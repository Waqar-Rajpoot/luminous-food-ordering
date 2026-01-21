"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Truck, ShieldCheck, QrCode, X, ChevronLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";
import { useParams, useRouter } from "next/navigation";

export default function DeliveryVerifyPage() {
  const params = useParams();
  const router = useRouter();
  
  // FIXED: Automatically captures the ID from the URL (e.g., 69707ffbed74b3bf86e3088a)
  const [orderId, setOrderId] = useState(params.orderId as string || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || !isScanning) return;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            try {
              const data = JSON.parse(decodedText);
              // If QR contains an ID, use it, otherwise use scanned text
              setOrderId(data.id || decodedText);
              setOtp(data.otp || "");
              toast.success("Details Captured");
            } catch {
              setOrderId(decodedText);
              toast.info("Order ID scanned");
            }
            handleStopScanning();
          },
          () => {} 
        );
      } catch (err) {
        console.error("Scanner failed:", err);
        toast.error("Camera error. Please ensure permissions are allowed.");
        setIsScanning(false);
      }
    };

    const timer = setTimeout(startScanner, 500);
    return () => clearTimeout(timer);
  }, [isScanning, mounted]);

  const handleStopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setIsScanning(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !otp) return toast.error("Credentials required");

    setLoading(true);
    try {
      // Logic: Sending the automatically filled orderId and otp to backend
      const response = await axios.post("/api/orders/verify-otp", { orderId, otp });
      if (response.data.success) {
        setIsSuccess(true);
        toast.success("Delivery Confirmed!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP or Order ID");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
        <Card className="bg-[#1D2B3F]/50 backdrop-blur-xl border-[#EFA765]/20 p-12 text-center max-w-md w-full rounded-[3rem] shadow-2xl border">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative bg-green-500 h-24 w-24 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-14 w-14 text-[#141F2D]" />
            </div>
          </div>
          <h2 className="text-4xl font-black mb-3 text-[#EFA765]">Delivered</h2>
          <p className="text-gray-400 mb-10 text-sm">
            Order <span className="text-white font-mono font-bold">#{orderId}</span> verified.
          </p>
          <Button 
            onClick={() => router.back()} 
            className="bg-[#EFA765] text-[#141F2D] hover:bg-white rounded-2xl w-full font-bold h-14"
          >
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141F2D] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full mb-4 z-10">
        <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white gap-2 px-0"
        >
            <ChevronLeft size={20} /> Back to Queue
        </Button>
      </div>

      <Card className="bg-[#1D2B3F]/40 backdrop-blur-xl border-[#EFA765]/20 max-w-md w-full rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {isScanning && (
          <div className="absolute inset-0 z-50 bg-[#141F2D] flex flex-col p-8">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-[#EFA765] uppercase tracking-widest text-xs">Live Scanner</h3>
              <Button size="icon" variant="ghost" onClick={handleStopScanning} className="text-white/50 rounded-full">
                <X className="h-7 w-7" />
              </Button>
            </div>
            <div className="relative mx-auto w-full max-w-[280px]">
              <div id="reader" className="overflow-hidden rounded-[2rem] border-2 border-[#EFA765]/30 bg-black aspect-square"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#EFA765] shadow-[0_0_20px_#EFA765] animate-[scan_2.5s_linear_infinite]" />
            </div>
            <div className="mt-8 flex flex-col items-center gap-4 px-4 text-center">
              <p className="text-white/40 text-[11px] italic">Align QR code within the frame.</p>
            </div>
          </div>
        )}

        <CardHeader className="text-center pt-12">
          <div className="bg-[#EFA765]/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-[#EFA765]/20">
            <Truck className="h-10 w-10 text-[#EFA765]" />
          </div>
          <CardTitle className="text-3xl font-black text-[#EFA765]">Verify Order</CardTitle>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Enter Customer OTP</p>
        </CardHeader>

        <CardContent className="px-8 pb-12 space-y-8">
          <Button 
            type="button"
            onClick={() => setIsScanning(true)}
            className="w-full bg-[#EFA765]/5 border border-[#EFA765]/30 text-[#EFA765] hover:bg-[#EFA765] hover:text-[#141F2D] h-20 rounded-3xl flex items-center justify-center gap-4 transition-all font-black"
          >
            <QrCode className="h-6 w-6" /> 
            <span className="text-sm tracking-wide">SCAN RECEIPT</span>
          </Button>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ml-1 text-gray-500">Auto-filled ID</label>
              <Input 
                value={orderId}
                readOnly 
                className="bg-[#141F2D]/60 border-white/5 text-slate-400 h-14 rounded-2xl text-lg font-bold cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ml-1 text-gray-500">6-Digit OTP</label>
              <Input 
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-[#141F2D]/40 border-white/5 text-[#EFA765] h-16 rounded-2xl text-center text-3xl tracking-[0.4em] font-black focus:border-[#EFA765]/50"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !orderId || !otp}
              className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white h-16 rounded-2xl text-lg font-black transition-all"
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <div className="flex items-center gap-2"><ShieldCheck className="h-6 w-6" /> CONFIRM DELIVERY</div>}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Styles omitted for brevity */}
    </div>
  );
}