// "use client";

// import React, { useState, useMemo } from 'react';
// import { CreditCard, Loader2, AlertCircle, Truck } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { v4 as uuidv4 } from 'uuid';
// import CartSummary from '@/components/checkout/CartSummary';
// import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
// import { Card } from '@/components/ui/card';
// import { IShippingAddress } from '@/models/Order.model';
// import { useSession } from 'next-auth/react';
// import { usePage } from '@/context/PageContext'; 
// import { useCart } from '@/context/CartContext';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";

// const CheckoutPage = () => {
//   const { data: session } = useSession();
//   const { setCurrentPage } = usePage(); 
//   const { 
//     cart, 
//     getOriginalCartTotal, 
//     updateQuantity, 
//     removeItemFromCart, 
//     dispatch 
//   } = useCart();

//   const [isLoading, setIsLoading] = useState(false);
  
//   // UPDATED: Initial state matches IShippingAddress
//   const [shippingAddress, setShippingAddress] = useState<IShippingAddress>({
//     fullName: "",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "Pakistan",
//     phoneNumber: "",
//   });

//   const [isShippingFormValid, setIsShippingFormValid] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

//   const finalCartTotal = useMemo(() => {
//     return typeof getOriginalCartTotal === 'function' ? getOriginalCartTotal() : 0;
//   }, [getOriginalCartTotal, cart]);

//   const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
//     setShippingAddress(data);
//     setIsShippingFormValid(isValid);
//   };

//   const handleCheckout = async () => {
//     if (!cart || cart.length === 0) {
//       toast.error("Your cart is empty.", { icon: <AlertCircle className="text-red-500" /> });
//       return;
//     }

//     const requiredFields: (keyof IShippingAddress)[] = [
//       'fullName', 
//       'addressLine1', 
//       'city', 
//       'state', 
//       'postalCode', 
//       'country', 
//       'phoneNumber'
//     ];

//     const isActuallyValid = requiredFields.every(field => 
//       shippingAddress[field]?.toString().trim() !== ""
//     );

//     if (!isActuallyValid || !isShippingFormValid) {
//       toast.error("Incomplete Shipping Details", {
//         description: "Please ensure all required fields are filled out correctly."
//       });
//       return;
//     }

//     if (!session?.user) {
//       toast.error("Authentication required. Please sign in to continue.");
//       return;
//     }

//     const currentIdempotencyKey = uuidv4();
    
//     const checkoutAction = async () => {
//       setIsLoading(true);
//       const checkoutData = {
//         cartItems: cart.map(item => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           image: item.image,
//         })),
//         shippingAddress: shippingAddress,
//         finalAmount: finalCartTotal,
//         originalTotal: finalCartTotal,
//         customerEmail: session.user.email,
//         shippingRate: 0,
//         paymentMethod: paymentMethod,
//       };

//       const response = await fetch("/api/stripe-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Idempotency-Key": currentIdempotencyKey,
//         },
//         body: JSON.stringify(checkoutData),
//       });

//       const data = await response.json();
      
//       if (response.ok) {
//         dispatch({ type: 'CLEAR_CART' });
//         if (paymentMethod === 'stripe' && data.url) {
//           window.location.assign(data.url);
//           return "Redirecting to secure gateway...";
//         } else {
//           window.location.assign(`/order-details/${data.orderId}?status=success`);
//           return "Order confirmed successfully!";
//         }
//       } else {
//         throw new Error(data.message || "Checkout synchronization failed.");
//       }
//     };

//     toast.promise(checkoutAction(), {
//       loading: paymentMethod === 'stripe' ? "Initializing Stripe Session..." : "Processing Order...",
//       success: (msg) => { setIsLoading(false); return msg; },
//       error: (err) => { setIsLoading(false); return err.message; },
//     });
//   };

//   const totalAmountContent = (
//     <Card className="p-6 rounded-[2rem] shadow-2xl bg-[#1D2B3F] border border-white/5">
//       <h3 className="text-xl font-black uppercase tracking-widest text-[#EFA765] mb-4 border-b border-white/5 pb-4 italic">Checkout Sum</h3>
//       <div className="flex justify-between items-center text-2xl font-black text-white my-6 italic">
//         <span>TOTAL:</span>
//         <span className="text-[#EFA765]">PKR {finalCartTotal.toLocaleString()}</span>
//       </div>
//       <div className="space-y-3">
//         <Button
//           onClick={handleCheckout}
//           disabled={isLoading || !cart || cart.length === 0}
//           className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all rounded-2xl h-14 text-lg font-black uppercase italic shadow-xl shadow-[#EFA765]/10"
//         >
//           {isLoading ? (
//             <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
//           ) : (
//             paymentMethod === 'stripe' ? (
//               <><CreditCard className="mr-2 h-6 w-6" /> Authorize Payment</>
//             ) : (
//               <><Truck className="mr-2 h-6 w-6" /> Confirm Delivery</>
//             )
//           )}
//         </Button>
//         <Button
//           onClick={() => setCurrentPage('products' as any)}
//           variant="ghost"
//           className="w-full text-white/40 hover:text-[#EFA765] hover:bg-transparent rounded-xl h-10 text-xs font-bold uppercase tracking-widest transition-colors"
//         >
//           ← Back to Marketplace
//         </Button>
//       </div>
//     </Card>
//   );

//   return (
//     <div className="container mx-auto px-4 py-12 min-h-screen selection:bg-[#EFA765] selection:text-black">
//       <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        
//         {/* LEFT COLUMN: Shipping & Payment */}
//         <div className="w-full lg:col-span-7 space-y-8 order-2 lg:order-1">
//           <div className="space-y-2">
//             <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
//               Checkout <span className="text-[#EFA765]">Process</span>
//             </h2>
//             <p className="text-slate-400 text-sm font-medium">Verify your shipping coordinates below.</p>
//           </div>

//           <ShippingAddressForm onFormChange={handleShippingFormChange} />
          
