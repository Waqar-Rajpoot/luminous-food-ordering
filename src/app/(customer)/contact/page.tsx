// "use client";

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "sonner";
// import axios, { AxiosError } from "axios";
// import { Loader2, Star, Mail, Phone, MapPin, Clock, Send, MessageSquareQuote } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import Autoplay from "embla-carousel-autoplay";

// import { contactSchema } from "@/schemas/contactSchema";
// import { ErrorResponse } from "@/utils/ErrorResponse";
// import { IReview } from "@/models/Review.model";

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
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import Header from "@/components/Header";

// type ContactFormInputs = z.infer<typeof contactSchema>;

// export default function ContactPage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [reviews, setReviews] = useState<IReview[]>([]);
//   const [isLoadingReviews, setIsLoadingReviews] = useState(true);

//   const form = useForm<ContactFormInputs>({
//     resolver: zodResolver(contactSchema),
//     defaultValues: { name: "", email: "", subject: "", message: "" },
//   });

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await axios.get("/api/approved-reviews");
//         setReviews(response.data.reviews || []);
//       } catch (error) {
//         console.error("Failed to fetch reviews:", error);
//       } finally {
//         setIsLoadingReviews(false);
//       }
//     };
//     fetchReviews();
//   }, []);

//   const handleContactSubmit = async (data: ContactFormInputs) => {
//     if (!session) {
//       toast.error("Please sign in to contact us.");
//       router.push("/sign-in");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = { ...data, userId: session.user._id };
//       const response = await axios.post("/api/contact", payload);
//       toast.success(response.data.message);
//       form.reset();
//     } catch (error) {
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast.error(axiosError.response?.data.message ?? "Failed to send message.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-[#141F2D] min-h-screen text-white pb-20">
//       <Header />

//       {/* --- HERO SECTION --- */}
//       <section className="pt-40 pb-16 px-6 max-w-7xl mx-auto border-b border-white/5">
//         <div className="flex flex-col gap-4">
//           <span className="text-[#EFA765] text-xs font-black uppercase tracking-[0.5em]">Global Support</span>
//           <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
//             Get In <br /> <span className="text-[#EFA765]">Touch.</span>
//           </h1>
//           <p className="max-w-xl text-gray-400 text-lg font-light leading-relaxed mt-4">
//             Have a question about our elite selection or logistics? Our dedicated support team is available to ensure your experience remains unparalleled.
//           </p>
//         </div>
//       </section>

//       <div className="max-w-7xl mx-auto px-6 py-20">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
//           {/* --- LEFT: CONTACT INFO --- */}
//           <div className="lg:col-span-4 space-y-12">
//             <div className="space-y-8">
//               <div className="flex gap-6 group">
//                 <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EFA765] group-hover:bg-[#EFA765] group-hover:text-[#141F2D] transition-all duration-500">
//                   <MapPin size={24} />
//                 </div>
//                 <div>
//                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Corporate HQ</h4>
//                   <p className="text-lg font-medium">1234 N Spring St, Sahiwal, <br />Punjab, Pakistan</p>
//                 </div>
//               </div>

//               <div className="flex gap-6 group">
//                 <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EFA765] group-hover:bg-[#EFA765] group-hover:text-[#141F2D] transition-all duration-500">
//                   <Phone size={24} />
//                 </div>
//                 <div>
//                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Direct Line</h4>
//                   <p className="text-lg font-medium">+92 320 1234567</p>
//                 </div>
//               </div>

//               <div className="flex gap-6 group">
//                 <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EFA765] group-hover:bg-[#EFA765] group-hover:text-[#141F2D] transition-all duration-500">
//                   <Mail size={24} />
//                 </div>
//                 <div>
//                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Digital Mail</h4>
//                   <p className="text-lg font-medium">support@luminous.com</p>
//                 </div>
//               </div>

//               <div className="flex gap-6 group">
//                 <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EFA765] group-hover:bg-[#EFA765] group-hover:text-[#141F2D] transition-all duration-500">
//                   <Clock size={24} />
//                 </div>
//                 <div>
//                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Service Hours</h4>
//                   <p className="text-lg font-medium">Mon - Fri: 11 AM - 10 PM<br />Sat - Sun: 12 PM - 11 PM</p>
//                 </div>
//               </div>
//             </div>

//             {/* REVIEWS CAROUSEL - INTEGRATED INTO SIDEBAR */}
//             <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden">
//               <MessageSquareQuote className="absolute -right-4 -top-4 h-24 w-24 text-white/5" />
//               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#EFA765] mb-6">Patron Feedback</h4>
              
//               {isLoadingReviews ? (
//                 <Loader2 className="animate-spin text-[#EFA765]" />
//               ) : (
//                 <Carousel plugins={[Autoplay({ delay: 4000 })]} className="w-full">
//                   <CarouselContent>
//                     {reviews.map((review) => (
//                       <CarouselItem key={review._id as string}>
//                         <div className="flex gap-1 mb-4">
//                           {[...Array(5)].map((_, i) => (
//                             <Star key={i} size={12} className={i < review.rating ? "fill-[#EFA765] text-[#EFA765]" : "text-gray-600"} />
//                           ))}
//                         </div>
//                         <p className="text-gray-300 italic mb-4 font-light leading-relaxed">{review.review}</p>
//                         <p className="text-sm font-black uppercase tracking-tighter">— {review.name}</p>
//                       </CarouselItem>
//                     ))}
//                   </CarouselContent>
//                 </Carousel>
//               )}
//             </div>
//           </div>

//           {/* --- RIGHT: CONTACT FORM --- */}
//           <div className="lg:col-span-8">
//             <div className="p-8 md:p-12 rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
//               <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Send a <span className="text-[#EFA765]">Message</span></h3>
              
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-8">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <FormField control={form.control} name="name" render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Full Name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Enter your name" {...field} className="h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-[#EFA765]" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />
//                     <FormField control={form.control} name="email" render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Email Address</FormLabel>
//                         <FormControl>
//                           <Input placeholder="email@example.com" {...field} className="h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-[#EFA765]" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />
//                   </div>

//                   <FormField control={form.control} name="subject" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Subject</FormLabel>
//                       <FormControl>
//                         <Input placeholder="How can we help?" {...field} className="h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-[#EFA765]" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />

//                   <FormField control={form.control} name="message" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Your Message</FormLabel>
//                       <FormControl>
//                         <textarea {...field} rows={5} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#EFA765] transition-all" placeholder="Tell us more..." />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />

//                   <Button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-2xl bg-[#EFA765] text-[#141F2D] font-black uppercase tracking-[0.2em] hover:bg-white transition-all text-xs">
//                     {isSubmitting ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-3">Dispatch Message <Send size={14}/></span>}
//                   </Button>
//                 </form>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Loader2, Star, Mail, Phone, MapPin, Clock, Send, MessageSquareQuote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Autoplay from "embla-carousel-autoplay";

import { contactSchema } from "@/schemas/contactSchema";
import { ErrorResponse } from "@/utils/ErrorResponse";
import { IReview } from "@/models/Review.model";

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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type ContactFormInputs = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const form = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("/api/approved-reviews");
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  const handleContactSubmit = async (data: ContactFormInputs) => {
    if (!session) {
      toast.error("Please sign in to contact us.");
      router.push("/sign-in");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...data, userId: session.user._id };
      const response = await axios.post("/api/contact", payload);
      toast.success(response.data.message);
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message ?? "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#141F2D] min-h-screen text-white pb-10 md:pb-20 overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="pt-20 md:pt-40 pb-12 md:pb-16 px-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex flex-col gap-3 md:gap-4">
          <span className="text-[#EFA765] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Global Support</span>
          {/* MOBILE FIX: Responsive font size and line height */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] md:leading-none">
            Get In <br /> <span className="text-[#EFA765]">Touch.</span>
          </h1>
          <p className="max-w-xl text-gray-400 text-base md:text-lg font-light leading-relaxed mt-4">
            Have a question about our elite selection or logistics? Our dedicated support team is available to ensure your experience remains unparalleled.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          
          {/* --- LEFT: CONTACT INFO --- */}
          <div className="lg:col-span-4 space-y-10 md:space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 md:gap-8">
              <div className="flex gap-4 md:gap-6 group">
                <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EFA765] group-hover:bg-[#EFA765] group-hover:text-[#141F2D] transition-all duration-500">
                  <MapPin size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Corporate HQ</h4>
                  <p className="text-base md:text-lg font-medium">1234 N Spring St, Sahiwal, <br />Punjab, Pakistan</p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6 group">
                <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EFA765] group-hover:bg-[#EFA765] group-hover:text-[#141F2D] transition-all duration-500">
                  <Phone size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Direct Line</h4>
                  <p className="text-base md:text-lg font-medium">+92 320 1234567</p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6 group">
                <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EFA765] group-hover:bg-[#EFA765] group-hover:text-[#141F2D] transition-all duration-500">
                  <Mail size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Digital Mail</h4>
                  <p className="text-base md:text-lg font-medium">support@luminous.com</p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6 group">
                <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EFA765] group-hover:bg-[#EFA765] group-hover:text-[#141F2D] transition-all duration-500">
                  <Clock size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Service Hours</h4>
                  <p className="text-base md:text-lg font-medium">Mon - Fri: 11 AM - 10 PM<br />Sat - Sun: 12 PM - 11 PM</p>
                </div>
              </div>
            </div>

            {/* REVIEWS CAROUSEL */}
            <div className="p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden">
              <MessageSquareQuote className="absolute -right-4 -top-4 h-20 w-20 md:h-24 md:w-24 text-white/5" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EFA765] mb-6">Patron Feedback</h4>
              
              {isLoadingReviews ? (
                <Loader2 className="animate-spin text-[#EFA765]" />
              ) : (
                <Carousel plugins={[Autoplay({ delay: 4000 })]} className="w-full">
                  <CarouselContent>
                    {reviews.map((review) => (
                      <CarouselItem key={review._id.toString()}>
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < review.rating ? "fill-[#EFA765] text-[#EFA765]" : "text-gray-600"} />
                          ))}
                        </div>
                        <p className="text-gray-300 italic mb-4 font-light leading-relaxed text-sm md:text-base">&quot;{review.review}&quot;</p>
                        <p className="text-[11px] md:text-sm font-black uppercase tracking-tighter">— {review.name}</p>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              )}
            </div>
          </div>

          {/* --- RIGHT: CONTACT FORM --- */}
          <div className="lg:col-span-8">
            <div className="p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
              <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-8">Send a <span className="text-[#EFA765]">Message</span></h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-6 md:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:ring-[#EFA765] text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:ring-[#EFA765] text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help?" {...field} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:ring-[#EFA765] text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Your Message</FormLabel>
                      <FormControl>
                        <textarea {...field} rows={5} className="w-full p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#EFA765] transition-all text-sm" placeholder="Tell us more..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl bg-[#EFA765] text-[#141F2D] font-black uppercase tracking-widest md:tracking-[0.2em] hover:bg-white transition-all text-[10px] md:text-xs">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-3">Dispatch Message <Send size={14}/></span>}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}