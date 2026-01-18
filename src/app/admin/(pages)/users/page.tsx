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
  Calendar,
  Mail,
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
  isVerified: boolean;
  role: "admin" | "manager" | "staff" | "user";
  createdAt: string;
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
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
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

  const fetchUsers = useCallback(async (page: number, search: string, role: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get<UsersResponse>(`/api/users`, {
        params: { page, search, role },
      });
      setUsers(response.data.users);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalUsers);
      setStats(response.data.stats);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(currentPage, searchTerm, filterRole);
    }, 300);
    return () => clearTimeout(handler);
  }, [currentPage, searchTerm, filterRole, fetchUsers]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (role: "all" | IUser["role"]) => {
    setFilterRole(role);
    setCurrentPage(1);
  };

  const handleRedirectToDashboard = (user: IUser) => {
    const userId = user._id;
    if (user?.role === "user") router.push(`/user-dashboard/${userId}`);
    else if (user?.role === "manager") router.push(`/manager-dashboard/${userId}`);
    else if (user?.role === "staff") router.push(`/staff-dashboard/${userId}`);
  };

  const handleUpdateRole = async (userId: string, newRole: IUser["role"]) => {
    setIsActionLoading(userId);
    try {
      await axios.patch(`/api/users/${userId}`, { role: newRole });
      toast.success(`User role updated to ${newRole}.`);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      fetchUsers(currentPage, searchTerm, filterRole);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update role.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsActionLoading(userId);
    try {
      await axios.delete(`/api/users/${userId}`);
      toast.success("User successfully deleted.");
      fetchUsers(currentPage, searchTerm, filterRole);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Failed to delete user.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const roleBadgeClasses = (role: IUser["role"]) => {
    switch (role) {
      case "admin": return "bg-red-700/20 text-red-300 border-red-700/40 border";
      case "manager": return "bg-blue-700/20 text-blue-300 border-blue-700/40 border";
      case "staff": return "bg-green-700/20 text-green-300 border-green-700/40 border";
      default: return "bg-yellow-700/20 text-yellow-300 border-yellow-700/40 border";
    }
  };

  const roleFilterButtonClasses = (role: "all" | IUser["role"]) =>
    `px-3 py-1.5 text-xs md:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
      filterRole === role
        ? "bg-[#efa765] text-gray-900 shadow-lg"
        : "bg-[#1c2a3b] text-[#efa765] hover:bg-[#2a3c4f]"
    }`;

  const StatCard = ({ title, value, icon, iconColor, description }: any) => (
    <Card className="bg-[#1c2a3b] border-[#efa765]/30 shadow-md min-w-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
        <CardTitle className="text-[10px] font-medium text-gray-400 uppercase truncate pr-1">
          {title}
        </CardTitle>
        <div className={`${iconColor} flex-shrink-0 scale-75`}>{icon}</div>
      </CardHeader>
      <CardContent className="p-3 pt-0 overflow-hidden">
        <div className="text-lg md:text-3xl font-bold text-[#efa765] truncate">{value}</div>
        <p className="text-[9px] text-gray-500 mt-0.5 truncate">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    /* FIXED: Using 'mx-auto' and explicit 'w-full' to prevent shifting. 
       Also ensured no extra left padding is forced if not needed. */
    <div className="flex-1 flex flex-col pt-3 md:pt-16 lg:pt-20 min-h-screen w-full max-w-[1400px] mx-auto overflow-x-hidden">
      
      {/* Title Section - Balanced padding */}
      <div className="mb-6 px-4 md:px-8">
        <h1 className="yeseva-one text-2xl md:text-5xl font-bold mb-1 tracking-wide text-[#efa765]">
          User Management
        </h1>
        <p className="text-gray-400 text-xs md:text-base">
          Filter and manage user accounts efficiently.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5 mb-6 px-4 md:px-8">
        <StatCard title="Total" value={stats.total} icon={<Users className="h-4 w-4" />} iconColor="text-[#efa765]" description="Active" />
        <StatCard title="Admins" value={stats.admin} icon={<Shield className="h-4 w-4" />} iconColor="text-red-500" description="High Access" />
        <StatCard title="Managers" value={stats.manager} icon={<Briefcase className="h-4 w-4" />} iconColor="text-blue-400" description="Operations" />
        <StatCard title="Staff" value={stats.staff} icon={<UserCheck className="h-4 w-4" />} iconColor="text-green-500" description="Standard" />
        <StatCard title="Basic" value={stats.user} icon={<User className="h-4 w-4" />} iconColor="text-yellow-500" description="Customers" />
      </div>

      {/* Search & Filters */}
      <div className="mx-4 md:mx-8 flex flex-col gap-3 mb-6 p-3 md:p-4 rounded-lg bg-[#1c2a3b] border border-[#efa765]/20">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 h-10 bg-[#0d141b] text-sm text-white border border-[#efa765]/30 focus:border-[#efa765] w-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
          {["all", "admin", "manager", "staff", "user"].map((role) => (
            <button key={role} onClick={() => handleRoleFilterChange(role as any)} className={roleFilterButtonClasses(role as any)}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table/Card Container - Centered Alignment */}
      <div className="md:mx-8 rounded-none md:rounded-xl border-y md:border border-[#efa765]/30 bg-[#141f2d]/30 text-white shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16 text-[#efa765]">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p className="text-sm">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-gray-500 italic text-sm">No users found.</div>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader className="bg-[#1c2a3b] text-[#efa765]">
                  <TableRow className="border-gray-800">
                    <TableHead className="text-[#efa765] font-bold">Name</TableHead>
                    <TableHead className="text-[#efa765] font-bold">Email</TableHead>
                    <TableHead className="text-[#efa765] font-bold">Status</TableHead>
                    <TableHead className="text-center text-[#efa765] font-bold">Role</TableHead>
                    <TableHead className="text-[#efa765] font-bold">Joined</TableHead>
                    <TableHead className="text-center text-[#efa765] font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} className="border-gray-800/50 hover:bg-[#1c2a3b]/40">
                      <TableCell className="font-medium truncate max-w-[150px] cursor-pointer" onClick={() => handleRedirectToDashboard(user)}>{user.name}</TableCell>
                      <TableCell className="text-gray-400 truncate max-w-[200px]">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${user.isVerified ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"}`}>
                          {user.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <RoleSelect user={user} isActionLoading={isActionLoading} handleUpdateRole={handleUpdateRole} roleBadgeClasses={roleBadgeClasses} />
                      </TableCell>
                      <TableCell className="text-gray-500 text-xs">{format(new Date(user.createdAt), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-center">
                        <DeleteAction user={user} isActionLoading={isActionLoading} handleDeleteUser={handleDeleteUser} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-800 w-full">
              {users.map((user) => (
                <div key={user._id} className="p-4 space-y-3 bg-[#141f2d]/50 w-full box-border">
                  <div className="flex justify-between items-start gap-2 w-full">
                    <div className="cursor-pointer overflow-hidden flex-1 min-w-0" onClick={() => handleRedirectToDashboard(user)}>
                      <h3 className="font-bold text-[#efa765] text-base truncate">{user.name}</h3>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                        <Mail className="h-3 w-3 flex-shrink-0"/> {user.email}
                      </p>
                    </div>
                    <DeleteAction user={user} isActionLoading={isActionLoading} handleDeleteUser={handleDeleteUser} />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <Badge className={user.isVerified ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                    <div className="text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3"/> {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </div>
                  </div>
                  <div className="bg-[#0d141b]/80 p-2 rounded-md flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Role:</span>
                    <RoleSelect user={user} isActionLoading={isActionLoading} handleUpdateRole={handleUpdateRole} roleBadgeClasses={roleBadgeClasses} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center mt-6 p-4 md:mx-8 md:rounded-lg bg-[#1c2a3b]/50 border-y md:border border-[#efa765]/20">
        <div className="text-gray-400 text-[10px] md:text-xs">
          Page {currentPage}/{totalPages} <span className="text-[#efa765] ml-1">{totalUsers} Users</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading} variant="ghost" size="sm" className="text-[#efa765] border border-[#efa765]/10 h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading} variant="ghost" size="sm" className="text-[#efa765] border border-[#efa765]/10 h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Sub-components logic...
const RoleSelect = ({ user, isActionLoading, handleUpdateRole, roleBadgeClasses }: any) => (
  <Select value={user.role} onValueChange={(val: any) => handleUpdateRole(user._id, val)} disabled={isActionLoading === user._id}>
    <SelectTrigger className={`w-[95px] md:w-[110px] h-7 md:h-8 text-[10px] font-bold capitalize border-none focus:ring-0 ${roleBadgeClasses(user.role)}`}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent className="bg-gray-800 text-white border-gray-700">
      {["admin", "manager", "staff", "user"].map(r => (
        <SelectItem key={r} value={r} className="capitalize text-xs">{r}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const DeleteAction = ({ user, isActionLoading, handleDeleteUser }: any) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="ghost" size="icon" disabled={isActionLoading === user._id} className="h-8 w-8 text-red-500 hover:bg-red-500/10">
        {isActionLoading === user._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-gray-900 text-white border border-red-900/50 w-[90vw] max-w-sm rounded-xl">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-red-500">Delete Account?</AlertDialogTitle>
        <AlertDialogDescription className="text-gray-400">
          This will permanently remove <strong className="text-white">{user.name}</strong>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-row gap-2 mt-4">
        <AlertDialogCancel className="flex-1 bg-gray-800 text-white border-none h-9">Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => handleDeleteUser(user._id)} className="flex-1 bg-red-600 hover:bg-red-700 h-9">Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);