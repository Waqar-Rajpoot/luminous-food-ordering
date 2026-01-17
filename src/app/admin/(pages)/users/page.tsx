"use client";

import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Users,
  Search,
  User,
  Shield,
  Briefcase,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- INTERFACES ---

interface IUser {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean; // Changed to boolean for clarity
  role: "admin" | "manager" | "staff" | "user";
  createdAt: string; // ISO Date string
}

interface UserStats {
  total: number;
  admin: number;
  manager: number;
  staff: number;
  user: number;
}

interface UsersResponse {
  users: IUser[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  stats: UserStats;
}

interface ErrorResponse {
  message?: string;
}

export default function AdminUsersPage() {
  // --- STATE ---
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null); // Track loading state by user ID

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | IUser["role"]>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const router = useRouter();

  const [stats, setStats] = useState<UserStats>({
    total: 0,
    admin: 0,
    manager: 0,
    staff: 0,
    user: 0,
  });

  const fetchUsers = useCallback(
    async (page: number, search: string, role: string) => {
      setIsLoading(true);
      try {
        const response = await axios.get<UsersResponse>(`/api/users`, {
          params: {
            page,
            search,
            role,
          },
        });

        setUsers(response.data.users);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalUsers(response.data.totalUsers);
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        const axiosError = error as AxiosError<ErrorResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to fetch users."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // Debounce the search term slightly to avoid too many API calls
    const handler = setTimeout(() => {
      fetchUsers(currentPage, searchTerm, filterRole);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [currentPage, searchTerm, filterRole, fetchUsers]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleRoleFilterChange = (role: "all" | IUser["role"]) => {
    setFilterRole(role);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handleRedirectToDashboard = (user: IUser) => {

    const userId = user._id;
    if (user?.role === "user") {
      router.push(`/user-dashboard/${userId}`);
    }else if (user?.role === "manager") {
      router.push(`/manager-dashboard/${userId}`);
    } else if (user?.role === "staff") {
      router.push(`/staff-dashboard/${userId}`);
    }
  };

  // --- NEW: API ACTION HANDLERS ---

  const handleUpdateRole = async (userId: string, newRole: IUser["role"]) => {
    setIsActionLoading(userId);
    try {
      await axios.patch(`/api/users/${userId}`, { role: newRole });
      toast.success(`User role updated to ${newRole}.`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      // Refetch stats after role change
      fetchUsers(currentPage, searchTerm, filterRole);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update role."
      );
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsActionLoading(userId);
    try {
      await axios.delete(`/api/users/${userId}`);
      toast.success("User successfully deleted.");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setTotalUsers((prev) => prev - 1); // Decrement total user count
      // Optionally refetch all data to ensure stats and pagination are accurate
      fetchUsers(currentPage, searchTerm, filterRole);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to delete user."
      );
    } finally {
      setIsActionLoading(null);
    }
  };

  // --- UI HELPER FUNCTIONS ---

  const roleBadgeClasses = (role: IUser["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-700/20 text-red-300 border-red-700/40 border";
      case "manager":
        return "bg-blue-700/20 text-blue-300 border-blue-700/40 border";
      case "staff":
        return "bg-green-700/20 text-green-300 border-green-700/40 border";
      case "user":
      default:
        return "bg-yellow-700/20 text-yellow-300 border-yellow-700/40 border";
    }
  };

  const roleFilterButtonClasses = (role: "all" | IUser["role"]) =>
    `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
      filterRole === role
        ? "bg-[#efa765] text-gray-900 shadow-lg"
        : "bg-[#1c2a3b] text-[#efa765] hover:bg-[#2a3c4f]"
    }`;

  const StatCard = ({
    title,
    value,
    icon,
    iconColor,
    description,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconColor: string;
    description: string;
  }) => (
    <Card className="bg-[#1c2a3b] border-[#efa765]/50 hover:border-[#efa765]/70 transition-all shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={`${iconColor}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-[#efa765]">{value}</div>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="flex-1 flex flex-col p-4 md:p-6 md:pt-16 lg:pt-20 min-h-screen">
        <div className="mb-8">
          <h1
            className="yeseva-one text-4xl font-bold mb-2 tracking-wide text-white"
            style={{ color: "rgb(239, 167, 101)" }}
          >
            User Management Dashboard
          </h1>
          <p className="text-gray-400">
            View, filter, and manage all user accounts here.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-10">
          <StatCard
            title="Total Accounts"
            value={stats.total}
            icon={<Users className="h-5 w-5" />}
            iconColor="text-[#efa765]"
            description={`Showing ${users.length} of ${totalUsers} total.`}
          />
          <StatCard
            title="Admins"
            value={stats.admin}
            icon={<Shield className="h-5 w-5" />}
            iconColor="text-red-500"
            description="Highest level of access"
          />
          <StatCard
            title="Managers"
            value={stats.manager}
            icon={<Briefcase className="h-5 w-5" />}
            iconColor="text-blue-400"
            description="Mid-level operational control"
          />
          <StatCard
            title="Staff"
            value={stats.staff}
            icon={<UserCheck className="h-5 w-5" />}
            iconColor="text-green-500"
            description="Day-to-day access"
          />
          <StatCard
            title="Basic Users"
            value={stats.user}
            icon={<User className="h-5 w-5" />}
            iconColor="text-yellow-500"
            description="Standard customer accounts"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 rounded-lg bg-[#1c2a3b] border border-[#efa765]/30">
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 rounded-md bg-[#0d141b] text-white border border-[#efa765]/50 focus:border-[#efa765]"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1">
            <button
              onClick={() => handleRoleFilterChange("all")}
              className={roleFilterButtonClasses("all")}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => handleRoleFilterChange("admin")}
              className={roleFilterButtonClasses("admin")}
            >
              Admin ({stats.admin})
            </button>
            <button
              onClick={() => handleRoleFilterChange("manager")}
              className={roleFilterButtonClasses("manager")}
            >
              Manager ({stats.manager})
            </button>
            <button
              onClick={() => handleRoleFilterChange("staff")}
              className={roleFilterButtonClasses("staff")}
            >
              Staff ({stats.staff})
            </button>
            <button
              onClick={() => handleRoleFilterChange("user")}
              className={roleFilterButtonClasses("user")}
            >
              User ({stats.user})
            </button>
          </div>
        </div>
        <div className="rounded-xl border border-[#efa765] bg-[#141f2d]/30 text-white overflow-hidden shadow-2xl flex-grow">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-[#1c2a3b] text-[#efa765] shadow-md z-10">
                <TableRow className="border-gray-700">
                  <TableHead className="w-[200px] text-[#efa765] font-bold">
                    ID
                  </TableHead>
                  <TableHead className="w-[200px] text-[#efa765] font-bold">
                    Name
                  </TableHead>
                  <TableHead className="text-[#efa765] font-bold">
                    Email
                  </TableHead>
                  <TableHead className="w-[120px] text-[#efa765] font-bold">
                    Status
                  </TableHead>
                  <TableHead className="w-[150px] text-center text-[#efa765] font-bold">
                    Role
                  </TableHead>
                  <TableHead className="w-[180px] text-[#efa765] font-bold">
                    Joined Date
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-[#efa765] font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#efa765]" />
                        <span className="ml-4 text-xl text-[#efa765]">
                          Loading users...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-400"
                    >
                      No users match the current filter and search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user._id}
                      className="border-gray-700 hover:bg-[#1c2a3b] transition-colors duration-150"
                    >
                      <TableCell className="font-medium text-white truncate max-w-[200px]">
                        <button
                          className="text-left hover:underline hover: cursor-pointer"
                          // ⬅️ CHANGE: Replaced existing onClick with redirect function
                          onClick={() => handleRedirectToDashboard(user)}
                        >
                          {user._id.substring(0, 12)}...
                        </button>
                      </TableCell>
                      <TableCell className="font-medium text-white truncate max-w-[200px]">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-gray-300 truncate">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isVerified ? "default" : "destructive"}
                          className={`px-3 py-2 text-xs font-semibold uppercase ${
                            user.isVerified
                              ? "bg-green-700/20 text-green-300 border-green-700/40"
                              : "bg-red-700/20 text-red-300 border-red-700/40"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Select
                          value={user.role}
                          onValueChange={(newRole: IUser["role"]) =>
                            handleUpdateRole(user._id, newRole)
                          }
                          disabled={isActionLoading === user._id}
                        >
                          <SelectTrigger
                            className={`w-[120px] mx-auto text-xs font-semibold capitalize border-none focus:ring-0 focus:ring-offset-0 ${roleBadgeClasses(user.role)}`}
                          >
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 text-white border-gray-700">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isActionLoading === user._id}
                              className="h-8 w-8 text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                            >
                              {isActionLoading === user._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-900 text-white border border-red-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-red-500">
                                Are you sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                This action cannot be undone. This will
                                permanently delete the user account for{" "}
                                <strong>{user.name}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user._id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-end items-center mt-6 p-4 rounded-lg bg-[#141f2d] border border-[#efa765]/30">
          <span className="text-gray-400 mr-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <span className="text-gray-400 mr-6 text-sm">
            Total Users: {totalUsers}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            variant="ghost"
            size="icon"
            className="text-[#efa765] hover:bg-[#efa765]/10 h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            variant="ghost"
            size="icon"
            className="text-[#efa765] hover:bg-[#efa765]/10 h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
