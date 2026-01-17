// "use client";
// import React, { useEffect, useState } from "react";
// import { useDebounceCallback } from "usehooks-ts";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import Link from "next/link";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import axios, { AxiosError } from "axios";

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
// import { signUpSchema } from "@/schemas/SignUpSchema";
// import { Loader2, Eye, EyeOff } from "lucide-react";
// import { ErrorResponse } from "@/utils/ErrorResponse";
// import { checkPasswordStrength } from "@/lib/passwordStrength";

// const Signup = () => {
//   const [username, setUsername] = useState("");
//   const [usernameMessage, setUsernameMessage] = useState("");
//   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState({
//     score: 0,
//     status: "",
//     color: "#ddd",
//     feedback: [],
//   });

//   const debounced = useDebounceCallback(setUsername, 500);
//   const router = useRouter();

//   const form = useForm<z.infer<typeof signUpSchema>>({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       name: "",
//       username: "",
//       email: "",
//       password: "",
//     },
//   });

//   const passwordValue = form.watch("password");

//   useEffect(() => {
//     const strength: any = checkPasswordStrength(passwordValue);
//     setPasswordStrength(strength);
//   }, [passwordValue]);

//   useEffect(() => {
//     const checkUsername = async () => {
//       if (username) {
//         setIsCheckingUsername(true);
//         setUsernameMessage("");
//         try {
//           const response = await axios.get(
//             `/api/username-uniqueness?username=${username}`
//           );
//           setUsernameMessage(response.data.message);
//         } catch (error) {
//           const axiosError = error as AxiosError<ErrorResponse>;
//           setUsernameMessage(
//             axiosError.response?.data?.message ??
//               "An error occurred while checking username uniqueness."
//           );
//         } finally {
//           setIsCheckingUsername(false);
//         }
//       }
//     };

//     checkUsername();
//   }, [username]);

//   const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post("/api/sign-up", data);
//       toast.success(response.data.message);

