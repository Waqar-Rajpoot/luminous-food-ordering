"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  RefreshCcw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ListOrdered,
  Truck,
  Zap,
  CurrencyIcon,
  Loader2,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
}

type PaymentStatus = "pending" | "paid" | "canceled";
type ShippingProgress = "processing" | "shipped" | "delivered" | "canceled";

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  orderStatus: PaymentStatus;
  shippingProgress: ShippingProgress;
  items: OrderItem[];
}

interface OrderMetrics {
  totalOrders: number;
  totalRevenue: number;
  paidOrders: number;
  pendingShipments: number;
  paymentCounts: Record<PaymentStatus, number>;
  shippingCounts: Record<ShippingProgress, number>;
}

const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    case "canceled":
      return "bg-red-700/20 text-red-300 border-red-700/40";
    case "pending":
    default:
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
  }
};

const getShippingProgressVariant = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500/20 text-green-300 border-green-500/40 border";
    case "shipped":
      return "bg-purple-500/20 text-purple-300 border-purple-500/40 border";
    case "canceled":
    case "cancelled":
      return "bg-red-700/20 text-red-300 border-red-700/40 border";
    case "processing":
    default:
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 border";
  }
};

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => (
  <input
    type="text"
    placeholder="Search by ID or Email..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="px-4 py-2 w-full md:w-80 rounded-full bg-[#141F2D] text-white border border-[#EFA765]/30 focus:ring-2 focus:ring-[#EFA765] focus:border-[#EFA765] transition-all placeholder:text-white/50"
  />
);

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  description,
}) => (
  <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-xl border border-[#EFA765]/20 transition-all hover:shadow-2xl hover:border-white/20">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
      <CardTitle className="text-sm font-medium text-white/70">
        {title}
      </CardTitle>
      <div className={`p-2 rounded-full ${color}/20`}>
        {React.cloneElement(icon as React.ReactElement, {
          className: `h-5 w-5 ${color}`,
        } as React.SVGProps<SVGSVGElement>)}
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <div className="text-3xl font-bold text-[#EFA765]">{value}</div>
      {description && (
        <p className="text-xs text-white/50 mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

interface OrderMetricsProps {
  metrics: OrderMetrics;
}

const OrderMetrics: React.FC<OrderMetricsProps> = ({ metrics }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 col-span-12">
    <MetricCard
      title="Total Orders"
      value={metrics.totalOrders.toString()}
      icon={<ListOrdered />}
      color="text-indigo-400"
      description="All orders received."
    />
    <MetricCard
      title="Total Revenue (PKR)"
      value={formatCurrency(metrics.totalRevenue, "PKR")}
      icon={<CurrencyIcon />}
      color="text-emerald-400"
      description={`${metrics.paidOrders} orders paid.`}
    />
    <MetricCard
      title="Pending Payment"
      value={metrics.paymentCounts.pending.toString()}
      icon={<Clock />}
      color="text-yellow-400"
      description="Awaiting customer confirmation."
    />
    <MetricCard
      title="Processing Shipments"
      value={metrics.shippingCounts.processing.toString()}
      icon={<Zap />}
      color="text-orange-400"
      description="Ready for fulfillment center."
    />
  </div>
);

interface StatusOverviewProps {
  metrics: OrderMetrics;
}

const StatusOverview: React.FC<StatusOverviewProps> = ({ metrics }) => {
  const { paymentCounts, shippingCounts } = metrics;

  const paymentBreakdown: {
    status: PaymentStatus;
    count: number;
    icon: React.ReactNode;
  }[] = [
    {
      status: "paid",
      count: paymentCounts.paid,
      icon: <CheckCircle className="h-4 w-4 text-emerald-400" />,
    },
    {
      status: "pending",
      count: paymentCounts.pending,
      icon: <Clock className="h-4 w-4 text-yellow-400" />,
    },
    {
      status: "canceled",
      count: paymentCounts.canceled,
      icon: <XCircle className="h-4 w-4 text-red-400" />,
    },
  ];

  const shippingBreakdown: {
    status: ShippingProgress;
    count: number;
    icon: React.ReactNode;
  }[] = [
    {
      status: "processing",
      count: shippingCounts.processing,
      icon: <Zap className="h-4 w-4 text-yellow-400" />,
    },
    {
      status: "shipped",
      count: shippingCounts.shipped,
      icon: <Truck className="h-4 w-4 text-purple-400" />,
    },
    {
      status: "delivered",
      count: shippingCounts.delivered,
      icon: <Package className="h-4 w-4 text-green-400" />,
    },
    {
      status: "canceled",
      count: shippingCounts.canceled,
      icon: <XCircle className="h-4 w-4 text-red-400" />,
    },
  ];

  return (
    <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-xl border border-[#EFA765]/20 col-span-12 md:col-span-4 lg:col-span-3">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl font-bold yeseva-one text-white">
          Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <h3 className="text-lg font-semibold text-[#EFA765]">Payment Status</h3>
        <div className="space-y-2">
          {paymentBreakdown.map(({ status, count, icon }) => (
            <div
              key={status}
              className="flex items-center justify-between text-white/90"
            >
              <div className="flex items-center space-x-2">
                {icon}
                <span className="capitalize text-sm">{status}</span>
              </div>
              <span className="font-mono text-sm">{count}</span>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-[#EFA765]/20">
          <h3 className="text-lg font-semibold text-[#EFA765]">
            Shipping Progress
          </h3>
          <div className="space-y-2 mt-2">
            {shippingBreakdown.map(({ status, count, icon }) => (
              <div
                key={status}
                className="flex items-center justify-between text-white/90"
              >
                <div className="flex items-center space-x-2">
                  {icon}
                  <span className="capitalize text-sm">{status}</span>
                </div>
                <span className="font-mono text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ShippingProgressSelectProps {
  order: Order;
  onUpdate: (orderId: string, newProgress: string) => Promise<void>;
}

const ShippingProgressSelect: React.FC<ShippingProgressSelectProps> = ({
  order,
  onUpdate,
}) => (
  <Select
    value={order.shippingProgress}
    onValueChange={(newProgress) => onUpdate(order._id, newProgress)}
  >
    <SelectTrigger
      className={`rounded-full capitalize w-full h-8 text-xs border ${getShippingProgressVariant(
        order.shippingProgress
      )}`}
    >
      <SelectValue placeholder="Progress" />
    </SelectTrigger>
    <SelectContent className="bg-[#1D2B3F] text-[#EFA765] border-[#EFA765]/40">
      <SelectItem value="processing">Processing</SelectItem>
      <SelectItem value="shipped">Shipped</SelectItem>
      <SelectItem value="delivered">Delivered</SelectItem>
      <SelectItem value="canceled">Canceled</SelectItem>
    </SelectContent>
  </Select>
);

interface PaymentStatusSelectProps {
  order: Order;
  onUpdate: (orderId: string, newStatus: string) => Promise<void>;
}

const PaymentStatusSelect: React.FC<PaymentStatusSelectProps> = ({
  order,
  onUpdate,
}) => (
  <Select
    value={order.orderStatus}
    onValueChange={(newStatus) => onUpdate(order._id, newStatus)}
  >
    <SelectTrigger
      className={`rounded-full capitalize w-full h-8 text-xs border ${getStatusVariant(
        order.orderStatus
      )}`}
    >
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent className="bg-[#1D2B3F] text-[#EFA765] border-[#EFA765]/40">
      <SelectItem value="pending">Pending</SelectItem>
      <SelectItem value="paid">Paid</SelectItem>
      <SelectItem value="canceled">Canceled</SelectItem>
    </SelectContent>
  </Select>
);

interface OrderTableRowProps {
  order: Order;
  handleRowClick: (orderId: string) => void;
  handleDeleteClick: (event: React.MouseEvent, order: Order) => void;
  handleUpdateShippingProgress: (
    orderId: string,
    newProgress: string
  ) => Promise<void>;
  handleUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  handleRowClick,
  handleDeleteClick,
  handleUpdateShippingProgress,
  handleUpdateStatus,
}) => {
  const maxItemsToShow = 2;
  const displayedItems = useMemo(
    () =>
      order.items
        .slice(0, maxItemsToShow)
        .map((item) => `${item.name} (${item.quantity})`)
        .join(", "),
    [order.items]
  );

  const remainingItemsCount = order.items.length - maxItemsToShow;
  const suffix = remainingItemsCount > 0 ? `...` : "";

  // Logic for display ID
  const displayId =
    (order.orderId ? order.orderId : order._id).substring(0, 8) + "...";

  const fullItemList = order.items
    .map((i) => `${i.name} (${i.quantity})`)
    .join(", ");

  return (
    <TableRow
      key={order._id}
      className="border-b border-[#1D2B3F]/50 hover:bg-[#1D2B3F]/50 transition-colors"
    >
      {/* Order ID cell (Clickable for details) */}
      <TableCell
        className="font-mono text-xs text-white/80 whitespace-nowrap cursor-pointer hover:underline"
        onClick={() => handleRowClick(order.orderId)}
      >
        {displayId}
      </TableCell>
      <TableCell className="text-sm text-white/70 whitespace-nowrap">
        {new Date(order.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="font-medium text-white whitespace-nowrap">
        {order.customerEmail}
      </TableCell>
      <TableCell className="text-[#3dd878] font-semibold whitespace-nowrap">
        {formatCurrency(order.totalAmount, order.currency)}
      </TableCell>

      <TableCell
        className="text-sm text-white/70 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
        title={fullItemList}
      >
        {displayedItems}
        {suffix}
      </TableCell>

      <TableCell
        onClick={(e) => e.stopPropagation()}
        className="text-sm whitespace-nowrap"
      >
        <ShippingProgressSelect
          order={order}
          onUpdate={handleUpdateShippingProgress}
        />
      </TableCell>

      <TableCell onClick={(e) => e.stopPropagation()}>
        <PaymentStatusSelect order={order} onUpdate={handleUpdateStatus} />
      </TableCell>

      <TableCell className="text-right whitespace-nowrap">
        <Button
          onClick={(e) => handleDeleteClick(e, order)}
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

interface OrderTableProps {
  orders: Order[];
  handleRowClick: (orderId: string) => void;
  handleDeleteClick: (event: React.MouseEvent, order: Order) => void;
  handleUpdateShippingProgress: (
    orderId: string,
    newProgress: string
  ) => Promise<void>;
  handleUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  handleRowClick,
  handleDeleteClick,
  handleUpdateShippingProgress,
  handleUpdateStatus,
}) => (
  <div className="rounded-xl border border-[#EFA765]/20">
    {/* DESKTOP TABLE VIEW */}
    <div className="hidden md:block overflow-x-auto max-h-125 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#1D2B3F] hover:bg-[#1D2B3F] border-b border-[#EFA765]/30 sticky top-0 z-10 shadow-md">
            <TableHead className="text-[#EFA765]">Order ID</TableHead>
            <TableHead className="text-[#EFA765]">Date</TableHead>
            <TableHead className="text-[#EFA765]">Customer</TableHead>
            <TableHead className="text-[#EFA765]">Amount</TableHead>
            <TableHead className="text-[#EFA765]">Items</TableHead>
            <TableHead className="text-[#EFA765]">Shipping</TableHead>
            <TableHead className="text-[#EFA765]">Payment</TableHead>
            <TableHead className="text-[#EFA765] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <OrderTableRow
              key={order._id}
              order={order}
              handleRowClick={handleRowClick}
              handleDeleteClick={handleDeleteClick}
              handleUpdateShippingProgress={handleUpdateShippingProgress}
              handleUpdateStatus={handleUpdateStatus}
            />
          ))}
        </TableBody>
      </Table>
    </div>

    {/* MOBILE CARD VIEW */}
    <div className="md:hidden flex flex-col gap-4 p-4 bg-[#141F2D]">
      {orders.map((order) => (
        <Card key={order._id} className="bg-[#1D2B3F] border border-[#EFA765]/30 p-4 rounded-2xl">
          <div className="flex justify-between items-start">
            <div onClick={() => handleRowClick(order.orderId)} className="cursor-pointer">
              <p className="text-[#EFA765] font-mono text-xs">{(order.orderId || order._id).substring(0, 18)}</p>
              <p className="text-white text-[12px] font-bold">{order.customerEmail.substring(0, 15)}...</p>
            </div>
            <Button
              onClick={(e) => handleDeleteClick(e, order)}
              variant="ghost" size="icon" className="text-red-500 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between mb-2 ">
            <div>
              <p className="text-white/50 text-[10px] uppercase">Amount</p>
              <p className="text-[#3dd878] font-bold text-[12px]">{formatCurrency(order.totalAmount, order.currency)}</p>
            </div>
            <div>
              <p className="text-white/50 text-[10px] uppercase">Date</p>
              <p className="text-white/80 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-white/50 text-[10px] uppercase mb-1">Shipping</p>
              <ShippingProgressSelect order={order} onUpdate={handleUpdateShippingProgress} />
            </div>
            <div>
              <p className="text-white/50 text-[10px] uppercase mb-1">Payment</p>
              <PaymentStatusSelect order={order} onUpdate={handleUpdateStatus} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
interface ConfirmDeleteModalProps {
  orderToDelete: Order | null;
  handleDeleteOrder: () => Promise<void>;
  setShowConfirmModal: (show: boolean) => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  orderToDelete,
  handleDeleteOrder,
  setShowConfirmModal,
}) => {
  if (!orderToDelete) return null;

  const displayId =
    (orderToDelete.orderId || orderToDelete._id).substring(0, 8) + "...";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-2xl border border-[#EFA765]/20 max-w-sm w-full text-[#EFA765]">
        <CardHeader>
          <CardTitle className="text-2xl">Confirm Deletion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-white">
            Are you sure you want to delete order #
            <span className="font-bold">{displayId}</span>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setShowConfirmModal(false)}
              className="bg-gray-500/20 text-white hover:bg-gray-500/40 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteOrder}
              className="bg-red-600 text-white hover:bg-red-700 rounded-full"
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ManagementHeaderProps {
  fetchOrders: () => void;
}

const ManagementHeader: React.FC<ManagementHeaderProps> = ({ fetchOrders }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 col-span-12">
    <h1 className="text-4xl font-extrabold yeseva-one text-[#EFA765]">
      Global Order Dashboard
    </h1>
    <Button
      onClick={fetchOrders}
      className="bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full shadow-lg"
    >
      <RefreshCcw className="h-4 w-4 mr-2" />
      Synchronize Data
    </Button>
  </div>
);

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Removed [recentSearchTerm, setRecentSearchTerm] state

  const handleRowClick = (orderId: string) => {
    // In a production application, this should navigate to the order details page.
    console.log(`Simulating navigation to /order-details/${orderId}`);
    window.location.href = `/order-details/${orderId}`;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/orders");

      if (!response.ok) {
        console.error("Failed to fetch orders with status:", response.status);
        setOrders([]);
        throw new Error("Failed to load orders from server.");
      }

      const rawData: any[] = await response.json();

      // Ensure data conforms to the Order interface structure
      const processedOrders: Order[] = rawData
        .map((item) => ({
          _id: item._id || item.id,
          orderId: item.orderId || item.externalId,
          createdAt: item.createdAt,
          customerEmail: item.customerEmail,
          totalAmount: item.totalAmount || 0,
          currency: item.currency || "USD",
          items: item.items || [],
          orderStatus: (item.orderStatus || "pending") as PaymentStatus,
          shippingProgress: (item.shippingProgress ||
            "processing") as ShippingProgress,
        }))
        .filter((order) => order._id);

      setOrders(processedOrders);
    } catch (error) {
      console.error("Error during fetch operation:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculate Metrics based on current orders state
  const metrics: OrderMetrics = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc.totalOrders++;

        acc.paymentCounts[order.orderStatus] =
          (acc.paymentCounts[order.orderStatus] || 0) + 1;
        acc.shippingCounts[order.shippingProgress] =
          (acc.shippingCounts[order.shippingProgress] || 0) + 1;

        if (order.orderStatus === "paid") {
          acc.totalRevenue += order.totalAmount;
          acc.paidOrders++;
        }

        if (
          order.shippingProgress === "processing" ||
          order.shippingProgress === "shipped"
        ) {
          if (order.orderStatus !== "canceled") {
            acc.pendingShipments++;
          }
        }

        return acc;
      },
      {
        totalOrders: 0,
        totalRevenue: 0,
        paidOrders: 0,
        pendingShipments: 0,
        paymentCounts: { paid: 0, pending: 0, canceled: 0 },
        shippingCounts: {
          processing: 0,
          shipped: 0,
          delivered: 0,
          canceled: 0,
        },
      } as OrderMetrics
    );
  }, [orders]);

  const updateOrderInState = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const sortedOrders = useMemo(() => {
    return orders
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) {
      return sortedOrders;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();

    return sortedOrders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(lowerCaseSearch) ||
        order.customerEmail.toLowerCase().includes(lowerCaseSearch) ||
        order._id.toLowerCase().includes(lowerCaseSearch)
    );
  }, [sortedOrders, searchTerm]);

  const recentOrders = useMemo(() => {
    const twentyFourHoursAgo = new Date().getTime() - 24 * 60 * 60 * 1000;

    return filteredOrders // Filter the already-searched list for recency
      .filter(
        (order) => new Date(order.createdAt).getTime() >= twentyFourHoursAgo
      );
  }, [filteredOrders]); // Depend on filteredOrders now

  // --- API MUTATION HANDLERS ---

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: string
  ): Promise<void> => {
    const originalOrders = [...orders];
    updateOrderInState(orderId, {
      orderStatus: newStatus as Order["orderStatus"],
    });

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (!response.ok) {
        setOrders(originalOrders);
        throw new Error("Failed to update order status on server.");
      }
    } catch (error) {
      console.error(error);
      setOrders(originalOrders); // Rollback
    }
  };

  const handleUpdateShippingProgress = async (
    orderId: string,
    newProgress: string
  ): Promise<void> => {
    const originalOrders = [...orders];
    updateOrderInState(orderId, {
      shippingProgress: newProgress as Order["shippingProgress"],
    });

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingProgress: newProgress }),
      });

      if (!response.ok) {
        setOrders(originalOrders);
        throw new Error("Failed to update shipping progress on server.");
      }
    } catch (error) {
      console.error(error);
      setOrders(originalOrders);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent, order: Order) => {
    event.stopPropagation();
    setOrderToDelete(order);
    setShowConfirmModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    const orderIdToDelete = orderToDelete._id;
    const originalOrders = [...orders];

    // Optimistic deletion
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderIdToDelete)
    );

    try {
      const response = await fetch(`/api/orders/${orderIdToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setOrders(originalOrders);
        throw new Error("Failed to delete order on server.");
      }

      setShowConfirmModal(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error(error);
      setOrders(originalOrders); // Rollback
      setShowConfirmModal(false);
      setOrderToDelete(null);
    }
  };

  // --- MAIN RENDER ---
  return (
    <>
      <div className="min-h-screen bg-[#141F2D] p-4 sm:pt-10 text-[#EFA765] font-sans sm:p-6 md:p-10">
        {/* TOP HEADER */}
        <div className="mb-8 border-b border-[#EFA765]/20 pb-4">
          <ManagementHeader fetchOrders={fetchOrders} />
        </div>

        {/* LOADING STATE */}
        {loading ? (
           <div className="flex flex-col justify-center items-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#efa765]" />
        <p className="mt-4 text-slate-400 font-medium tracking-widest uppercase text-[10px]">Syncing Orders Data...</p>
      </div>
        ) : (
          // GRID LAYOUT FOR METRICS AND TABLES
          <div className="grid grid-cols-12 gap-6">
            {/* KPI METRICS (4 CARDS) */}
            <OrderMetrics metrics={metrics} />

            {/* STATUS OVERVIEW (LEFT COLUMN ON DESKTOP) */}
            <StatusOverview metrics={metrics} />

            {/* RECENT ORDERS TABLE (MAIN COLUMN ON DESKTOP) */}
            <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-xl border border-[#EFA765]/20 col-span-12 md:col-span-8 lg:col-span-9">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 p-0 mb-4">
                <CardTitle className="text-2xl font-bold yeseva-one text-white">
                  Recent Orders (Last 24 Hours)
                </CardTitle>
                <div className="w-full md:w-auto">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentOrders.length > 0 ? (
                  <OrderTable
                    orders={recentOrders}
                    handleRowClick={handleRowClick}
                    handleDeleteClick={handleDeleteClick}
                    handleUpdateShippingProgress={handleUpdateShippingProgress}
                    handleUpdateStatus={handleUpdateStatus}
                  />
                ) : (
                  <div className="text-center text-white/70 py-5">
                    <p>
                      {searchTerm
                        ? `No recent orders match "${searchTerm}".`
                        : "No new orders placed in the last 24 hours."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ALL ORDERS TABLE (FULL WIDTH BOTTOM) */}
            <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-xl border border-[#EFA765]/20 col-span-12 mt-4">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 p-0 mb-4">
                <CardTitle className="text-2xl font-bold yeseva-one text-white">
                  All Orders History
                </CardTitle>
                <div className="w-full md:w-auto">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredOrders.length > 0 ? (
                  <OrderTable
                    orders={filteredOrders}
                    handleRowClick={handleRowClick}
                    handleDeleteClick={handleDeleteClick}
                    handleUpdateShippingProgress={handleUpdateShippingProgress}
                    handleUpdateStatus={handleUpdateStatus}
                  />
                ) : (
                  <div className="text-center text-white/70 py-10">
                    <p>
                      {searchTerm
                        ? `No orders found matching "${searchTerm}".`
                        : "The full order history is empty."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        orderToDelete={orderToDelete}
        handleDeleteOrder={handleDeleteOrder}
        setShowConfirmModal={() => {
        setShowConfirmModal(false);
        setOrderToDelete(null);
      }}
      />
    </>
  );
};

export default OrderPage;