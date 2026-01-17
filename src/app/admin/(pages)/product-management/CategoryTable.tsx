// 




// src/components/menu/CategoryTable.tsx

import React from "react";
import {
  Loader2,
  PlusCircle,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types/Models
import { ICategory } from "@/models/Category.model";

interface CategoryTableProps {
  categories: ICategory[];
  loadingCategories: boolean;
  isCategoriesOpen: boolean;
  setIsCategoriesOpen: (open: boolean) => void;
  handleAddCategoryClick: () => void;
  handleEditCategoryClick: (category: ICategory) => void;
  confirmDeleteCategory: (category: ICategory) => void;
}

export default function CategoryTable({
  categories,
  loadingCategories,
  isCategoriesOpen,
  setIsCategoriesOpen,
  handleAddCategoryClick,
  handleEditCategoryClick,
  confirmDeleteCategory,
}: CategoryTableProps) {
  return (
    <section className="bg-card-background/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#efa765]">
      <Collapsible
        open={isCategoriesOpen}
        onOpenChange={setIsCategoriesOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center mb-6 cursor-pointer">
            <h2 className="yeseva-one text-[rgb(239,167,101)] text-3xl font-bold">
              Categories
            </h2>
            <Button
              variant="ghost"
              className="text-[#efa765] hover:bg-gray-700"
            >
              {isCategoriesOpen ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex justify-end items-center mb-6">
            <Button
              onClick={handleAddCategoryClick}
              className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Category
            </Button>
          </div>

          {loadingCategories ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-[#efa765]" />
              <p className="ml-3 text-lg">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No categories found. Add one to organize your menu!
            </p>
          ) : (
            // FIX APPLIED HERE: Added max-h-[400px] and overflow-y-auto for 400px scrollable height.
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-800 hover:bg-gray-800">
                    <TableHead className="text-[#efa765]">
                      Category Name
                    </TableHead>
                    <TableHead className="text-[#efa765] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow
                      key={category._id}
                      className="border-gray-700 hover:bg-gray-700"
                    >
                      <TableCell className="font-medium text-white">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-white hover:bg-gray-600"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-gray-800 border-gray-700 text-white"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditCategoryClick(category)}
                              className="text-gray-200 hover:bg-gray-700 cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              onClick={() => confirmDeleteCategory(category)}
                              className="text-red-500 hover:bg-red-900 hover:text-red-100 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
