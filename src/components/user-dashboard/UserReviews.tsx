"use client";
import { Star, Quote } from "lucide-react";

export const UserReviews = ({ reviews }: any) => {
  return (
    <div className="bg-[#1E293B]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 h-full shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Star className="text-[#EFA765]" size={20} fill="#EFA765" />
        <h3 className="text-xl font-black font-[var(--font-yeseva-one)] text-white">My Reviews</h3>
      </div>
      <div className="space-y-6 max-h-202.5 overflow-y-auto pr-2 custom-scrollbar">
        {reviews?.map((review: any) => (
          <div key={review._id} className="relative p-5 bg-white/5 rounded-2xl border-l-2 border-[#EFA765]">
            <Quote className="absolute top-2 right-4 text-white/5" size={40} />
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < review.rating ? "#EFA765" : "none"} className={i < review.rating ? "text-[#EFA765]" : "text-slate-600"} />
              ))}
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed">&quot;{review.review}&quot;</p>
            <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};