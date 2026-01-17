// "use client";
// import React, { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import Link from "next/link";
// import { toast } from "sonner";
// import axios, { AxiosError } from "axios";
// import { useRouter, useSearchParams } from "next/navigation";

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
// import { Loader2, Eye, EyeOff } from "lucide-react";
// import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";


// const ResetPassword = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Get username and code from URL query parameters
//   const username = searchParams.get("username");
//   const code = searchParams.get("code");

//   const form = useForm({
//     resolver: zodResolver(resetPasswordSchema),
//     defaultValues: {
//       newPassword: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (data: any) => {
//     setIsSubmitting(true);
//     try {
//       if (!username || !code) {
//         toast.error("Invalid request. Missing username or verification code.");
//         router.replace("/forgot-password");
//         return;
//       }

//       const resetData = {
//         username: username,
//         code: code,
//         newPassword: data.newPassword,
//       };

//       // Call the backend API to reset the password
//       const response = await axios.post("/api/reset-password", resetData);

//       toast.success(response.data.message);
//       router.replace("/sign-in");
//     } catch (error) {
//       console.error("Password reset error:", error);
//       const axiosError = error as AxiosError;
//       toast.error(
//         axiosError.response?.data?.message ||
//           "An error occurred. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-[90vh] flex items-center justify-center p-4">
//       <div className="p-8 rounded-xl shadow-lg w-full max-w-md border border-[#efa765]">
//         <h2 className="second-heading mb-6 text-center">Reset Your Password</h2>
//         <p className="text-center mb-6 text-sm text-gray-500">
//           Enter your new password below.
//         </p>
//         <Form {...form}>
//           <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
//             <FormField
//               name="newPassword"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel
//                     className="block text-sm font-medium"
//                     style={{ color: "rgb(239, 167, 101)" }}
//                   >
//                     New Password
//                   </FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Input
//                         placeholder="Enter a new password"
//                         {...field}
//                         className="text pr-10"
//                         type={showPassword ? "text" : "password"}
//                         required
//                       />
//                       <button
//                         className="text absolute right-2 top-0 h-full py-2 hover:cursor-pointer"
//                         type="button"
//                         onClick={() => setShowPassword((prev) => !prev)}
//                         aria-label={
//                           showPassword ? "Hide password" : "Show password"
//                         }
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-5 w-5" />
//                         ) : (
//                           <Eye className="h-5 w-5" />
//                         )}
//                       </button>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="confirmPassword"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel
//                     className="block text-sm font-medium"
//                     style={{ color: "rgb(239, 167, 101)" }}
//                   >
//                     Confirm New Password
//                   </FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Input
//                         placeholder="Confirm new password"
//                         {...field}
//                         type={showPassword ? "text" : "password"}
//                         className="text pr-10"
//                         required
//                       />
//                       <button
//                         className="text absolute right-2 top-0 h-full py-2 hover:cursor-pointer"
//                         type="button"
//                         onClick={() => setShowPassword((prev) => !prev)}
//                         aria-label={
//                           showPassword ? "Hide password" : "Show password"
//                         }
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-5 w-5" />
//                         ) : (
//                           <Eye className="h-5 w-5" />
//                         )}
//                       </button>
//                     </div>
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
//               ) : (
//                 "Reset Password"
//               )}
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

// export default ResetPassword;





// "use client";

// import React, { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import Link from "next/link";
// import { toast } from "sonner";
// import axios, { AxiosError } from "axios";
// import { useRouter, useSearchParams } from "next/navigation";

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
// import { Loader2, Eye, EyeOff, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
// import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
// import { ErrorResponse } from "@/utils/ErrorResponse";

// const ResetPassword = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Get username and code from URL query parameters
//   const username = searchParams.get("username");
//   const code = searchParams.get("code");

//   // Fixed TS Error: Added Schema Inference to useForm
//   const form = useForm<z.infer<typeof resetPasswordSchema>>({
//     resolver: zodResolver(resetPasswordSchema),
//     defaultValues: {
//       newPassword: "",
//       confirmPassword: "",
//     },
//   });

//   // Fixed TS Error: Properly typed 'data'
//   const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
//     setIsSubmitting(true);
//     try {
//       if (!username || !code) {
//         toast.error("Invalid request. Missing username or verification code.");
//         router.replace("/forgot-password");
//         return;
//       }

//       const resetData = {
//         username: username,
//         code: code,
//         newPassword: data.newPassword,
//       };

//       const response = await axios.post("/api/reset-password", resetData);

