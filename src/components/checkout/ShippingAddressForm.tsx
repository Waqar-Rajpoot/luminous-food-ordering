// "use client";

// import React, { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ShippingAddressInputs, shippingAddressSchema } from '@/schemas/shippingSchema';

// interface ShippingAddressFormProps {
//   onFormChange: (data: ShippingAddressInputs, isValid: boolean) => void;
//   initialData?: ShippingAddressInputs;
// }

// const PAKISTAN_PROVINCES = [
//   "Punjab",
//   "Sindh",
//   "Khyber Pakhtunkhwa",
//   "Balochistan",
//   "Islamabad Capital Territory",
//   "Azad Jammu & Kashmir",
//   "Gilgit-Baltistan"
// ];

// const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ onFormChange, initialData }) => {
//   const form = useForm<ShippingAddressInputs>({
//     resolver: zodResolver(shippingAddressSchema),
//     defaultValues: {
//       fullName: initialData?.fullName || "",
//       addressLine1: initialData?.addressLine1 || "",
//       addressLine2: initialData?.addressLine2 || "", // Explicitly default to empty string
//       city: initialData?.city || "",
//       state: initialData?.state || "",
//       postalCode: initialData?.postalCode || "",
//       country: "Pakistan",
//       phoneNumber: initialData?.phoneNumber || "",
//     },
//     mode: "onChange",
//   });

//   // Watch for changes and notify parent
//   useEffect(() => {
//     const subscription = form.watch((value) => {
//       // Create a safe copy of the data to ensure addressLine2 is never undefined
//       const safeData = {
//         ...value,
//         addressLine2: value.addressLine2 || "",
//       } as ShippingAddressInputs;
      
//       onFormChange(safeData, form.formState.isValid);
//     });
//     return () => subscription.unsubscribe();
//   }, [form.watch, form.formState.isValid, onFormChange]);

//   // Handle Initial Data Sync
//   useEffect(() => {
//     if (initialData) {
//       form.reset({
//         ...initialData,
//         addressLine2: initialData.addressLine2 || "", // Guard against null/undefined from DB
//       });
//     }
//   }, [initialData, form]);

//   return (
//     <Card className="p-2 md:p-6 rounded-2xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-[#EFA765]/10">
//       <CardHeader className="pb-4">
//         <CardTitle className="text-xl md:text-2xl font-bold font-[Yeseve One] text-center md:text-left">
//           Shipping Address
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
//             {/* Full Name */}
//             <FormField
//               control={form.control}
//               name="fullName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm">Full Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="John Doe" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
//                   </FormControl>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />

//             {/* Phone Number */}
//             <FormField
//               control={form.control}
//               name="phoneNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm">Phone Number</FormLabel>
//                   <FormControl>
//                     <Input placeholder="+923XX-XXXXXXX" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
//                   </FormControl>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />

//             {/* Address Line 1 */}
//             <FormField
//               control={form.control}
//               name="addressLine1"
//               render={({ field }) => (
//                 <FormItem className="md:col-span-2">
//                   <FormLabel className="text-[#EFA765] text-sm">Address Line 1</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Street address, House No, Area" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
//                   </FormControl>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />
            
//             {/* Address Line 2 - The Problem Solver */}
//             <FormField
//               control={form.control}
//               name="addressLine2"
//               render={({ field }) => (
//                 <FormItem className="md:col-span-2">
//                   <div className="flex justify-between items-center">
//                     <FormLabel className="text-[#EFA765] text-sm">Address Line 2</FormLabel>
//                     <span className="text-[10px] text-white/30 uppercase italic">Optional</span>
//                   </div>
//                   <FormControl>
//                     <Input 
//                       placeholder="Apartment, suite, landmark, etc." 
//                       {...field} 
//                       value={field.value || ""} // Double-guard to prevent controlled/uncontrolled warnings
//                       className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" 
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />

//             {/* City */}
//             <FormField
//               control={form.control}
//               name="city"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm">City</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Lahore, Karachi" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
//                   </FormControl>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />
            
//             {/* Province/State */}
//             <FormField
//               control={form.control}
//               name="state"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm">Province</FormLabel>
//                   <Select onValueChange={field.onChange} value={field.value || undefined}>
//                     <FormControl>
//                       <SelectTrigger className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11">
//                         <SelectValue placeholder="Select Province" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent className="bg-[#1D2B3F] border-[#EFA765]/30 text-white">
//                       {PAKISTAN_PROVINCES.map((province) => (
//                         <SelectItem key={province} value={province} className="hover:bg-[#EFA765] hover:text-[#1D2B3F] focus:bg-[#EFA765] focus:text-[#1D2B3F]">
//                           {province}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />

