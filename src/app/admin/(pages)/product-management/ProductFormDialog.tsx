// src/components/menu/ProductFormDialog.tsx

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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from "@/components/MediaUploader";

// Types/Models
import { Product } from "@/models/Product.model";
import { ICategory } from "@/models/Category.model";
import { productFormSchema } from "@/schemas/productFormSchema";

type ProductFormInputs = z.infer<typeof productFormSchema>;

interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  categories: ICategory[];
  onFormSubmit: (data: ProductFormInputs) => Promise<void>;
  productForm: ReturnType<typeof useForm<ProductFormInputs>>; // Pass the form instance
}

export default function ProductFormDialog({
  isOpen,
  onOpenChange,
  editingProduct,
  categories,
  onFormSubmit,
  productForm,
}: ProductFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh] bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="yeseva-one text-[rgb(239,167,101)] text-center">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...productForm}>
          <form
            onSubmit={productForm.handleSubmit(onFormSubmit)}
            className="flex-grow space-y-4 py-4 overflow-y-auto"
          >
            <FormField
              control={productForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765]">Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Classic Burger"
                      {...field}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765]">Price (PKR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="750.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765]">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat.name} className="hover:bg-gray-700">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="imageSrc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765]">Product Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      onChange={field.onChange}
                      value={field.value}
                      name={field.name}
                      disabled={productForm.formState.isSubmitting}
                      label="Upload product image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {editingProduct && (
              <FormField
                control={productForm.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-[#efa765]">Available for Order</FormLabel>
                      <FormDescription className="text-gray-400">
                        Toggle to make this product visible/hidden on the menu.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#3dd878] data-[state=unchecked]:bg-gray-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="flex-shrink-0">
              <Button
                type="submit"
                disabled={productForm.formState.isSubmitting}
                className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90"
              >
                {productForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...
                  </>
                ) : editingProduct ? (
                  "Save Changes"
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}