import React, { useEffect, useState } from "react";
import { Contact } from "../types";
import { api } from "../lib/api";
import { Sidebar } from "./Sidebar";
import { ContactModal } from "./ContactModal";
import { Plus, Trash2, Edit2, Link as LinkIcon, Building2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Partial<Contact> | null>(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getContacts();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSaveContact = async (contact: Partial<Contact>) => {
    try {
      if (contact._id) {
        await api.updateContact(contact._id, contact);
      } else {
        await api.createContact(contact);
      }
      setModalOpen(false);
      loadContacts();
    } catch (err) {
      alert("Failed to save contact");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      await api.deleteContact(id);
      setContacts(contacts.filter(c => c._id !== id));
    } catch (err) {
      alert("Failed to delete contact");
    }
  };

  const handleCopyLink = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/card/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Public link copied to clipboard!");
    } catch (err) {
      prompt("Copy this link to share:", url);
    }
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setModalOpen(true);
  };

  const openNewModal = () => {
    setEditingContact(null);
    setModalOpen(true);
  };

  return (
    <Sidebar>
      <header className="h-20 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0 sticky top-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Digital Contacts</h1>
          <p className="text-sm text-zinc-500">Manage and share your enterprise identity</p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Card</span>
        </button>
      </header>
      
      <div className="flex-1 overflow-auto p-8 bg-zinc-50 relative">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[2rem] flex items-center justify-between text-red-700 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>{error}</span>
            </div>
            <button onClick={loadContacts} className="px-4 py-1.5 bg-red-100 font-medium rounded-xl hover:bg-red-200">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="h-64 flex items-center justify-center">
             <div className="w-10 h-10 border-4 border-zinc-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {contacts.map((contact) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={contact._id}
                  className="bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col relative overflow-hidden"
                  onClick={() => openEditModal(contact)}
                >
                  <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    <button 
                      onClick={(e) => handleCopyLink(contact._id!, e)}
                      title="Copy Public Link"
                      className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <a 
                      href={`/card/${contact._id}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      title="View Public Card"
                      className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                    <button 
                       onClick={(e) => handleDelete(contact._id!, e)}
                      title="Delete"
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                     {contact.avatarBase64 ? (
                      <img src={contact.avatarBase64} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover bg-zinc-100 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-500 flex items-center justify-center text-lg font-bold shrink-0">
                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                       <h3 className="text-zinc-900 font-bold truncate">
                         {contact.firstName} {contact.lastName}
                       </h3>
                       {contact.title && <p className="text-sm text-zinc-500 truncate">{contact.title}</p>}
                    </div>
                  </div>
                  
                  {contact.organization && (
                     <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                         <Building2 className="w-3.5 h-3.5" />
                         <span className="truncate">{contact.organization}</span>
                     </div>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-zinc-100">
                     <p className="text-sm font-medium text-indigo-600 truncate">{contact.email}</p>
                  </div>
                </motion.div>
              ))}
              {contacts.length === 0 && !error && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white shadow-sm border border-zinc-200 text-zinc-400 rounded-3xl flex items-center justify-center mb-4">
                     <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">No digital cards yet</h3>
                  <p className="text-zinc-500 mt-2 max-w-md">Create your first contact to start building your enterprise directory.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {modalOpen && (
        <ContactModal
          contact={editingContact}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveContact}
        />
      )}
    </Sidebar>
  );
}
