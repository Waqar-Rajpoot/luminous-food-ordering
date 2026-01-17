// "use client";
// import React, { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import Link from "next/link";
// import { toast } from "sonner";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import { emailSchema } from "@/schemas/emailSchema";



// const ForgotPassword = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   const form = useForm({
//     resolver: zodResolver(emailSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof emailSchema>) => {
//     setIsSubmitting(true);
    
//     try {
//       const response = await axios.post("/api/forgot-password", {
//         email: data.email,
//       });

//       toast.success(response.data.message);
//         const { username, emailType } = response.data;
//         console.log("username and emailType in forgot password page", username, emailType);
//       router.replace(`/verify/${username}?emailType=${emailType}`);

//     } catch (error) {
//       console.error("Forgot password error:", error);
//       toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   return (
//     <div className="min-h-[90vh] flex items-center justify-center p-4">
//       <div className="p-8 rounded-xl shadow-lg w-full max-w-md border border-[#efa765]">
//         <h2 className="second-heading mb-6 text-center">Forgot Password</h2>
//         <p className="text-center mb-6 text-sm text-gray-500">
//           Enter the email address associated with your account and we will send you a password reset code.
//         </p>
//         <Form {...form}>
//           <form
//             className="space-y-6"
//             onSubmit={form.handleSubmit(onSubmit)}
//           >
//             <FormField
//               name="email"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel
//                     className="block text-sm font-medium"
//                     style={{ color: "rgb(239, 167, 101)" }}
//                   >
//                     Email
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter your email"
//                       {...field}
//                       className="text"
//                       required
//                       type="email"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full py-3 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md"
//               style={{
//                 backgroundColor: "rgb(239, 167, 101)",
//                 color: "rgb(20, 31, 45)",
//               }}
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="animate-spin h-4 w-4 mr-2" /> Please wait
//                 </>
//               ) : "Send Reset Code"}
//             </Button>
//           </form>
//         </Form>
//         <div className="text-center mt-4">
//           <p className="mt-6 text-center text-sm text">
//             Remember your password?{" "}
//             <Link
//               href="/sign-in"
//               className="hover:underline"
//               style={{ color: "rgb(239, 167, 101)" }}
//             >
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;







"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

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
import { Loader2, Mail, ArrowLeft, Send } from "lucide-react";
import { emailSchema } from "@/schemas/emailSchema";
import { ErrorResponse } from "@/utils/ErrorResponse";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Added proper TypeScript generic to useForm
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/api/forgot-password", {
        email: data.email,
      });

      toast.success(response.data.message);
      const { username, emailType } = response.data;
      
      // Navigate to verify page with dynamic params
      router.replace(`/verify/${username}?emailType=${emailType}`);

    } catch (error) {
      // Fixed TypeScript error by properly casting AxiosError
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "Something went wrong. Please try again.";
      
      console.error("Forgot password error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="text-[#EFA765] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            Account Recovery
          </span>
          <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
            Reset <span className="text-[#EFA765]">Pass.</span>
          </h2>
          <p className="text-gray-400 font-light mt-4 text-sm tracking-wide leading-relaxed">
            Enter your email address and we will send a <br className="hidden md:block" /> 
            secure recovery code to your inbox.
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">
                      Digital Mail
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-[#EFA765] transition-all"
                          required
                          type="email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-[10px] font-bold uppercase tracking-wider" />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 rounded-2xl bg-[#EFA765] text-[#141F2D] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#EFA765]/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Code <Send size={16} />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-gray-400 text-xs font-light hover:text-[#EFA765] transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to <span className="font-black uppercase tracking-widest ml-1">Log In</span>
            </Link>
          </div>
        </div>

        {/* Brand Footer */}
        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
          Luminous Bistro &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;