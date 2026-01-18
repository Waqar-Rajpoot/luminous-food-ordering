"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  Star,
  MessageSquare,
  ThumbsUp,
  Clock,
  BarChart,
  Search, // Added Search icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Ensure you have this component
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IReview } from "@/models/Review.model";
import { format } from "date-fns";

// --- Type Definitions ---
interface ErrorResponse {
  message?: string;
  success?: boolean;
}

const StarRatingDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center space-x-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
          rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }`}
      />
    ))}
  </div>
);

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div
    className={`p-4 sm:p-6 rounded-xl shadow-lg border border-opacity-20 ${color} transition-all duration-300 hover:shadow-2xl bg-[#1c2a3b]`}
    style={{ borderColor: "#efa765" }}
  >
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h3 className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <div className="text-xl sm:text-3xl font-bold text-white">{value}</div>
      </div>
      <div
        className="p-2 sm:p-3 rounded-full bg-opacity-10"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  
  // New State for Search
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/reviews");
      setReviews(response.data.reviews || []);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch reviews.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Derived state for filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        review.name.toLowerCase().includes(searchLower) ||
        review.email.toLowerCase().includes(searchLower)
      );
    });
  }, [reviews, searchQuery]);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageRating: 0.0,
        approvedCount: 0,
        pendingCount: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        ratingPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
      };
    }
    const totalScore = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalScore / totalReviews).toFixed(2);
    const approvedCount = reviews.filter((r) => r.isApproved).length;
    const pendingCount = totalReviews - approvedCount;
    const distribution: Record<number, number> = reviews.reduce(
      (dist, review) => {
        const rating = review.rating >= 1 && review.rating <= 5 ? review.rating : 1;
        dist[rating] = (dist[rating] || 0) + 1;
        return dist;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>
    );
    const ratingPercentages: Record<number, number> = Object.fromEntries(
      Object.entries(distribution).map(([rating, count]) => [
        parseInt(rating),
        parseFloat(((count / totalReviews) * 100).toFixed(1)),
      ])
    );
    return {
      totalReviews,
      averageRating: parseFloat(averageRating),
      approvedCount,
      pendingCount,
      ratingDistribution: distribution,
      ratingPercentages,
    };
  }, [reviews]);

  const handleToggleApproval = async (reviewId: string, currentStatus: boolean) => {
    setIsActionLoading(true);
    try {
      const response = await axios.patch(`/api/reviews/${reviewId}`, {
        isApproved: !currentStatus,
      });
      toast.success(response.data.message);
      setReviews((prev: any) =>
        prev.map((r: any) => (r._id === reviewId ? { ...r, isApproved: !currentStatus } : r))
      );
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update review status.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setIsActionLoading(true);
    try {
      const response = await axios.delete(`/api/reviews/${reviewId}`);
      toast.success(response.data.message);
      setReviews((prev) => prev.filter((r: any) => r._id !== reviewId));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Failed to delete review.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReviewClick = (review: IReview) => {
    setSelectedReview(review);
    setIsReviewDialogOpen(true);
  };

  const RatingBar = ({ rating, count, percentage }: { rating: number; count: number; percentage: number }) => (
    <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm">
      <div className="w-8 shrink-0 text-gray-400">
        {rating} <span className="text-yellow-400">★</span>
      </div>
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#efa765] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="w-10 text-right shrink-0 font-medium text-white">{percentage}%</div>
      <div className="hidden sm:block w-10 text-right shrink-0 text-gray-400 text-xs">({count})</div>
    </div>
  );

  return (
    <div className="min-h-screen text-white p-4 md:p-8 lg:p-12 yeseva-one overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 tracking-tighter text-[#efa765]">
            Review Hub Dashboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg">
            Centralized management and analytics for customer feedback.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatCard
            title="Total"
            value={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats.totalReviews}
            icon={<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-[#efa765]" />}
            color="#efa765"
          />
          <StatCard
            title="Rating"
            value={isLoading ? "-" : stats.averageRating}
            icon={<Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 fill-yellow-400" />}
            color="#facc15"
          />
          <StatCard
            title="Approved"
            value={isLoading ? "-" : stats.approvedCount}
            icon={<ThumbsUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />}
            color="#22c55e"
          />
          <StatCard
            title="Pending"
            value={isLoading ? "-" : stats.pendingCount}
            icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />}
            color="#f87171"
          />
        </div>

        {/* Rating Breakdown */}
        <div className="bg-[#141f2d] rounded-xl p-4 sm:p-6 shadow-xl border border-[#efa765]/30">
          <h2 className="flex items-center text-xl sm:text-2xl font-semibold mb-6 text-[#efa765]">
            <BarChart className="h-5 w-5 sm:h-6 sm:w-6 mr-2" /> Rating Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center justify-center lg:border-r border-gray-700 pb-6 lg:pb-0 lg:pr-8">
              <p className="text-5xl sm:text-6xl font-extrabold text-[#efa765]">
                {isLoading ? "..." : stats.averageRating}
              </p>
              <div className="my-2">
                <StarRatingDisplay rating={Math.round(stats.averageRating)} />
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">Based on {stats.totalReviews} reviews</p>
            </div>
            <div className="lg:col-span-2 space-y-3 pt-4 lg:pt-0">
              {reviews.length === 0 && !isLoading ? (
                <p className="text-gray-500 text-center">No feedback data available.</p>
              ) : (
                [5, 4, 3, 2, 1].map((rating) => (
                  <RatingBar
                    key={rating}
                    rating={rating}
                    count={stats.ratingDistribution[rating] || 0}
                    percentage={stats.ratingPercentages[rating] || 0}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Review Queue Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Review Queue</h2>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10 bg-[#141f2d] border-[#efa765]/30 text-white focus:border-[#efa765] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Desktop Table / Mobile Card View */}
        <div className="space-y-4">
          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block rounded-xl border border-[#efa765]/30 bg-[#141f2d] shadow-xl overflow-hidden">
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-[#1c2a3b] text-[#efa765] z-10">
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-[#efa765] font-bold">Customer</TableHead>
                    <TableHead className="text-[#efa765] font-bold">Email</TableHead>
                    <TableHead className="text-center text-[#efa765] font-bold">Rating</TableHead>
                    <TableHead className="text-[#efa765] font-bold">Review</TableHead>
                    <TableHead className="text-center text-[#efa765] font-bold">Status</TableHead>
                    <TableHead className="text-center text-[#efa765] font-bold">Date</TableHead>
                    <TableHead className="text-center text-[#efa765] font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-[#efa765]" /></TableCell></TableRow>
                  ) : filteredReviews.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-20 text-gray-500">No matching reviews found.</TableCell></TableRow>
                  ) : (
                    filteredReviews.map((review) => (
                      <TableRow key={review._id.toString()} className="border-gray-800 hover:bg-[#1c2a3b]/50">
                        <TableCell className="font-medium">{review.name}</TableCell>
                        <TableCell className="text-gray-400 text-sm">{review.email}</TableCell>
                        <TableCell><StarRatingDisplay rating={review.rating} /></TableCell>
                        <TableCell 
                          className="text-gray-400 truncate max-w-50 cursor-pointer hover:text-[#efa765]"
                          onClick={() => handleReviewClick(review)}
                        >
                          {review.review}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={review.isApproved ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}>
                            {review.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 text-xs text-center">{format(new Date(review.createdAt), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <ActionButtons review={review} isActionLoading={isActionLoading} handleToggleApproval={handleToggleApproval} handleDeleteReview={handleDeleteReview} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View (hidden on desktop) */}
          <div className="md:hidden space-y-4">
             {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-[#efa765]" /></div>
             ) : filteredReviews.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No matching reviews found.</p>
             ) : (
                filteredReviews.map((review) => (
                  <div key={review._id.toString()} className="bg-[#1c2a3b] rounded-xl p-4 border border-gray-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[#efa765]">{review.name}</h4>
                        <p className="text-[10px] text-gray-500">{format(new Date(review.createdAt), "MMM dd, yyyy")}</p>
                      </div>
                      <Badge className={review.isApproved ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <StarRatingDisplay rating={review.rating} />
                    <p className="text-sm text-gray-400 line-clamp-2 italic" onClick={() => handleReviewClick(review)}>
                      &quot;{review.review}&quot;
                    </p>
                    <div className="pt-2 border-t border-gray-700 flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 truncate max-w-[150px]">{review.email}</span>
                      <ActionButtons review={review} isActionLoading={isActionLoading} handleToggleApproval={handleToggleApproval} handleDeleteReview={handleDeleteReview} />
                    </div>
                  </div>
                ))
             )}
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="w-[95%] max-w-lg bg-gray-900 text-white border border-[#efa765] rounded-2xl">
          <DialogHeader><DialogTitle className="text-[#efa765] text-xl font-bold">Review Details</DialogTitle></DialogHeader>
          {selectedReview && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#efa765]/20 flex items-center justify-center text-[#efa765] font-bold">{selectedReview.name[0]}</div>
                  <div>
                    <p className="text-sm font-bold">{selectedReview.name}</p>
                    <p className="text-[10px] text-gray-400">{selectedReview.email}</p>
                  </div>
                </div>
                <StarRatingDisplay rating={selectedReview.rating} />
              </div>
              <div className="bg-gray-800 p-4 rounded-xl min-h-[150px] max-h-[300px] overflow-y-auto border border-gray-700">
                <p className="text-sm leading-relaxed text-gray-200">{selectedReview.review}</p>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest px-1">
                <span>Status: {selectedReview.isApproved ? "Approved" : "Pending"}</span>
                <span>{format(new Date(selectedReview.createdAt), "dd MMM yyyy")}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ActionButtons = ({ review, isActionLoading, handleToggleApproval, handleDeleteReview }: any) => (
  <div className="flex justify-center space-x-2">
    <Button
      variant={review.isApproved ? "destructive" : "default"}
      size="icon"
      onClick={() => handleToggleApproval(review._id.toString(), review.isApproved)}
      disabled={isActionLoading}
      className="h-8 w-8"
      style={{ backgroundColor: review.isApproved ? "#dc2626" : "#22c55e", color: "white" }}
    >
      {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : review.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
    </Button>

    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isActionLoading} className="h-8 w-8 bg-red-700/20 text-red-300 border border-red-700/40">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 text-white border border-red-700 w-[90%] rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">Delete Review?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">This will permanently remove this feedback from the records.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2 mt-4">
          <AlertDialogCancel className="flex-1 bg-gray-700 text-white border-none mt-0">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteReview(review._id.toString())} className="flex-1 bg-red-600 text-white hover:bg-red-700">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
