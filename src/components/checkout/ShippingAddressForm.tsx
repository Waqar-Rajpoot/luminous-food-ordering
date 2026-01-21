"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShippingAddressInputs, shippingAddressSchema } from '@/schemas/shippingSchema';

interface ShippingAddressFormProps {
  onFormChange: (data: ShippingAddressInputs, isValid: boolean) => void;
  initialData?: ShippingAddressInputs;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ onFormChange, initialData }) => {
  const form = useForm<ShippingAddressInputs>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: initialData || {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onFormChange(value as ShippingAddressInputs, form.formState.isValid);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.formState.isValid, onFormChange, form]);

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form.reset, form]);


  return (
    <Card className="p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-[Yeseve One]">Shipping Address</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765]">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765]" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765]">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+923XX-XXXXXXX" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765]" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[#EFA765]">Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address, P.O. Box" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765]" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[#EFA765]">Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765]" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765]">City</FormLabel>
                  <FormControl>
                    <Input placeholder="Lahore" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765]" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765]">State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="Punjab" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765]" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765]">Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="54000" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765]" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#EFA765]">Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Pakistan" {...field} className="bg-[#2a3b52] border-[#EFA765]/30 text-white focus:ring-[#EFA765]" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
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