//           <Card className="p-8 bg-[#1D2B3F] border border-white/5 text-white rounded-[2rem] shadow-xl">
//             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#EFA765] mb-6 flex items-center gap-2 italic">
//               <CreditCard size={14} /> Payment Protocol
//             </h3>
//             <RadioGroup 
//               defaultValue="stripe" 
//               onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'cod')}
//               className="grid grid-cols-1 md:grid-cols-2 gap-4"
//             >
//               <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'stripe' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}>
//                 <RadioGroupItem value="stripe" id="stripe" className="border-[#EFA765] text-[#EFA765]" />
//                 <Label htmlFor="stripe" className="flex flex-col cursor-pointer flex-1">
//                   <span className="font-black uppercase text-sm italic">Online Payment</span>
//                   <span className="text-[10px] opacity-40 uppercase font-bold tracking-tighter">Credit/Debit Card via Stripe</span>
//                 </Label>
//               </div>
//               <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}>
//                 <RadioGroupItem value="cod" id="cod" className="border-[#EFA765] text-[#EFA765]" />
//                 <Label htmlFor="cod" className="flex flex-col cursor-pointer flex-1">
//                   <span className="font-black uppercase text-sm italic">Cash on Delivery</span>
//                   <span className="text-[10px] opacity-40 uppercase font-bold tracking-tighter">Pay when you receive</span>
//                 </Label>
//               </div>
//             </RadioGroup>
//           </Card>
//         </div>

//         {/* RIGHT COLUMN: Order Summary */}
//         <div className="w-full lg:col-span-5 space-y-6 order-1 lg:order-2">
//           <CartSummary
//             cart={cart || []}
//             handleUpdateQuantity={(product, q) => updateQuantity(product.id, q)}
//             handleRemoveItem={(product) => removeItemFromCart(product.id)}
//             getCartTotal={getOriginalCartTotal}
//             originalCartTotal={finalCartTotal}
//           />
//           <div className="hidden lg:block">
//             {totalAmountContent}
//           </div>
//         </div>

//         {/* Mobile View */}
//         <div className="lg:hidden w-full order-3 mt-8">
//           {totalAmountContent}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;






// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { CreditCard, Loader2, AlertCircle, Truck, ShieldAlert, Zap } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { v4 as uuidv4 } from 'uuid';
// import CartSummary from '@/components/checkout/CartSummary';
// import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
// import { Card } from '@/components/ui/card';
// import { IShippingAddress } from '@/models/Order.model';
// import { useSession } from 'next-auth/react';
// import { usePage } from '@/context/PageContext'; 
// import { useCart } from '@/context/CartContext';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { ISettings } from '@/types/settings';

// const CheckoutPage = () => {
//   const { data: session } = useSession();
//   const { setCurrentPage } = usePage(); 
//   const { 
//     cart, 
//     getOriginalCartTotal, 
//     updateQuantity, 
//     removeItemFromCart, 
//     dispatch 
//   } = useCart();

//   const [isLoading, setIsLoading] = useState(false);
//   const [settingsLoading, setSettingsLoading] = useState(true);
//   const [config, setConfig] = useState<ISettings | null>(null);
  
//   const [shippingAddress, setShippingAddress] = useState<IShippingAddress>({
//     fullName: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "Pakistan",
//     phoneNumber: "",
//   });

//   const [isShippingFormValid, setIsShippingFormValid] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

//   // 1. FETCH SYSTEM PARAMETERS ON LOAD
//   useEffect(() => {
//     async function fetchSettings() {
//       try {
//         const res = await fetch("/api/settings");
//         const data = await res.json();
//         if (data.success) {
//           setConfig(data.settings);
//           if (!data.settings.paymentMethods.stripe && data.settings.paymentMethods.cod) {
//             setPaymentMethod('cod');
//           }
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Security handshake failed. Check connection.");
//       } finally {
//         setSettingsLoading(false);
//       }
//     }
//     fetchSettings();
//   }, []);

//   const finalCartTotal = useMemo(() => {
//     return typeof getOriginalCartTotal === 'function' ? getOriginalCartTotal() : 0;
//   }, [getOriginalCartTotal, cart]);

//   const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
//     setShippingAddress(data);
//     setIsShippingFormValid(isValid);
//   };

//   const handleCheckout = async () => {
//     // A. SETTINGS VALIDATIONS
//     if (config?.maintenanceMode) {
//       toast.error("System Offline", { description: "The terminal is currently in maintenance mode." });
//       return;
//     }

//     if (config && finalCartTotal < config.minOrderValue) {
//       toast.error("Minimum Order Requirement", { 
//         description: `Please add PKR ${config.minOrderValue - finalCartTotal} more to proceed.` 
//       });
//       return;
//     }

//     if (!cart || cart.length === 0) {
//       toast.error("Your cart is empty.", { icon: <AlertCircle className="text-red-500" /> });
//       return;
//     }

//     const requiredFields: (keyof IShippingAddress)[] = [
//       'fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'phoneNumber'
//     ];

//     const isActuallyValid = requiredFields.every(field => 
//       shippingAddress[field]?.toString().trim() !== ""
//     );

//     if (!isActuallyValid || !isShippingFormValid) {
//       toast.error("Incomplete Shipping Details");
//       return;
//     }

//     if (!session?.user) {
//       toast.error("Authentication required.");
//       return;
//     }

//     const currentIdempotencyKey = uuidv4();
    
//     const checkoutAction = async () => {
//       setIsLoading(true);
//       const checkoutData = {
//         cartItems: cart.map(item => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           image: item.image,
//         })),
//         shippingAddress: shippingAddress,
//         finalAmount: finalCartTotal,
//         originalTotal: finalCartTotal,
//         customerEmail: session.user.email,
//         shippingRate: 0,
//         paymentMethod: paymentMethod,
//       };

//       const response = await fetch("/api/stripe-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Idempotency-Key": currentIdempotencyKey,
//         },
//         body: JSON.stringify(checkoutData),
//       });

//       const data = await response.json();
      
//       if (response.ok) {
//         dispatch({ type: 'CLEAR_CART' });
//         if (paymentMethod === 'stripe' && data.url) {
//           window.location.assign(data.url);
//           return "Redirecting to secure gateway...";
//         } else {
//           window.location.assign(`/order-details/${data.orderId}?status=success`);
//           return "Order confirmed successfully!";
//         }
//       } else {
//         throw new Error(data.message || "Checkout synchronization failed.");
//       }
//     };

