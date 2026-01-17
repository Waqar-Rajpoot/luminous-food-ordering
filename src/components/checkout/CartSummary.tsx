// components/checkout/CartSummary.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { X, Plus, Minus } from 'lucide-react';

interface CartSummaryProps {
  cart: any[];
  handleUpdateQuantity: (product: any, quantity: number) => void;
  handleRemoveItem: (product: any) => void;
  getCartTotal: (withDiscount?: boolean) => number;
  originalCartTotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  handleUpdateQuantity,
  handleRemoveItem,
  getCartTotal,
}) => {
  return (
    <Card className="p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765]">
      <h3 className="text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2 yeseva-one">Order Summary</h3>
      
      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
        {cart.length === 0 ? (
          <p className="text-white text-opacity-70 text-center">Your cart is empty.</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#EFA765]/10 last:border-b-0">
              <div className="flex items-center space-x-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <CardTitle className="text-base font-bold">{item.name}</CardTitle>
                  <CardDescription className="text-sm font-[Varela Round] text-[#EFA765] opacity-70">
                    PKR {(item.price * item.quantity).toFixed(2)} ({item.quantity} x {item.price.toFixed(2)})
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="border-[#EFA765]/40 text-[#EFA765] h-7 w-7"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                  className="border-[#EFA765]/40 text-[#EFA765] h-7 w-7"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item)} className="text-red-500 hover:text-red-700 h-7 w-7">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center text-xl font-bold border-t border-[#EFA765]/20 pt-4">
        <span className="font-[Yeseve One]">Total:</span>
        <span className="font-[Yeseve One]">PKR {getCartTotal().toFixed(2)}</span>
      </div>
    </Card>
  );
};

export default CartSummary;
