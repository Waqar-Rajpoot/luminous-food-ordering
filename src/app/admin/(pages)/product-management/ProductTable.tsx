import React from "react";
// Removed: import Image from "next/image"; (Caused the error)
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
import { Switch } from "@/components/ui/switch";

// Types/Models
import { Product } from "@/models/Product.model";
import Image from "next/image";

interface ProductTableProps {
  products: Product[];
  loadingProducts: boolean;
  isProductsOpen: boolean;
  setIsProductsOpen: (open: boolean) => void;
  handleAddProductClick: () => void;
  handleEditProductClick: (product: Product) => void;
  confirmDeleteProduct: (product: Product) => void;
  handleToggleProductAvailability: (product: Product) => void;
}

export default function ProductTable({
  products,
  loadingProducts,
  isProductsOpen,
  setIsProductsOpen,
  handleAddProductClick,
  handleEditProductClick,
  confirmDeleteProduct,
  handleToggleProductAvailability,
}: ProductTableProps) {
  return (
    <section className="bg-card-background/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#efa765] mb-8">
      <Collapsible
        open={isProductsOpen}
        onOpenChange={setIsProductsOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center mb-6 cursor-pointer">
            <h2 className="yeseva-one text-[rgb(239,167,101)] text-3xl font-bold">
              Products
            </h2>
            <Button
              variant="ghost"
              className="text-[#efa765] hover:bg-gray-700"
            >
              {isProductsOpen ? (
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
              onClick={handleAddProductClick}
              className="bg-[#efa765] text-[#141f2d] hover:bg-opacity-90"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
            </Button>
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-[#efa765]" />
              <p className="ml-3 text-lg">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No products found. Add one to get started!
            </p>
          ) : (
            // The table wrapper includes horizontal scroll and the requested 500px vertical scroll fix.
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-800 hover:bg-gray-800">
                    <TableHead className="text-[#efa765]">Image</TableHead>
                    <TableHead className="text-[#efa765]">Name</TableHead>
                    <TableHead className="text-[#efa765]">Category</TableHead>
                    <TableHead className="text-[#efa765]">Price</TableHead>
                    <TableHead className="text-[#efa765]">Available</TableHead>
                    <TableHead className="text-[#efa765] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product._id}
                      className="border-gray-700 hover:bg-gray-700"
                    >
                      <TableCell>
                        {/* FIXED: Replaced Next.js Image component with standard HTML img tag */}
                        <Image 
                          src={product.imageSrc}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover w-[60px] h-[60px]" // Added Tailwind size classes for explicit dimensions
                        />
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {product.category}
                      </TableCell>
                      <TableCell className="text-[#3dd878]">
                        PKR {product.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={product.isAvailable}
                          onCheckedChange={() =>
                            handleToggleProductAvailability(product)
                          }
                          className="data-[state=checked]:bg-[#3dd878] data-[state=unchecked]:bg-gray-500"
                        />
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
                              onClick={() => handleEditProductClick(product)}
                              className="text-gray-200 hover:bg-gray-700 cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              onClick={() => confirmDeleteProduct(product)}
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