//     toast.promise(checkoutAction(), {
//       loading: paymentMethod === 'stripe' ? "Initializing Stripe Session..." : "Processing Order...",
//       success: (msg) => { setIsLoading(false); return msg; },
//       error: (err) => { setIsLoading(false); return err.message; },
//     });
//   };

//   // MAINTENANCE OVERLAY
//   if (!settingsLoading && config?.maintenanceMode) {
//     return (
//       <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6 text-center">
//         <div className="max-w-md space-y-6">
//           <ShieldAlert size={80} className="text-[#EFA765] mx-auto animate-pulse" />
//           <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">System <span className="text-[#EFA765]">Frozen</span></h1>
//           <p className="text-slate-400 font-medium">The deployment terminal is currently under scheduled maintenance. No new orders can be processed at this time.</p>
//           <Button onClick={() => setCurrentPage('products' as any)} className="bg-[#EFA765] text-[#141F2D] font-black uppercase rounded-2xl h-14 px-10">Return to Base</Button>
//         </div>
//       </div>
//     );
//   }

//   const totalAmountContent = (
//     <Card className="p-6 rounded-[2rem] shadow-2xl bg-[#1D2B3F] border border-white/5">
//       <h3 className="text-xl font-black uppercase tracking-widest text-[#EFA765] mb-4 border-b border-white/5 pb-4 italic">Checkout Sum</h3>
      
//       {/* MIN ORDER INDICATOR */}
//       {config && finalCartTotal < config.minOrderValue && (
//         <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-tight">
//           <AlertCircle size={14} /> Min Order: PKR {config.minOrderValue.toLocaleString()}
//         </div>
//       )}

//       <div className="flex justify-between items-center text-2xl font-black text-white my-6 italic">
//         <span>TOTAL:</span>
//         <span className="text-[#EFA765]">PKR {finalCartTotal.toLocaleString()}</span>
//       </div>
//       <div className="space-y-3">
//         <Button
//           onClick={handleCheckout}
//           disabled={isLoading || settingsLoading || !cart || cart.length === 0 || (config ? finalCartTotal < config.minOrderValue : false)}
//           className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all rounded-2xl h-14 text-lg font-black uppercase italic shadow-xl shadow-[#EFA765]/10 disabled:opacity-30"
//         >
//           {isLoading ? (
//             <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
//           ) : (
//             paymentMethod === 'stripe' ? (
//               <><CreditCard className="mr-2 h-6 w-6" /> Authorize Payment</>
//             ) : (
//               <><Truck className="mr-2 h-6 w-6" /> Confirm Delivery</>
//             )
//           )}
//         </Button>
//       </div>
//     </Card>
//   );

//   return (
//     <div className="container mx-auto px-4 py-12 min-h-screen selection:bg-[#EFA765] selection:text-black">
//       {settingsLoading ? (
//          <div className="flex flex-col items-center justify-center py-20 space-y-4">
//             <Loader2 className="animate-spin text-[#EFA765] h-12 w-12" />
//             <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.5em]">Synchronizing Gateways...</span>
//          </div>
//       ) : (
//         <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 items-start">
//           <div className="w-full lg:col-span-7 space-y-8 order-2 lg:order-1">
//             <div className="space-y-2">
//               <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
//                 Checkout <span className="text-[#EFA765]">Process</span>
//               </h2>
//               <p className="text-slate-400 text-sm font-medium">Verify your shipping coordinates below.</p>
//             </div>

//             <ShippingAddressForm onFormChange={handleShippingFormChange} />
            
//             <Card className="p-8 bg-[#1D2B3F] border border-white/5 text-white rounded-[2rem] shadow-xl">
//               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#EFA765] mb-6 flex items-center gap-2 italic">
//                 <Zap size={14} className="fill-[#EFA765]" /> Payment Protocol
//               </h3>
              
//               <RadioGroup 
//                 value={paymentMethod} 
//                 onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'cod')}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-4"
//               >
//                 {/* STRIPE CARD */}
//                 <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer 
//                   ${!config?.paymentMethods.stripe ? 'opacity-30 cursor-not-allowed' : ''}
//                   ${paymentMethod === 'stripe' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}
//                 >
//                   <RadioGroupItem 
//                     value="stripe" 
//                     id="stripe" 
//                     disabled={!config?.paymentMethods.stripe}
//                     className="border-[#EFA765] text-[#EFA765]" 
//                   />
//                   <Label htmlFor="stripe" className={`flex flex-col flex-1 ${!config?.paymentMethods.stripe ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
//                     <span className="font-black uppercase text-sm italic">Online Payment</span>
//                     <span className="text-[10px] opacity-40 uppercase font-bold">
//                       {config?.paymentMethods.stripe ? 'Stripe Gateway' : 'Gateway Offline'}
//                     </span>
//                   </Label>
//                 </div>

//                 {/* COD CARD */}
//                 <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer 
//                   ${!config?.paymentMethods.cod ? 'opacity-30 cursor-not-allowed' : ''}
//                   ${paymentMethod === 'cod' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}
//                 >
//                   <RadioGroupItem 
//                     value="cod" 
//                     id="cod" 
//                     disabled={!config?.paymentMethods.cod}
//                     className="border-[#EFA765] text-[#EFA765]" 
//                   />
//                   <Label htmlFor="cod" className={`flex flex-col flex-1 ${!config?.paymentMethods.cod ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
//                     <span className="font-black uppercase text-sm italic">Cash on Delivery</span>
//                     <span className="text-[10px] opacity-40 uppercase font-bold">
//                       {config?.paymentMethods.cod ? 'Pay upon receipt' : 'COD Suspended'}
//                     </span>
//                   </Label>
//                 </div>
//               </RadioGroup>
//             </Card>
//           </div>

