import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Contact } from "../types";
import { api } from "../lib/api";
import { exportVCard } from "../lib/utils";
import { Phone, Mail, MessageSquare, MapPin, Globe, Linkedin, Twitter, Github, Download, Share2, Building2 } from "lucide-react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";

export function PublicCard() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getContact(id)
      .then(setContact)
      .catch(() => setError("Digital card not found or has been removed."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-zinc-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <Share2 className="w-8 h-8 text-zinc-500" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight">Card Unavailable</h1>
        <p className="text-zinc-500 mt-2">{error}</p>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${contact.firstName} ${contact.lastName} - Digital Card`,
          text: `Connect with ${contact.firstName} ${contact.lastName}`,
          url: url,
        });
      } else {
        throw new Error("Share not supported");
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (clipboardErr) {
        prompt("Copy this link to share:", url);
      }
    }
  };

  const ActionButton = ({ icon: Icon, label, href, colorClass }: any) => (
    <a 
      href={href} 
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 group w-full"
    >
      <div className={`aspect-square w-full rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
    </a>
  );

  const SocialTile = ({ label, href }: any) => {
    if (!href) return null;
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
      >
        <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">{label}</span>
        <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative isolate selection:bg-zinc-800 selection:text-white">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-zinc-800/50 to-black z-0 pointer-events-none mix-blend-screen mix-blend-color-dodge"></div>
      
      <main className="max-w-md mx-auto min-h-screen flex flex-col relative z-10 px-6 py-12">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mt-4 relative z-10"
        >
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent -z-10 blur-2xl pointer-events-none"></div>
          {contact.avatarBase64 ? (
            <img src={contact.avatarBase64} alt="Avatar" className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-rose-400 rounded-full border-[6px] border-zinc-900 shadow-2xl object-cover shrink-0 z-10 rotate-3 transition-transform hover:rotate-0" />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-rose-400 rounded-full border-[6px] border-zinc-900 shadow-2xl flex items-center justify-center text-5xl font-bold text-white shrink-0 z-10 rotate-3 hover:rotate-0 transition-transform">
              {contact.firstName?.[0]}{contact.lastName?.[0]}
            </div>
          )}

          <h1 className="text-3xl font-bold mt-8 tracking-tight text-white leading-tight">
            {contact.firstName} {contact.lastName}
          </h1>
          {contact.organization && <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mt-2">{contact.organization}</p>}
          {contact.title && <p className="text-lg text-zinc-400 mt-2 font-light">{contact.title}</p>}
        </motion.div>

        {/* Quick Actions Array */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-3 w-full mt-8 mb-2"
        >
          {contact.phone && <ActionButton icon={Phone} label="Call" href={`tel:${contact.phone}`} colorClass="hover:text-white" />}
          {contact.phone && <ActionButton icon={MessageSquare} label="Text" href={`sms:${contact.phone}`} colorClass="hover:text-white" />}
          {contact.email && <ActionButton icon={Mail} label="Email" href={`mailto:${contact.email}`} colorClass="hover:text-white" />}
          {contact.address && <ActionButton icon={MapPin} label="Map" href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`} colorClass="hover:text-white" />}
        </motion.div>

        {/* Social Links Stack */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-2 flex-1 w-full"
        >
          <SocialTile label="Official Website" href={contact.website} />
          <SocialTile label="LinkedIn Profile" href={contact.linkedin} />
          <SocialTile label="Twitter Profile" href={contact.twitter} />
          <SocialTile label="GitHub Profile" href={contact.github} />
        </motion.div>

        {/* Bottom Actions Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 sticky bottom-6 left-0 right-0 z-50 px-2"
        >
          <div className="bg-zinc-900/90 backdrop-blur-3xl p-2 rounded-[2rem] border border-zinc-800/80 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex gap-2">
            <button 
              onClick={() => exportVCard(contact)}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-black rounded-[1.5rem] font-bold tracking-wide hover:bg-zinc-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              Save Contact
            </button>
            <button 
              onClick={handleShare}
              className="w-16 flex items-center justify-center bg-zinc-800 text-zinc-300 rounded-[1.5rem] hover:bg-zinc-700 transition-colors shrink-0 border border-zinc-700"
            >
              <Share2 className="w-5 h-5" />
            </button>
             <button 
              onClick={() => setShowQR(true)}
              className="w-16 flex items-center justify-center bg-zinc-800 text-zinc-300 rounded-[1.5rem] hover:bg-zinc-700 transition-colors shrink-0 border border-zinc-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
            </button>
          </div>
        </motion.div>

        {/* QR Code Modal Overlay */}
        {showQR && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-lg flex items-center justify-center p-6" onClick={() => setShowQR(false)}>
             <div className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center">
                <div className="bg-black text-white px-6 py-2 rounded-full mb-6 font-medium text-sm tracking-widest uppercase">Scan Me</div>
                <div className="bg-white p-4 rounded-3xl border-2 border-zinc-100 mb-6">
                  <QRCodeSVG 
                    value={window.location.href} 
                    size={240} 
                    bgColor={"#ffffff"} 
                    fgColor={"#000000"} 
                    level={"Q"} 
                  />
                </div>
                <h3 className="text-black font-bold text-xl">{contact.firstName} {contact.lastName}</h3>
                <p className="text-zinc-500 font-medium text-sm">{contact.title}</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
