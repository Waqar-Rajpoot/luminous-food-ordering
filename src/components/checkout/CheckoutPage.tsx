"use client";

import React, { useState } from 'react';
import { CreditCard, Loader2, AlertCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import CartSummary from './CartSummary';
import ShippingAddressForm from './ShippingAddressForm';
import { Card } from '@/components/ui/card';
import { IShippingAddress } from '@/models/Order.model';
import { useSession } from 'next-auth/react';
import { PageName } from '@/context/PageContext';
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
          return "Redirecting to secure payment...";
        } else {
          window.location.assign(`/order-details/${data.orderId}?status=success`);
          return "Order placed successfully!";
        }
      } else {
        throw new Error(data.message || "Failed to initiate checkout.");
      }
    };

    toast.promise(checkoutAction(), {
      loading: paymentMethod === 'stripe' ? "Preparing payment..." : "Placing your order...",
      success: (msg) => { setIsLoading(false); return msg; },
      error: (err) => { setIsLoading(false); return err.message; },
    });
  };

  // Define the content as a variable instead of a nested component function
  const totalAmountContent = (
    <Card className="p-4 md:p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-none">
      <h3 className="text-xl md:text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2">Final Amount</h3>
      <div className="flex justify-between items-center text-lg md:text-xl font-bold my-4">
        <span>Grand Total:</span>
        <span className="whitespace-nowrap">PKR {finalCartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleCheckout}
          disabled={isLoading || cart.length === 0}
          className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-all rounded-full h-12 text-base md:text-lg font-bold"
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
          className="w-full border-[#EFA765] bg-transparent text-[#EFA765] hover:bg-[#EFA765]/10 rounded-full h-12 text-sm md:text-base"
        >
          Continue Shopping
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* MOBILE FLOW: 1. CartSummary -> 2. Shipping Form -> 3. Payment -> 4. Total Amount
         LAPTOP FLOW: Left Column (Shipping/Payment) | Right Column (Summary/Total)
      */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start">
        
        {/* SECTION A: Cart Summary (Mobile: 1st | Laptop: Right Column) */}
        <div className="w-full lg:col-span-5 order-1 lg:order-2 space-y-6">
          <CartSummary
            cart={cart}
            handleUpdateQuantity={handleUpdateQuantity}
            handleRemoveItem={handleRemoveItem}
            getCartTotal={getOriginalCartTotal}
            originalCartTotal={finalCartTotal}
          />
          {/* Shown on Laptop Right Column, below Summary */}
          <div className="hidden lg:block">
            {totalAmountContent}
          </div>
        </div>

        {/* SECTION B: Form & Payment (Mobile: 2nd & 3rd | Laptop: Left Column) */}
        <div className="w-full lg:col-span-7 order-2 lg:order-1 space-y-6 mt-6 lg:mt-0">
          <ShippingAddressForm onFormChange={handleShippingFormChange} />
          
          <Card className="p-4 md:p-6 bg-[#1D2B3F] border-none text-[#EFA765] rounded-xl shadow-lg">
            <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Payment Method
            </h3>
            <RadioGroup 
              defaultValue="stripe" 
              onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'cod')}
              className="grid grid-cols-1 gap-3 md:gap-4"
            >
              <div className={`flex items-center space-x-3 p-3 md:p-4 rounded-lg border transition-all ${paymentMethod === 'stripe' ? 'border-[#EFA765] bg-[#EFA765]/10' : 'border-gray-600'}`}>
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex flex-col cursor-pointer flex-1">
                  <span className="font-bold text-sm md:text-base">Pay via Card (Stripe)</span>
                  <span className="text-[10px] md:text-xs opacity-70">Secure online payment</span>
                </Label>
              </div>
              <div className={`flex items-center space-x-3 p-3 md:p-4 rounded-lg border transition-all ${paymentMethod === 'cod' ? 'border-[#EFA765] bg-[#EFA765]/10' : 'border-gray-600'}`}>
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex flex-col cursor-pointer flex-1">
                  <span className="font-bold text-sm md:text-base">Cash on Delivery</span>
                  <span className="text-[10px] md:text-xs opacity-70">Pay when you receive your order</span>
                </Label>
              </div>
            </RadioGroup>
          </Card>

          {/* SECTION C: Total Amount (Mobile: 4th | Laptop: Hidden because it's in Section A) */}
          <div className="lg:hidden mt-6">
            {totalAmountContent}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;