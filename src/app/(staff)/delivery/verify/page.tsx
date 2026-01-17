"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Truck, ShieldCheck, QrCode, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function DeliveryVerifyPage() {
  const [orderId, setOrderId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.id && data.otp) {
              setOrderId(data.id);
              setOtp(data.otp);
              toast.success("QR Scanned Successfully");
              setIsScanning(false);
            }
          } catch {
            // Fallback if QR only contains the Order ID string
            setOrderId(decodedText);
            toast.info("Order ID detected");
            setIsScanning(false);
          }
        },
        () => { /* Silent error for continuous scanning */ }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((error) => console.error("Scanner cleanup failed", error));
      }
    };
  }, [isScanning]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !otp) {
      toast.error("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/delivery/verify-otp", { orderId, otp });
      if (response.data.success) {
        setIsSuccess(true);
        toast.success("Delivery Verified!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(true); // Keep loading state until success view triggers
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6 text-[#EFA765]">
        <Card className="bg-[#1D2B3F] border-[#EFA765]/20 p-10 text-center max-w-md w-full rounded-3xl">
          <CheckCircle2 className="h-20 w-20 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Success!</h2>
          <p className="text-white/60 mb-6 text-sm">Order #{orderId} has been marked as Delivered.</p>
          <Button 
            onClick={() => { setIsSuccess(false); setOrderId(""); setOtp(""); }}
            className="bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/90 rounded-full w-full font-bold h-12"
          >
            Verify Another Order
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-4 text-[#EFA765]">
      <Card className="bg-[#1D2B3F] border-[#EFA765]/20 max-w-md w-full rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* QR Scanner Overlay */}
        {isScanning && (
          <div className="absolute inset-0 z-50 bg-[#1D2B3F] flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Scan QR Code</h3>
              <Button size="icon" variant="ghost" onClick={() => setIsScanning(false)} className="text-[#EFA765]">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div id="reader" className="overflow-hidden rounded-2xl border border-[#EFA765]/30 bg-black"></div>
            <p className="text-white/40 text-xs text-center mt-4 italic">Align customer QR code within the frame</p>
          </div>
        )}

        <CardHeader className="text-center pt-8">
          <div className="bg-[#EFA765]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-[#EFA765]" />
          </div>
          <CardTitle className="text-2xl font-bold">Staff Delivery Portal</CardTitle>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">Verify Customer OTP</p>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-6">
          <Button 
            type="button"
            onClick={() => setIsScanning(true)}
            className="w-full bg-[#EFA765]/10 border border-[#EFA765] text-[#EFA765] hover:bg-[#EFA765] hover:text-[#141F2D] h-16 rounded-2xl flex gap-3 transition-all font-bold"
          >
            <QrCode className="h-6 w-6" /> Scan Customer Phone
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-tighter"><span className="bg-[#1D2B3F] px-3 text-white/30">Or Manual Entry</span></div>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase ml-1 opacity-70">Order ID</label>
              <Input 
                placeholder="ORDER-ID-HERE" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="bg-[#141F2D] border-[#EFA765]/20 text-white h-12 rounded-xl focus-visible:ring-[#EFA765]/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase ml-1 opacity-70">6-Digit OTP</label>
              <Input 
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-[#141F2D] border-[#EFA765]/20 text-white h-12 rounded-xl text-center text-2xl tracking-[0.4em] font-mono focus-visible:ring-[#EFA765]/50"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !orderId || !otp}
              className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/90 h-14 rounded-full text-lg font-bold transition-all shadow-lg shadow-[#EFA765]/10"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Complete Delivery
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}