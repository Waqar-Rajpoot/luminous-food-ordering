"use client";
import React, { useState } from "react";
import { XCircle, Loader2 } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  shippingProgress: 'processing' | 'shipped' | 'delivered' | 'canceled' | string;
  orderStatus: 'paid' | 'pending' | 'canceled' | string;
  finalAmount: number;
  createdAt: string;
}

export const UserOrders = ({ recentOrders }: { recentOrders: Order[] | any }) => {
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const router = useRouter();

  const handleCancelOrder = async (orderId: string) => {
    if (loadingOrderId) return;
    
    console.log(`Attempting to cancel order: ${orderId}`);
    setLoadingOrderId(orderId);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ shippingProgress: 'canceled' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.refresh();
      }


    } catch (error) {
      console.error(`Error canceling order ${orderId}:`, error);
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-7xl text-white">
      <h3 className="text-2xl font-semibold mb-4 third-heading">
        Recent Orders
      </h3>
      <hr className="border-slate-700 my-8" />
      {recentOrders.length === 0 ? (
        <p className="text-gray-400">No recent orders found.</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <ul className="space-y-4">
            {recentOrders.map((order: Order) => {
              const isCancellable = 
                order.shippingProgress !== "shipped" && 
                order.shippingProgress !== "delivered" && 
                order.shippingProgress !== "canceled";

              const isLoading = loadingOrderId === order._id;

              return (
                <li
                  key={order._id}
                  className="border-b mx-1 border-slate-700 pb-4 last:border-b-0 flex justify-between items-start sm:items-center"
                >
                  <Link
                    href={`/order-details/${order.orderId}`}
                    className="flex-grow cursor-pointer transition-colors duration-200 hover:bg-slate-700 p-3 -m-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center no-underline text-white w-full sm:w-auto"
                  >
                    <div className="flex-grow">
                      <p className="font-semibold">
                        Order ID: {order._id.substring(0, 15)}...
                      </p>
                      <p className="text-md text-gray-300">
                        Customer: {order.customerName}
                      </p>
                      <p>Shipping Status:
                      <span
                        className={`mt-2 sm:mt-0 ml-2 px-2 py-1 rounded-full text-xs font-semibold uppercase border ${order.shippingProgress === "processing" ? "bg-yellow-700/20 text-yellow-300 border-yellow-700" : order.shippingProgress === "shipped" ? "bg-blue-700/20 text-blue-300 border-blue-700/40" : order.shippingProgress === "delivered" ? "bg-green-700/20 text-green-300 border-green-700/40" : order.shippingProgress === "canceled" ? "bg-red-700/20 text-red-300 border-red-700/40" : "bg-gray-700/20 text-gray-300 border-gray-700/40"}`}
                      >
                        {order.shippingProgress}
                      </span>
                      </p>
                      <p className="text-sm py-1 font-bold text-[#EFA765]">
                        Paid Amount: {order.finalAmount} PKR
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    <p className="text-gray-400 text-xs mt-1">See more details...</p>

                    </div>
                    <span
                      className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold uppercase border ${order.orderStatus === "paid" ? "bg-green-700/20 text-green-300 border-green-700/20" : order.orderStatus === "pending" ? "bg-yellow-700/20 text-yellow-300 border-yellow-700/40" : order.orderStatus === "canceled" ? "bg-red-700/20 text-red-300 border-red-700/40" : "bg-gray-700/20 text-gray-300 border-gray-700/40"}`}
                    >
                      {order.orderStatus}
                    </span>
                  </Link>

                  {isCancellable && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isLoading}
                      className={`
                        ml-4 flex items-center justify-center py-1 px-3 text-sm font-medium rounded-full transition-all duration-300 transform-gpu
                        ${isLoading 
                          ? 'bg-red-900/40 text-red-400 cursor-not-allowed animate-pulse' 
                          : 'bg-red-700/20 text-red-300 border-red-700/40 border hover:bg-red-700/40 hover:cursor-pointer active:scale-95'
                        }
                      `}
                      aria-label={`Cancel order ${order._id.substring(0, 10)}`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <XCircle className="h-5 w-5 mr-1" />
                      )}
                      <span className="hidden sm:inline">
                        {isLoading ? 'Cancelling...' : 'Cancel'}
                      </span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
