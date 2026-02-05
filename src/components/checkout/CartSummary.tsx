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
    <Card className="p-4 md:p-6 rounded-2xl md:rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765] border-[#EFA765]/20">
      <h3 className="text-xl md:text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2 font-[Yeseve One]">
        Order Summary
      </h3>
      
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {cart.length === 0 ? (
          <p className="text-white text-opacity-70 text-center py-4">Your cart is empty.</p>
        ) : (
          cart.map(item => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-[#EFA765]/10 last:border-b-0 gap-3"
            >
              {/* Product Info Section */}
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg border border-[#EFA765]/10"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm md:text-base font-bold truncate leading-tight">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm font-[Varela Round] text-[#EFA765] opacity-70 mt-0.5">
                    PKR {(item.price * item.quantity).toFixed(2)}
                    <span className="block text-[10px] md:inline md:ml-2 md:text-xs">
                       ({item.quantity} x {item.price.toFixed(2)})
                    </span>
                  </CardDescription>
                </div>
              </div>

              {/* Controls Section */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end space-x-3 bg-[#141F2D]/40 p-2 sm:p-0 rounded-lg sm:bg-transparent">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="border-[#EFA765]/40 text-[#EFA765] h-8 w-8 md:h-7 md:w-7 bg-transparent hover:bg-[#EFA765] hover:text-[#141F2D] transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-6 text-center text-sm font-bold text-white">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                    className="border-[#EFA765]/40 text-[#EFA765] h-8 w-8 md:h-7 md:w-7 bg-transparent hover:bg-[#EFA765] hover:text-[#141F2D] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveItem(item)} 
                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10 h-8 w-8 md:h-7 md:w-7 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pricing Footer */}
      <div className="space-y-2 border-t border-[#EFA765]/20 pt-4">
        <div className="flex justify-between items-center text-lg md:text-xl font-bold">
          <span className="font-[Yeseve One] tracking-tight">Total:</span>
          <span className="font-[Yeseve One] text-[#EFA765]">
            PKR {getCartTotal().toFixed(2)}
          </span>
        </div>
        <p className="text-[10px] text-white/40 text-right italic uppercase tracking-tighter">
          Taxes and shipping calculated at checkout
        </p>
      </div>
    </Card>
  );
};

export default CartSummary;