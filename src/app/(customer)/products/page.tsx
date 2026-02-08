"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { 
  ChefHat, Salad, Soup, Utensils, Loader2, 
  Star, Search, SlidersHorizontal, ShoppingBag, Zap 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  salesCount: number;
  averageRating: number;
  reviewCount: number;
}

const getCategoryIcon = (category: string) => {
  const iconClass = "h-6 w-6 md:h-8 md:w-8 text-[#EFA765]";
  switch (category) {
    case "Fast Food": return <ChefHat className={iconClass} />;
    case "Healthy Options": return <Salad className={iconClass} />;
    case "Main Courses": return <Utensils className={iconClass} />;
    case "Desserts": return <Soup className={iconClass} />;
    default: return <Utensils className={iconClass} />;
  }
};

export default function ProductsPage() {
  const { addItemToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState("");
  const [sortOrder, setSortOrder] = useState("price-asc");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/product");
        const mappedData = response.data.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          category: item.category,
          image: item.imageSrc || "/placeholder-food.jpg",
          salesCount: item.salesCount || 0,
          averageRating: item.averageRating || 0,
          reviewCount: item.reviewCount || 0,
        }));
        setProducts(mappedData);
      } catch (e: any) {
        setError(e.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const groupedProducts = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(filterName.toLowerCase())
    );

    if (sortOrder === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sortOrder === "sales-desc") filtered.sort((a, b) => b.salesCount - a.salesCount);

    return filtered.reduce((acc: Record<string, Product[]>, product) => {
      acc[product.category] = acc[product.category] || [];
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [products, filterName, sortOrder]);

  const handleAddToCart = (product: Product) => {
    if (!session) {
      toast.error("Please sign in to add products to your cart.");
      router.push("/sign-in");
      return;
    }
    addItemToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-[#141F2D] text-white overflow-x-hidden">

      {/* --- PREMIUM HEADER --- */}
      <div className="pt-20 md:pt-20 pb-12 md:pb-16 px-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex flex-col gap-3 md:gap-4">
          <span className="text-[#EFA765] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">The Elite Menu</span>
          
          {/* MOBILE FIX: Reduced text size from text-6xl to text-4xl/5xl and added leading adjustment */}
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] md:leading-none">
            Culinary <br /> <span className="text-[#EFA765]">Excellence.</span>
          </h2>
          
          <p className="max-w-xl text-gray-400 text-sm md:text-lg font-light leading-relaxed mt-4">
            Explore our meticulously crafted selection of dishes, where every ingredient is chosen for its superior quality.
          </p>
        </div>
      </div>

      {/* --- STICKY FILTERS --- */}
      <div className="sticky top-[64px] md:top-[70px] z-30 bg-[#141F2D]/90 backdrop-blur-xl border-b border-white/5 py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 h-4 w-4" />
            <Input
              placeholder="Search masterpieces..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:ring-[#EFA765] text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <SlidersHorizontal className="text-[#EFA765] h-5 w-5 hidden md:block" />
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-12 md:h-14 rounded-xl md:rounded-2xl w-full md:w-[240px] border-white/10 bg-white/5 text-white text-sm">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1D2B3F] text-white border-white/10">
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="sales-desc">Highly Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 md:h-96">
            <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin mb-4 text-[#EFA765]" />
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#EFA765] animate-pulse">Refining Menu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400 font-bold italic uppercase text-sm">System Error: {error}</div>
        ) : (
          Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="mb-16 md:mb-24">
              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                <div className="p-3 md:p-4 bg-[#EFA765]/10 rounded-2xl md:rounded-3xl">{getCategoryIcon(category)}</div>
                <h3 className="text-2xl md:text-5xl font-black italic tracking-tighter uppercase">{category}</h3>
                <div className="flex-grow h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              {/* Responsive Grid: 1 column for small phones, 2 for tablets, 4 for desktops */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-12 md:gap-y-16">
                {items.map((product) => (
                  <div key={product.id} className="group relative">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden mb-5 md:mb-6 bg-[#1A293A] border border-white/5 shadow-2xl transition-all duration-500 group-hover:rounded-3xl">
                      <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      
                      <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-[#141F2D]/80 backdrop-blur-xl border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-2">
                        <Star className="h-3 w-3 fill-[#EFA765] text-[#EFA765]" />
                        <span className="text-[10px] md:text-[11px] font-black">{product.averageRating}</span>
                        <span className="text-[8px] md:text-[9px] text-white/80 font-bold">Reviews ({product.reviewCount})</span>
                      </div>

                      {/* Add Button for Desktop (Hover) */}
                      <div className="absolute inset-0 bg-[#EFA765]/90 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button onClick={() => handleAddToCart(product)} className="bg-[#141F2D] text-white px-8 py-4 h-auto rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                          Quick Add <ShoppingBag size={14} className="ml-2" />
                        </Button>
                      </div>
                    </div>

                    <div className="px-2 md:px-4">
                      <p className="text-[#EFA765] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2">{category}</p>
                      <h4 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-3 md:mb-4 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xl md:text-2xl font-black">Rs. {product.price.toLocaleString()}</span>
                        {/* Mobile Add to Cart Icon (since hover doesn't work on mobile) */}
                        <button onClick={() => handleAddToCart(product)} className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-[#EFA765]/10 md:bg-white/5 border border-[#EFA765]/20 md:border-white/10 flex items-center justify-center text-[#EFA765] md:text-white hover:bg-[#EFA765] hover:text-[#141F2D] transition-all active:scale-95">
                          <Zap size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}