import React, { useState } from "react";
import { Contact } from "../types";
import { Building2, X, Upload } from "lucide-react";
import { classNames } from "../lib/utils";

interface ContactModalProps {
  contact: Partial<Contact> | null;
  onClose: () => void;
  onSave: (contact: Partial<Contact>) => void;
}

export function ContactModal({ contact, onClose, onSave }: ContactModalProps) {
  const [formData, setFormData] = useState<Partial<Contact>>(
    contact || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      title: "",
      organization: "",
      website: "",
      address: "",
      linkedin: "",
      twitter: "",
      github: "",
      avatarBase64: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image must be smaller than 1.5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatarBase64: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[880px] h-[600px] flex flex-col md:flex-row overflow-hidden border border-white/50">
        
        {/* Form Section */}
        <div className="flex-1 p-10 overflow-y-auto w-full border-r border-zinc-100">
          <div className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                 {contact?._id ? "Edit Card Details" : "New Card Details"}
               </h2>
               <p className="text-sm text-zinc-500">Changes are reflected instantly in the preview.</p>
            </div>
            <button onClick={onClose} className="p-2 md:hidden text-zinc-500 hover:text-zinc-700 bg-zinc-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-50 shrink-0">
                {formData.avatarBase64 ? (
                  <img src={formData.avatarBase64} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-zinc-400" />
                )}
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Avatar Image</label>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 w-full" />
                <p className="text-xs text-zinc-500 mt-1">JPEG/PNG under 1.5MB</p>
              </div>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">First Name</label>
                <input required type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Last Name</label>
                <input required type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Organization</label>
                <input type="text" name="organization" value={formData.organization || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                <input required type="email" name="email" value={formData.email || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Title</label>
                <input type="text" name="title" value={formData.title || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Phone </label>
                <input type="tel" name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Address</label>
                <input type="text" name="address" value={formData.address || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
               <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Website URL</label>
                <input type="url" name="website" value={formData.website || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">LinkedIn URL</label>
                <input type="url" name="linkedin" value={formData.linkedin || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
              <div>
                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Twitter URL</label>
                <input type="url" name="twitter" value={formData.twitter || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
               <div>
                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">GitHub URL</label>
                <input type="url" name="github" value={formData.github || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
              <button type="submit" form="contact-form" className="flex-1 bg-zinc-900 text-white py-3 rounded-2xl font-bold shadow-lg shadow-zinc-900/20 active:scale-[0.98] transition-transform">Save Changes</button>
              <button type="button" onClick={onClose} className="px-8 py-3 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-colors">Cancel</button>
            </div>
          </form>
        </div>

        {/* Live Preview Section (Tablet/Desktop Only) */}
        <div className="hidden lg:flex flex-col w-[380px] bg-zinc-100 p-8 flex flex-col items-center justify-center shrink-0 border-l border-zinc-200/50">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">Live Public Preview</p>
          
          <div className="w-64 h-[440px] bg-zinc-900 rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col shrink-0">
             {/* Status Bar */}
             <div className="h-6 w-full px-6 pt-1 flex justify-between items-center text-[8px] text-zinc-500">
               <span>9:41</span>
               <div className="flex gap-1">
                 <div className="w-2 h-2 bg-zinc-700 rounded-full"></div>
                 <div className="w-3 h-2 bg-zinc-700 rounded-sm"></div>
               </div>
             </div>

             {/* Public Card Content */}
             <div className="flex-1 flex flex-col items-center pt-8 px-4 overflow-hidden relative z-10">
               <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent -z-10 blur-xl"></div>
               {formData.avatarBase64 ? (
                 <img src={formData.avatarBase64} alt="Avatar" className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-rose-400 rounded-full border-4 border-zinc-800 shadow-xl object-cover shrink-0 z-10" />
               ) : (
                 <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-rose-400 rounded-full border-4 border-zinc-800 shadow-xl flex items-center justify-center text-3xl font-bold text-white shrink-0 z-10">
                   {(formData.firstName?.[0] || "")}{(formData.lastName?.[0] || "")}
                 </div>
               )}
               
               <h3 className="text-white font-bold text-lg text-center leading-tight mt-4 truncate w-full px-2">
                 {formData.firstName || "First"} {formData.lastName || "Last"}
               </h3>
               {formData.organization && <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider mt-1 truncate w-full text-center px-2">{formData.organization}</p>}
               
               {/* Action Grid placeholder */}
               <div className="grid grid-cols-4 gap-2 w-full mt-6">
                 <div className="aspect-square bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-300"></div>
                 <div className="aspect-square bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-300"></div>
                 <div className="aspect-square bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-300"></div>
                 <div className="aspect-square bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-300"></div>
               </div>
               
               {/* Social Link Tiled */}
               <div className="w-full space-y-2 mt-6">
                 <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 h-10 w-full animate-pulse"></div>
                 <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 h-10 w-full animate-pulse"></div>
               </div>

                {/* Bottom Action */}
               <div className="mt-auto w-full p-4 shrink-0">
                 <div className="w-full bg-indigo-600 rounded-xl py-3 flex items-center justify-center gap-2">
                   <span className="text-[10px] font-bold text-white uppercase tracking-wider">Add to Contacts</span>
                 </div>
               </div>
             </div>
          </div>
          <div className="mt-6 bg-white px-4 py-2 rounded-full border border-zinc-200 flex items-center gap-2 shadow-sm relative z-10">
            <span className="text-[10px] font-medium text-zinc-500">cardnet.id/v/{(formData.firstName || "").toLowerCase()}-{(formData.lastName || "").toLowerCase()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