//           <div className="w-full lg:col-span-5 space-y-6 order-1 lg:order-2">
//             <CartSummary
//               cart={cart || []}
//               handleUpdateQuantity={(product, q) => updateQuantity(product.id, q)}
//               handleRemoveItem={(product) => removeItemFromCart(product.id)}
//               getCartTotal={getOriginalCartTotal}
//               originalCartTotal={finalCartTotal}
//             />
//             <div className="hidden lg:block">{totalAmountContent}</div>
//           </div>

//           <div className="lg:hidden w-full order-3 mt-8">{totalAmountContent}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;





// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { CreditCard, Loader2, AlertCircle, Truck, ShieldAlert, Zap } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { v4 as uuidv4 } from 'uuid';
// import CartSummary from '@/components/checkout/CartSummary';
// import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
// import { Card } from '@/components/ui/card';
// import { IShippingAddress } from '@/models/Order.model';
// import { useSession } from 'next-auth/react';
// import { usePage } from '@/context/PageContext'; 
// import { useCart } from '@/context/CartContext';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { ISettings } from '@/types/settings';

// const CheckoutPage = () => {
//   const { data: session } = useSession();
//   const { setCurrentPage } = usePage(); 
//   const { 
//     cart, 
//     getOriginalCartTotal, 
//     updateQuantity, 
//     removeItemFromCart, 
//     dispatch 
//   } = useCart();

//   const [isLoading, setIsLoading] = useState(false);
//   const [settingsLoading, setSettingsLoading] = useState(true);
//   const [config, setConfig] = useState<ISettings | null>(null);
  
//   const [shippingAddress, setShippingAddress] = useState<IShippingAddress>({
//     fullName: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "Pakistan",
//     phoneNumber: "",
//   });

//   const [isShippingFormValid, setIsShippingFormValid] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

//   // 1. FETCH SYSTEM PARAMETERS ON LOAD
//   useEffect(() => {
//     async function fetchSettings() {
//       try {
//         const res = await fetch("/api/settings");
//         const data = await res.json();
//         if (data.success) {
//           setConfig(data.settings);
//           if (!data.settings.paymentMethods.stripe && data.settings.paymentMethods.cod) {
//             setPaymentMethod('cod');
//           }
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Security handshake failed. Check connection.");
//       } finally {
//         setSettingsLoading(false);
//       }
//     }
//     fetchSettings();
//   }, []);

//   const finalCartTotal = useMemo(() => {
//     return typeof getOriginalCartTotal === 'function' ? getOriginalCartTotal() : 0;
//   }, [getOriginalCartTotal, cart]);

//   // NEW: Numerical check for the limit
//   const isBelowMinimum = useMemo(() => {
//     if (!config) return false;
//     return Number(finalCartTotal) < Number(config.minOrderValue);
//   }, [finalCartTotal, config]);

//   const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
//     setShippingAddress(data);
//     setIsShippingFormValid(isValid);
//   };

//   const handleCheckout = async () => {
//     // A. SETTINGS VALIDATIONS
//     if (config?.maintenanceMode) {
//       toast.error("System Offline", { description: "The terminal is currently in maintenance mode." });
//       return;
//     }

//     if (isBelowMinimum) {
//       toast.error("Minimum Order Requirement", { 
//         description: `Please add PKR ${Number(config?.minOrderValue) - finalCartTotal} more to proceed.` 
//       });
//       return;
//     }

//     if (!cart || cart.length === 0) {
//       toast.error("Your cart is empty.", { icon: <AlertCircle className="text-red-500" /> });
//       return;
//     }

//     const requiredFields: (keyof IShippingAddress)[] = [
//       'fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'phoneNumber'
//     ];

//     const isActuallyValid = requiredFields.every(field => 
//       shippingAddress[field]?.toString().trim() !== ""
//     );

//     if (!isActuallyValid || !isShippingFormValid) {
//       toast.error("Incomplete Shipping Details");
//       return;
//     }

//     if (!session?.user) {
//       toast.error("Authentication required.");
//       return;
//     }

//     const currentIdempotencyKey = uuidv4();
    
//     const checkoutAction = async () => {
//       setIsLoading(true);
//       const checkoutData = {
//         cartItems: cart.map(item => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           image: item.image,
//         })),
//         shippingAddress: shippingAddress,
//         finalAmount: finalCartTotal,
//         originalTotal: finalCartTotal,
//         customerEmail: session.user.email,
//         shippingRate: 0,
//         paymentMethod: paymentMethod,
//       };

//       const response = await fetch("/api/stripe-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Idempotency-Key": currentIdempotencyKey,
//         },
//         body: JSON.stringify(checkoutData),
//       });

//       const data = await response.json();
      
//       if (response.ok) {
//         dispatch({ type: 'CLEAR_CART' });
//         if (paymentMethod === 'stripe' && data.url) {
//           window.location.assign(data.url);
//           return "Redirecting to secure gateway...";
//         } else {
//           window.location.assign(`/order-details/${data.orderId}?status=success`);
//           return "Order confirmed successfully!";
//         }
//       } else {
//         throw new Error(data.message || "Checkout synchronization failed.");
//       }
//     };

//     toast.promise(checkoutAction(), {
//       loading: paymentMethod === 'stripe' ? "Initializing Stripe Session..." : "Processing Order...",
//       success: (msg) => { setIsLoading(false); return msg; },
//       error: (err) => { setIsLoading(false); return err.message; },
//     });
//   };

//   if (!settingsLoading && config?.maintenanceMode) {
//     return (
//       <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6 text-center">
//         <div className="max-w-md space-y-6">
//           <ShieldAlert size={80} className="text-[#EFA765] mx-auto animate-pulse" />
//           <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">System <span className="text-[#EFA765]">Frozen</span></h1>
//           <p className="text-slate-400 font-medium">The deployment terminal is currently under scheduled maintenance. No new orders can be processed at this time.</p>
//           <Button onClick={() => setCurrentPage('products' as any)} className="bg-[#EFA765] text-[#141F2D] font-black uppercase rounded-2xl h-14 px-10">Return to Base</Button>
//         </div>
//       </div>
//     );
//   }

