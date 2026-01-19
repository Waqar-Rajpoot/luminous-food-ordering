// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader2, CheckCircle2, Truck, ShieldCheck, QrCode, X, } from "lucide-react";
// import axios from "axios";
// import { toast } from "sonner";
// import { Html5QrcodeScanner } from "html5-qrcode";

// export default function DeliveryVerifyPage() {
//   const [orderId, setOrderId] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   // Fix Hydration Error: Ensure component is mounted before rendering client-specific logic
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;

//     let scanner: Html5QrcodeScanner | null = null;

//     if (isScanning) {
//       // Delay to ensure the "reader" ID is in the DOM
//       const timer = setTimeout(() => {
//         try {
//           scanner = new Html5QrcodeScanner(
//             "reader",
//             { fps: 20, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
//             false
//           );

//           scanner.render(
//             (decodedText) => {
//               try {
//                 const data = JSON.parse(decodedText);
//                 if (data.id && data.otp) {
//                   setOrderId(data.id);
//                   setOtp(data.otp);
//                   toast.success("Identity Detected");
//                   setIsScanning(false);
//                 }
//               } catch {
//                 setOrderId(decodedText);
//                 toast.info("Order ID scanned");
//                 setIsScanning(false);
//               }
//             },
//             () => {}
//           );
//         } catch (err) {
//           console.error("Scanner Error:", err);
//         }
//       }, 300);

//       return () => {
//         clearTimeout(timer);
//         if (scanner) {
//           scanner.clear().catch(console.error);
//         }
//       };
//     }
//   }, [isScanning, mounted]);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!orderId || !otp) return toast.error("Credentials required");

//     setLoading(true);
//     try {
//       const response = await axios.post("/api/orders/verify-otp", { orderId, otp });
//       if (response.data.success) {
//         setIsSuccess(true);
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Prevent rendering until client-side to stop hydration errors
//   if (!mounted) return null;

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6">
//         <div className="absolute inset-0 bg-gradient-to-b from-[#EFA765]/5 to-transparent pointer-events-none" />
//         <Card className="bg-[#1D2B3F]/50 backdrop-blur-xl border-[#EFA765]/20 p-12 text-center max-w-md w-full rounded-[3rem] shadow-2xl border">
//           <div className="relative mx-auto w-24 h-24 mb-8">
//             <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
//             <div className="relative bg-green-500 h-24 w-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
//               <CheckCircle2 className="h-14 w-14 text-[#141F2D]" />
//             </div>
//           </div>
//           <h2 className="text-4xl font-black mb-3 text-[#EFA765] font-[Yeseve One]">Delivered</h2>
//           <p className="text-gray-400 mb-10 text-sm leading-relaxed">
//             Order <span className="text-white font-mono font-bold">#{orderId}</span> has been confirmed.
//           </p>
//           <Button 
//             onClick={() => { setIsSuccess(false); setOrderId(""); setOtp(""); }}
//             className="bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all duration-500 rounded-2xl w-full font-bold h-14 text-lg shadow-lg shadow-[#EFA765]/10"
//           >
//             Process Next Order
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Background Aesthetic Elements */}
//       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#EFA765] opacity-[0.03] blur-[120px] rounded-full" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#EFA765] opacity-[0.03] blur-[120px] rounded-full" />

//       <Card className="bg-[#1D2B3F]/40 backdrop-blur-xl border-[#EFA765]/20 max-w-md w-full rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
        
//         {/* QR Scanner Overlay */}
//         {isScanning && (
//           <div className="absolute inset-0 z-50 bg-[#141F2D] flex flex-col p-8 animate-in fade-in zoom-in duration-300">
//             <div className="flex justify-between items-center mb-10">
//               <div className="flex items-center gap-3">
//                 <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
//                 <h3 className="font-bold text-[#EFA765] uppercase tracking-widest text-xs">Live Scanner</h3>
//               </div>
//               <Button size="icon" variant="ghost" onClick={() => setIsScanning(false)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-full">
//                 <X className="h-7 w-7" />
//               </Button>
//             </div>
            
//             <div className="relative group mx-auto w-full max-w-[280px]">
//               <div id="reader" className="overflow-hidden rounded-[2rem] border-2 border-[#EFA765]/30 bg-black aspect-square shadow-2xl"></div>
//               <div className="absolute top-0 left-0 w-full h-[2px] bg-[#EFA765] shadow-[0_0_20px_#EFA765] animate-[scan_2.5s_linear_infinite] z-10" />
//             </div>

