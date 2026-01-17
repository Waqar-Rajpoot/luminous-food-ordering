"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, PlusCircle, Edit, Trash2, MoreHorizontal,ChevronDown, ChevronUp, Package, Tag, CheckCircle,DollarSign,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ICategory } from "@/models/Category.model";

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
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import FileUpload from "@/components/MediaUploader";
import { Product } from "@/models/Product.model";
import { categoryFormSchema } from "@/schemas/categoryFormSchema";
import { productFormSchema } from "@/schemas/productFormSchema";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type CategoryFormInputs = z.infer<typeof categoryFormSchema>;

interface MenuStats {
  totalProducts: number;
  totalCategories: number;
  availableProducts: number;
  averagePrice: string;
}

const calculateMenuStats = (
  products: Product[],
  categories: ICategory[]
): MenuStats => {
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const availableProducts = products.filter((p) => p.isAvailable).length;
  const totalPrice = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const averagePrice =
    totalProducts > 0
      ? (totalPrice / totalProducts).toFixed(2).toLocaleString()
      : "0.00";

  return {
    totalProducts,
    totalCategories,
    availableProducts,
    averagePrice,
  };
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  description,
  colorClass,
}) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 transition duration-300 hover:shadow-2xl hover:border-white/20">
    <div className={`flex items-center justify-between mb-4 ${colorClass}`}>
      {icon}
      <p className="text-sm font-semibold uppercase">{title}</p>
    </div>
    <div className="text-4xl font-extrabold text-white mb-1">{value}</div>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export default function CreateMenuPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  // 👈 2. Declare the missing state variable

  // State for Product Deletion Confirmation Dialog
  const [showProductDeleteConfirm, setShowProductDeleteConfirm] =
    useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(
    null
  );
  const [productToDeleteName, setProductToDeleteName] = useState<string | null>(
    null
  );

  // State for Category Deletion Confirmation Dialog
  const [showCategoryDeleteConfirm, setShowCategoryDeleteConfirm] =
    useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(
    null
  );
  const [categoryToDeleteName, setCategoryToDeleteName] = useState<
    string | null
  >(null);

  // States for Collapsible sections
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  // Calculate stats dynamically
  const menuStats = useMemo(
    () => calculateMenuStats(products, categories),
    [products, categories]
  );

  // React Hook Form for Product Management
  const productForm = useForm<any>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      imageSrc: "",
      isAvailable: true,
    },
  });

  // React Hook Form for Category Management
  const categoryForm = useForm<CategoryFormInputs>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products.");
      const data = await response.json();
      if (data.success) setProducts(data.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load products.");
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories.");
      const data = await response.json();
      if (data.success) setCategories(data.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load categories.");
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchProducts();
      fetchCategories();
    }
  }, [status, session, fetchProducts, fetchCategories]);

  const handleAddProductClick = () => {
    setEditingProduct(null);
    // Resetting with only the required fields
    productForm.reset({
      name: "",
      price: 0,
      category: "",
      imageSrc: "",
      isAvailable: true,
    });
    setIsProductDialogOpen(true);
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    // Resetting with only the required fields from the product object
    productForm.reset({
      name: product.name,
      price: product.price,
      category: product.category,
      // Removed product.description
      imageSrc: product.imageSrc,
      isAvailable: product.isAvailable,
    });
    setIsProductDialogOpen(true);
  };

  const confirmDeleteProduct = (product: Product) => {
    setProductToDeleteId(product._id);
    setProductToDeleteName(product.name);
    setShowProductDeleteConfirm(true);
  };

  const executeDeleteProduct = async () => {
    if (!productToDeleteId) return;
    try {
      const response = await fetch(`/api/products/${productToDeleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product.");
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product.");
      console.error("Error deleting product:", error);
    } finally {
      setProductToDeleteId(null);
      setProductToDeleteName(null);
      setShowProductDeleteConfirm(false);
    }
  };

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !product.isAvailable }),
      });
      if (!response.ok) throw new Error("Failed to update availability.");
      toast.success("Product availability updated!");
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Failed to update availability.");
      console.error("Error updating availability:", error);
    }
  };

  const onProductFormSubmit = async (data: any) => {
    // Use 'any' to accommodate the form structure without description
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `/api/products/${editingProduct._id}`
      : "/api/products";
    try {
      const payload = {
        name: data.name,
        price: data.price,
        category: data.category,
        imageSrc: data.imageSrc,
        isAvailable: data.isAvailable,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${editingProduct ? "update" : "add"} product.`
        );
      }

      toast.success(
        `Product ${editingProduct ? "updated" : "added"} successfully!`
      );
      setIsProductDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(
        error.message ||
          `Failed to ${editingProduct ? "update" : "add"} product.`
      );
      console.error("Product form submission error:", error);
    }
  };

  const handleAddCategoryClick = () => {
    setEditingCategory(null);
    categoryForm.reset();
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategoryClick = (category: ICategory) => {
    setEditingCategory(category);
    categoryForm.reset({ _id: category._id, name: category.name });
    setIsCategoryDialogOpen(true);
  };

  const confirmDeleteCategory = (category: ICategory) => {
    setCategoryToDeleteId(category._id);
    setCategoryToDeleteName(category.name);
    setShowCategoryDeleteConfirm(true);
  };

  const executeDeleteCategory = async () => {
    if (!categoryToDeleteId) return;
    try {
      const response = await fetch(`/api/categories/${categoryToDeleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category.");
      toast.success("Category deleted successfully!");
      fetchCategories();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category.");
      console.error("Error deleting category:", error);
    } finally {
      setCategoryToDeleteId(null);
      setCategoryToDeleteName(null);
      setShowCategoryDeleteConfirm(false);
    }
  };

  const onCategoryFormSubmit = async (data: CategoryFormInputs) => {
    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `/api/categories/${editingCategory._id}`
      : "/api/categories";
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${editingCategory ? "update" : "add"} category.`
        );
      }

      toast.success(
        `Category ${editingCategory ? "updated" : "added"} successfully!`
      );
      setIsCategoryDialogOpen(false);
      categoryForm.reset();
      fetchCategories();
    } catch (error: any) {
      toast.error(
        error.message ||
          `Failed to ${editingCategory ? "update" : "add"} category.`
      );
      console.error("Category form submission error:", error);
    }
  };

  // --- LOADING / AUTH CHECK ---
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#141f2d] flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#efa765]" />
        <p className="text-[#efa765] text-xl ml-4">Loading Admin Panel...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    redirect("/sign-in");
    return null;
  }

  // --- RENDERED UI ---
  return (
    <div className="min-h-screen bg-[#141f2d] p-4 sm:pt-25 text-white pt-20">
      <h1 className="yeseva-one text-[rgb(239,167,101)] text-5xl md:text-6xl font-bold text-center mb-12 drop-shadow-lg tracking-wider">
        📦 Product Command Center
      </h1>

      {/* --- STATS OVERVIEW --- */}
      <section className="mb-12">
        <h2 className="yeseva-one text-4xl font-bold text-white mb-6">
          Stats Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Package className="h-8 w-8" />}
            title="Total Products"
            value={menuStats.totalProducts}
            colorClass="text-[#efa765]"
            description="All items in your menu"
          />
          <StatCard
            icon={<Tag className="h-8 w-8" />}
            title="Total Categories"
            value={menuStats.totalCategories}
            colorClass="text-blue-400"
            description="Sections to organize your menu"
          />
          <StatCard
            icon={<CheckCircle className="h-8 w-8" />}
            title="Available Products"
            value={menuStats.availableProducts}
            colorClass="text-[#3dd878]"
            description="Currently visible to customers"
          />
          <StatCard
            icon={<DollarSign className="h-8 w-8" />}
            title="Average Price"
            value={`PKR ${menuStats.averagePrice}`}
            colorClass="text-red-400"
            description="Mean price across all products"
          />
        </div>
      </section>

      <hr className="border-gray-700 my-8" />

      {/* --- PRODUCTS SECTION (500px Scrollable) --- */}
      <section className="bg-gray-800/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#efa765]/50 mb-8">
        <Collapsible
          open={isProductsOpen}
          onOpenChange={setIsProductsOpen}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center mb-6 cursor-pointer border-b border-gray-700 pb-4">
              <h2 className="yeseva-one text-[rgb(239,167,101)] text-3xl font-bold flex items-center">
                <Package className="h-6 w-6 mr-3" /> Product List
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
            <div className="flex justify-end items-center mb-6 space-x-4">
              <Button
                onClick={handleAddProductClick}
                className="bg-[#efa765] text-[#141f2d] hover:bg-[#ffb779] font-semibold transition duration-200 shadow-md hover:cursor-pointer"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
              </Button>
            </div>

            {loadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-10 w-10 text-[#efa765]" />
                <p className="ml-4 text-xl text-gray-400">
                  Loading gourmet goodness...
                </p>
              </div>
            ) : products.length === 0 ? (
              <p className="text-center text-gray-400 py-12 text-lg">
                No products found. Time to add your first delicious item! 🚀
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-700 max-h-[500px] overflow-y-auto">
                <Table className="min-w-full">
                  <TableHeader className="bg-gray-700/50 sticky top-0 z-10">
                    <TableRow className="hover:bg-gray-700/50">
                      <TableHead className="text-[#efa765] min-w-[70px]">
                        Image
                      </TableHead>
                      <TableHead className="text-[#efa765] min-w-[150px]">
                        Name
                      </TableHead>
                      <TableHead className="text-[#efa765] min-w-[100px]">
                        Category
                      </TableHead>
                      <TableHead className="text-[#efa765] min-w-[100px]">
                        Price (PKR)
                      </TableHead>
                      <TableHead className="text-[#efa765] min-w-[100px]">
                        Availability
                      </TableHead>
                      <TableHead className="text-[#efa765] text-right min-w-[80px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product._id}
                        className="border-gray-700 hover:bg-gray-700/70 transition-colors"
                      >
                        <TableCell>
                          <Image
                            src={product.imageSrc || "/placeholder-image.png"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-lg object-cover w-[50px] h-[50px] border border-gray-600"
                            unoptimized
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-white">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-600 text-[#efa765]">
                            {product.category}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-[#3dd878] font-bold">
                          {`PKR ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={product.isAvailable}
                            onCheckedChange={() =>
                              handleToggleProductAvailability(product)
                            }
                            className="data-[state=checked]:bg-[#3dd878] data-[state=unchecked]:bg-red-500"
                          />
                          <span
                            className={`ml-2 text-sm font-medium ${product.isAvailable ? "text-[#3dd878]" : "text-red-400"}`}
                          >
                            {product.isAvailable ? "Live" : "Hidden"}
                          </span>
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
                                <Edit className="mr-2 h-4 w-4 text-blue-400" />{" "}
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem
                                onClick={() => confirmDeleteProduct(product)}
                                className="text-red-500 hover:bg-red-900 hover:text-red-100 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                Product
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

      <hr className="border-gray-700 my-8" />

      {/* --- CATEGORIES SECTION (400px Scrollable) --- */}
      <section className="bg-gray-800/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#efa765]/50">
        <Collapsible
          open={isCategoriesOpen}
          onOpenChange={setIsCategoriesOpen}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center mb-6 cursor-pointer border-b border-gray-700 pb-4">
              <h2 className="yeseva-one text-[rgb(239,167,101)] text-3xl font-bold flex items-center">
                <Tag className="h-6 w-6 mr-3" /> Category Structure
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
                className="bg-[#efa765] text-[#141f2d] hover:bg-[#ffb779] font-semibold transition duration-200 shadow-md hover:shadow-lg"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Category
              </Button>
            </div>

            {loadingCategories ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-10 w-10 text-[#efa765]" />
                <p className="ml-4 text-xl text-gray-400">
                  Organizing categories...
                </p>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center text-gray-400 py-12 text-lg">
                No categories found. Start organizing your menu! 📂
              </p>
            ) : (
              // --- SCROLLABLE CONTAINER ADDED HERE ---
              <div className="overflow-x-auto rounded-lg border border-gray-700 max-h-[400px] overflow-y-auto">
                <Table className="min-w-full">
                  <TableHeader className="bg-gray-700/50 sticky top-0 z-10">
                    <TableRow className="hover:bg-gray-700/50">
                      <TableHead className="text-[#efa765]">
                        Category Name
                      </TableHead>
                      <TableHead className="text-gray-400 hidden sm:table-cell">
                        Products Count
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
                        className="border-gray-700 hover:bg-gray-700/70 transition-colors"
                      >
                        <TableCell className="font-semibold text-white">
                          {category.name}
                        </TableCell>
                        <TableCell className="text-gray-300 hidden sm:table-cell">
                          {
                            products.filter((p) => p.category === category.name)
                              .length
                          }
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
                                onClick={() =>
                                  handleEditCategoryClick(category)
                                }
                                className="text-gray-200 hover:bg-gray-700 cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4 text-blue-400" />{" "}
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem
                                onClick={() => confirmDeleteCategory(category)}
                                className="text-red-500 hover:bg-red-900 hover:text-red-100 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              // --- END SCROLLABLE CONTAINER ---
            )}
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* --- Product Add/Edit Dialog --- */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh] bg-gray-800/95 backdrop-blur-sm border-[#efa765] text-white">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="yeseva-one text-[rgb(239,167,101)] text-center text-3xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            {/* DialogDescription intentionally removed here */}
          </DialogHeader>
          <Form {...productForm}>
            <form
              onSubmit={productForm.handleSubmit(onProductFormSubmit)}
              className="flex-grow space-y-4 py-4 overflow-y-auto"
            >
              <FormField
                control={productForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#efa765]">
                      Product Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Classic Burger"
                        {...field}
                        className="bg-gray-700 text-white border-gray-600 focus:border-[#efa765]"
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
                    <FormLabel className="text-[#efa765]">
                      Price (PKR)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="750.00"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className="bg-gray-700 text-white border-gray-600 focus:border-[#efa765]"
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-700 text-white border-gray-600 focus:border-[#efa765]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat._id}
                            value={cat.name}
                            className="hover:bg-gray-700"
                          >
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
                    <FormLabel className="text-[#efa765]">
                      Product Image
                    </FormLabel>
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4 bg-gray-700/50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-white">
                          Available for Order
                        </FormLabel>
                        <FormDescription className="text-gray-400">
                          Toggle to make this product visible/hidden on the
                          menu.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#3dd878] data-[state=unchecked]:bg-red-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter className="mt-6">
                <Button
                  type="submit"
                  disabled={productForm.formState.isSubmitting}
                  className="bg-[#efa765] text-[#141f2d] hover:bg-[#ffb779] font-bold transition duration-200"
                >
                  {productForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />{" "}
                      Saving...
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

      {/* --- Category Add/Edit Dialog --- */}
      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-gray-800/95 backdrop-blur-sm border-[#efa765] text-white">
          <DialogHeader>
            <DialogTitle className="yeseva-one text-[rgb(239,167,101)] text-2xl">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingCategory
                ? "Make changes to your category here."
                : "Add a new category for your menu items."}
            </DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form
              onSubmit={categoryForm.handleSubmit(onCategoryFormSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#efa765]">
                      Category Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Burgers"
                        {...field}
                        className="bg-gray-700 text-white border-gray-600 focus:border-[#efa765]"
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
                  className="bg-[#efa765] text-[#141f2d] hover:bg-[#ffb779] font-bold transition duration-200"
                >
                  {categoryForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />{" "}
                      Saving...
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

      {/* --- Product Delete Confirmation Dialog --- */}
      <AlertDialog
        open={showProductDeleteConfirm}
        onOpenChange={setShowProductDeleteConfirm}
      >
        <AlertDialogContent className="bg-gray-800/95 backdrop-blur-sm border-red-500/50 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="yeseva-one text-red-500 text-2xl">
              ⚠️ Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the
              product:
              <br />
              <span className="font-bold text-white text-lg">
                {productToDeleteName}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white border-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteProduct}
              className="bg-red-600 text-white hover:bg-red-700 font-bold"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- Category Delete Confirmation Dialog --- */}
      <AlertDialog
        open={showCategoryDeleteConfirm}
        onOpenChange={setShowCategoryDeleteConfirm}
      >
        <AlertDialogContent className="bg-gray-800/95 backdrop-blur-sm border-red-500/50 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="yeseva-one text-red-500 text-2xl">
              ⚠️ Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the
              category:
              <br />
              <span className="font-bold text-white text-lg">
                {categoryToDeleteName}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white border-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteCategory}
              className="bg-red-600 text-white hover:bg-red-700 font-bold"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
