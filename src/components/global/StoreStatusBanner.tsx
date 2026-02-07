"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Clock, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function StoreStatusBanner() {
  const [status, setStatus] = useState<{
    isVisible: boolean;
    message: string;
    type: "warning" | "danger";
  }>({ isVisible: false, message: "", type: "warning" });

  const [isDismissed, setIsDismissed] = useState(false);
  const isFetching = useRef(false);
  
  const pathname = usePathname();
  const router = useRouter();

  const checkStoreStatus = useCallback(async () => {
    if (isDismissed || isFetching.current) return;

    try {
      isFetching.current = true;
      const res = await fetch("/api/settings", { cache: 'no-store' });
      const data = await res.json();
      
      if (!data?.success) return;

      const { isStoreOpen, operatingHours } = data.settings;

      // --- SERVER TIME LOGIC (PAKISTAN TIMEZONE) ---
      const serverDateHeader = res.headers.get("Date");
      const baseDate = serverDateHeader ? new Date(serverDateHeader) : new Date();
      
      const pakistanTimeString = baseDate.toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
        hour12: false,
      });

      const timePart = pakistanTimeString.split(", ")[1];
      const [pkHour, pkMin] = timePart.split(":").map(Number);
      const currentMinutes = pkHour * 60 + pkMin;

      const [closeHour, closeMin] = operatingHours.close.split(":").map(Number);
      const [openHour, openMin] = operatingHours.open.split(":").map(Number);
      
      const closeMinutes = closeHour * 60 + closeMin;
      const openMinutes = openHour * 60 + openMin;
      const diffInMinutes = closeMinutes - currentMinutes;

      // Determine if store is closed (Manual Toggle OR Time)
      const isActuallyClosed = !isStoreOpen || currentMinutes >= closeMinutes || currentMinutes < openMinutes;

      if (isActuallyClosed) {
        setStatus({
          isVisible: true,
          message: "Orders are currently paused. Feel free to browse!",
          type: "danger",
        });

        // --- AUTO-REDIRECT LOGIC ---
        // If user is on checkout and NOT an admin, redirect them
        const isAdmin = pathname.startsWith("/admin");
        if (pathname.startsWith("/checkout") && !isAdmin) {
          router.push("/store-closed");
        }
        return;
      }

      // Logic for Closing Soon Warning
      if (diffInMinutes > 0 && diffInMinutes <= 30) {
        setStatus({
          isVisible: true,
          message: `Closing Protocol: Terminal shuts down in ${Math.round(diffInMinutes)}m`,
          type: "warning",
        });
      } else {
        // Hide if open and outside warning window
        setStatus((prev) => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      }
    } catch (err) {
      console.error("Status check failed", err);
    } finally {
      isFetching.current = false;
    }
  }, [isDismissed, pathname, router]);

  useEffect(() => {
    const initCheck = async () => {
      await checkStoreStatus();
    };
    
    initCheck();

    const interval = setInterval(checkStoreStatus, 30000); 
    return () => clearInterval(interval);
  }, [checkStoreStatus]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setStatus(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <AnimatePresence>
      {status.isVisible && (
        <div className="fixed top-24 left-0 right-0 z-60 flex justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            className={`
              pointer-events-auto relative flex items-center gap-4 px-6 py-3 
              rounded-2xl border backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]
              max-w-2xl w-full md:w-auto
              ${status.type === "danger" 
                ? "bg-red-500/10 border-red-500/20 text-red-500" 
                : "bg-[#EFA765]/10 border-[#EFA765]/20 text-[#EFA765]"
              }
            `}
          >
            <div className={`shrink-0 p-2 rounded-xl ${status.type === "danger" ? "bg-red-500/20" : "bg-[#EFA765]/20"}`}>
              {status.type === "danger" ? (
                <AlertTriangle size={20} className="animate-pulse" />
              ) : (
                <Clock size={20} className="animate-pulse" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Live Terminal Status</span>
              <p className="text-xs md:text-sm font-bold uppercase italic tracking-tight leading-tight">{status.message}</p>
            </div>
            <button onClick={handleDismiss} className="ml-4 p-1.5 hover:bg-white/5 rounded-lg transition-colors">
              <X size={16} />
            </button>
            <div className={`absolute inset-0 -z-10 blur-xl opacity-20 rounded-2xl ${status.type === "danger" ? "bg-red-500" : "bg-[#EFA765]"}`} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}