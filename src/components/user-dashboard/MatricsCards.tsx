import React from "react";
import { ShoppingCart, MessageSquare, Star } from "lucide-react";

interface MetricCardsProps {
  allOrders: any[];
  reviews: any[];
  messages: any[];
}

const MetricCards = ({ allOrders, reviews, messages }: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:scale-[1.02] border border-slate-700 cursor-pointer">
        <div
          className={`p-3 rounded-full bg-indigo-600 flex-shrink-0 shadow-md`}
        >
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          <p className="text-3xl font-extrabold text-white leading-none">
            {allOrders.length.toLocaleString()}
          </p>
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">
            Total Orders
          </h3>
        </div>
      </div>
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:scale-[1.02] border border-slate-700 cursor-pointer">
        <div
          className={`p-3 rounded-full bg-amber-600 flex-shrink-0 shadow-md`}
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </div>

        <div className="flex flex-col">
          <p className="text-3xl font-extrabold text-white leading-none">
            {messages.length.toLocaleString()}
          </p>
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">
            Total Messages
          </h3>
        </div>
      </div>

      <div
        className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-all duration-300 ease-in-out
                  transform hover:shadow-2xl hover:scale-[1.02] border border-slate-700 cursor-pointer"
      >
        <div className={`p-3 rounded-full bg-rose-600 flex-shrink-0 shadow-md`}>
          <Star className="w-6 h-6 text-white" />
        </div>

        <div className="flex flex-col">
          <p className="text-3xl font-extrabold text-white leading-none">
            {reviews.length.toLocaleString()}
          </p>
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">
            Total Reviews
          </h3>
        </div>
      </div>
    </div>
  );
};
export default MetricCards;
