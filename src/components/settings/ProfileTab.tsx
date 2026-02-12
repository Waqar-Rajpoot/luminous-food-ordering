"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2, User, AtSign, BadgeCheck, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function ProfileTab() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isUsernameUnique, setIsUsernameUnique] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
    },
  });

  const usernameValue = watch("username");

  useEffect(() => {
    const checkAvailability = async () => {
      if (!usernameValue || usernameValue.length < 3) {
        setIsUsernameUnique(null);
        return;
      }

      if (usernameValue === session?.user?.username) {
        setIsUsernameUnique(true);
        return;
      }

      setCheckingUsername(true);
      try {
        const response = await axios.get(`/api/username-uniqueness?username=${usernameValue}`);
        setIsUsernameUnique(response.data.success);
      } catch (error: any) {
        if (error.response?.status === 400) {
          setIsUsernameUnique(false);
        } else {
          setIsUsernameUnique(null);
        }
      } finally {
        setCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [usernameValue, session?.user?.username]);

  const onSubmit = async (data: any) => {
    if (isUsernameUnique === false) {
      toast.error("This username is already taken");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch("/api/user/settings", {
        action: "UPDATE_PROFILE",
        payload: data,
      });
      
      toast.success(response.data.message || "Profile updated!");
      await update(); 
      window.location.reload();
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#EFA765]/10 rounded-lg border border-[#EFA765]/20">
          <BadgeCheck className="text-[#EFA765]" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Identity</h3>
          <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Manage your public presence</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#EFA765] uppercase tracking-[0.2em] ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#EFA765] transition-colors" size={16} />
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="ENTER YOUR NAME"
              className="w-full bg-[#1e293b]/40 border border-white/5 rounded-xl px-12 py-4 text-white text-xs font-black uppercase tracking-widest focus:border-[#EFA765]/50 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#EFA765] uppercase tracking-[0.2em] ml-1">Username</label>
          <div className="relative group">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#EFA765] transition-colors" size={16} />
            <input
              {...register("username", { 
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" },
                pattern: { value: /^[a-z0-9_]+$/, message: "Invalid format" }
              })}
              placeholder="UNIQUE_USERNAME"
              className={`w-full bg-[#1e293b]/40 border ${
                (isUsernameUnique === false || errors.username) ? 'border-red-500/50' : 'border-white/5'
              } rounded-xl px-12 py-4 text-white text-xs font-black uppercase tracking-widest focus:border-[#EFA765]/50 outline-none transition-all placeholder:text-slate-600`}
            />
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {checkingUsername && <Loader2 className="animate-spin text-slate-500" size={16} />}
              {!checkingUsername && isUsernameUnique === true && <CheckCircle2 className="text-green-500" size={16} />}
              {!checkingUsername && (isUsernameUnique === false || (errors.username && usernameValue.length > 0)) && <XCircle className="text-red-500" size={16} />}
            </div>
          </div>
          
          {errors.username && (
            <p className="text-red-400 text-[9px] font-bold uppercase pl-2 flex items-center gap-1 mt-1">
              <AlertCircle size={10} /> {errors.username.message as string}
            </p>
          )}

          {!errors.username && isUsernameUnique === false && (
            <p className="text-red-400 text-[9px] font-bold uppercase pl-2 mt-1">Username already taken</p>
          )}
          {isUsernameUnique === true && usernameValue !== session?.user?.username && (
            <p className="text-green-400 text-[9px] font-bold uppercase pl-2 mt-1">Username available</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || checkingUsername || isUsernameUnique === false || !!errors.username}
          className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-4 bg-[#EFA765] text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 disabled:grayscale"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Save Profile Changes"}
        </button>
      </form>

      <div className="pt-4 border-t border-white/5">
        <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
          Note: Your username must be unique. This acts as your identifier across the Luminous platform.
        </p>
      </div>
    </div>
  );
}