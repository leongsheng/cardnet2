import { Contact, SystemConfig } from "../types";

export const api = {
  getConfig: async (): Promise<SystemConfig> => {
    const res = await fetch("/api/config");
    return res.json();
  },
  getContacts: async (): Promise<Contact[]> => {
    const res = await fetch("/api/contacts");
    return res.json();
  },
  getContact: async (id: string): Promise<Contact> => {
    const res = await fetch(`/api/contacts/${id}`);
    if (!res.ok) throw new Error("Contact not found");
    return res.json();
  },
  createContact: async (contact: Partial<Contact>): Promise<Contact> => {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    return res.json();
  },
  updateContact: async (id: string, contact: Partial<Contact>): Promise<Contact> => {
    const res = await fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    return res.json();
  },
  deleteContact: async (id: string): Promise<void> => {
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
  },
};
