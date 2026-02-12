
"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import axios from "axios"; // Ensure axios is imported
import { Loader2, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";

const Signin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false); // New state for 2FA UI
  const [otpValue, setOtpValue] = useState(""); // State for OTP input
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      if (!showOTP) {
        // --- STAGE 1: Check Credentials & 2FA Status ---
        const response = await axios.post("/api/auth/send-2fa", {
          identifier: data.identifier,
          password: data.password,
        });

        if (response.data.requires2FA) {
          setShowOTP(true);
          toast.success("Security code sent to your email");
          setIsSubmitting(false);
          return;
        }
      }

      // --- STAGE 2: Perform Final Login ---
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
        code: otpValue, // Pass the OTP code (will be undefined if 2FA is off)
      });

      if (result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      const session = await getSession();
      const userId = session?.user?._id;

      if (session?.user?.role === "admin") {
        toast.success("Welcome, Admin");
        router.push("/admin");
      } else {
        toast.success("Login Successful");
        router.push(`/user-dashboard/${userId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <span className="text-[#EFA765] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            {showOTP ? "Security Verification" : "The Elite Experience"}
          </span>
          <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
            {showOTP ? "Verify" : "Sign"} <span className="text-[#EFA765]">{showOTP ? "OTP" : "In."}</span>
          </h2>
          <p className="text-gray-400 font-light mt-4 text-sm tracking-wide">
            {showOTP 
              ? "A 6-digit code has been sent to your registered email address."
              : "Enter your credentials to access your bespoke culinary dashboard."}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {!showOTP ? (
                <>
                  {/* Identifier Field */}
                  <FormField
                    name="identifier"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">Identity</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <Input
                              placeholder="Email or Username"
                              {...field}
                              className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-[#EFA765] transition-all"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold uppercase tracking-wider" />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">Passcode</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              {...field}
                              className="pl-12 pr-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-[#EFA765] transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#EFA765] transition-colors"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px] font-bold uppercase tracking-wider" />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                /* --- OTP Input Field --- */
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">Verification Code</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#EFA765]" />
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-white/10 border-[#EFA765]/30 text-white text-xl tracking-[0.5em] font-black placeholder:text-white/10 focus:ring-[#EFA765] transition-all text-center"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowOTP(false)}
                      className="text-[9px] uppercase font-bold text-[#EFA765]/60 hover:text-[#EFA765] transition-colors tracking-widest"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </div>
              )}

              {!showOTP && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#EFA765] transition-colors"
                  >
                    Forgot Passcode?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || (showOTP && otpValue.length < 6)}
                className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-[#EFA765] bg-[#EFA765]/90 text-[#141F2D] text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-[#EFA765]/20"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {showOTP ? "Verify & Enter" : "Enter Dashboard"} <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-400 text-xs font-light">
              New to the Bistro?{" "}
              <Link
                href="/sign-up"
                className="text-[#EFA765] font-black uppercase tracking-widest ml-1 hover:underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
          Luminous Bistro &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default Signin;