//   const totalAmountContent = (
//     <Card className="p-6 rounded-[2rem] shadow-2xl bg-[#1D2B3F] border border-white/5">
//       <h3 className="text-xl font-black uppercase tracking-widest text-[#EFA765] mb-4 border-b border-white/5 pb-4 italic">Checkout Sum</h3>
      
//       {/* IMPROVED MIN ORDER INDICATOR */}
//       {config && isBelowMinimum && (
//         <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-tight">
//           <AlertCircle size={14} /> Min Order Required: PKR {Number(config.minOrderValue).toLocaleString()}
//         </div>
//       )}

//       <div className="flex justify-between items-center text-2xl font-black text-white my-6 italic">
//         <span>TOTAL:</span>
//         <span className="text-[#EFA765]">PKR {finalCartTotal.toLocaleString()}</span>
//       </div>
//       <div className="space-y-3">
//         <Button
//           onClick={handleCheckout}
//           // Button is now strictly disabled if amount is too low
//           disabled={isLoading || settingsLoading || !cart || cart.length === 0 || isBelowMinimum}
//           className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all rounded-2xl h-14 text-lg font-black uppercase italic shadow-xl shadow-[#EFA765]/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
//         >
//           {isLoading ? (
//             <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
//           ) : isBelowMinimum ? (
//             "Limit Not Reached"
//           ) : (
//             paymentMethod === 'stripe' ? (
//               <><CreditCard className="mr-2 h-6 w-6" /> Authorize Payment</>
//             ) : (
//               <><Truck className="mr-2 h-6 w-6" /> Confirm Delivery</>
//             )
//           )}
//         </Button>
//       </div>
//     </Card>
//   );

//   return (
//     <div className="container mx-auto px-4 py-12 min-h-screen selection:bg-[#EFA765] selection:text-black">
//       {settingsLoading ? (
//          <div className="flex flex-col items-center justify-center py-20 space-y-4">
//             <Loader2 className="animate-spin text-[#EFA765] h-12 w-12" />
//             <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.5em]">Synchronizing Gateways...</span>
//          </div>
//       ) : (
//         <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 items-start">
//           <div className="w-full lg:col-span-7 space-y-8 order-2 lg:order-1">
//             <div className="space-y-2">
//               <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
//                 Checkout <span className="text-[#EFA765]">Process</span>
//               </h2>
//               <p className="text-slate-400 text-sm font-medium">Verify your shipping coordinates below.</p>
//             </div>

//             <ShippingAddressForm onFormChange={handleShippingFormChange} />
            
//             <Card className="p-8 bg-[#1D2B3F] border border-white/5 text-white rounded-[2rem] shadow-xl">
//               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#EFA765] mb-6 flex items-center gap-2 italic">
//                 <Zap size={14} className="fill-[#EFA765]" /> Payment Protocol
//               </h3>
              
//               <RadioGroup 
//                 value={paymentMethod} 
//                 onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'cod')}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-4"
//               >
//                 <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer 
//                   ${!config?.paymentMethods.stripe ? 'opacity-30 cursor-not-allowed' : ''}
//                   ${paymentMethod === 'stripe' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}
//                 >
//                   <RadioGroupItem 
//                     value="stripe" 
//                     id="stripe" 
//                     disabled={!config?.paymentMethods.stripe}
//                     className="border-[#EFA765] text-[#EFA765]" 
//                   />
//                   <Label htmlFor="stripe" className={`flex flex-col flex-1 ${!config?.paymentMethods.stripe ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
//                     <span className="font-black uppercase text-sm italic">Online Payment</span>
//                     <span className="text-[10px] opacity-40 uppercase font-bold">
//                       {config?.paymentMethods.stripe ? 'Stripe Gateway' : 'Gateway Offline'}
//                     </span>
//                   </Label>
//                 </div>

//                 <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer 
//                   ${!config?.paymentMethods.cod ? 'opacity-30 cursor-not-allowed' : ''}
//                   ${paymentMethod === 'cod' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}
//                 >
//                   <RadioGroupItem 
//                     value="cod" 
//                     id="cod" 
//                     disabled={!config?.paymentMethods.cod}
//                     className="border-[#EFA765] text-[#EFA765]" 
//                   />
//                   <Label htmlFor="cod" className={`flex flex-col flex-1 ${!config?.paymentMethods.cod ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
//                     <span className="font-black uppercase text-sm italic">Cash on Delivery</span>
//                     <span className="text-[10px] opacity-40 uppercase font-bold">
//                       {config?.paymentMethods.cod ? 'Pay upon receipt' : 'COD Suspended'}
//                     </span>
//                   </Label>
//                 </div>
//               </RadioGroup>
//             </Card>
//           </div>

//           <div className="w-full lg:col-span-5 space-y-6 order-1 lg:order-2">
//             <CartSummary
//               cart={cart || []}
//               handleUpdateQuantity={(product, q) => updateQuantity(product.id, q)}
//               handleRemoveItem={(product) => removeItemFromCart(product.id)}
//               getCartTotal={getOriginalCartTotal}
//               originalCartTotal={finalCartTotal}
//             />
//             <div className="hidden lg:block">{totalAmountContent}</div>
//           </div>

//           <div className="lg:hidden w-full order-3 mt-8">{totalAmountContent}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;






// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { CreditCard, Loader2, AlertCircle, Truck, ShieldAlert, Zap, PlusCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { v4 as uuidv4 } from 'uuid';
// import CartSummary from '@/components/checkout/CartSummary';
// import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
// import { Card } from '@/components/ui/card';
// import { IShippingAddress } from '@/models/Order.model';
// import { useSession } from 'next-auth/react';
// import { usePage } from '@/context/PageContext'; 
// import { useCart } from '@/context/CartContext';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { ISettings } from '@/types/settings';
// import { useRouter } from 'next/navigation';

// const CheckoutPage = () => {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const { setCurrentPage } = usePage(); 
//   const { 
//     cart, 
//     getOriginalCartTotal, 
//     updateQuantity, 
//     removeItemFromCart, 
//     dispatch 
//   } = useCart();

//   const [isLoading, setIsLoading] = useState(false);
//   const [settingsLoading, setSettingsLoading] = useState(true);
//   const [config, setConfig] = useState<ISettings | null>(null);
  
