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
  batch_year: string;
  message: string;
  created_at: string;
}

export interface ValidationErrors {
  name?: string;
  batch_year?: string;
  message?: string;
}

export type InsertResult =
  | { success: true; message: Message }
  | { success: false; error: string };

export type RealtimeMessageHandler = (message: Message) => void;

/* ── Validation ─────────────────────────────────────────────── */

const MAX_MESSAGE_LENGTH = 500;

/**
 * Validate form fields.
 * Returns empty object if valid, otherwise errors keyed by field name.
 */
export function validateForm(
  name: string,
  batch_year: string,
  message: string,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!name || name.trim().length === 0) {
    errors.name = "Nama tidak boleh kosong";
  } else if (name.trim().length > 100) {
    errors.name = "Nama terlalu panjang (maksimal 100 karakter)";
  }

  if (!batch_year || batch_year.trim().length === 0) {
    errors.batch_year = "Angkatan tidak boleh kosong";
  } else {
    const batchNum = Number(batch_year.trim());
    const PALASMA_BASE_YEAR = 1978;
    const maxBatch = new Date().getFullYear() - PALASMA_BASE_YEAR;
    if (Number.isNaN(batchNum) || batchNum < 1 || batchNum > maxBatch) {
      errors.batch_year = `Angkatan harus antara 1 dan ${maxBatch}`;
    }
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
export function createClient(): any {
  if (supabaseClient) return supabaseClient;

  // Dynamic import to avoid bundling in static build if not used
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");

  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase URL and ANON_KEY must be set in environment variables",
    );
  }

  supabaseClient = createSupabaseClient(url, anonKey);
  return supabaseClient;
}

/* ── CRUD Operations ───────────────────────────────────────── */

/**
 * Fetch all messages, ordered by newest first.
 */
export async function fetchMessages(): Promise<Message[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("id, name, batch_year, message, created_at")
    .order("created_at", { ascending: false });

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
  message: string,
): Promise<InsertResult> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({ name: name.trim(), batch_year: batch_year.trim(), message })
    .select()
    .single();

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
export function subscribeToMessages(
  handler: RealtimeMessageHandler,
): () => void {
  const supabase = createClient();

  // Avoid duplicate subscriptions
  if (realtimeSubscription) {
    supabase.removeChannel(realtimeSubscription);
  }

  const channel = supabase.channel("messages");

  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
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
