export interface Contact {
  name: string;
  role: string;
  phone?: string;
  whatsapp?: string;
}

export const CONTACTS: Contact[] = [
  {
    name: "John Doe",
    role: "Ketua Panitia",
    phone: "+62-xxx-xxxx-xxxx",
    whatsapp: "#",
  },
  {
    name: "Jane Doe",
    role: "Sekretaris",
    phone: "+62-xxx-xxxx-xxxx",
    whatsapp: "#",
  },
];
