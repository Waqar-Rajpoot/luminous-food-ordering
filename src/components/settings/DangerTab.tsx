"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Trash2, AlertTriangle, Loader2, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DangerTab() {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Deletion error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
          <Trash2 className="text-red-500" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Danger Zone</h3>
          <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Irreversible account actions</p>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/10 rounded-[1.5rem] p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/20 rounded-2xl hidden sm:block">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="text-red-500 font-black text-sm uppercase tracking-widest">Delete This Account</h4>
            <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-tight">
              Once you delete your account, there is no going back. All your personal profile data, settings, and active sessions will be wiped clean. Your order history will be anonymized.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-red-600/10 text-red-500 border border-red-600/20 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all">
                Terminate Account
              </button>
            </AlertDialogTrigger>
            
            <AlertDialogContent className="bg-[#1e293b] border-white/10 rounded-[2rem]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white font-black uppercase tracking-widest text-lg">
                  Final Confirmation
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400 font-bold text-xs uppercase leading-relaxed">
                  Are you absolutely sure? This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-3">
                <AlertDialogCancel className="bg-white/5 border-white/10 text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                  I changed my mind
                </AlertDialogCancel>
                
                <AlertDialogAction 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent modal from closing immediately
                    handleDelete();
                  }}
                  disabled={loading}
                  className="bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all border-none py-6 sm:py-0"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "YES, DELETE FOREVER"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Manual Sign Out Option */}
      <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Just want to leave?</h4>
          <p className="text-slate-500 text-[9px] font-bold uppercase">Sign out of your current session instead</p>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#EFA765] hover:text-black transition-all"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}