//             <p className="text-white/40 text-[11px] text-center mt-12 italic leading-relaxed px-6">
//               Align the customer&apos;s digital receipt within the frame to auto-fill details.
//             </p>
//           </div>
//         )}

//         <CardHeader className="text-center pt-12">
//           <div className="bg-[#EFA765]/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-[#EFA765]/20">
//             <Truck className="h-10 w-10 text-[#EFA765]" />
//           </div>
//           <CardTitle className="text-3xl font-black font-[Yeseve One] tracking-tight text-[#EFA765]">Staff Portal</CardTitle>
//           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Verification System</p>
//         </CardHeader>

//         <CardContent className="px-8 pb-12 space-y-8">
//           <Button 
//             type="button"
//             onClick={() => setIsScanning(true)}
//             className="w-full bg-[#EFA765]/5 border border-[#EFA765]/30 text-[#EFA765] hover:bg-[#EFA765] hover:text-[#141F2D] h-20 rounded-3xl flex items-center justify-center gap-4 transition-all duration-500 font-black group"
//           >
//             <div className="p-2 bg-[#EFA765]/10 rounded-xl group-hover:bg-[#141F2D]/20 transition-colors">
//               <QrCode className="h-6 w-6" /> 
//             </div>
//             <span className="text-sm tracking-wide">SCAN RECEIPT</span>
//           </Button>

//           <div className="relative flex items-center">
//             <div className="flex-grow border-t border-white/5"></div>
//             <span className="mx-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Manual Entry</span>
//             <div className="flex-grow border-t border-white/5"></div>
//           </div>

//           <form onSubmit={handleVerify} className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase ml-1 text-gray-500 tracking-[0.1em]">Order Reference</label>
//               <Input 
//                 placeholder="Ex: ORDER-12345" 
//                 value={orderId}
//                 onChange={(e) => setOrderId(e.target.value.toUpperCase())}
//                 className="bg-[#141F2D]/40 border-white/5 text-white h-14 rounded-2xl focus:border-[#EFA765]/50 focus:ring-0 text-lg font-bold transition-all"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase ml-1 text-gray-500 tracking-[0.1em]">Delivery OTP</label>
//               <Input 
//                 type="text"
//                 placeholder="••••••"
//                 maxLength={6}
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="bg-[#141F2D]/40 border-white/5 text-[#EFA765] h-16 rounded-2xl text-center text-3xl tracking-[0.4em] font-black focus:border-[#EFA765] transition-all"
//               />
//             </div>

