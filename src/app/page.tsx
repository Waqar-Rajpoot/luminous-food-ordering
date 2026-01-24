"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { 
  Loader2, Star, ShoppingCart, 
  ArrowRight, Flame, Crown, Utensils, Zap,
  TrendingUp, Sparkles
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItemToCart } = useCart();
  
  const { data: session } = useSession();
  const router = useRouter();

  const isValid = (src: any) => src && typeof src === "string" && src.trim() !== "";

  useEffect(() => {
    async function fetchHome() {
      try {
        const res = await fetch("/api/home-summary");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error(err);
        toast.error("Experience difficulty loading. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    fetchHome();
  }, []);

  const handleAddToCart = (item: any, isDeal: boolean) => {
    if (!session) {
      toast.error("Please sign in to add products to your cart.");
      router.push("/sign-in");
      return;
    }
    addItemToCart({
      id: item._id,
      name: isDeal ? item.title : item.name,
      price: isDeal ? item.dealPrice : item.price,
      image: isDeal ? item.image : item.imageSrc,
      category: item.category || "Premium",
    });
    toast.success(`${isDeal ? item.title : item.name} added to selection`);
  };

  if (loading) return (
    <div className="h-screen bg-[#141f2d] flex flex-col items-center justify-center p-6">
      <div className="relative">
        <Loader2 className="animate-spin text-[#efa765] h-12 w-12 md:h-16 md:w-16" />
        <Utensils className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white h-5 w-5 md:h-6 md:w-6" />
      </div>
      <h2 className="text-[#efa765] font-light tracking-[0.3em] uppercase text-[10px] mt-6 animate-pulse text-center">Refining the Experience</h2>
    </div>
  );

  return (
    <div className="bg-[#141f2d] min-h-screen text-white selection:bg-[#efa765] selection:text-[#141f2d] overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] md:h-screen flex items-center">
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
          {/* Mobile-friendly tag */}
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-4 md:px-6 py-2 rounded-full mb-6 md:mb-10 shadow-2xl">
            <Sparkles className="text-[#efa765] h-3 w-3 md:h-4 md:w-4" />
            <span className="text-white/80 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">The Gold Standard of Sahiwal</span>
          </div>
          
          {/* FIX: Reduced mobile font size from 8xl to 5xl and adjusted leading */}
          <h1 className="text-5xl sm:text-7xl md:text-[11rem] font-black tracking-tighter italic leading-[0.9] md:leading-[0.75] mb-8 md:mb-10 uppercase">
            ELITE <br /> <span className="text-[#efa765]">FLAVOR.</span>
          </h1>
          
          <div className="max-w-xl mb-12">
            <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-8 md:mb-10">
              Where architectural brilliance meets culinary perfection. We do not just serve food; we craft sensory experiences.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10">
                <button
                  onClick={() => router.push("/products")}
                  className="w-full sm:w-auto bg-[#efa765] text-[#141f2d] px-8 md:px-12 py-5 md:py-6 rounded-2xl font-black uppercase text-xs md:text-sm hover:translate-y-1 transition-all flex items-center justify-center gap-4 shadow-lg"
                >
                  Explore Creations <ArrowRight size={18} />
                </button>
                <div className="hidden md:block h-12 w-px bg-white/10" />
                <div className="flex flex-col">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">Open Daily</p>
                    <p className="text-sm font-bold italic uppercase">12:00 PM - 02:00 AM</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXCLUSIVE DEALS --- */}
      <section className="py-16 md:py-24 bg-[#101925]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
            <div className="flex items-center gap-4">
               <div className="p-3 md:p-4 bg-[#efa765]/10 rounded-2xl">
                 <Flame className="text-[#efa765] h-5 w-5 md:h-6 md:w-6" />
               </div>
               <div>
                  <h2 className="text-[#efa765] text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-1">Seasonal Offers</h2>
                  <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">Signature Deals.</h3>
               </div>
            </div>
            <p className="text-white/40 text-xs md:text-sm max-w-50 font-medium uppercase tracking-tighter md:text-right">
              Curated bundles for the ultimate dining experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data?.activeDeals.map((deal: any) => (
              <div key={deal._id} className="group relative bg-[#1a293a] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/5 flex flex-col h-110 md:h-120">
                <div className="relative h-3/5 md:h-2/3 overflow-hidden">
                  {isValid(deal.image) && (
                    <Image 
                      src={deal.image} 
                      alt={deal.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a293a] via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 md:top-6 md:right-6">
                    <div className="bg-[#efa765] text-[#141f2d] text-[9px] md:text-[10px] font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase shadow-2xl">
                       Save Rs. {deal.savings || (deal.originalPrice - deal.dealPrice)}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 pt-2 flex flex-col grow justify-between">
                  <div>
                    <h4 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-2 md:mb-3">{deal.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                      {deal.items.slice(0, 3).map((it: any, i: number) => (
                        <span key={i} className="text-[8px] md:text-[9px] font-bold text-white/50 uppercase border border-white/10 px-2 py-1 rounded-lg bg-white/5">
                          {it.quantity}x {it.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white/30 text-[9px] md:text-[10px] line-through font-bold">Rs. {deal.originalPrice}</span>
                      <span className="text-2xl md:text-3xl font-black text-[#efa765]">Rs. {deal.dealPrice}</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(deal, true)}
                      className="bg-white text-[#141f2d] h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#efa765] transition-all transform group-hover:rotate-360 duration-500 shadow-xl"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BEST SELLERS --- */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
             <div className="inline-block p-3 md:p-4 bg-white/5 rounded-2xl md:rounded-3xl mb-6">
               <TrendingUp className="text-[#efa765] h-6 w-6 md:h-8 md:w-8" />
             </div>
             <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4">The Elite Eight.</h3>
             <p className="text-white/40 uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-[10px] font-black px-4">Sahiwal most requested masterpieces</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 md:gap-y-24 gap-x-8 md:gap-x-12">
            {data?.bestSellers.map((prod: any) => (
              <div key={prod._id} className="group">
                <div className="relative aspect-4/5 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden mb-6 md:mb-8 bg-[#1a293a] border border-white/5 shadow-2xl transition-all duration-500 group-hover:rounded-3xl md:group-hover:rounded-4xl">
                  {isValid(prod.imageSrc) && (
                    <Image 
                      src={prod.imageSrc} 
                      alt={prod.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  
                  <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-[#141f2d]/80 backdrop-blur-xl border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-2">
                    <Star className="h-3 w-3 fill-[#efa765] text-[#efa765]" />
                    <span className="text-[10px] md:text-[11px] font-black">{prod.averageRating}</span>
                    <span className="text-[8px] md:text-[9px] text-white/40 font-bold">({prod.reviewCount})</span>
                  </div>
                  
                  {/* Improved hover button for mobile touch */}
                  <div className="absolute inset-0 bg-[#141f2d]/60 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
                    <button 
                      onClick={() => handleAddToCart(prod, false)}
                      className="w-full bg-[#efa765] text-[#141f2d] py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest flex items-center justify-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                    >
                      Instant Selection <Zap size={14} className="fill-current" />
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-white/30 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-2 block">{prod.category}</span>
                  <h4 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-3 h-10 md:h-14 flex items-center justify-center px-2">{prod.name}</h4>
                  <p className="text-2xl md:text-3xl font-black text-[#efa765]">Rs. {prod.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 md:py-40 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <Crown className="mx-auto h-10 w-10 md:h-12 md:w-12 text-[#efa765] mb-8 md:mb-10 opacity-20" />
          <h2 className="text-4xl md:text-7xl font-black italic uppercase mb-10 md:mb-12 tracking-tighter leading-tight">
            Elevate Your <br /> Evening Today.
          </h2>
          <button
            onClick={() => router.push("/products")} 
            className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-4 bg-transparent border-2 border-[#efa765] text-[#efa765] px-10 md:px-14 py-5 md:py-6 rounded-2xl font-black uppercase text-xs md:text-sm hover:bg-[#efa765] hover:text-[#141f2d] transition-all"
          >
            <span>Browse All Culinary Works</span>
            <ArrowRight className="transition-transform group-hover:translate-x-2" />
          </button>
        </div>
      </section>
    </div>
  );
}