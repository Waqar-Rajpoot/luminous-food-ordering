"use client";

import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, Mail, MailOpen, Trash2, Users, RefreshCw, Calendar, User, Info } from "lucide-react";
import { format } from "date-fns";
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

interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface ErrorResponse {
  message?: string;
  success?: boolean;
}

const StatCard = ({ title, value, icon: Icon, color, bgColor }: any) => (
  <div className={`p-4 md:p-5 rounded-xl shadow-lg border border-gray-700 ${bgColor} transition-all duration-300 hover:border-[#efa765]/70`}>
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-[10px] md:text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        <h2 className="text-2xl md:text-4xl font-extrabold mt-1 text-white truncate">{value}</h2>
      </div>
      <Icon className={`h-6 w-6 md:h-10 md:w-10 ${color} opacity-70 flex-shrink-0`} />
    </div>
  </div>
);

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<IContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<IContactMessage | null>(null);

  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => !m.isRead).length;
  const readMessages = totalMessages - unreadMessages;

  const stats = [
    { title: "Total", value: totalMessages, icon: Users, color: "text-blue-400", bgColor: "bg-[#141f2d]" },
    { title: "Unread", value: unreadMessages, icon: Mail, color: "text-red-400", bgColor: "bg-[#141f2d]" },
    { title: "Resolved", value: readMessages, icon: MailOpen, color: "text-green-400", bgColor: "bg-[#141f2d]" },
  ];

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/contact");
      setMessages(response.data.contactMessages || []);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch messages.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleToggleReadStatus = async (messageId: string, currentStatus: boolean) => {
    setIsActionLoading(true);
    try {
      const response = await axios.patch(`/api/contact/${messageId}`, { isRead: !currentStatus });
      toast.success(response.data.message || `Status updated.`);
      setMessages((prev) => prev.map((m) => m._id === messageId ? { ...m, isRead: !currentStatus } : m));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Update failed.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setIsActionLoading(true);
    try {
      const response = await axios.delete(`/api/contact/${messageId}`);
      toast.success(response.data.message || "Message deleted.");
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Delete failed.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMessageClick = (message: IContactMessage) => {
    setSelectedMessage(message);
    setIsMessageDialogOpen(true);
    if (!message.isRead) {
      handleToggleReadStatus(message._id, false);
    }
  };

  return (
    <div className="min-h-screen text-white lg:pt-8 w-full overflow-x-hidden flex flex-col items-center p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl w-full">
        
        {/* Header Section */}
        <div className="mb-6 p-4 md:p-4 bg-[#141f2d] rounded-xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-black text-2xl md:text-5xl text-[#efa765] tracking-wide">
              Inquiry Dashboard
            </h1>
            <p className="text-gray-400 text-xs md:text-base mt-1">
              Management of user inquiries and feedback.
            </p>
          </div>
          <Button 
            onClick={fetchMessages}
            disabled={isLoading || isActionLoading}
            className="bg-[#efa765] hover:bg-[#d6985c] text-gray-900 w-full md:w-auto font-bold"
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh Data
          </Button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Messages Container */}
        <div className="bg-[#141f2d] rounded-xl shadow-2xl border border-[#efa765]/30 overflow-hidden mb-10">
          <div className="p-4 border-b border-gray-800 bg-[#1c2a3b]/30">
            <h2 className="text-lg md:text-2xl font-semibold text-[#efa765] yeseva-one">
               Recent Messages
            </h2>
          </div>

          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#1c2a3b]">
                <TableRow className="border-gray-700 hover:bg-[#1c2a3b]">
                  <TableHead className="text-[#efa765] font-bold">Customer</TableHead>
                  <TableHead className="text-[#efa765] font-bold">Email</TableHead>
                  <TableHead className="text-[#efa765] font-bold">Subject</TableHead>
                  <TableHead className="text-center text-[#efa765] font-bold">Status</TableHead>
                  <TableHead className="text-center text-[#efa765] font-bold">Date</TableHead>
                  <TableHead className="text-center text-[#efa765] font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow
                    key={message._id}
                    className={`border-gray-800 transition-colors cursor-pointer ${
                      message.isRead ? 'hover:bg-gray-800/50' : 'bg-[#1c2a3b]/50 hover:bg-[#2a3c50]'
                    }`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <TableCell className="font-medium text-white max-w-[150px] truncate">{message.name}</TableCell>
                    <TableCell className="text-gray-400 max-w-[150px] truncate">{message.email}</TableCell>
                    <TableCell className={`max-w-[250px] truncate ${message.isRead ? 'text-gray-500' : 'text-white font-bold'}`}>{message.subject}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={message.isRead ? "bg-green-600/10 text-green-400 border-green-600/30" : "bg-yellow-600/10 text-yellow-400 border-yellow-600/30"}>
                        {message.isRead ? "Read" : "New"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-center text-xs">{format(new Date(message.createdAt), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center gap-2">
                           <Button variant="ghost" size="icon" onClick={() => handleToggleReadStatus(message._id, message.isRead)} className={message.isRead ? 'text-green-400' : 'text-yellow-400'}>
                             {message.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                           </Button>
                           <DeleteDialog onDelete={() => handleDeleteMessage(message._id)} />
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View (Visible on mobile only) */}
          <div className="md:hidden divide-y divide-gray-800">
            {isLoading ? (
                <div className="p-10 text-center text-[#efa765]"><Loader2 className="animate-spin mx-auto h-8 w-8" /></div>
            ) : messages.length === 0 ? (
                <div className="p-10 text-center text-gray-500">No messages.</div>
            ) : (
                messages.map((m) => (
                    <div 
                        key={m._id} 
                        onClick={() => handleMessageClick(m)}
                        className={`p-4 active:bg-gray-800 transition-colors ${!m.isRead ? 'bg-[#1c2a3b]/40 border-l-4 border-l-[#efa765]' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-[#efa765]" />
                                <span className="font-bold text-sm truncate max-w-[150px]">{m.name}</span>
                            </div>
                            <Badge className={`text-[10px] ${m.isRead ? 'bg-gray-800 text-gray-400' : 'bg-[#efa765] text-black'}`}>
                                {m.isRead ? "Read" : "New"}
                            </Badge>
                        </div>
                        <p className={`text-xs mb-3 line-clamp-1 ${!m.isRead ? 'text-white' : 'text-gray-400'}`}>
                            <span className="text-[#efa765] mr-1 italic">Sub:</span> {m.subject}
                        </p>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(m.createdAt), "MMM dd")}
                            </div>
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-gray-700 bg-transparent" onClick={() => handleToggleReadStatus(m._id, m.isRead)}>
                                    {m.isRead ? <Mail className="h-3 w-3" /> : <MailOpen className="h-3 w-3" />}
                                </Button>
                                <DeleteDialog onDelete={() => handleDeleteMessage(m._id)} />
                            </div>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[600px] bg-[#0f172a] text-white border-[#efa765] rounded-xl overflow-hidden shadow-2xl">
          <DialogHeader className="border-b border-gray-800 pb-4">
            <DialogTitle className="text-[#efa765] text-xl yeseva-one">Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-2 text-xs md:text-sm bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <p><span className="text-[#efa765] font-semibold">From:</span> {selectedMessage.name}</p>
                <p><span className="text-[#efa765] font-semibold">Email:</span> {selectedMessage.email}</p>
                <p><span className="text-[#efa765] font-semibold">Subject:</span> {selectedMessage.subject}</p>
                <p><span className="text-[#efa765] font-semibold">Date:</span> {format(new Date(selectedMessage.createdAt), "PPP p")}</p>
              </div>
              <div className="bg-gray-950 p-4 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto text-gray-200 text-sm border border-gray-800 shadow-inner">
                {selectedMessage.message}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reusable Delete Confirmation Dialog to keep code clean
function DeleteDialog({ onDelete }: { onDelete: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 text-white border-red-900 w-[90vw] max-w-md rounded-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-500">Delete Permanently?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">This inquiry will be removed from your database.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-2 mt-4">
                    <AlertDialogCancel className="bg-gray-800 border-none flex-1 m-0">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-600 flex-1">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}