//             {/* Postal Code */}
//             <FormField
//               control={form.control}
//               name="postalCode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm">Postal Code</FormLabel>
//                   <FormControl>
//                     <Input placeholder="54000" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
//                   </FormControl>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />

//             {/* Country */}
//             <FormField
//               control={form.control}
//               name="country"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm opacity-50">Country</FormLabel>
//                   <FormControl>
//                     <Input 
//                       {...field} 
//                       readOnly 
//                       className="bg-[#141F2D] border-[#EFA765]/10 text-gray-500 cursor-not-allowed h-11" 
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

// export default ShippingAddressForm;








// "use client";

// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { MapPin, CheckCircle2, Navigation } from 'lucide-react';
// import { ShippingAddressInputs, shippingAddressSchema } from '@/schemas/shippingSchema';

// interface ShippingAddressFormProps {
//   onFormChange: (data: any, isValid: boolean) => void;
//   initialData?: any;
// }

// const PAKISTAN_PROVINCES = [
//   "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
//   "Islamabad Capital Territory", "Azad Jammu & Kashmir", "Gilgit-Baltistan"
// ];

// const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ onFormChange, initialData }) => {
//   const [isLocating, setIsLocating] = useState(false);
//   const [coordsAcquired, setCoordsAcquired] = useState(false);

//   const form = useForm<any>({
//     resolver: zodResolver(shippingAddressSchema),
//     defaultValues: {
//       fullName: initialData?.fullName || "",
//       addressLine1: initialData?.addressLine1 || "",
//       addressLine2: initialData?.addressLine2 || "",
//       city: initialData?.city || "",
//       state: initialData?.state || "",
//       postalCode: initialData?.postalCode || "",
//       country: "Pakistan",
//       phoneNumber: initialData?.phoneNumber || "",
//       // Added lat/lng to default values
//       lat: initialData?.lat || 0,
//       lng: initialData?.lng || 0,
//     },
//     mode: "onChange",
//   });

//   // Get User Geolocation
//   const handleGetLocation = () => {
//     setIsLocating(true);
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           form.setValue("lat", position.coords.latitude);
//           form.setValue("lng", position.coords.longitude);
//           setCoordsAcquired(true);
//           setIsLocating(false);
//         },
//         (error) => {
//           console.error(error);
//           setIsLocating(false);
//         }
//       );
//     }
//   };

//   useEffect(() => {
//     const subscription = form.watch((value) => {
//       onFormChange(value, form.formState.isValid);
//     });
//     return () => subscription.unsubscribe();
//   }, [form.watch, form.formState.isValid, onFormChange]);

//   return (
//     <Card className="p-2 md:p-6 rounded-2xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-[#EFA765]/10">
//       <CardHeader className="pb-4 flex flex-row items-center justify-between">
//         <CardTitle className="text-xl md:text-2xl font-bold text-center md:text-left">
//           Shipping Address
//         </CardTitle>
//         <Button 
//           type="button"
//           onClick={handleGetLocation}
//           disabled={isLocating}
//           className={`h-10 rounded-xl gap-2 transition-all ${coordsAcquired ? 'bg-green-500 text-white' : 'bg-[#EFA765] text-[#1D2B3F] hover:bg-white'}`}
//         >
//           {isLocating ? <Navigation className="animate-spin w-4 h-4" /> : <MapPin className="w-4 h-4" />}
//           {coordsAcquired ? "Location Verified" : "Pin My Location"}
//         </Button>
//       </CardHeader>
      
//       <CardContent>
//         {/* Distance Preview (Optional Placeholder) */}
//         {coordsAcquired && (
//           <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
//             <CheckCircle2 className="text-green-500 w-5 h-5" />
//             <p className="text-[11px] text-green-400 font-bold uppercase tracking-widest">Precise Location Captured for Delivery</p>
//           </div>
//         )}

//         <Form {...form}>
//           <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//             {/* FULL NAME */}
//             <FormField
//               control={form.control}
//               name="fullName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm">Full Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="John Doe" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
//                   </FormControl>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />

//             {/* PHONE */}
//             <FormField
//               control={form.control}
//               name="phoneNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm">Phone Number</FormLabel>
//                   <FormControl>
//                     <Input placeholder="+923XX-XXXXXXX" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
//                   </FormControl>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />

