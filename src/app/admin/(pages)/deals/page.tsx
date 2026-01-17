"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dealSchema, type DealFormValues } from "@/schemas/hotDealFormSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Loader2, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import FileUpload from "@/components/MediaUploader";
// import AdminHotDealsList from "@/components/AdminComponents/AdminHotDealsList";
import DealsList from "@/components/AdminComponents/DealsList";

const defaultFormValues: DealFormValues = {
  title: "",
  description: "",
  originalPrice: 0,
  dealPrice: 0,
  image: "",
  items: [{ name: "", quantity: 1 }],
  isAvailable: true,
  category: "Deals",
  startDate: "",
  endDate: "",
  availableDays: [],
};

export default function CreateDealPage() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<DealFormValues>({
    // Using 'as any' here resolves the "Type string | undefined is not assignable to string" 
    // error caused by Zod's refinement output vs form input mismatch.
    resolver: zodResolver(dealSchema) as any,
    defaultValues: defaultFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Get today's date in YYYY-MM-DD format for the 'min' attribute
  const today = new Date().toISOString().split("T")[0];

  // Watch the startDate value to dynamically set the min for endDate
  const selectedStartDate = watch("startDate");

  const onSubmit = async (data: DealFormValues) => {
    try {
      const response = await axios.post("/api/deals", data);
      if (response.data.success) {
        toast.success("Deal published successfully!");
        reset(defaultFormValues);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      

    <div className="min-h-screen bg-[#141F2D] p-8 text-[#EFA765] pt-20 space-y-10">
      <CardHeader className="border-b border-white/5 mb-8 rounded-t-3xl p-6">
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Save className="h-8 w-8 text-[#EFA765]" /> Create New Deal
          </CardTitle>
        </CardHeader>
      <Card className="bg-[#1D2B3F] border-[#EFA765]/20 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Image Section */}
            <div className="space-y-4">
              <Controller
                control={control}
                name="image"
                render={({ field }) => (
                  <FileUpload 
                    name={field.name}
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    label="Deal Banner Image"
                  />
                )}
              />
              {errors.image && (
                <p className="text-red-400 text-xs mt-2 font-medium">{errors.image.message}</p>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase ml-1 text-gray-500">Deal Title</label>
                <Input 
                  {...register("title")} 
                  className="bg-[#141F2D] border-white/10 text-white focus:ring-[#EFA765] h-12" 
                  placeholder="e.g. Midnight Platter Special" 
                />
                {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase ml-1 text-gray-500">Detailed Description</label>
                <Textarea 
                  {...register("description")} 
                  className="bg-[#141F2D] border-white/10 text-white min-h-[100px]" 
                  placeholder="Describe what makes this deal special..." 
                />
                {errors.description && <p className="text-red-400 text-xs">{errors.description.message}</p>}
              </div>
            </div>

            {/* Validity Dates Section */}
            <div className="space-y-4">
               <h3 className="text-lg font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#EFA765]" /> Validity Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/50">Start Date</label>
                  <Input 
                    type="date" 
                    {...register("startDate")} 
                    min={today} 
                    className="bg-[#141F2D] border-white/10 text-white focus:border-[#EFA765]" 
                  />
                  {errors.startDate && <p className="text-red-400 text-xs">{errors.startDate.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/50">End Date</label>
                  <Input 
                    type="date" 
                    {...register("endDate")} 
                    min={selectedStartDate || today} 
                    className="bg-[#141F2D] border-white/10 text-white focus:border-[#EFA765]" 
                  />
                  {errors.endDate && <p className="text-red-400 text-xs">{errors.endDate.message}</p>}
                </div>
              </div>
            </div>

            {/* Pricing Logic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#EFA765]/5 border border-[#EFA765]/20 shadow-inner">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-white/50">Original Price (PKR)</label>
                <Input 
                  type="number" 
                  {...register("originalPrice", { valueAsNumber: true })} 
                  className="bg-[#141F2D] border-white/10 text-white" 
                />
                {errors.originalPrice && <p className="text-red-400 text-xs">{errors.originalPrice.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[#EFA765]">Deal Price (PKR)</label>
                <Input 
                  type="number" 
                  {...register("dealPrice", { valueAsNumber: true })} 
                  className="bg-[#141F2D] border-[#EFA765]/30 text-white text-lg font-bold" 
                />
                {errors.dealPrice && <p className="text-red-400 text-xs">{errors.dealPrice.message}</p>}
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-lg font-bold uppercase tracking-widest text-gray-300">Included Items</h3>
                <Button 
                  type="button" 
                  onClick={() => append({ name: "", quantity: 1 })}
                  className="bg-transparent border border-[#EFA765] text-[#EFA765] hover:bg-[#EFA765] hover:text-[#141F2D]"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex-[3]">
                      <Input 
                        {...register(`items.${index}.name` as const)} 
                        placeholder="Item Name" 
                        className="bg-transparent border-none text-white focus:ring-0" 
                      />
                    </div>
                    <div className="flex-1">
                      <Input 
                        type="number" 
                        {...register(`items.${index}.quantity` as const, { valueAsNumber: true })} 
                        className="bg-[#141F2D] border-white/10 text-white text-center" 
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={() => remove(index)} 
                      variant="ghost" 
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting} 
              className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white h-16 rounded-2xl text-xl font-black"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "PUBLISH HOT DEAL"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    <DealsList />
</div>
  );
}