//   const [shippingAddress, setShippingAddress] = useState<IShippingAddress>({
//     fullName: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "Pakistan",
//     phoneNumber: "",
//   });

//   const [isShippingFormValid, setIsShippingFormValid] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

//   // 1. FETCH SYSTEM PARAMETERS ON LOAD
//   useEffect(() => {
//     async function fetchSettings() {
//       try {
//         const res = await fetch("/api/settings");
//         const data = await res.json();
//         if (data.success) {
//           setConfig(data.settings);
//           if (!data.settings.paymentMethods.stripe && data.settings.paymentMethods.cod) {
//             setPaymentMethod('cod');
//           }
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Security handshake failed. Check connection.");
//       } finally {
//         setSettingsLoading(false);
//       }
//     }
//     fetchSettings();
//   }, []);

//   const finalCartTotal = useMemo(() => {
//     return typeof getOriginalCartTotal === 'function' ? getOriginalCartTotal() : 0;
//   }, [getOriginalCartTotal, cart]);

//   const isBelowMinimum = useMemo(() => {
//     if (!config) return false;
//     return Number(finalCartTotal) < Number(config.minOrderValue);
//   }, [finalCartTotal, config]);

//   const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
//     setShippingAddress(data);
//     setIsShippingFormValid(isValid);
//   };

//   const handleCheckout = async () => {
//     if (config?.maintenanceMode) {
//       toast.error("System Offline", { description: "The terminal is currently in maintenance mode." });
//       return;
//     }

//     if (isBelowMinimum) {
//       toast.error("Minimum Order Requirement", { 
//         description: `Please add PKR ${Number(config?.minOrderValue) - finalCartTotal} more to proceed.` 
//       });
//       return;
//     }

//     if (!cart || cart.length === 0) {
//       toast.error("Your cart is empty.", { icon: <AlertCircle className="text-red-500" /> });
//       return;
//     }

//     const requiredFields: (keyof IShippingAddress)[] = [
//       'fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'phoneNumber'
//     ];

//     const isActuallyValid = requiredFields.every(field => 
//       shippingAddress[field]?.toString().trim() !== ""
//     );

//     if (!isActuallyValid || !isShippingFormValid) {
//       toast.error("Incomplete Shipping Details");
//       return;
//     }

//     if (!session?.user) {
//       toast.error("Authentication required.");
//       return;
//     }

//     const currentIdempotencyKey = uuidv4();
    
//     const checkoutAction = async () => {
//       setIsLoading(true);
//       const checkoutData = {
//         cartItems: cart.map(item => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           image: item.image,
//         })),
//         shippingAddress: shippingAddress,
//         finalAmount: finalCartTotal,
//         originalTotal: finalCartTotal,
//         customerEmail: session.user.email,
//         shippingRate: 0,
//         paymentMethod: paymentMethod,
//       };

//       const response = await fetch("/api/stripe-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Idempotency-Key": currentIdempotencyKey,
//         },
//         body: JSON.stringify(checkoutData),
//       });

//       const data = await response.json();
      
//       if (response.ok) {
//         dispatch({ type: 'CLEAR_CART' });
//         if (paymentMethod === 'stripe' && data.url) {
//           window.location.assign(data.url);
//           return "Redirecting to secure gateway...";
//         } else {
//           window.location.assign(`/order-details/${data.orderId}?status=success`);
//           return "Order confirmed successfully!";
//         }
//       } else {
//         throw new Error(data.message || "Checkout synchronization failed.");
//       }
//     };

//     toast.promise(checkoutAction(), {
//       loading: paymentMethod === 'stripe' ? "Initializing Stripe Session..." : "Processing Order...",
//       success: (msg) => { setIsLoading(false); return msg; },
//       error: (err) => { setIsLoading(false); return err.message; },
//     });
//   };

//   if (!settingsLoading && config?.maintenanceMode) {
//     return (
//       <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6 text-center">
//         <div className="max-w-md space-y-6">
//           <ShieldAlert size={80} className="text-[#EFA765] mx-auto animate-pulse" />
//           <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">System <span className="text-[#EFA765]">Frozen</span></h1>
//           <p className="text-slate-400 font-medium">The deployment terminal is currently under scheduled maintenance. No new orders can be processed at this time.</p>
//           <Button onClick={() => setCurrentPage('products' as any)} className="bg-[#EFA765] text-[#141F2D] font-black uppercase rounded-2xl h-14 px-10">Return to Base</Button>
//         </div>
//       </div>
//     );
//   }

//   const totalAmountContent = (
//     <Card className="p-6 rounded-[2rem] shadow-2xl bg-[#1D2B3F] border border-white/5">
//       <h3 className="text-xl font-black uppercase tracking-widest text-[#EFA765] mb-4 border-b border-white/5 pb-4 italic">Checkout Sum</h3>
      
//       {config && isBelowMinimum && (
//         <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-tight">
//           <AlertCircle size={14} /> Min Order Required: PKR {Number(config.minOrderValue).toLocaleString()}
//         </div>
//       )}

//       <div className="flex justify-between items-center text-2xl font-black text-white my-6 italic">
//         <span>TOTAL:</span>
//         <span className="text-[#EFA765]">PKR {finalCartTotal.toLocaleString()}</span>
//       </div>
//       <div className="space-y-3">
//         <Button
//           onClick={handleCheckout}
//           disabled={isLoading || settingsLoading || !cart || cart.length === 0 || isBelowMinimum}
//           className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all rounded-2xl h-14 text-lg font-black uppercase italic shadow-xl shadow-[#EFA765]/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
//         >
//           {isLoading ? (
//             <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
//           ) : isBelowMinimum ? (
//             "Limit Not Reached"
//           ) : (
//             paymentMethod === 'stripe' ? (
//               <><CreditCard className="mr-2 h-6 w-6" /> Authorize Payment</>
//             ) : (
//               <><Truck className="mr-2 h-6 w-6" /> Confirm Delivery</>
//             )
//           )}
//         </Button>
//       </div>
//     </Card>
//   );

