// src/components/menu/CategoryFormDialog.tsx

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

// Components & Schemas
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Types/Models
import { ICategory } from "@/models/Category.model";
import { categoryFormSchema } from "@/schemas/categoryFormSchema";

type CategoryFormInputs = z.infer<typeof categoryFormSchema>;

interface CategoryFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: ICategory | null;
  onFormSubmit: (data: CategoryFormInputs) => Promise<void>;
  categoryForm: ReturnType<typeof useForm<CategoryFormInputs>>; // Pass the form instance
}

export default function CategoryFormDialog({
  isOpen,
  onOpenChange,
  editingCategory,
  onFormSubmit,
  categoryForm,
}: CategoryFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white">
        <DialogHeader>
          <DialogTitle className="yeseva-one text-[rgb(239,167,101)]">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingCategory
              ? "Make changes to your category here."
              : "Add a new category for your menu items."}
          </DialogDescription>
        </DialogHeader>
        <Form {...categoryForm}>
          <form onSubmit={categoryForm.handleSubmit(onFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={categoryForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765]">Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Burgers"
                      {...field}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={categoryForm.formState.isSubmitting}
                className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90"
              >
                {categoryForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...
                  </>
                ) : editingCategory ? (
                  "Save Changes"
                ) : (
                  "Add Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}