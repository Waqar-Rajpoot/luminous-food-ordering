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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
// Assuming IReview is defined globally or imported correctly
import { IReview } from "@/models/Review.model";
import { format } from "date-fns";

// --- Type Definitions (Kept from original) ---
interface ErrorResponse {
  message?: string;
  success?: boolean;
}

// Helper component for star rating display
const StarRatingDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center space-x-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }`}
      />
    ))}
  </div>
);

// Helper component for statistic cards
interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div
    className={`p-6 rounded-xl shadow-lg border border-opacity-20 ${color} transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] bg-[#1c2a3b]`}
    style={{ borderColor: "#efa765" }}
  >
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div
        className="p-3 rounded-full bg-opacity-10"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
    </div>
  </div>
);

// --- Main Component Start ---
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/reviews");
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch reviews."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // --- Statistics Calculation ---
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
  // --- End Statistics Calculation ---

  // --- Action Handlers (Kept from original) ---
  const handleToggleApproval = async (
    reviewId: string,
    currentStatus: boolean
  ) => {
    setIsActionLoading(true);
    try {
      const response = await axios.patch(`/api/reviews/${reviewId}`, {
        isApproved: !currentStatus,
      });
      toast.success(response.data.message);
      setReviews((prevReviews: any) =>
        prevReviews.map((review: any) =>
          review._id === reviewId
            ? { ...review, isApproved: !currentStatus }
            : review
        )
      );
    } catch (error) {
      console.error("Failed to update review status:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update review status."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: any) => {
    setIsActionLoading(true);
    try {
      const response = await axios.delete(`/api/reviews/${reviewId}`);
      toast.success(response.data.message);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );
    } catch (error) {
      console.error("Failed to delete review:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to delete review."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReviewClick = (review: IReview) => {
    setSelectedReview(review);
    setIsReviewDialogOpen(true);
  };
  // --- End Action Handlers ---

  // Rating Distribution Bar Component
  const RatingBar = ({
    rating,
    count,
    percentage,
  }: {
    rating: number;
    count: number;
    percentage: number;
  }) => (
    <div className="flex items-center space-x-4 text-sm">
      <div className="w-8 shrink-0 text-gray-400">
        {rating} <span className="text-yellow-400">★</span>
      </div>
      <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#efa765] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="w-12 text-right shrink-0 font-medium text-white">
        {percentage}%
      </div>
      <div className="w-10 text-right shrink-0 text-gray-400 text-xs">
        ({count})
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen text-white p-4 md:p-8 lg:p-12 yeseva-one">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1
              className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tighter"
              style={{ color: "rgb(239, 167, 101)" }}
            >
              Review Hub Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Centralized management and analytics for customer feedback.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Reviews"
              value={isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalReviews} 
              icon={<MessageSquare className="h-6 w-6 text-[#efa765]" />}
              color="#efa765"
            />
            <StatCard
              title="Average Rating"
              value={isLoading ? "-" : stats.averageRating}
              icon={<Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />}
              color="#facc15" // yellow-400
            />
            <StatCard
              title="Approved Reviews"
              value={isLoading ? "-" : stats.approvedCount}
              icon={<ThumbsUp className="h-6 w-6 text-green-500" />}
              color="#22c55e" // green-500
            />
            <StatCard
              title="Pending Reviews"
              value={isLoading ? "-" : stats.pendingCount}
              icon={<Clock className="h-6 w-6 text-red-400" />}
              color="#f87171" // red-400
            />
          </div>
          
          {/* Rating Distribution & Summary */}
          <div className="bg-[#141f2d] rounded-xl p-6 shadow-xl mb-10 border border-[#efa765] border-opacity-30">
            <h2 className="flex items-center text-2xl font-semibold mb-6 text-[#efa765]">
              <BarChart className="h-6 w-6 mr-2" /> Rating Breakdown
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Summary Score (Left Column) */}
              <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-700 pb-6 lg:pb-0 lg:pr-8">
                <p className="text-6xl font-extrabold text-[#efa765]">
                  {isLoading ? "..." : stats.averageRating}
                </p>
                <div className="my-2">
                  <StarRatingDisplay rating={Math.round(stats.averageRating)} />
                </div>
                <p className="text-gray-400 text-sm">
                  Based on {stats.totalReviews} total reviews.
                </p>
              </div>

              {/* Distribution Bars (Right Columns) */}
              <div className="lg:col-span-2 space-y-3 pt-4 lg:pt-0">
                {reviews.length === 0 && !isLoading ? (
                  <p className="text-gray-500 text-center col-span-2">
                    No reviews to calculate distribution.
                  </p>
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
          
          {/* Main Reviews Table */}
          <h2 className="text-3xl font-bold mb-4 text-white">Review Queue</h2>
          <div className="rounded-xl border border-[#efa765] bg-[#141f2d] text-white shadow-xl overflow-hidden">
            <div className="min-h-100 max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-[#1c2a3b] text-[#efa765] shadow-md z-10">
                  <TableRow className="border-gray-700">
                    <TableHead className="w-37.5 text-[#efa765] font-bold">
                      Customer
                    </TableHead>
                    <TableHead className="w-50 text-[#efa765] font-bold">
                      Email
                    </TableHead>
                    <TableHead className="w-25 text-center text-[#efa765] font-bold">
                      Rating
                    </TableHead>
                    <TableHead className="text-[#efa765] font-bold">
                      Review Snippet
                    </TableHead>
                    <TableHead className="w-30 text-center text-[#efa765] font-bold">
                      Status
                    </TableHead>
                    <TableHead className="w-37.5 text-center text-[#efa765] font-bold">
                      Date Submitted
                    </TableHead>
                    <TableHead className="w-25 text-center text-[#efa765] font-bold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-[#efa765]" />
                          <span className="ml-4 text-xl text-[#efa765]">
                            Loading reviews...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : reviews.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-gray-400"
                      >
                        <CheckCircle2 className="h-6 w-6 inline mr-2 text-green-500" />
                        No reviews found yet. The queue is empty.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reviews.map((review) => (
                      <TableRow
                        key={review._id.toString()}
                        className="border-gray-800 hover:bg-[#1c2a3b]/50 transition-colors"
                      >
                        <TableCell className="font-medium text-white">
                          {review.name}
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">
                          {review.email}
                        </TableCell>
                        <TableCell className="text-center text-yellow-400">
                          <StarRatingDisplay rating={review.rating} />
                        </TableCell>
                        <TableCell
                          className="text-gray-400 truncate max-w-50 cursor-pointer hover:text-[#efa765] transition-colors"
                          onClick={() => handleReviewClick(review)}
                        >
                          {review.review}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              review.isApproved ? "default" : "destructive"
                            }
                            className={`px-3 py-1 text-sm ${
                              review.isApproved
                                ? "bg-green-700/20 text-green-300 border-green-700/40 hover:bg-green-700/10"
                                : "bg-red-700/20 text-red-300 border-red-700/40 hover:bg-red-700/10</TableCell>"
                            }`}
                          >
                            {review.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 text-xs text-center">
                          {format(new Date(review.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            {/* Toggle Approval Button */}
                            <Button
                              variant={
                                review.isApproved ? "destructive" : "default"
                              }
                              size="icon"
                              onClick={() =>
                                handleToggleApproval(
                                  review._id.toString(),
                                  review.isApproved
                                )
                              }
                              disabled={isActionLoading}
                              className="h-8 w-8 transition-colors duration-200"
                              style={{
                                backgroundColor: review.isApproved
                                  ? "#dc2626"
                                  : "#22c55e",
                                color: "white",
                              }}
                            >
                              {isActionLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : review.isApproved ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {review.isApproved ? "Unapprove" : "Approve"}
                              </span>
                            </Button>

                            {/* Delete Confirmation Dialog */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isActionLoading}
                                  className="h-8 w-8 bg-red-700/20 text-red-300 border-red-700/40 hover:bg-red-700/10 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-900 text-white border border-red-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-red-500">
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-300">
                                    This action cannot be undone. This will
                                    permanently delete the review from your
                                    database.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteReview(review._id.toString())
                                    }
                                    className="bg-red-600 text-white hover:bg-red-700"
                                  >
                                    {isActionLoading ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      "Delete"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Full Review Content Dialog (Kept from original) */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-106.25 bg-gray-900 text-white border border-[#efa765]">
          <DialogHeader>
            <DialogTitle className="text-[#efa765] text-2xl font-bold">
              Full Review Details
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-bold text-gray-300">
                    Customer
                  </div>
                  <div className="text-lg text-white font-semibold">
                    {selectedReview.name}
                  </div>
                </div>
                <Badge
                  className={`text-sm py-1 px-3 ${
                    selectedReview.isApproved
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {selectedReview.isApproved ? "Approved" : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-gray-400 border-t border-b border-gray-700 py-3">
                <div className='flex items-center space-x-2'>
                    <Star className='h-4 w-4 text-yellow-400 fill-yellow-400'/>
                    <span className="font-bold text-gray-300">Rating:</span>
                    <span className="text-yellow-400 font-semibold text-lg">
                      {selectedReview.rating} / 5
                    </span>
                </div>
                <div className="text-xs">
                    {format(new Date(selectedReview.createdAt), "dd MMM yyyy")}
                </div>
              </div>

              <div className="text-gray-400">
                <span className="font-bold text-gray-300">Email:</span>{" "}
                {selectedReview.email}
              </div>

              <div className="bg-gray-800 p-4 rounded-lg h-64 overflow-y-auto text-gray-200 border border-gray-700">
                <p className="font-medium text-lg mb-2 text-[#efa765]">Review Content:</p>
                {selectedReview.review}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
