"use client";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Loader2, ShieldCheck, RotateCcw } from "lucide-react";
import { ApiError } from "next/dist/server/api-utils";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const searchParams = useSearchParams();
  const emailType = searchParams.get("emailType");

  // States for Resend Logic
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [remainingTries, setRemainingTries] = useState<number | null>(null);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  // Handle Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const onResendCode = async () => {
    if (countdown > 0 || remainingTries === 0) return;

    setIsResending(true);
    try {
      const response = await axios.post("/api/resend-code", {
        username: params.username,
        emailType,
      });

      toast.success(response.data.message);
      setRemainingTries(response.data.remainingTries);
      setCountdown(60); // Start 60s cooldown
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.message || "Failed to resend code");
      
      // If server returns tries, sync them
      // if (axiosError.response?.data?.remainingTries !== undefined) {
      //   setRemainingTries(axiosError.response.data.remainingTries as number);
      // }
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
        emailType,
      });

      toast.success(response.data.message);
      if (emailType === "RESET") {
        router.replace(`/reset-password?username=${params.username}&code=${data.code}`);
      } else {
        router.replace("/sign-in");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(
        axiosError.response?.data?.message ?? "An error occurred while verifying account."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1D2B3F] p-8 rounded-[2rem] shadow-2xl border border-[#EFA765]/20">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EFA765]/10 mb-4 border border-[#EFA765]/20">
            <ShieldCheck className="h-8 w-8 text-[#EFA765]" />
          </div>
          <h1 className="text-3xl font-black text-[#EFA765] uppercase tracking-tighter italic varela-round">
            Verify <span className="text-white">Account</span>
          </h1>
          <p className="mt-3 text-white/60 text-sm leading-relaxed">
            A 6-digit verification code has been sent to your email. 
            <span className="block text-[#EFA765]/80 font-bold mt-1">Expires in 5 minutes</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EFA765] mb-4">
                    Security Code
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2 sm:gap-3">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <React.Fragment key={index}>
                            <InputOTPSlot
                              index={index}
                              className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold bg-[#141F2D] border-[#EFA765]/20 text-white rounded-xl focus:ring-2 focus:ring-[#EFA765] focus:border-transparent transition-all"
                            />
                            {(index === 1 || index === 3) && (
                              <InputOTPSeparator className="text-[#EFA765]/30" />
                            )}
                          </React.Fragment>
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-red-400 font-bold text-xs mt-2" />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white h-14 rounded-2xl text-lg font-black transition-all active:scale-95 shadow-xl shadow-[#EFA765]/10"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                    <span className="tracking-widest">VERIFYING...</span>
                  </>
                ) : (
                  "VERIFY ACCOUNT"
                )}
              </Button>

              {/* Resend Section */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={onResendCode}
                  disabled={countdown > 0 || isResending || remainingTries === 0}
                  className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#EFA765] hover:text-white transition-colors disabled:text-slate-600 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3 w-3" />
                  )}
                  {countdown > 0 ? `Resend Code in ${countdown}s` : "Resend New Code"}
                </button>

                {/* Attempt Tracker */}
                {remainingTries !== null && (
                  <p className="text-[12px] font-bold uppercase tracking-tighter text-red-400">
                    {remainingTries > 0 
                      ? `Attempts  remaining: ${remainingTries}` 
                      : "Daily limit reached. Try again in 24h."}
                  </p>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;