//       const { emailType } = response.data;
//       console.log("emailType in sign up page", emailType);
//       router.replace(`/verify/${username}?emailType=${emailType}`);
//     } catch (error) {
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(
//         axiosError.response?.data?.message ?? "An error occurred while sign up."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-[90vh] flex items-center justify-center p-4">
//       <div className="p-8 rounded-xl shadow-lg w-full max-w-md border border-[#efa765]">
//         <h2 className="second-heading mb-2 text-center">Sign up</h2>
//         <h2 className="text-[#efa765] mb-6 text-center">With Luminous Bistro</h2>
//         <Form {...form}>
//           <form
//             action=""
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-6"
//           >
//             <FormField
//               name="name"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel
//                     className="varela-round block text-sm font-medium"
//                     style={{ color: "rgb(239, 167, 101)" }}
//                   >
//                     Name
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter your name"
//                       {...field}
//                       className="text"
//                       required
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="username"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel
//                     className="varela-round block text-sm font-medium"
//                     style={{ color: "rgb(239, 167, 101)" }}
//                   >
//                     Username
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter your username"
//                       {...field}
//                       onChange={(e) => {
//                         field.onChange(e);
//                         debounced(e.target.value);
//                       }}
//                       className="text"
//                       required
//                     />
//                   </FormControl>
//                   {isCheckingUsername && <Loader2 className="animate-spin" />}
//                   <p
//                     className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
//                   >
//                     { username ? usernameMessage : ""}
//                   </p>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="email"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel
//                     className="varela-round block text-sm font-medium"
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
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="password"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel
//                     className="varela-round block text-sm font-medium"
//                     style={{ color: "rgb(239, 167, 101)" }}
//                   >
//                     Password
//                   </FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Input
//                         placeholder="Enter your password"
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
//                   {passwordValue.length > 0 && (
//                     <>
//                   <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden relative">
//                     <div
//                       id="password-strength-bar"
//                       className="h-full rounded-full flex items-center justify-center text-white text-xs font-semibold"
//                       style={{
//                         width: `${passwordStrength.score}%`,
//                         backgroundColor: passwordStrength.color,
//                         transition:
//                           "width 0.3s ease-in-out, background-color 0.3s ease-in-out",
//                       }}
//                     >
//                       {`${passwordStrength.score}%`}
//                     </div>
//                   </div>
//                   <p
//                     id="password-strength-text"
//                     className={`text-xs mt-1 font-semibold`}
//                     style={{ color: passwordStrength.color }}
//                   >
//                     {passwordValue.length > 0 && `${passwordStrength.status}: `}
//                     <span className="font-normal text-gray-600">
//                       {passwordStrength.feedback.length > 0 &&
//                         `Needs ${passwordStrength.feedback.join(", ")}`}
//                     </span>
//                   </p>
//                   </>
//                   )}
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
//                   <Loader2 className="animate-spin mr-2 h-4 w-4" /> Please wait
//                 </>
//               ) : (
//                 "Sign up"
//               )}
//             </Button>
//           </form>
//         </Form>
//         <div className="text-center mt-4">
//           <p className="mt-6 text-center text-sm text">
//             Already have an account?
//             <Link
//               href="/sign-in"
//               className="hover:underline"
//               style={{ color: "rgb(239, 167, 101)" }}
//             >
//               Log In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;






"use client";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

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
import { signUpSchema } from "@/schemas/SignUpSchema";
import { Loader2, Eye, EyeOff, User, AtSign, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { ErrorResponse } from "@/utils/ErrorResponse";
import { checkPasswordStrength } from "@/lib/passwordStrength";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    status: "",
    color: "#ddd",
    feedback: [],
  });

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = form.watch("password");

  useEffect(() => {
    const strength: any = checkPasswordStrength(passwordValue);
    setPasswordStrength(strength);
  }, [passwordValue]);

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/username-uniqueness?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>;
          setUsernameMessage(
            axiosError.response?.data?.message ??
              "An error occurred while checking username uniqueness."
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast.success(response.data.message);

      const { emailType } = response.data;
      router.replace(`/verify/${username}?emailType=${emailType}`);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data?.message ?? "An error occurred while sign up."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EFA765]/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-lg z-10">
        <div className="text-center mb-8">
          <span className="text-[#EFA765] text-[10px] font-black uppercase tracking-[0.5em] mb-3 block">
            Join The Inner Circle
          </span>
          <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
            Sign <span className="text-[#EFA765]">Up.</span>
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                          <Input placeholder="John Doe" {...field} className="pl-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:ring-[#EFA765]" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-400 font-bold uppercase tracking-tighter" />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                          <Input
                            placeholder="username"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                            }}
                            className="pl-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:ring-[#EFA765]"
                          />
                          {isCheckingUsername && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 text-[#EFA765]" />}
                        </div>
                      </FormControl>
                      {username && !isCheckingUsername && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {usernameMessage === "Username is available" ? <CheckCircle2 size={12} className="text-green-500"/> : <AlertCircle size={12} className="text-red-500"/>}
                          <p className={`text-[10px] font-bold uppercase tracking-tight ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>
                            {usernameMessage}
                          </p>
                        </div>
                      )}
                      <FormMessage className="text-[10px] text-red-400 font-bold uppercase tracking-tighter" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">Digital Mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <Input placeholder="email@example.com" {...field} className="pl-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:ring-[#EFA765]" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] text-red-400 font-bold uppercase tracking-tighter" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-[#EFA765]">Secure Passcode</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pl-12 pr-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:ring-[#EFA765]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#EFA765]"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    
                    {/* Strength Bar */}
                    {passwordValue.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full transition-all duration-500 ease-in-out"
                            style={{
                              width: `${passwordStrength.score}%`,
                              backgroundColor: passwordStrength.color,
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: passwordStrength.color }}>
                            {passwordStrength.status}
                          </p>
                          {passwordStrength.feedback.length > 0 && (
                            <p className="text-[10px] text-gray-500 font-medium text-right max-w-[150px]">
                              Needs: {passwordStrength.feedback.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <FormMessage className="text-[10px] text-red-400 font-bold uppercase tracking-tighter" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl bg-[#EFA765] text-[#141F2D] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 shadow-lg shadow-[#EFA765]/10"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-xs font-light tracking-wide">
              Already an elite member?
              <Link
                href="/sign-in"
                className="text-[#EFA765] font-black uppercase tracking-widest ml-2 hover:underline underline-offset-4"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;