//   return (
//     <div className="container mx-auto px-4 py-12 min-h-screen selection:bg-[#EFA765] selection:text-black">
//       {settingsLoading ? (
//          <div className="flex flex-col items-center justify-center py-20 space-y-4">
//             <Loader2 className="animate-spin text-[#EFA765] h-12 w-12" />
//             <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.5em]">Synchronizing Gateways...</span>
//          </div>
//       ) : (
//         <div className="space-y-10">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
//             <div className="space-y-2">
//               <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
//                 Checkout <span className="text-[#EFA765]">Process</span>
//               </h2>
//               <p className="text-slate-400 text-sm font-medium tracking-wide uppercase opacity-70">
//                 Secure your shipment coordinates and payment protocol.
//               </p>
//             </div>
            
//             <Button 
//               onClick={() => router.push('/products')}
//               variant="outline"
//               className="border-[#EFA765]/20 text-[#EFA765] bg-[#1D2B3F] hover:bg-[#141F2D] hover:text-[#EFA765] rounded-xl h-12 px-6 font-black uppercase italic transition-all flex items-center gap-2 group"
//             >
//               <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
//               Shop More Products
//             </Button>
//           </div>

//           <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 items-start">
//             <div className="w-full lg:col-span-7 space-y-8 order-2 lg:order-1">
//               {/* Form Section */}
//               <ShippingAddressForm onFormChange={handleShippingFormChange} />
              
//               <Card className="p-8 bg-[#1D2B3F] border border-white/5 text-white rounded-[2rem] shadow-xl">
//                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#EFA765] mb-6 flex items-center gap-2 italic">
//                   <Zap size={14} className="fill-[#EFA765]" /> Payment Protocol
//                 </h3>
                
//                 <RadioGroup 
//                   value={paymentMethod} 
//                   onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'cod')}
//                   className="grid grid-cols-1 md:grid-cols-2 gap-4"
//                 >
//                   <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer 
//                     ${!config?.paymentMethods.stripe ? 'opacity-30 cursor-not-allowed' : ''}
//                     ${paymentMethod === 'stripe' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}
//                   >
//                     <RadioGroupItem 
//                       value="stripe" 
//                       id="stripe" 
//                       disabled={!config?.paymentMethods.stripe}
//                       className="border-[#EFA765] text-[#EFA765]" 
//                     />
//                     <Label htmlFor="stripe" className={`flex flex-col flex-1 ${!config?.paymentMethods.stripe ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
//                       <span className="font-black uppercase text-sm italic">Online Payment</span>
//                       <span className="text-[10px] opacity-40 uppercase font-bold">
//                         {config?.paymentMethods.stripe ? 'Stripe Gateway' : 'Gateway Offline'}
//                       </span>
//                     </Label>
//                   </div>

//                   <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer 
//                     ${!config?.paymentMethods.cod ? 'opacity-30 cursor-not-allowed' : ''}
//                     ${paymentMethod === 'cod' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}
//                   >
//                     <RadioGroupItem 
//                       value="cod" 
//                       id="cod" 
//                       disabled={!config?.paymentMethods.cod}
//                       className="border-[#EFA765] text-[#EFA765]" 
//                     />
//                     <Label htmlFor="cod" className={`flex flex-col flex-1 ${!config?.paymentMethods.cod ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
//                       <span className="font-black uppercase text-sm italic">Cash on Delivery</span>
//                       <span className="text-[10px] opacity-40 uppercase font-bold">
//                         {config?.paymentMethods.cod ? 'Pay upon receipt' : 'COD Suspended'}
//                       </span>
//                     </Label>
//                   </div>
//                 </RadioGroup>
//               </Card>
//             </div>

//             <div className="w-full lg:col-span-5 space-y-6 order-1 lg:order-2">
//               <CartSummary
//                 cart={cart || []}
//                 handleUpdateQuantity={(product, q) => updateQuantity(product.id, q)}
//                 handleRemoveItem={(product) => removeItemFromCart(product.id)}
//                 getCartTotal={getOriginalCartTotal}
//                 originalCartTotal={finalCartTotal}
//               />
//               <div className="hidden lg:block">{totalAmountContent}</div>
//             </div>

//             <div className="lg:hidden w-full order-3 mt-8">{totalAmountContent}</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;