//       toast.success(response.data.message || "Password reset successfully");
//       router.replace("/sign-in");
//     } catch (error) {
//       // Fixed TS Error: Proper AxiosError typing
//       const axiosError = error as AxiosError<ErrorResponse>;
//       const errorMessage = axiosError.response?.data?.message || "An error occurred. Please try again.";
      
//       console.error("Password reset error:", errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6 relative overflow-hidden">
//       {/* Premium Background Accents */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />

//       <div className="w-full max-w-md z-10">
//         <div className="text-center mb-10">
//           <span className="text-[#EFA765] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
//             Security Update
//           </span>
//           <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
//             New <span className="text-[#EFA765]">Entry.</span>
//           </h2>
//           <p className="text-gray-400 font-light mt-4 text-sm tracking-wide">
//             Ensure your new password is strong and <br />
//             contains at least 6 characters.
//           </p>
//         </div>

//         <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
//           <Form {...form}>
//             <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
//               {/* New Password Field */}
//               <FormField
//                 name="newPassword"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">
//                       New Passcode
//                     </FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
//                         <Input
//                           placeholder="••••••••"
//                           {...field}
//                           className="pl-12 pr-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-[#EFA765]"
//                           type={showPassword ? "text" : "password"}
//                         />
//                         <button
//                           className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#EFA765] transition-colors"
//                           type="button"
//                           onClick={() => setShowPassword((prev) => !prev)}
//                         >
//                           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </button>
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-red-400 text-[10px] font-bold uppercase tracking-wider" />
//                   </FormItem>
//                 )}
//               />

//               {/* Confirm Password Field */}
//               <FormField
//                 name="confirmPassword"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">
//                       Repeat Passcode
//                     </FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
//                         <Input
//                           placeholder="••••••••"
//                           {...field}
//                           className="pl-12 pr-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-[#EFA765]"
//                           type={showPassword ? "text" : "password"}
//                         />
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-red-400 text-[10px] font-bold uppercase tracking-wider" />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full h-16 rounded-2xl bg-[#EFA765] text-[#141F2D] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#EFA765]/10"
//               >
//                 {isSubmitting ? (
//                   <Loader2 className="animate-spin h-5 w-5" />
//                 ) : (
//                   "Update Password"
//                 )}
//               </Button>
//             </form>
//           </Form>

//           <div className="mt-8 pt-8 border-t border-white/5 text-center">
//             <Link
//               href="/sign-in"
//               className="inline-flex items-center gap-2 text-gray-400 text-xs font-light hover:text-[#EFA765] transition-colors group"
//             >
//               <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
//               Return to <span className="font-black uppercase tracking-widest ml-1">Log In</span>
//             </Link>
//           </div>
//         </div>
        
//         <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
//           Luminous Bistro Secured
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;






"use client";

import React, { useState, Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";

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
import { Loader2, Eye, EyeOff, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { ErrorResponse } from "@/utils/ErrorResponse";

// 1. Move the form logic into a separate component
const ResetPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const username = searchParams.get("username");
  const code = searchParams.get("code");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      if (!username || !code) {
        toast.error("Invalid request. Missing username or verification code.");
        router.replace("/forgot-password");
        return;
      }

      const resetData = {
        username: username,
        code: code,
        newPassword: data.newPassword,
      };

      const response = await axios.post("/api/reset-password", resetData);
      toast.success(response.data.message || "Password reset successfully");
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">
                  New Passcode
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input
                      placeholder="••••••••"
                      {...field}
                      className="pl-12 pr-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-[#EFA765]"
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#EFA765] transition-colors"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-[10px] font-bold uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">
                  Repeat Passcode
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input
                      placeholder="••••••••"
                      {...field}
                      className="pl-12 pr-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-[#EFA765]"
                      type={showPassword ? "text" : "password"}
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
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Update Password"}
          </Button>
        </form>
      </Form>

      <div className="mt-8 pt-8 border-t border-white/5 text-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-gray-400 text-xs font-light hover:text-[#EFA765] transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return to <span className="font-black uppercase tracking-widest ml-1">Log In</span>
        </Link>
      </div>
    </div>
  );
};

// 2. Main component exported as default, wrapping the form in Suspense
const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <span className="text-[#EFA765] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            Security Update
          </span>
          <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
            New <span className="text-[#EFA765]">Entry.</span>
          </h2>
          <p className="text-gray-400 font-light mt-4 text-sm tracking-wide">
            Ensure your new password is strong and <br />
            contains at least 6 characters.
          </p>
        </div>

        {/* 3. Wrap the searchParams-dependent component in Suspense */}
        <Suspense fallback={
          <div className="flex justify-center p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
            <Loader2 className="animate-spin h-10 w-10 text-[#EFA765]" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
          Luminous Bistro Secured
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;