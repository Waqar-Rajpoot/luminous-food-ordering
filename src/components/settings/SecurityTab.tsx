"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react"; // Added useSession
import { Loader2, Lock, ShieldCheck, ShieldAlert } from "lucide-react";

export default function SecurityTab() {
  const { data: session, update } = useSession(); // Get session data and update function
  const [passLoading, setPassLoading] = useState(false);
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false); 

  // --- Sync UI with Session on Load ---
  useEffect(() => {
    if (session?.user) {
      // Assuming your session object has twoFactorEnabled 
      // (Check your authOptions jwt/session callbacks if this is undefined)
      setIs2FAEnabled(!!session.user.twoFactorEnabled);
    }
  }, [session]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onChangePassword = async (data: any) => {
    setPassLoading(true);
    try {
      await axios.patch("/api/user/settings", {
        action: "CHANGE_PASSWORD",
        payload: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });
      toast.success("Password updated successfully");
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating password");
    } finally {
      setPassLoading(false);
    }
  };

  const toggle2FA = async (checked: boolean) => {
    setTwoFaLoading(true);
    try {
      await axios.patch("/api/user/settings", {
        action: "TOGGLE_2FA",
        payload: { enabled: checked },
      });
      
      setIs2FAEnabled(checked);
      
      // Crucial: Update the session so the change persists across refreshes
      await update({
        ...session,
        user: {
          ...session?.user,
          twoFactorEnabled: checked
        }
      });

      toast.success(`2FA ${checked ? "Enabled" : "Disabled"}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update 2FA settings");
      // Revert UI if API fails
      setIs2FAEnabled(!checked);
    } finally {
      setTwoFaLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Password Update Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#EFA765]/10 rounded-lg border border-[#EFA765]/20">
            <Lock className="text-[#EFA765]" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Password Update</h3>
            <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Secure your culinary account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4 max-w-md">
          {/* ... Password Inputs (Unchanged) ... */}
          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#EFA765] transition-colors" size={16} />
              <input
                type="password"
                {...register("currentPassword", { required: "Current password is required" })}
                placeholder="CURRENT PASSWORD"
                className={`w-full bg-[#1e293b]/40 border ${errors.currentPassword ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-12 py-4 text-white text-xs font-black uppercase tracking-widest focus:border-[#EFA765]/50 outline-none transition-all placeholder:text-slate-600`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#EFA765] transition-colors" size={16} />
              <input
                type="password"
                {...register("newPassword", { 
                  required: "New password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" } 
                })}
                placeholder="NEW PASSWORD"
                className={`w-full bg-[#1e293b]/40 border ${errors.newPassword ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-12 py-4 text-white text-xs font-black uppercase tracking-widest focus:border-[#EFA765]/50 outline-none transition-all placeholder:text-slate-600`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passLoading}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-[#EFA765] text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50"
          >
            {passLoading ? <Loader2 className="animate-spin" size={18} /> : "Update Credentials"}
          </button>
        </form>
      </section>

      <hr className="border-white/5" />

      {/* 2FA Section */}
      <section className="p-6 bg-[#EFA765]/5 border border-[#EFA765]/10 rounded-[1.5rem] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3 bg-[#EFA765]/20 rounded-2xl">
            <ShieldAlert className="text-[#EFA765]" size={24} />
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-tight">Two-Factor Authentication</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase">
              Status: <span className={is2FAEnabled ? "text-[#EFA765]" : "text-slate-400"}>
                {is2FAEnabled ? "ACTIVE" : "INACTIVE"}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-[#1e293b]/60 px-4 py-2 rounded-2xl border border-white/5">
          {twoFaLoading && <Loader2 className="animate-spin w-4 h-4 text-[#EFA765]" />}
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={is2FAEnabled}
              onChange={(e) => toggle2FA(e.target.checked)}
              disabled={twoFaLoading}
            />
            <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-slate-500 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EFA765] peer-checked:after:bg-black"></div>
          </label>
        </div>
      </section>
    </div>
  );
}