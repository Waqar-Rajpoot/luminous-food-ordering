"use client";

import { useEffect, useState } from "react";
import { Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2 } from "lucide-react";
import axios, { AxiosResponse } from "axios";

import Link from "next/link";
import {
  Utensils,
  Box,
  MessageSquare,
  CalendarCheck,
  ListOrdered,
} from "lucide-react";
import OverviewCards from "./components/OverviewCards";
import ReviewsChart from "./components/Charts";
import UserProfile from "@/components/user-dashboard/UserProfile";
import { useSession } from "next-auth/react";

interface DashboardStatsData {
  reviews: number;
  products: number;
  bookings: number;
  orders: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const user: any = session?.user;
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response: AxiosResponse<ApiResponse<DashboardStatsData>> =
          await axios.get("/api/count");

        if (response.data.success && response.data.data) {
          setStats(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch dashboard data.");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data.message || "Server error");
          } else {
            setError(err.message);
          }
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-[#efa765]" />
        <span className="ml-4 text-xl">Loading Dashboard...</span>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen p-6 rounded-xl sm:p-10 text-white font-sans">
        <div className="max-w-7xl mx-auto">
        <UserProfile user={user} />
          <div className="text-center mb-10">
          </div>
          {error && (
            <div className="text-center p-4 mb-4 text-red-500 bg-red-900 rounded-lg">
              <p className="text-xl font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          <OverviewCards data={stats} />
          <ReviewsChart />
        </div>
      </div>
      {/* Pages */}
      <div className="min-h-screen bg-[#141f2d] p-8 text-white">
        <h1 className="yeseva-one text-[rgb(239,167,101)] text-5xl font-bold text-center mb-12 drop-shadow-lg second-heading">
          Admin Pages
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Menu Management Card */}
          <Link href="/admin/menu-management" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <Utensils className="mr-3 h-7 w-7" /> Menu Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  Manage menu categories and their associated products.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Product Management Card */}
          <Link href="/admin/product-management" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <Box className="mr-3 h-7 w-7" /> Product Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  Oversee all individual products, inventory, and pricing.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Contact Messages Card */}
          <Link href="/admin/messages" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <MessageSquare className="mr-3 h-7 w-7" /> Contact Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  Review and respond to inquiries from the contact form.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Order Management Card */}
          <Link href="/admin/orders" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <ListOrdered className="mr-3 h-7 w-7" /> Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  View and manage all customer orders.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* User Reviews Card */}
          <Link href="/admin/reviews" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <Star className="mr-3 h-7 w-7" /> User Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  View and manage customer feedback and ratings.
                </p>
              </CardContent> 
            </Card>
          </Link>

          {/* User Management Card */}
          <Link href="/admin/users" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <Users className="mr-3 h-7 w-7" /> User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  Manage user accounts, permissions, and roles.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Booked Tables Card */}
          <Link href="/admin/bookings" className="block">
            <Card className="bg-card-background/90 backdrop-blur-sm border-[#efa765] text-white hover:border-white transition-colors cursor-pointer min-h-[180px]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#efa765]">
                  <CalendarCheck className="mr-3 h-7 w-7" /> Booked Tables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg">
                  Manage and track all table reservations.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}