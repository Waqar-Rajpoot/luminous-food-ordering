"use client";

import { useState } from "react"; // Added useState
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dealSchema, type DealFormValues } from "@/schemas/hotDealFormSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, Loader2, Calendar, X } from "lucide-react"; // Added X
import axios from "axios";
import { toast } from "sonner";
import FileUpload from "@/components/MediaUploader";
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
  // 1. State to track if we are editing
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema) as any,
    defaultValues: defaultFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const today = new Date().toISOString().split("T")[0];
  const selectedStartDate = watch("startDate");

  // 2. Handle Edit Trigger from DealsList
  const handleEdit = (deal: any) => {
    setEditingId(deal._id);
    
    // Normalize dates for HTML input (YYYY-MM-DD)
    const start = deal.startDate?.$date || deal.startDate;
    const end = deal.endDate?.$date || deal.endDate;

    reset({
      ...deal,
      startDate: start ? new Date(start).toISOString().split('T')[0] : "",
      endDate: end ? new Date(end).toISOString().split('T')[0] : "",
      items: deal.items.map((i: any) => ({ name: i.name, quantity: i.quantity }))
    });
  };

  // 3. Reset form and exit edit mode
  const cancelEdit = () => {
    setEditingId(null);
    reset(defaultFormValues);
  };

  const onSubmit = async (data: DealFormValues) => {
    try {
      const response = editingId 
        ? await axios.patch(`/api/deals/${editingId}`, data) // UPDATE
        : await axios.post("/api/deals", data);               // CREATE

      if (response.data.success) {
        toast.success(editingId ? "Deal updated successfully!" : "Deal published successfully!");
        reset(defaultFormValues);
        setEditingId(null);
        // Tip: You might want to trigger a refresh in the DealsList here 
        // if it doesn't auto-update via a shared state or SWR/React Query.
        window.location.reload(); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#141F2D] text-[#EFA765] overflow-x-hidden flex flex-col justify-center items-center">
      
      <div className="max-w-4xl mx-auto md:mx-0 px-4 py-8 sm:px-2 lg:px-8 pt-24 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3 uppercase tracking-tighter">
              <Save className="h-7 w-7 sm:h-8 sm:w-8" /> 
              {editingId ? "Update Deal" : "Create New Deal"}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">
              {editingId ? `Modifying: ${editingId}` : "Design and publish elite bistro offers"}
            </p>
          </div>

          {editingId && (
            <Button 
              onClick={cancelEdit} 
              variant="outline" 
              className="border-red-500/50 text-red-500 hover:bg-red-500/10"
            >
              <X className="mr-2 h-4 w-4" /> Cancel Editing
            </Button>
          )}
        </div>

        <Card className="bg-[#1D2B3F] border-[#EFA765]/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-4 sm:p-8">
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
                {errors.image && <p className="text-red-400 text-xs mt-2">{errors.image.message}</p>}
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Deal Title</label>
                  <Input 
                    {...register("title")} 
                    className="bg-[#141F2D] border-white/10 text-white focus:ring-[#EFA765] h-12 rounded-xl" 
                    placeholder="e.g. Midnight Platter Special" 
                  />
                  {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Detailed Description</label>
                  <Textarea 
                    {...register("description")} 
                    className="bg-[#141F2D] border-white/10 text-white min-h-[100px] rounded-xl" 
                    placeholder="Describe what makes this deal special..." 
                  />
                  {errors.description && <p className="text-red-400 text-xs">{errors.description.message}</p>}
                </div>
              </div>

              {/* Validity Dates */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#EFA765]" /> Validity Period
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-white/30">Start Date</label>
                    <Input 
                      type="date" 
                      {...register("startDate")} 
                      min={today} 
                      className="bg-[#141F2D] border-white/10 text-white h-11 [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-white/30">End Date</label>
                    <Input 
                      type="date" 
                      {...register("endDate")} 
                      min={selectedStartDate || today} 
                      className="bg-[#141F2D] border-white/10 text-white h-11 [color-scheme:dark]" 
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Logic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#EFA765]/5 border border-[#EFA765]/10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-white/30">Original Price (PKR)</label>
                  <Input 
                    type="number" 
                    {...register("originalPrice", { valueAsNumber: true })} 
                    className="bg-[#141F2D] border-white/10 text-white h-11" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#EFA765]">Deal Price (PKR)</label>
                  <Input 
                    type="number" 
                    {...register("dealPrice", { valueAsNumber: true })} 
                    className="bg-[#141F2D] border-[#EFA765]/30 text-white text-lg font-black h-11" 
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Included Items</h3>
                  <button 
                    type="button" 
                    onClick={() => append({ name: "", quantity: 1 })}
                    className="flex items-center gap-1 border border-[#EFA765] text-[#EFA765] hover:bg-[#EFA765] hover:text-[#141F2D] px-3 py-1 rounded-md text-[10px] font-bold transition-all"
                  >
                    <Plus className="h-3 w-3" /> ADD
                  </button>
                </div>
                
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-3 sm:items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="flex-grow">
                        <Input 
                          {...register(`items.${index}.name` as const)} 
                          placeholder="Item Name" 
                          className="bg-transparent border-none text-white focus:ring-0 p-0 h-8" 
                        />
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase text-white/20 sm:hidden">Qty:</span>
                          <Input 
                            type="number" 
                            {...register(`items.${index}.quantity` as const, { valueAsNumber: true })} 
                            className="bg-[#141F2D] border-white/10 text-white text-center w-16 h-9 rounded-lg" 
                          />
                        </div>
                        <Button 
                          type="button" 
                          onClick={() => remove(index)} 
                          variant="ghost" 
                          className="text-red-400 hover:bg-red-500/10 h-9 w-9 p-0 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Submit Button */}
              <Button 
                type="submit"
                disabled={isSubmitting} 
                className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white h-14 sm:h-16 rounded-xl sm:rounded-2xl text-lg font-black transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  editingId ? "SAVE CHANGES" : "PUBLISH HOT DEAL"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Section - Passing the handleEdit prop */}
        <div className="w-full">
           <DealsList onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}