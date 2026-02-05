// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { CreditCard, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { loadStripe, Stripe } from '@stripe/stripe-js';
// import { v4 as uuidv4 } from 'uuid';
// import CartSummary from './CartSummary';
// import ShippingAddressForm from './ShippingAddressForm';
// import { Card } from '@/components/ui/card';
// import { IShippingAddress } from '@/models/Order.model';
// import { useSession } from 'next-auth/react';
// // Import PageName to ensure type consistency
// import { PageName } from '@/context/PageContext';

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface CheckoutPageProps {
//   cart: CartItem[];
//   handleUpdateQuantity: (product: any, quantity: number) => void;
//   handleRemoveItem: (product: any) => void;
//   getOriginalCartTotal: () => number;
//   dispatch: React.Dispatch<any>;
//   // ✅ UPDATED: Now matches the global PageName type
//   setCurrentPage: React.Dispatch<React.SetStateAction<PageName>>;
// }

// // ... rest of your Stripe Helper code ...
// let stripePromise: Promise<Stripe | null> | null = null;
// const getStripePromise = () => {
//   if (!stripePromise) {
//     const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
//     if (!stripePublicKey) {
//       console.error("Stripe public key is missing in .env.local");
//       return null;
//     }
//     stripePromise = loadStripe(stripePublicKey);
//   }
//   return stripePromise;
// };

// const CheckoutPage: React.FC<CheckoutPageProps> = ({
//   cart,
//   handleUpdateQuantity,
//   handleRemoveItem,
//   getOriginalCartTotal,
//   dispatch,
//   setCurrentPage,
// }) => {
//   const { data: session } = useSession();
//   const [isLoading, setIsLoading] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
//   const [isShippingFormValid, setIsShippingFormValid] = useState(false);
//   const [finalCartTotal, setFinalCartTotal] = useState<number>(0);

//   const idempotencyKeyRef = useRef(uuidv4());

//   useEffect(() => {
//     setFinalCartTotal(getOriginalCartTotal());
//   }, [getOriginalCartTotal, cart]);

//   const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
//     setShippingAddress(data);
//     setIsShippingFormValid(isValid);
//   };

//   const handleCheckout = async () => {
//     if (!isShippingFormValid || !shippingAddress) {
//       toast.error("Please complete the shipping address form correctly.");
//       return;
//     }
//     if (cart.length === 0) {
//       toast.error("Your cart is empty.");
//       return;
//     }

//     const stripeInitPromise = getStripePromise();

//     const checkoutAction = async () => {
//       setIsLoading(true);
//       if (!stripeInitPromise) {
//         throw new Error("Stripe configuration is missing.");
//       }

//       const stripe = await stripeInitPromise;
//       if (!stripe) {
//         throw new Error("Stripe failed to initialize.");
//       }

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
//         originalTotal: getOriginalCartTotal(),
//         customerEmail: session?.user?.email,
//       };

//       const response = await fetch("/api/stripe-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Idempotency-Key": idempotencyKeyRef.current,
//         },
//         body: JSON.stringify(checkoutData),
//       });

//       const data = await response.json();

//       if (response.ok && data.url) {
//         dispatch({ type: 'CLEAR_CART' });
//         // const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
//         // if (error) throw new Error(error.message);
//         window.location.assign(data.url);
//         return "Redirecting to payment...";
//       } else {
//         throw new Error(data.message || "Failed to initiate checkout.");
//       }
//     };

//     toast.promise(checkoutAction(), {
//       loading: "Preparing your order...",
//       success: (msg) => {
//         setIsLoading(false);
//         return msg;
//       },
//       error: (err) => {
//         setIsLoading(false);
//         return err.message;
//       },
//     });
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
//       <div className="space-y-6">
//         <ShippingAddressForm onFormChange={handleShippingFormChange} />
//       </div>

//       <div className="space-y-6">
//         <CartSummary
//           cart={cart}
//           handleUpdateQuantity={handleUpdateQuantity}
//           handleRemoveItem={handleRemoveItem}
//           getCartTotal={getOriginalCartTotal}
//           originalCartTotal={getOriginalCartTotal()}
//         />

//         <Card className="p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-none">
//           <h3 className="text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2">Final Amount</h3>
//           <div className="flex justify-between items-center text-xl font-bold my-4">
//             <span>Grand Total:</span>
//             <span>PKR {finalCartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
//           </div>
          
//           <Button
//             onClick={handleCheckout}
//             disabled={isLoading || cart.length === 0 || !isShippingFormValid || finalCartTotal <= 0}
//             className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-all rounded-full h-12 text-lg font-bold"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CreditCard className="mr-2 h-5 w-5" />
//                 Proceed to Payment
//               </>
//             )}
//           </Button>

//           <Button
//             onClick={() => setCurrentPage('products')}
//             variant="outline"
//             className="w-full border-[#EFA765] bg-transparent text-[#EFA765] hover:bg-[#EFA765]/10 rounded-full mt-4 h-12"
//           >
//             Continue Shopping
//           </Button>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;








// "use client";

// import React, { useState, useRef } from 'react';
// import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { loadStripe, Stripe } from '@stripe/stripe-js';
// import { v4 as uuidv4 } from 'uuid';
// import CartSummary from './CartSummary';
// import ShippingAddressForm from './ShippingAddressForm';
// import { Card } from '@/components/ui/card';
// import { IShippingAddress } from '@/models/Order.model';
// import { useSession } from 'next-auth/react';
// import { PageName } from '@/context/PageContext';

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface CheckoutPageProps {
//   cart: CartItem[];
//   handleUpdateQuantity: (product: any, quantity: number) => void;
//   handleRemoveItem: (product: any) => void;
//   getOriginalCartTotal: () => number;
//   dispatch: React.Dispatch<any>;
//   setCurrentPage: React.Dispatch<React.SetStateAction<PageName>>;
// }

// let stripePromise: Promise<Stripe | null> | null = null;
// const getStripePromise = () => {
//   if (!stripePromise) {
//     const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
//     if (!stripePublicKey) {
//       console.error("Stripe public key is missing in .env.local");
//       return null;
//     }
//     stripePromise = loadStripe(stripePublicKey);
//   }
//   return stripePromise;
// };

// const CheckoutPage: React.FC<CheckoutPageProps> = ({
//   cart,
//   handleUpdateQuantity,
//   handleRemoveItem,
//   getOriginalCartTotal,
//   dispatch,
//   setCurrentPage,
// }) => {
//   const { data: session } = useSession();
//   const [isLoading, setIsLoading] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
//   const [isShippingFormValid, setIsShippingFormValid] = useState(false);

//   // ✅ FIX: Derive total directly from prop instead of using useEffect/useState
//   // This removes the "cascading render" error entirely.
//   const finalCartTotal = getOriginalCartTotal();

//   const idempotencyKeyRef = useRef(uuidv4());

//   const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
//     setShippingAddress(data);
//     setIsShippingFormValid(isValid);
//   };

//   const handleCheckout = async () => {
//     // ✅ VALIDATION: Show toast errors if data is missing
//     if (cart.length === 0) {
//       toast.error("Your cart is empty. Please add items before checking out.", {
//         icon: <AlertCircle className="text-red-500" />
//       });
//       return;
//     }

//     if (!isShippingFormValid || !shippingAddress) {
//       toast.error("Shipping information is incomplete. Please check the address form.", {
//         description: "Ensure all required fields are filled correctly.",
//         icon: <AlertCircle className="text-yellow-500" />
//       });
//       return;
//     }

//     if (!session?.user) {
//       toast.error("Please sign in to complete your order.");
//       return;
//     }

//     const stripeInitPromise = getStripePromise();

//     const checkoutAction = async () => {
//       setIsLoading(true);
//       if (!stripeInitPromise) {
//         throw new Error("Stripe configuration is missing. Check your environment variables.");
//       }

//       const stripe = await stripeInitPromise;
//       if (!stripe) {
//         throw new Error("Failed to connect to the payment gateway.");
//       }

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
//       };

//       const response = await fetch("/api/stripe-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Idempotency-Key": idempotencyKeyRef.current,
//         },
//         body: JSON.stringify(checkoutData),
//       });

//       const data = await response.json();

//       if (response.ok && data.url) {
//         dispatch({ type: 'CLEAR_CART' });
//         window.location.assign(data.url);
//         return "Redirecting to secure payment...";
//       } else {
//         throw new Error(data.message || "Failed to initiate checkout.");
//       }
//     };

//     toast.promise(checkoutAction(), {
//       loading: "Securing your checkout session...",
//       success: (msg) => {
//         setIsLoading(false);
//         return msg;
//       },
//       error: (err) => {
//         setIsLoading(false);
//         return err.message;
//       },
//     });
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
//       <div className="space-y-6">
//         <ShippingAddressForm onFormChange={handleShippingFormChange} />
//       </div>

//       <div className="space-y-6">
//         <CartSummary
//           cart={cart}
//           handleUpdateQuantity={handleUpdateQuantity}
//           handleRemoveItem={handleRemoveItem}
//           getCartTotal={getOriginalCartTotal}
//           originalCartTotal={finalCartTotal}
//         />

//         <Card className="p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-none">
//           <h3 className="text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2">Final Amount</h3>
//           <div className="flex justify-between items-center text-xl font-bold my-4">
//             <span>Grand Total:</span>
//             <span>PKR {finalCartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
//           </div>
          
//           <Button
//             onClick={handleCheckout}
//             // ✅ CHANGED: Button is now enabled even if form is invalid, 
//             // so we can show the user toast errors on click.
//             disabled={isLoading || cart.length === 0}
//             className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-all rounded-full h-12 text-lg font-bold"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CreditCard className="mr-2 h-5 w-5" />
//                 Proceed to Payment
//               </>
//             )}
//           </Button>

//           <Button
//             onClick={() => setCurrentPage('products')}
//             variant="outline"
//             className="w-full border-[#EFA765] bg-transparent text-[#EFA765] hover:bg-[#EFA765]/10 rounded-full mt-4 h-12"
//           >
//             Continue Shopping
//           </Button>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;








// "use client";

// import React, { useState } from 'react';
// import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { loadStripe, Stripe } from '@stripe/stripe-js';
// import { v4 as uuidv4 } from 'uuid';
// import CartSummary from './CartSummary';
// import ShippingAddressForm from './ShippingAddressForm';
// import { Card } from '@/components/ui/card';
// import { IShippingAddress } from '@/models/Order.model';
// import { useSession } from 'next-auth/react';
// import { PageName } from '@/context/PageContext';

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface CheckoutPageProps {
//   cart: CartItem[];
//   handleUpdateQuantity: (product: any, quantity: number) => void;
//   handleRemoveItem: (product: any) => void;
//   getOriginalCartTotal: () => number;
//   dispatch: React.Dispatch<any>;
//   setCurrentPage: React.Dispatch<React.SetStateAction<PageName>>;
// }

// let stripePromise: Promise<Stripe | null> | null = null;
// const getStripePromise = () => {
//   if (!stripePromise) {
//     const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
//     if (!stripePublicKey) {
//       console.error("Stripe public key is missing in .env.local");
//       return null;
//     }
//     stripePromise = loadStripe(stripePublicKey);
//   }
//   return stripePromise;
// };

// const CheckoutPage: React.FC<CheckoutPageProps> = ({
//   cart,
//   handleUpdateQuantity,
//   handleRemoveItem,
//   getOriginalCartTotal,
//   dispatch,
//   setCurrentPage,
// }) => {
//   const { data: session } = useSession();
//   const [isLoading, setIsLoading] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
//   const [isShippingFormValid, setIsShippingFormValid] = useState(false);

//   // Derived state to avoid cascading render errors
//   const finalCartTotal = getOriginalCartTotal();

//   const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
//     setShippingAddress(data);
//     setIsShippingFormValid(isValid);
//   };

//   const handleCheckout = async () => {
//     // 1. Immediate Validations with Toasts
//     if (cart.length === 0) {
//       toast.error("Your cart is empty.", { icon: <AlertCircle className="text-red-500" /> });
//       return;
//     }

//     if (!isShippingFormValid || !shippingAddress) {
//       toast.error("Please complete the shipping address form correctly.", {
//         description: "Check for missing fields in the address section.",
//         icon: <AlertCircle className="text-yellow-500" />
//       });
//       return;
//     }

//     if (!session?.user) {
//       toast.error("Authentication required. Please sign in to continue.");
//       return;
//     }

//     // 2. Generate a fresh Idempotency Key for this specific click attempt
//     const currentIdempotencyKey = uuidv4();
//     const stripeInitPromise = getStripePromise();

//     const checkoutAction = async () => {
//       setIsLoading(true);

//       if (!stripeInitPromise) {
//         throw new Error("Stripe configuration is missing.");
//       }

//       const stripe = await stripeInitPromise;
//       if (!stripe) {
//         throw new Error("Failed to initialize payment gateway.");
//       }

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

//       // Check if response is successful and contains the redirect URL
//       if (response.ok && data.url) {
//         dispatch({ type: 'CLEAR_CART' });
//         // Redirecting to Stripe Hosted Page
//         window.location.assign(data.url);
//         return "Redirecting to secure payment...";
//       } else {
//         throw new Error(data.message || "Failed to initiate checkout.");
//       }
//     };

//     toast.promise(checkoutAction(), {
//       loading: "Preparing your secure checkout...",
//       success: (msg) => {
//         setIsLoading(false);
//         return msg;
//       },
//       error: (err) => {
//         setIsLoading(false);
//         return err.message;
//       },
//     });
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
//       <div className="space-y-6">
//         <ShippingAddressForm onFormChange={handleShippingFormChange} />
//       </div>

//       <div className="space-y-6">
//         <CartSummary
//           cart={cart}
//           handleUpdateQuantity={handleUpdateQuantity}
//           handleRemoveItem={handleRemoveItem}
//           getCartTotal={getOriginalCartTotal}
//           originalCartTotal={finalCartTotal}
//         />

//         <Card className="p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-none">
//           <h3 className="text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2">Final Amount</h3>
//           <div className="flex justify-between items-center text-xl font-bold my-4">
//             <span>Grand Total:</span>
//             <span>PKR {finalCartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
//           </div>
          
//           <Button
//             onClick={handleCheckout}
//             disabled={isLoading || cart.length === 0}
//             className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-all rounded-full h-12 text-lg font-bold"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CreditCard className="mr-2 h-5 w-5" />
//                 Proceed to Payment
//               </>
//             )}
//           </Button>

//           <Button
//             onClick={() => setCurrentPage('products')}
//             variant="outline"
//             className="w-full border-[#EFA765] bg-transparent text-[#EFA765] hover:bg-[#EFA765]/10 rounded-full mt-4 h-12"
//           >
//             Continue Shopping
//           </Button>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;







"use client";

import React, { useState } from 'react';
import { CreditCard, Loader2, AlertCircle, Truck } from 'lucide-react'; // Added Truck icon
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { v4 as uuidv4 } from 'uuid';
import CartSummary from './CartSummary';
import ShippingAddressForm from './ShippingAddressForm';
import { Card } from '@/components/ui/card';
import { IShippingAddress } from '@/models/Order.model';
import { useSession } from 'next-auth/react';
import { PageName } from '@/context/PageContext';

// --- ADDED UI COMPONENTS FOR SELECTION ---
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutPageProps {
  cart: CartItem[];
  handleUpdateQuantity: (product: any, quantity: number) => void;
  handleRemoveItem: (product: any) => void;
  getOriginalCartTotal: () => number;
  dispatch: React.Dispatch<any>;
  setCurrentPage: React.Dispatch<React.SetStateAction<PageName>>;
}

let stripePromise: Promise<Stripe | null> | null = null;
const getStripePromise = () => {
  if (!stripePromise) {
    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripePublicKey) {
      console.error("Stripe public key is missing in .env.local");
      return null;
    }
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  handleUpdateQuantity,
  handleRemoveItem,
  getOriginalCartTotal,
  dispatch,
  setCurrentPage,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
  const [isShippingFormValid, setIsShippingFormValid] = useState(false);
  
  // --- NEW STATE FOR PAYMENT METHOD ---
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

  const finalCartTotal = getOriginalCartTotal();

  const handleShippingFormChange = (data: IShippingAddress, isValid: boolean) => {
    setShippingAddress(data);
    setIsShippingFormValid(isValid);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.", { icon: <AlertCircle className="text-red-500" /> });
      return;
    }

    if (!isShippingFormValid || !shippingAddress) {
      toast.error("Please complete the shipping address form correctly.");
      return;
    }

    if (!session?.user) {
      toast.error("Authentication required. Please sign in to continue.");
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
        finalAmount: finalCartTotal,
        originalTotal: finalCartTotal,
        customerEmail: session.user.email,
        shippingRate: 0,
        paymentMethod: paymentMethod, // --- PASSING METHOD TO BACKEND ---
      };

      // We use the same endpoint, but the backend logic will branch
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
          return "Redirecting to secure payment...";
        } else {
          // COD Success: Redirect to order details directly
          window.location.assign(`/order-details/${data.orderId}?status=success`);
          return "Order placed successfully!";
        }
      } else {
        throw new Error(data.message || "Failed to initiate checkout.");
      }
    };

    toast.promise(checkoutAction(), {
      loading: paymentMethod === 'stripe' ? "Preparing payment..." : "Placing your order...",
      success: (msg) => {
        setIsLoading(false);
        return msg;
      },
      error: (err) => {
        setIsLoading(false);
        return err.message;
      },
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <ShippingAddressForm onFormChange={handleShippingFormChange} />
        
        {/* --- PAYMENT METHOD SELECTION UI --- */}
        <Card className="p-6 bg-[#1D2B3F] border-none text-[#EFA765] rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Payment Method
          </h3>
          <RadioGroup 
            defaultValue="stripe" 
            onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'cod')}
            className="grid grid-cols-1 gap-4"
          >
            <div className={`flex items-center space-x-3 p-4 rounded-lg border ${paymentMethod === 'stripe' ? 'border-[#EFA765] bg-[#EFA765]/10' : 'border-gray-600'}`}>
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex flex-col cursor-pointer">
                <span className="font-bold">Pay via Card (Stripe)</span>
                <span className="text-xs opacity-70">Secure online payment</span>
              </Label>
            </div>
            <div className={`flex items-center space-x-3 p-4 rounded-lg border ${paymentMethod === 'cod' ? 'border-[#EFA765] bg-[#EFA765]/10' : 'border-gray-600'}`}>
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex flex-col cursor-pointer">
                <span className="font-bold">Cash on Delivery</span>
                <span className="text-xs opacity-70">Pay when you receive your order</span>
              </Label>
            </div>
          </RadioGroup>
        </Card>
      </div>

      <div className="space-y-6">
        <CartSummary
          cart={cart}
          handleUpdateQuantity={handleUpdateQuantity}
          handleRemoveItem={handleRemoveItem}
          getCartTotal={getOriginalCartTotal}
          originalCartTotal={finalCartTotal}
        />

        <Card className="p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-none">
          <h3 className="text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2">Final Amount</h3>
          <div className="flex justify-between items-center text-xl font-bold my-4">
            <span>Grand Total:</span>
            <span>PKR {finalCartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          
          <Button
            onClick={handleCheckout}
            disabled={isLoading || cart.length === 0}
            className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-all rounded-full h-12 text-lg font-bold"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
            ) : (
              paymentMethod === 'stripe' ? (
                <><CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment</>
              ) : (
                <><Truck className="mr-2 h-5 w-5" /> Confirm COD Order</>
              )
            )}
          </Button>

          <Button
            onClick={() => setCurrentPage('products')}
            variant="outline"
            className="w-full border-[#EFA765] bg-transparent text-[#EFA765] hover:bg-[#EFA765]/10 rounded-full mt-4 h-12"
          >
            Continue Shopping
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;