//             <Button 
//               type="submit" 
//               disabled={loading || !orderId || !otp}
//               className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white h-16 rounded-2xl text-lg font-black transition-all duration-500 shadow-xl shadow-[#EFA765]/5 group"
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin h-6 w-6" />
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <ShieldCheck className="h-6 w-6" />
//                   CONFIRM DELIVERY
//                 </div>
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       <style jsx global>{`
//         @keyframes scan {
//           0% { transform: translateY(0); opacity: 0; }
//           50% { opacity: 1; }
//           100% { transform: translateY(280px); opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// }








"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Truck, ShieldCheck, QrCode, X, } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function DeliveryVerifyPage() {
  const [orderId, setOrderId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      const timer = setTimeout(() => {
        try {
          // Optimized config for Mobile/Vercel
          scanner = new Html5QrcodeScanner(
            "reader",
            { 
              fps: 20, 
              qrbox: (viewfinderWidth, viewfinderHeight) => {
                const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdgeSize * 0.7);
                return { width: qrboxSize, height: qrboxSize };
              },
              aspectRatio: 1.0,
              // Disable buggy native API to force reliable JS scanning
              useBarCodeDetectorIfSupported: false,
              videoConstraints: {
                facingMode: "environment",
              }
            },
            false
          );

          scanner.render(
            (decodedText) => {
              try {
                const data = JSON.parse(decodedText);
                if (data.id && data.otp) {
                  setOrderId(data.id);
                  setOtp(data.otp);
                  toast.success("Identity Detected");
                  setIsScanning(false);
                }
              } catch {
                setOrderId(decodedText);
                toast.info("Order ID scanned");
                setIsScanning(false);
              }
            },
            (err) => {
              // Frame-by-frame scanning errors are normal and ignored
            }
          );
        } catch (err) {
          console.error("Scanner Error:", err);
          toast.error("Camera access failed. Check permissions.");
          setIsScanning(false);
        }
      }, 400);

      return () => {
        clearTimeout(timer);
        if (scanner) {
          scanner.clear().catch(console.error);
        }
      };
    }
  }, [isScanning, mounted]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !otp) return toast.error("Credentials required");

    setLoading(true);
    try {
      const response = await axios.post("/api/orders/verify-otp", { orderId, otp });
      if (response.data.success) {
        setIsSuccess(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EFA765]/5 to-transparent pointer-events-none" />
        <Card className="bg-[#1D2B3F]/50 backdrop-blur-xl border-[#EFA765]/20 p-12 text-center max-w-md w-full rounded-[3rem] shadow-2xl border">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative bg-green-500 h-24 w-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="h-14 w-14 text-[#141F2D]" />
            </div>
          </div>
          <h2 className="text-4xl font-black mb-3 text-[#EFA765] font-[Yeseve One]">Delivered</h2>
          <p className="text-gray-400 mb-10 text-sm leading-relaxed">
            Order <span className="text-white font-mono font-bold">#{orderId}</span> has been confirmed.
          </p>
          <Button 
            onClick={() => { setIsSuccess(false); setOrderId(""); setOtp(""); }}
            className="bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all duration-500 rounded-2xl w-full font-bold h-14 text-lg shadow-lg shadow-[#EFA765]/10"
          >
            Process Next Order
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141F2D] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#EFA765] opacity-[0.03] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#EFA765] opacity-[0.03] blur-[120px] rounded-full" />

      <Card className="bg-[#1D2B3F]/40 backdrop-blur-xl border-[#EFA765]/20 max-w-md w-full rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
        
        {isScanning && (
          <div className="absolute inset-0 z-50 bg-[#141F2D] flex flex-col p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                <h3 className="font-bold text-[#EFA765] uppercase tracking-widest text-xs">Live Scanner</h3>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setIsScanning(false)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-full">
                <X className="h-7 w-7" />
              </Button>
            </div>
            
            <div className="relative group mx-auto w-full max-w-[280px]">
              <div id="reader" className="overflow-hidden rounded-[2rem] border-2 border-[#EFA765]/30 bg-black aspect-square shadow-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#EFA765] shadow-[0_0_20px_#EFA765] animate-[scan_2.5s_linear_infinite] z-10" />
            </div>

            <p className="text-white/40 text-[11px] text-center mt-12 italic leading-relaxed px-6">
              Align the customer&apos;s digital receipt within the frame to auto-fill details.
            </p>
          </div>
        )}

        <CardHeader className="text-center pt-12">
          <div className="bg-[#EFA765]/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-[#EFA765]/20">
            <Truck className="h-10 w-10 text-[#EFA765]" />
          </div>
          <CardTitle className="text-3xl font-black font-[Yeseve One] tracking-tight text-[#EFA765]">Staff Portal</CardTitle>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Verification System</p>
        </CardHeader>

        <CardContent className="px-8 pb-12 space-y-8">
          <Button 
            type="button"
            onClick={() => setIsScanning(true)}
            className="w-full bg-[#EFA765]/5 border border-[#EFA765]/30 text-[#EFA765] hover:bg-[#EFA765] hover:text-[#141F2D] h-20 rounded-3xl flex items-center justify-center gap-4 transition-all duration-500 font-black group"
          >
            <div className="p-2 bg-[#EFA765]/10 rounded-xl group-hover:bg-[#141F2D]/20 transition-colors">
              <QrCode className="h-6 w-6" /> 
            </div>
            <span className="text-sm tracking-wide">SCAN RECEIPT</span>
          </Button>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="mx-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Manual Entry</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ml-1 text-gray-500 tracking-[0.1em]">Order Reference</label>
              <Input 
                placeholder="Ex: ORDER-12345" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="bg-[#141F2D]/40 border-white/5 text-white h-14 rounded-2xl focus:border-[#EFA765]/50 focus:ring-0 text-lg font-bold transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ml-1 text-gray-500 tracking-[0.1em]">Delivery OTP</label>
              <Input 
                type="text"
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-[#141F2D]/40 border-white/5 text-[#EFA765] h-16 rounded-2xl text-center text-3xl tracking-[0.4em] font-black focus:border-[#EFA765] transition-all"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !orderId || !otp}
              className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white h-16 rounded-2xl text-lg font-black transition-all duration-500 shadow-xl shadow-[#EFA765]/5 group"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6" />
                  CONFIRM DELIVERY
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(240px); opacity: 0; }
        }
        #reader video {
          object-fit: cover !important;
          border-radius: 2rem;
          width: 100% !important;
          height: 100% !important;
        }
        #reader img {
          display: none !important; /* Hide library's default info icon */
        }
      `}</style>
    </div>
  );
}