"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CalendarDays, ShoppingCart, Star } from "lucide-react"; // Added Star for the new chart title
import React from "react";
import {
  Bar,
  ResponsiveContainer,
  Tooltip,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label,
} from "recharts";

const chartData = [
  {
    month: "Jan",
    reviews: 186,
    orders: 45,
    bookings: 10,
    contactMessages: 5,
  },
  {
    month: "Feb",
    reviews: 305,
    orders: 70,
    bookings: 15,
    contactMessages: 8,
  },
  {
    month: "Mar",
    reviews: 237,
    orders: 85,
    bookings: 20,
    contactMessages: 7,
  },
  { month: "Apr", reviews: 73, orders: 60, bookings: 12, contactMessages: 3 },
  { month: "May", reviews: 209, orders: 105, bookings: 18, contactMessages: 6 },
  { month: "Jun", reviews: 214, orders: 90, bookings: 15, contactMessages: 9 },
  { month: "Jul", reviews: 114, orders: 95, bookings: 25, contactMessages: 4 },
  {
    month: "Aug",
    reviews: 234,
    orders: 75,
    bookings: 33,
    contactMessages: 8,
  },
  {
    month: "Sep",
    reviews: 284,
    orders: 65,
    bookings: 45,
    contactMessages: 10,
  },
  {
    month: "Oct",
    reviews: 224,
    orders: 92,
    bookings: 40,
    contactMessages: 7,
  },
  {
    month: "Nov",
    reviews: 234,
    orders: 63,
    bookings: 37,
    contactMessages: 9,
  },
  {
    month: "Dec",
    reviews: 294,
    orders: 71,
    bookings: 50,
    contactMessages: 12,
  },
];

const orderStatusData = [
  { name: "Completed", value: 750 },
  { name: "Pending", value: 200 },
  { name: "Cancelled", value: 50 },
];

// Dummy data for rating breakdown to demonstrate the Pie Chart
const ratingBreakdownData = [
  { name: "5 Stars", value: 400 },
  { name: "4 Stars", value: 250 },
  { name: "3 Stars", value: 150 },
  { name: "2 Stars", value: 80 },
  { name: "1 Star", value: 20 },
];

// New dummy data for booking breakdown
const bookingStatusData = [
  { name: "Confirmed", value: 300 },
  { name: "Pending", value: 70 },
  { name: "Cancelled", value: 30 },
];

const RATING_COLORS = ["#10B981", "#FACC15", "#FB923C", "#F87171", "#EF4444"];
const ORDER_STATUS_COLORS = ["#38bdf8", "#FFBB28", "#FF8042"];
const BOOKING_COLORS = ["#A855F7", "#6366F1", "#EC4899"];

