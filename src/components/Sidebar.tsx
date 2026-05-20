import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { SystemConfig } from "../types";
import { Database, ServerCrash, HardDrive, LayoutGrid } from "lucide-react";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    api.getConfig().then(setConfig).catch(console.error);
  }, []);

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden select-none">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 z-10 hidden md:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">CARDNET</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <a href="/" className="flex items-center gap-3 px-4 py-3 bg-zinc-800 text-white rounded-xl transition-colors">
             <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"></path></svg>
            <span className="font-medium">Contacts</span>
          </a>
        </nav>

        <div className="p-6">
          <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 flex flex-col gap-3 overflow-hidden">
             <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3 shrink-0">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    config?.mode === "database" ? "bg-green-400 animate-ping" : 
                    config?.mode === "memory" ? "bg-yellow-400 animate-ping" : "bg-red-400 animate-ping"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    config?.mode === "database" ? "bg-green-500" : 
                    config?.mode === "memory" ? "bg-yellow-500" : "bg-red-500"
                }`}></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
                   {config?.mode === "database" ? "MongoDB Status" : "Memory Mode"}
                </p>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                   {config?.mode === "database" ? `Connected: ${config?.dbName}` : "Local Storage Active"}
                </p>
              </div>
             </div>
             {config?.error && (
               <div className="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded-xl">
                 <p className="text-[10px] text-red-300 font-mono break-words">{config.error}</p>
               </div>
             )}
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col relative min-w-0 overflow-hidden">{children}</main>
    </div>
  );
}