//             {/* ADDRESS LINE 1 */}
//             <FormField
//               control={form.control}
//               name="addressLine1"
//               render={({ field }) => (
//                 <FormItem className="md:col-span-2">
//                   <FormLabel className="text-[#EFA765] text-sm">Address Line 1</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Street address, House No, Area" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
//                   </FormControl>
//                   <FormMessage className="text-red-400 text-xs" />
//                 </FormItem>
//               )}
//             />

//             {/* HIDDEN LAT/LNG FIELDS (To ensure they are part of the form state) */}
//             <input type="hidden" {...form.register("lat")} />
//             <input type="hidden" {...form.register("lng")} />

//             {/* CITY & PROVINCE (Keep your existing fields here...) */}
//             <FormField
//               control={form.control}
//               name="city"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm">City</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Sahiwal" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="state"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#EFA765] text-sm">Province</FormLabel>
//                   <Select onValueChange={field.onChange} value={field.value || undefined}>
//                     <FormControl>
//                       <SelectTrigger className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11">
//                         <SelectValue placeholder="Select Province" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent className="bg-[#1D2B3F] border-[#EFA765]/30 text-white">
//                       {PAKISTAN_PROVINCES.map((province) => (
//                         <SelectItem key={province} value={province}>{province}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

// export default ShippingAddressForm;









"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, CheckCircle2, Navigation } from 'lucide-react';
import { ShippingAddressInputs, shippingAddressSchema } from '@/schemas/shippingSchema';

interface ShippingAddressFormProps {
  onFormChange: (data: any, isValid: boolean) => void;
  initialData?: any;
}

const PAKISTAN_PROVINCES = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
  "Islamabad Capital Territory", "Azad Jammu & Kashmir", "Gilgit-Baltistan"
];

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ onFormChange, initialData }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [coordsAcquired, setCoordsAcquired] = useState(false);

  const form = useForm<ShippingAddressInputs>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      addressLine1: initialData?.addressLine1 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      phoneNumber: initialData?.phoneNumber || "",
      lat: initialData?.lat || 0,
      lng: initialData?.lng || 0,
    },
    mode: "onChange",
  });

  // Get User Geolocation
  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // CRITICAL: shouldValidate: true ensures the parent knows the form is now valid
          form.setValue("lat", latitude, { shouldValidate: true });
          form.setValue("lng", longitude, { shouldValidate: true });
          
          setCoordsAcquired(true);
          setIsLocating(false);
          
          // Immediate sync for coordinates
          onFormChange(form.getValues(), form.formState.isValid);
        },
        (error) => {
          console.error("Location Error:", error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  // Keep Parent Updated
  useEffect(() => {
    const subscription = form.watch((value) => {
      onFormChange(value, form.formState.isValid);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.formState.isValid, onFormChange]);

  // Ensure coordsAcquired reflects the form state (e.g., on page reload)
  useEffect(() => {
    if (form.getValues("lat") !== 0) {
      setCoordsAcquired(true);
    }
  }, []);

  return (
    <Card className="p-2 md:p-6 rounded-2xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-[#EFA765]/10">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl md:text-2xl font-bold text-center md:text-left">
          Shipping Address
        </CardTitle>
        <Button 
          type="button"
          onClick={handleGetLocation}
          disabled={isLocating}
          className={`h-10 rounded-xl gap-2 transition-all ${coordsAcquired ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-[#EFA765] text-[#1D2B3F] hover:bg-white'}`}
        >
          {isLocating ? <Navigation className="animate-spin w-4 h-4" /> : <MapPin className="w-4 h-4" />}
          {coordsAcquired ? "Location Verified" : "Pin My Location"}
        </Button>
      </CardHeader>
      
      <CardContent>
        {coordsAcquired && (
          <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
            <CheckCircle2 className="text-green-500 w-5 h-5" />
            <p className="text-[11px] text-green-400 font-bold uppercase tracking-widest">
              Precise Location Captured ({form.getValues("lat")?.toFixed(4)}, {form.getValues("lng")?.toFixed(4)})
            </p>
          </div>
        )}

        <Form {...form}>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765] text-sm">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765] text-sm">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="03206913949" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[#EFA765] text-sm">Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address, House No, Area" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765] text-sm">City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sahiwal" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765] text-sm">Province</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11">
                        <SelectValue placeholder="Select Province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1D2B3F] border-[#EFA765]/30 text-white">
                      {PAKISTAN_PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>{province}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Hidden fields to ensure inclusion in form submission */}
            <input type="hidden" {...form.register("lat")} />
            <input type="hidden" {...form.register("lng")} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ShippingAddressForm;