const Chart = () => {
  return (
    <>
      {/* Monthly Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-10">
        {/* Monthly Orders Bar Chart */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-[#38bdf8]">
              <div className="flex items-center justify-center space-x-2">
                <ShoppingCart className="h-6 w-6 text-[#38bdf8]" />
                <span>Orders Per Month</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                  stroke="#a0aec0"
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis stroke="#a0aec0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    border: "1px solid #4a5568",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="orders" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Orders Status Pie Chart */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-[#38bdf8]">
              <div className="flex items-center justify-center space-x-2">
                <ShoppingCart className="h-6 w-6 text-[#38bdf8]" />
                <span>Order Status Breakdown</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length]
                      }
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="font-bold text-xl"
                              fill="#38bdf8"
                            >
                              100
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="font-bold text-xl"
                              fill="#38bdf8"
                            >
                              Orders
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    border: "1px solid #4a5568",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value, name) => [`${value} orders`, name]}
                />
                <Legend
                  wrapperStyle={{ color: "#a0aec0" }}
                  formatter={(value) => (
                    <span style={{ color: "#fff" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="mx-auto">
            <div className="flex">
              <span className="text-center gap-2 mb-3 text-sm">
                <span>Completed</span>
                <span className="rounded-full px-2 text-sm bg-[#38bdf8] text-white ml-1">
                  0
                </span>
              </span>
              <span className="ml-8 mb-3 text-sm">
                <span>Pending</span>
                <span className="ml-1 rounded-full px-2 text-sm bg-[#FFBB28] text-white">
                  0
                </span>
              </span>
              <span className="ml-8 mb-3 text-sm">
                <span>Cancelled</span>
                <span className="ml-1 rounded-full px-2 text-sm bg-[#FF8042] text-white">
                  0
                </span>
              </span>
            </div>
          </div>
        </Card>
        {/* Monthly Reviews Bar Chart */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-[#efa765]">
              <div className="flex items-center justify-center space-x-2">
                <BarChart className="h-6 w-6 text-[#efa765]" />
                <span>Reviews Per Month</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                  stroke="#a0aec0"
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis stroke="#a0aec0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    border: "1px solid #4a5568",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="reviews" fill="#efa765" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* New Review Rating Breakdown Pie Chart */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-[#efa765]">
              <div className="flex items-center justify-center space-x-2">
                <Star className="h-6 w-6 text-[#efa765] fill-[#efa765]" />{" "}
                {/* Star icon for ratings */}
                <span>Review Rating Breakdown</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="font-bold text-xl"
                              fill="#efa765"
                            >
                              100
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="font-bold text-xl"
                              fill="#efa765"
                            >
                              Reviews
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                  {ratingBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RATING_COLORS[index % RATING_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    border: "1px solid #4a5568",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value, name) => [`${value} reviews`, name]}
                />
                <Legend
                  wrapperStyle={{ color: "#a0aec0" }}
                  formatter={(value) => (
                    <span style={{ color: "#fff" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="mx-auto">
            <div className="flex">
              <span className="text-center gap-2 mb-3 text-sm">
                <span>5 Stars</span>
                <span className="rounded-full px-2 text-sm bg-[#10B981] text-white ml-1">
                  0
                </span>
              </span>
              <span className="ml-8 mb-3 text-sm">
                <span>4 Stars</span>
                <span className="ml-1 rounded-full px-2 text-sm bg-[#FACC15] text-white">
                  0
                </span>
              </span>
              <span className="ml-8 mb-3 text-sm">
                <span>3 Stars</span>
                <span className="ml-1 rounded-full px-2 text-sm bg-[#FB923C] text-white">
                  0
                </span>
              </span>
            </div>
            <div>
              <span className="mb-3 text-sm">
                <span>2 Stars</span>
                <span className="ml-1 rounded-full px-2 text-sm bg-[#F87171] text-white">
                  0
                </span>
              </span>
              <span className="ml-8 mb-3 text-sm">
                <span>1 Star</span>
                <span className="ml-1 rounded-full px-2 text-sm bg-[#EF4444] text-white">
                  0
                </span>
              </span>
            </div>
          </div>
        </Card>
        {/* Monthly Bookings Bar Chart */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-[#a855f7]">
              <div className="flex items-center justify-center space-x-2">
                <CalendarDays className="h-6 w-6 text-[#a855f7]" />
                <span>Bookings Per Month</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                  stroke="#a0aec0"
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis stroke="#a0aec0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    border: "1px solid #4a5568",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="bookings" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* New Booking Breakdown Pie Chart */}
        <Card className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-[#a855f7]">
              {" "}
              {/* Using a color that aligns with bookings */}
              <div className="flex items-center justify-center space-x-2">
                <CalendarDays className="h-6 w-6 text-[#a855f7]" />
                <span>Booking Status Breakdown</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BOOKING_COLORS[index % BOOKING_COLORS.length]}
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="font-bold text-xl"
                              fill="#a855f7"
                            >
                              100
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="font-bold text-xl"
                              fill="#a855f7"
                            >
                              Bookings
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    border: "1px solid #4a5568",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value, name) => [`${value} bookings`, name]}
                />
                <Legend
                  wrapperStyle={{ color: "#a0aec0" }}
                  formatter={(value) => (
                    <span style={{ color: "#fff" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="mx-auto">
            <div className="flex">
              <span className="text-center gap-2 mb-3 text-sm">
                <span>Confirmed</span>
                <span className="rounded-full px-2 text-sm bg-[#A855F7] text-white ml-1">
                  0
                </span>
              </span>
              <span className="ml-8 mb-3 text-sm">
                <span>Pending</span>
                <span className="ml-1 rounded-full px-2 text-sm bg-[#6366F1] text-white">
                  0
                </span>
              </span>
              <span className="ml-8 mb-3 text-sm">
                <span>Cancelled</span>
                <span className="ml-1 rounded-full px-2 text-sm bg-[#EC4899] text-white">
                  0
                </span>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Chart;