"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { CreditCard, Loader2, AlertCircle, Truck, Zap, PlusCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import CartSummary from '@/components/checkout/CartSummary';
import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
import { Card } from '@/components/ui/card';
import { IShippingAddress } from '@/models/Order.model';
import { useSession } from 'next-auth/react';
import { usePage } from '@/context/PageContext'; 
import { useCart } from '@/context/CartContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ISettings } from '@/types/settings';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setCurrentPage } = usePage(); 
  const { 
    cart, 
    getOriginalCartTotal, 
    updateQuantity, 
    removeItemFromCart, 
    dispatch 
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [config, setConfig] = useState<ISettings | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState<IShippingAddress>({
    fullName: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    phoneNumber: "",
  });

  const [isShippingFormValid, setIsShippingFormValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

  // 1. FETCH SYSTEM PARAMETERS ON LOAD
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
        toast.error("Security handshake failed. Check connection.");
      } finally {
        setSettingsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // --- CALCULATION LOGIC ---
  const subtotal = useMemo(() => {
    return typeof getOriginalCartTotal === 'function' ? getOriginalCartTotal() : 0;
  }, [getOriginalCartTotal, cart]);

  const discountValue = useMemo(() => {
    const percent = config?.globalDiscount || 0;
    return (subtotal * percent) / 100;
  }, [subtotal, config]);

  const finalCartTotal = useMemo(() => {
    return subtotal - discountValue;
  }, [subtotal, discountValue]);

  const isBelowMinimum = useMemo(() => {
    if (!config) return false;
    return Number(subtotal) < Number(config.minOrderValue);
  }, [subtotal, config]);

  const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
    setShippingAddress(data);
    setIsShippingFormValid(isValid);
  };

  const handleCheckout = async () => {
    if (config?.maintenanceMode) {
      toast.error("System Offline", { description: "The terminal is currently in maintenance mode." });
      return;
    }

    if (isBelowMinimum) {
      toast.error("Minimum Order Requirement", { 
        description: `Please add PKR ${Number(config?.minOrderValue) - subtotal} more to proceed.` 
      });
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty.", { icon: <AlertCircle className="text-red-500" /> });
      return;
    }

    const requiredFields: (keyof IShippingAddress)[] = [
      'fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'phoneNumber'
    ];

    const isActuallyValid = requiredFields.every(field => 
      shippingAddress[field]?.toString().trim() !== ""
    );

    if (!isActuallyValid || !isShippingFormValid) {
      toast.error("Incomplete Shipping Details");
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
        shippingAddress: shippingAddress,
        finalAmount: finalCartTotal, // Sending discounted total
        originalTotal: subtotal,      // Sending original subtotal
        customerEmail: session.user.email,
        shippingRate: 0,
        paymentMethod: paymentMethod,
      };

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
        throw new Error(data.message || "Checkout synchronization failed.");
      }
    };

    toast.promise(checkoutAction(), {
      loading: paymentMethod === 'stripe' ? "Initializing Stripe Session..." : "Processing Order...",
      success: (msg) => { setIsLoading(false); return msg; },
      error: (err) => { setIsLoading(false); return err.message; },
    });
  };

  const totalAmountContent = (
    <Card className="p-6 rounded-[2rem] shadow-2xl bg-[#1D2B3F] border border-white/5">
      <h3 className="text-xl font-black uppercase tracking-widest text-[#EFA765] mb-4 border-b border-white/5 pb-4 italic">Order Summary</h3>
      
      {config && isBelowMinimum && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-tight">
          <AlertCircle size={14} /> Min Order Required: PKR {Number(config.minOrderValue).toLocaleString()}
        </div>
      )}

      {/* PRICE BREAKDOWN SECTION */}
      <div className="space-y-3 mb-6 border-b border-white/5 pb-6">
        <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-tighter">
          <span>Subtotal</span>
          <span>PKR {subtotal.toLocaleString()}</span>
        </div>
        
        {discountValue > 0 && (
          <div className="flex justify-between text-emerald-400 text-sm font-bold uppercase tracking-tighter italic">
            <span className="flex items-center gap-1.5"><Tag size={12} /> Global Discount ({config?.globalDiscount}%)</span>
            <span>- PKR {discountValue.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-3xl font-black text-white mb-8 italic">
        <span className="text-sm uppercase not-italic tracking-widest opacity-50">Grand Total</span>
        <span className="text-[#EFA765]">PKR {finalCartTotal.toLocaleString()}</span>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleCheckout}
          disabled={isLoading || settingsLoading || !cart || cart.length === 0 || isBelowMinimum}
          className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all rounded-2xl h-14 text-lg font-black uppercase italic shadow-xl shadow-[#EFA765]/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
          ) : isBelowMinimum ? (
            "Limit Not Reached"
          ) : (
            paymentMethod === 'stripe' ? (
              <><CreditCard className="mr-2 h-6 w-6" /> Authorize Payment</>
            ) : (
              <><Truck className="mr-2 h-6 w-6" /> Confirm Delivery</>
            )
          )}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen selection:bg-[#EFA765] selection:text-black">
      {settingsLoading ? (
         <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-[#EFA765] h-12 w-12" />
            <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.5em]">Synchronizing Gateways...</span>
         </div>
      ) : (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                Checkout <span className="text-[#EFA765]">Process</span>
              </h2>
              <p className="text-slate-400 text-sm font-medium tracking-wide uppercase opacity-70">
                Secure your shipment coordinates and payment protocol.
              </p>
            </div>
            
            <Button 
              onClick={() => router.push('/products')}
              variant="outline"
              className="border-[#EFA765]/20 text-[#EFA765] bg-[#1D2B3F] hover:bg-[#141F2D] hover:text-[#EFA765] rounded-xl h-12 px-6 font-black uppercase italic transition-all flex items-center gap-2 group"
            >
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
              Shop More Products
            </Button>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 items-start">
            <div className="w-full lg:col-span-7 space-y-8 order-2 lg:order-1">
              <ShippingAddressForm onFormChange={handleShippingFormChange} />
              
              <Card className="p-8 bg-[#1D2B3F] border border-white/5 text-white rounded-[2rem] shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#EFA765] mb-6 flex items-center gap-2 italic">
                  <Zap size={14} className="fill-[#EFA765]" /> Payment Protocol
                </h3>
                
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'cod')}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer 
                    ${!config?.paymentMethods.stripe ? 'opacity-30 cursor-not-allowed' : ''}
                    ${paymentMethod === 'stripe' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}
                  >
                    <RadioGroupItem value="stripe" id="stripe" disabled={!config?.paymentMethods.stripe} className="border-[#EFA765] text-[#EFA765]" />
                    <Label htmlFor="stripe" className={`flex flex-col flex-1 ${!config?.paymentMethods.stripe ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <span className="font-black uppercase text-sm italic">Online Payment</span>
                      <span className="text-[10px] opacity-40 uppercase font-bold">
                        {config?.paymentMethods.stripe ? 'Stripe Gateway' : 'Gateway Offline'}
                      </span>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all cursor-pointer 
                    ${!config?.paymentMethods.cod ? 'opacity-30 cursor-not-allowed' : ''}
                    ${paymentMethod === 'cod' ? 'border-[#EFA765] bg-[#EFA765]/5' : 'border-white/5 bg-[#141F2D]'}`}
                  >
                    <RadioGroupItem value="cod" id="cod" disabled={!config?.paymentMethods.cod} className="border-[#EFA765] text-[#EFA765]" />
                    <Label htmlFor="cod" className={`flex flex-col flex-1 ${!config?.paymentMethods.cod ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <span className="font-black uppercase text-sm italic">Cash on Delivery</span>
                      <span className="text-[10px] opacity-40 uppercase font-bold">
                        {config?.paymentMethods.cod ? 'Pay upon receipt' : 'COD Suspended'}
                      </span>
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

            <div className="lg:hidden w-full order-3 mt-8">{totalAmountContent}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;