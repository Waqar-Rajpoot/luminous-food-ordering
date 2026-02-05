"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShippingAddressInputs, shippingAddressSchema } from '@/schemas/shippingSchema';

interface ShippingAddressFormProps {
  onFormChange: (data: ShippingAddressInputs, isValid: boolean) => void;
  initialData?: ShippingAddressInputs;
}

const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan"
];

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ onFormChange, initialData }) => {
  const form = useForm<ShippingAddressInputs>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      addressLine1: initialData?.addressLine1 || "",
      addressLine2: initialData?.addressLine2 || "", // Explicitly default to empty string
      city: initialData?.city || "",
      state: initialData?.state || "",
      postalCode: initialData?.postalCode || "",
      country: "Pakistan",
      phoneNumber: initialData?.phoneNumber || "",
    },
    mode: "onChange",
  });

  // Watch for changes and notify parent
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Create a safe copy of the data to ensure addressLine2 is never undefined
      const safeData = {
        ...value,
        addressLine2: value.addressLine2 || "",
      } as ShippingAddressInputs;
      
      onFormChange(safeData, form.formState.isValid);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.formState.isValid, onFormChange]);

  // Handle Initial Data Sync
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        addressLine2: initialData.addressLine2 || "", // Guard against null/undefined from DB
      });
    }
  }, [initialData, form]);

  return (
    <Card className="p-2 md:p-6 rounded-2xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-[#EFA765]/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl md:text-2xl font-bold font-[Yeseve One] text-center md:text-left">
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Full Name */}
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

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765] text-sm">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+923XX-XXXXXXX" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Address Line 1 */}
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
            
            {/* Address Line 2 - The Problem Solver */}
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-[#EFA765] text-sm">Address Line 2</FormLabel>
                    <span className="text-[10px] text-white/30 uppercase italic">Optional</span>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Apartment, suite, landmark, etc." 
                      {...field} 
                      value={field.value || ""} // Double-guard to prevent controlled/uncontrolled warnings
                      className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765] text-sm">City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Lahore, Karachi" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
            
            {/* Province/State */}
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
                        <SelectItem key={province} value={province} className="hover:bg-[#EFA765] hover:text-[#1D2B3F] focus:bg-[#EFA765] focus:text-[#1D2B3F]">
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Postal Code */}
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765] text-sm">Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="54000" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765] h-11" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765] text-sm opacity-50">Country</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      readOnly 
                      className="bg-[#141F2D] border-[#EFA765]/10 text-gray-500 cursor-not-allowed h-11" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ShippingAddressForm;