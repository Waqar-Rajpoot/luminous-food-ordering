"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dealSchema, type DealFormValues } from "@/schemas/hotDealFormSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, Loader2, Calendar, X, Zap } from "lucide-react";
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema) as any,
    defaultValues: defaultFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const today = new Date().toISOString().split("T")[0];
  const selectedStartDate = watch("startDate");

  const handleEdit = (deal: any) => {
    setEditingId(deal._id);
    const start = deal.startDate?.$date || deal.startDate;
    const end = deal.endDate?.$date || deal.endDate;

    reset({
      ...deal,
      startDate: start ? new Date(start).toISOString().split("T")[0] : "",
      endDate: end ? new Date(end).toISOString().split("T")[0] : "",
      items: deal.items.map((i: any) => ({
        name: i.name,
        quantity: i.quantity,
      })),
    });
    // Scroll to top on mobile when editing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset(defaultFormValues);
  };

  const onSubmit = async (data: DealFormValues) => {
    try {
      const response = editingId
        ? await axios.patch(`/api/deals/${editingId}`, data)
        : await axios.post("/api/deals", data);

      if (response.data.success) {
        toast.success(
          editingId
            ? "Deal updated successfully!"
            : "Deal published successfully!",
        );
        reset(defaultFormValues);
        setEditingId(null);
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#141F2D] text-[#EFA765] p-4 sm:p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-[#1D2B3F] p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-[#EFA765]/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-[#EFA765] fill-[#EFA765]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                  Promotional Engine
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-[#EFA765] flex items-center flex-wrap uppercase italic">
                {editingId ? "Update" : "Deal"}{" "}
                <span className="text-white ml-2 sm:ml-3">Management</span>
              </h1>
              <p className="text-gray-100 opacity-60 text-xs sm:text-sm font-medium max-w-xl">
                {editingId
                  ? `Modifying Terminal ID: ${editingId}`
                  : "Design and publish elite bistro offers for the deployment pipeline."}
              </p>
            </div>

            {editingId && (
              <Button
                onClick={cancelEdit}
                variant="outline"
                className="border-red-500/50 text-red-500 hover:bg-red-500/10 h-14 px-8 rounded-xl font-black uppercase text-xs"
              >
                <X className="mr-2 h-4 w-4" /> Cancel Editing
              </Button>
            )}
          </div>
        </div>

        {/* SIDE-BY-SIDE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FORM (Takes 7 columns on large screens) */}
          <div className="lg:col-span-7 xl:col-span-7">
            <Card className="bg-[#1D2B3F] border-[#EFA765]/20 rounded-[2rem] overflow-hidden shadow-2xl">
              <CardContent className="p-6 sm:p-10">
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
                      <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mt-2 animate-pulse">
                        {errors.image.message}
                      </p>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#EFA765]/60 ml-1">
                        Deal Title
                      </label>
                      <Input
                        {...register("title")}
                        className="bg-[#141F2D] border-[#EFA765]/10 text-white focus:border-[#EFA765]/50 h-14 rounded-xl font-bold"
                        placeholder="e.g. Midnight Platter Special"
                      />
                      {errors.title && (
                        <p className="text-red-400 text-xs">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#EFA765]/60 ml-1">
                        Detailed Description
                      </label>
                      <Textarea
                        {...register("description")}
                        className="bg-[#141F2D] border-[#EFA765]/10 text-white min-h-[120px] rounded-xl focus:border-[#EFA765]/50"
                        placeholder="Describe what makes this deal special..."
                      />
                      {errors.description && (
                        <p className="text-red-400 text-xs">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Validity and Pricing Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EFA765] flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Validity Window
                      </h3>
                      <div className="space-y-3 p-5 rounded-2xl bg-[#141F2D]/50 border border-[#EFA765]/10">
                        <Input
                          type="date"
                          {...register("startDate")}
                          min={today}
                          className="bg-[#141F2D] border-white/5 text-white h-11 [color-scheme:dark]"
                        />
                        <Input
                          type="date"
                          {...register("endDate")}
                          min={selectedStartDate || today}
                          className="bg-[#141F2D] border-white/5 text-white h-11 [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EFA765] flex items-center gap-2">
                        Financial Matrix
                      </h3>
                      <div className="space-y-3 p-5 rounded-2xl bg-[#EFA765]/5 border border-[#EFA765]/10">
                        <Input
                          type="number"
                          {...register("originalPrice", {
                            valueAsNumber: true,
                          })}
                          placeholder="Original Price"
                          className="bg-[#141F2D] border-white/5 text-white h-11"
                        />
                        <Input
                          type="number"
                          {...register("dealPrice", { valueAsNumber: true })}
                          placeholder="Deal Price"
                          className="bg-[#141F2D] border-[#EFA765]/30 text-[#EFA765] text-lg font-black h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Items Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#EFA765]/10 pb-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EFA765]">
                        Inventory Bundle
                      </h3>
                      <button
                        type="button"
                        onClick={() => append({ name: "", quantity: 1 })}
                        className="flex items-center gap-1 bg-[#EFA765]/10 border border-[#EFA765]/20 text-[#EFA765] hover:bg-[#EFA765] hover:text-[#141F2D] px-4 py-1.5 rounded-full text-[10px] font-black transition-all"
                      >
                        <Plus className="h-3 w-3" /> ADD ITEM
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex gap-3 items-center bg-[#141F2D]/50 p-3 rounded-xl border border-white/5 group"
                        >
                          <Input
                            {...register(`items.${index}.name` as const)}
                            placeholder="Item Name"
                            className="bg-transparent border-none text-white focus:ring-0 p-0 h-8 font-bold"
                          />
                          <Input
                            type="number"
                            {...register(`items.${index}.quantity` as const, {
                              valueAsNumber: true,
                            })}
                            className="bg-[#141F2D] border-white/10 text-white text-center w-20 h-9 rounded-lg"
                          />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="ghost"
                            className="text-red-400 hover:bg-red-500/10 h-9 w-9 p-0 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white h-16 sm:h-20 rounded-2xl text-xl font-black transition-all shadow-xl shadow-[#EFA765]/10"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin h-6 w-6" />
                    ) : editingId ? (
                      "SYNC CHANGES"
                    ) : (
                      "DEPLOY HOT DEAL"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: LIST (Takes 5 columns on large screens) */}
          <div className="lg:col-span-5 xl:col-span-5 h-full">
            <div className="bg-[#1D2B3F] rounded-[2rem] border border-[#EFA765]/20 shadow-2xl p-2 h-full min-h-[600px]">
              <DealsList onEdit={handleEdit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
