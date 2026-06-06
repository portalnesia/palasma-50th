/**
 * Ucapan & Doa — Pure functions + Supabase integration + Realtime.
 *
 * Architecture:
 *  - Validation: validateForm() returns errors or valid state
 *  - Supabase: createClient() initializes with anon key
 *  - CRUD: fetchMessages(), insertMessage(), subscribeToMessages()
 *  - Types: Message, ValidationErrors, InsertPayload
 */

/* ── Types ─────────────────────────────────────────────────── */

export interface Message {
  id: string;
  name: string;
  batch_year: number | null;
  organization: string | null;
  message: string;
  created_at: string;
}

export interface ValidationErrors {
  name?: string;
  batch_year?: string;
  organization?: string;
  message?: string;
}

export type InsertResult = { success: true; message: Message } | { success: false; error: string };

export type RealtimeMessageHandler = (message: Message) => void;

/* ── Validation ─────────────────────────────────────────────── */

export const MAX_MESSAGE_LENGTH = 500;

/**
 * Validate form fields.
 * Returns empty object if valid, otherwise errors keyed by field name.
 */
export function validateForm(
  name: string,
  batch_year: string,
  organization: string,
  message: string,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!name || name.trim().length === 0) {
    errors.name = "Nama tidak boleh kosong";
  } else if (name.trim().length > 100) {
    errors.name = "Nama terlalu panjang (maksimal 100 karakter)";
  }

  const hasBatch = batch_year && batch_year.trim().length > 0;
  const hasOrganisasi = organization && organization.trim().length > 0;

  if (!hasBatch && !hasOrganisasi) {
    errors.batch_year = "Angkatan atau organization harus diisi salah satu";
    errors.organization = "Angkatan atau organization harus diisi salah satu";
  } else if (hasBatch) {
    const batchNum = Number(batch_year.trim());
    const PALASMA_BASE_YEAR = 1978;
    const maxBatch = new Date().getFullYear() - PALASMA_BASE_YEAR;
    if (Number.isNaN(batchNum) || batchNum < 1 || batchNum > maxBatch) {
      errors.batch_year = `Angkatan harus antara 1 dan ${maxBatch}`;
    }
  } else if (hasOrganisasi && organization.trim().length > 100) {
    errors.organization = "Nama organization terlalu panjang (maksimal 100 karakter)";
  }

  if (!message || message.trim().length === 0) {
    errors.message = "Pesan tidak boleh kosong";
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Pesan terlalu panjang (maksimal ${MAX_MESSAGE_LENGTH} karakter)`;
  }

  return errors;
}

/**
 * Check if validation errors exist.
 */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/* ── Supabase Client ────────────────────────────────────────── */

let supabaseClient: any = null;

/**
 * Initialize Supabase client from environment variables.
 * Uses PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.
 */
export async function createClient(): Promise<any> {
  if (supabaseClient) return supabaseClient;

  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");

  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase URL and ANON_KEY must be set in environment variables");
  }

  supabaseClient = createSupabaseClient(url, anonKey);
  return supabaseClient;
}

/**
 * Check if Supabase is configured (URL and anon key exist).
 */
export function isConfigured(): boolean {
  return !!(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
}

/* ── CRUD Operations ───────────────────────────────────────── */

export interface FetchOptions {
  limit?: number;
  offset?: number;
}

/**
 * Fetch messages, ordered by newest first.
 * Supports pagination via limit/offset.
 */
export async function fetchMessages(options: FetchOptions = {}): Promise<Message[]> {
  const supabase = await createClient();
  const { limit, offset } = options;

  let query = supabase
    .from("plm_messages")
    .select("id, name, batch_year, organization, message, created_at")
    .order("created_at", { ascending: false });

  if (limit !== undefined) query = query.limit(limit);
  if (offset !== undefined) query = query.range(offset, offset + (limit ?? 10) - 1);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error(`Gagal mengambil ucapan: ${error.message}`);
  }

  return data || [];
}

/**
 * Insert a new message.
 */
export async function insertMessage(
  name: string,
  batch_year: string,
  organization: string,
  message: string,
): Promise<InsertResult> {
  const supabase = await createClient();

  const payload: Record<string, unknown> = {
    name: name.trim(),
    message,
  };

  if (batch_year && batch_year.trim().length > 0) {
    payload.batch_year = Number(batch_year);
  }
  if (organization && organization.trim().length > 0) {
    payload.organization = organization.trim();
  }

  const { data, error } = await supabase.from("plm_messages").insert(payload).select().single();

  if (error) {
    console.error("Error inserting message:", error);
    return { success: false, error: error.message };
  }

  return { success: true, message: data };
}

/* ── Realtime ───────────────────────────────────────────────── */

let realtimeSubscription: any = null;

/**
 * Subscribe to new messages in real-time.
 * Calls handler when a new message is inserted.
 */
export async function subscribeToMessages(handler: RealtimeMessageHandler): Promise<() => void> {
  const supabase = await createClient();

  // Avoid duplicate subscriptions
  if (realtimeSubscription) {
    supabase.removeChannel(realtimeSubscription);
  }

  const channel = supabase.channel("plm_messages");

  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "plm_messages",
    },
    (payload: any) => {
      handler(payload.new as Message);
    },
  );

  channel.subscribe();

  realtimeSubscription = channel;

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
    if (realtimeSubscription === channel) {
      realtimeSubscription = null;
    }
  };
}

/* ── Formatting ─────────────────────────────────────────────── */

/**
 * Format date to Indonesian locale.
 */
export function formatMessageDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Truncate message with ellipsis if too long.
 */
export function truncateMessage(message: string, maxLength: number = 120): string {
  if (message.length <= maxLength) return message;
  return message.slice(0, maxLength).trim() + "...";
}
