"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { CreditCard, Loader2, Truck, Zap, PlusCircle, Tag, MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import CartSummary from '@/components/checkout/CartSummary';
import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
import { Card } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ISettings } from '@/types/settings';
import { useRouter } from 'next/navigation';
import { calculateDistance } from '@/lib/distance'; 

interface ILocalShippingAddress {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  phoneNumber: string;
  lat: number;
  lng: number;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, getOriginalCartTotal, updateQuantity, removeItemFromCart, dispatch } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [config, setConfig] = useState<ISettings | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState<ILocalShippingAddress>({
    fullName: "",
    addressLine1: "",
    city: "",
    state: "",
    phoneNumber: "",
    lat: 0,
    lng: 0,
  });

  const [isShippingFormValid, setIsShippingFormValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) {
          setConfig(data.settings);
          if (!data.settings.paymentMethods.stripe && data.settings.paymentMethods.cod) {
            setPaymentMethod('cod');
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Security handshake failed.");
      } finally {
        setSettingsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const subtotal = useMemo(() => {
    return typeof getOriginalCartTotal === 'function' ? getOriginalCartTotal() : 0;
  }, [getOriginalCartTotal, cart]);

  const discountValue = useMemo(() => {
    const percent = config?.globalDiscount || 0;
    return (subtotal * percent) / 100;
  }, [subtotal, config]);

  const finalCartTotal = useMemo(() => subtotal - discountValue, [subtotal, discountValue]);

  const isBelowMinimum = useMemo(() => {
    if (!config) return false;
    return Number(subtotal) < Number(config.minOrderValue);
  }, [subtotal, config]);

  const currentDistance = useMemo(() => {
    if (!config?.restaurantLocation || shippingAddress.lat === 0) return 0;
    return calculateDistance(
      config.restaurantLocation.lat,
      config.restaurantLocation.lng,
      shippingAddress.lat,
      shippingAddress.lng
    );
  }, [shippingAddress.lat, shippingAddress.lng, config]);

  const isTooFar = useMemo(() => {
    if (!config || shippingAddress.lat === 0) return false;
    return currentDistance > config.deliveryRadius;
  }, [currentDistance, config, shippingAddress.lat]);

  const handleShippingFormChange = (data: ILocalShippingAddress, isValid: boolean) => {
    setShippingAddress(data);
    setIsShippingFormValid(isValid);
  };

  const handleCheckout = async () => {
    if (config?.maintenanceMode) {
      toast.error("System Offline");
      return;
    }

    if (isTooFar) {
      toast.error("Outside Delivery Zone", { description: `Your location is ${currentDistance}km away.` });
      return;
    }

    // CRITICAL FIX: Ensure coordinates exist before proceeding
    if (!isShippingFormValid || !shippingAddress.lat || !shippingAddress.lng) {
      toast.error("Coordinate Sync Error", { description: "Please pin your location on the map again." });
      return;
    }

    if (!session?.user) {
      toast.error("Authentication required.");
      return;
    }

    const currentIdempotencyKey = uuidv4();
    
    const checkoutAction = async () => {
      setIsLoading(true);
      
      const checkoutData = {
        cartItems: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
            ...shippingAddress,
            lat: Number(shippingAddress.lat), // Explicit cast to Number
            lng: Number(shippingAddress.lng), // Explicit cast to Number
            country: "Pakistan", 
            postalCode: "00000"   
        },
        finalAmount: finalCartTotal,
        originalTotal: subtotal,
        customerEmail: session.user.email,
        paymentMethod: paymentMethod,
        shippingRate: 0, // Ensure field exists for schema
      };

      // Debugging log to verify data before it leaves the browser
      console.log("SENDING TO BACKEND:", checkoutData);

      const response = await fetch("/api/stripe-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": currentIdempotencyKey,
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();
      
      if (response.ok) {
        dispatch({ type: 'CLEAR_CART' });
        if (paymentMethod === 'stripe' && data.url) {
          window.location.assign(data.url);
          return "Redirecting to secure gateway...";
        } else {
          window.location.assign(`/order-details/${data.orderId}?status=success`);
          return "Order confirmed successfully!";
        }
      } else {
        throw new Error(data.message || "Checkout failed.");
      }
    };

    toast.promise(checkoutAction(), {
      loading: "Processing protocol...",
      success: (msg) => { setIsLoading(false); return msg; },
      error: (err) => { setIsLoading(false); return err.message; },
    });
  };

  const totalAmountContent = (
    <Card className="p-6 rounded-[2rem] shadow-2xl bg-[#1D2B3F] border border-white/5">
      <h3 className="text-xl font-black uppercase tracking-widest text-[#EFA765] mb-4 border-b border-white/5 pb-4 italic">Order Summary</h3>
      
      {isTooFar && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase">
          <MapPinOff size={14} /> Out of Range ({currentDistance}km)
        </div>
      )}

      <div className="space-y-3 mb-6 border-b border-white/5 pb-6">
        <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-tighter">
          <span>Subtotal</span>
          <span>PKR {subtotal.toLocaleString()}</span>
        </div>
        
        {discountValue > 0 && (
          <div className="flex justify-between text-emerald-400 text-sm font-bold uppercase tracking-tighter italic">
            <span className="flex items-center gap-1.5"><Tag size={12} /> Discount ({config?.globalDiscount}%)</span>
            <span>- PKR {discountValue.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-3xl font-black text-white mb-8 italic">
        <span className="text-sm uppercase not-italic tracking-widest opacity-50">Grand Total</span>
        <span className="text-[#EFA765]">PKR {finalCartTotal.toLocaleString()}</span>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={isLoading || settingsLoading || !cart.length || isBelowMinimum || isTooFar || !isShippingFormValid}
        className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all rounded-2xl h-14 text-lg font-black uppercase italic shadow-xl disabled:opacity-30 disabled:grayscale"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : isTooFar ? (
          "Too Far for Delivery"
        ) : isBelowMinimum ? (
          "Limit Not Reached"
        ) : (
          paymentMethod === 'stripe' ? <><CreditCard className="mr-2 h-6 w-6" /> Pay Online</> : <><Truck className="mr-2 h-6 w-6" /> Confirm COD</>
        )}
      </Button>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen selection:bg-[#EFA765] selection:text-black">
      {settingsLoading ? (
         <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-[#EFA765] h-12 w-12" />
            <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.5em]">Syncing...</span>
         </div>
      ) : (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                Checkout <span className="text-[#EFA765]">Process</span>
              </h2>
            </div>
            <Button onClick={() => router.push('/products')} variant="outline" className="border-[#EFA765]/20 text-[#EFA765] bg-[#1D2B3F] hover:bg-[#141F2D] rounded-xl h-12 px-6 font-black uppercase italic">
              <PlusCircle size={18} className="mr-2" /> Shop More
            </Button>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 items-start">
            <div className="w-full lg:col-span-7 space-y-8 order-2 lg:order-1">
              <ShippingAddressForm onFormChange={handleShippingFormChange} />
              
              <Card className="p-8 bg-[#1D2B3F] border border-white/5 text-white rounded-[2rem]">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#EFA765] mb-6 flex items-center gap-2 italic">
                  <Zap size={14} className="fill-[#EFA765]" /> Payment Method
                </h3>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'cod')} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all ${paymentMethod === 'stripe' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}>
                    <RadioGroupItem value="stripe" id="stripe" disabled={!config?.paymentMethods.stripe} />
                    <Label htmlFor="stripe" className="flex flex-col flex-1 cursor-pointer">
                      <span className="font-black uppercase text-sm italic">Credit/Debit Card</span>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all ${paymentMethod === 'cod' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}>
                    <RadioGroupItem value="cod" id="cod" disabled={!config?.paymentMethods.cod} />
                    <Label htmlFor="cod" className="flex flex-col flex-1 cursor-pointer">
                      <span className="font-black uppercase text-sm italic">Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            <div className="w-full lg:col-span-5 space-y-6 order-1 lg:order-2">
              <CartSummary
                cart={cart || []}
                handleUpdateQuantity={(product, q) => updateQuantity(product.id, q)}
                handleRemoveItem={(product) => removeItemFromCart(product.id)}
                getCartTotal={getOriginalCartTotal}
                originalCartTotal={subtotal}
              />
              <div className="hidden lg:block">{totalAmountContent}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;