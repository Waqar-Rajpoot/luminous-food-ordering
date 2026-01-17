// src/components/menu/ConfirmationDialogs.tsx

import React from "react";

// Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogsProps {
  // Product Delete Props
  showProductDeleteConfirm: boolean;
  setShowProductDeleteConfirm: (open: boolean) => void;
  productToDeleteName: string | null;
  executeDeleteProduct: () => Promise<void>;
  
  // Category Delete Props
  showCategoryDeleteConfirm: boolean;
  setShowCategoryDeleteConfirm: (open: boolean) => void;
  categoryToDeleteName: string | null;
  executeDeleteCategory: () => Promise<void>;
}

export default function ConfirmationDialogs({
  showProductDeleteConfirm,
  setShowProductDeleteConfirm,
  productToDeleteName,
  executeDeleteProduct,
  showCategoryDeleteConfirm,
  setShowCategoryDeleteConfirm,
  categoryToDeleteName,
  executeDeleteCategory,
}: ConfirmationDialogsProps) {
  return (
    <>
      {/* Product Delete Confirmation Dialog */}
      <AlertDialog open={showProductDeleteConfirm} onOpenChange={setShowProductDeleteConfirm}>
        <AlertDialogContent className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="yeseva-one text-red-500">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the product:
              <br />
              <span className="font-bold text-white text-lg">{productToDeleteName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white border-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={executeDeleteProduct} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Delete Confirmation Dialog */}
      <AlertDialog open={showCategoryDeleteConfirm} onOpenChange={setShowCategoryDeleteConfirm}>
        <AlertDialogContent className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="yeseva-one text-red-500">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the category:
              <br />
              <span className="font-bold text-white text-lg">{categoryToDeleteName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white border-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={executeDeleteCategory} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}