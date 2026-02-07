"use client";
import React, { useEffect, useState } from "react";
import { 
  Save, Store, Truck, CreditCard, 
  AlertCircle, ShieldCheck, Activity, Timer, Zap,
  Gift, Landmark, ShieldAlert, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ISettings } from "@/types/settings";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [config, setConfig] = useState<ISettings>({
    isStoreOpen: true,
    operatingHours: { open: "09:00", close: "23:00" },
    estimatedDeliveryTime: "30-45 mins",
    minOrderValue: 0,
    deliveryRadius: 0,
    staffCommission: 0,
    paymentMethods: { stripe: true, cod: true },
    taxPercentage: 0,
    featuredLimit: 6,
    globalDiscount: 0,
    adminNotifications: true,
    maintenanceMode: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) {
          setConfig((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (err) {
        console.log(err);
        toast.error("Terminal Sync Failed");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("System Parameters Optimized");
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        toast.error("Matrix Validation Failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Network Error: Link to core lost");
    } finally {
      setSaving(false);
    }
  };

  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return (
      <p className="text-[10px] text-red-500 font-black uppercase mt-2 flex items-center gap-1.5 animate-pulse tracking-widest">
        <AlertCircle size={12} strokeWidth={3} /> {errors[field][0]}
      </p>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#141F2D] flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-[#EFA765]/10 border-t-[#EFA765] rounded-full animate-spin shadow-[0_0_20px_rgba(239,167,101,0.2)]" />
      <p className="text-[#EFA765] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Terminal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#141F2D] p-4 sm:p-6 md:p-10 text-[#EFA765] font-sans selection:bg-[#EFA765]/20 pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
        
        {/* HEADER */}
        <div className="bg-[#1D2B3F] p-6 sm:p-8 md:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-[#EFA765]/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-[#EFA765] fill-[#EFA765]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Terminal Matrix</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-[#EFA765] flex items-center flex-wrap uppercase italic">
                CORE <span className="text-white ml-2 sm:ml-3">SETTINGS</span>
              </h1>
              <p className="text-gray-100 opacity-60 text-xs sm:text-sm font-medium max-w-xl">
                Configuring global operational parameters and system logic for the deployment pipeline.
              </p>
            </div>
            
            <Button
              onClick={handleUpdate}
              disabled={saving}
              className="hidden lg:flex bg-[#EFA765] text-[#141F2D] hover:bg-white hover:scale-105 active:scale-95 transition-all h-20 px-10 font-black uppercase text-sm rounded-[1.5rem] gap-2 shadow-2xl shadow-[#EFA765]/20 group"
            >
              {saving ? "Processing..." : (
                <>
                  <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
                  Deploy Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="ops" className="w-full">
          <div className="sticky top-4 z-40 md:static">
            <TabsList className="bg-[#1D2B3F]/90 backdrop-blur-xl border border-[#EFA765]/20 p-1.5 rounded-2xl md:rounded-[2rem] mb-6 md:mb-12 flex flex-wrap w-full md:w-fit justify-center gap-1.5 h-auto overflow-hidden">
              {[
                { id: 'ops', icon: Store, label: 'Options' },
                { id: 'logistics', icon: Truck, label: 'Logistics' },
                { id: 'finance', icon: CreditCard, label: 'Finance' },
                { id: 'system', icon: ShieldAlert, label: 'Security' },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="data-[state=active]:bg-[#EFA765] data-[state=active]:text-[#141F2D] rounded-xl md:rounded-[1.4rem] px-3 md:px-8 py-3 md:py-4 gap-2 uppercase text-[10px] font-black transition-all text-white/40 flex items-center justify-center flex-1 sm:flex-none min-w-20"
                >
                  <tab.icon className="w-3.5 h-3.5 shrink-0" /> 
                  <span className="whitespace-nowrap">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* 1. OPERATIONS */}
          <TabsContent value="ops" className="space-y-4 md:space-y-8 outline-none animate-in fade-in slide-in-from-bottom-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className={`p-6 md:p-10 rounded-[2rem] border transition-all duration-700 ${config.isStoreOpen ? 'bg-[#EFA765]/5 border-[#EFA765]/30' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.isStoreOpen ? 'text-[#EFA765]' : 'text-red-500'}`}>Store Status</label>
                    <h3 className="text-3xl font-black text-white uppercase italic">{config.isStoreOpen ? 'Public' : 'Hidden'}</h3>
                  </div>
                  <Switch
                    checked={config.isStoreOpen}
                    onCheckedChange={(val) => setConfig({ ...config, isStoreOpen: val })}
                    className="data-[state=checked]:bg-[#EFA765] scale-125"
                  />
                </div>
                <p className="text-[10px] text-white/40 font-medium italic">Toggle global storefront visibility for customers.</p>
              </div>

              <div className="bg-[#1D2B3F] p-6 md:p-10 rounded-[2rem] border border-[#EFA765]/20 space-y-4 shadow-xl">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EFA765]">Min Order Value</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 font-black text-xs group-focus-within:text-[#EFA765]">PKR</span>
                  <Input
                    type="number"
                    value={config.minOrderValue}
                    onChange={(e) => setConfig({ ...config, minOrderValue: Number(e.target.value) })}
                    className="h-16 pl-16 bg-[#141F2D] border-[#EFA765]/10 rounded-2xl text-white text-xl font-bold focus:border-[#EFA765]/50"
                  />
                </div>
                <ErrorMessage field="minOrderValue" />
              </div>

              <div className="bg-[#1D2B3F] p-6 md:p-10 rounded-[2.5rem] border border-[#EFA765]/20 space-y-8 md:col-span-2 shadow-xl">
                <div className="flex items-center gap-3">
                  <Timer className="text-[#EFA765] w-5 h-5" />
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EFA765]">Terminal Uptime Window</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['open', 'close'].map((type) => (
                    <div key={type} className="space-y-3">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">{type === 'open' ? 'Auto-Initialize' : 'Auto-Shutdown'}</p>
                      <Input 
                        type="time" 
                        value={config.operatingHours[type as 'open' | 'close']} 
                        onChange={(e) => setConfig({
                          ...config, 
                          operatingHours: { ...config.operatingHours, [type]: e.target.value }
                        })} 
                        className="h-14 bg-[#141F2D] border-[#EFA765]/10 rounded-xl text-white px-6 font-mono text-lg focus:border-[#EFA765]/40" 
                      />
                      <ErrorMessage field={`operatingHours.${type}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 2. LOGISTICS */}
          <TabsContent value="logistics" className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-5">
            <div className="bg-[#1D2B3F] p-6 md:p-12 rounded-[2rem] border border-[#EFA765]/20 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EFA765]">Delivery Perimeter</label>
                  <div className="relative group">
                    <Input 
                      type="number" 
                      value={config.deliveryRadius} 
                      onChange={(e) => setConfig({...config, deliveryRadius: Number(e.target.value)})} 
                      className="h-20 bg-[#141F2D] border-[#EFA765]/10 rounded-2xl text-white text-4xl font-black focus:border-[#EFA765]/50 pr-20" 
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black italic text-[#EFA765]/30 text-xl">KM</span>
                  </div>
                  <ErrorMessage field="deliveryRadius" />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EFA765]">ETA Logic</label>
                  <div className="relative group">
                    <Input 
                      value={config.estimatedDeliveryTime} 
                      onChange={(e) => setConfig({...config, estimatedDeliveryTime: e.target.value})} 
                      className="h-20 bg-[#141F2D] border-[#EFA765]/10 rounded-2xl text-white text-xl font-black focus:border-[#EFA765]/50" 
                    />
                    <Activity className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 w-6 h-6" />
                  </div>
                  <ErrorMessage field="estimatedDeliveryTime" />
               </div>
            </div>
          </TabsContent>

          {/* 3. FINANCE */}
          <TabsContent value="finance" className="space-y-4 md:space-y-8 outline-none animate-in fade-in slide-in-from-bottom-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Global Discount (%)', icon: Gift, key: 'globalDiscount' },
                { label: 'Rider Bounty (Fixed PKR)', icon: Landmark, key: 'staffCommission' },
              ].map((item) => (
                <div key={item.key} className="bg-[#1D2B3F] p-6 md:p-10 rounded-[2.5rem] border border-[#EFA765]/20 group hover:shadow-2xl hover:shadow-[#EFA765]/5 transition-all">
                  <item.icon className="text-[#EFA765] mb-4 group-hover:scale-110 transition-transform w-8 h-8" />
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-3">{item.label}</label>
                  <Input 
                    type="number" 
                    value={(config as any)[item.key]} 
                    onChange={(e) => setConfig({...config, [item.key]: Number(e.target.value)})}
                    className="h-20 bg-[#141F2D] border-[#EFA765]/10 font-black text-4xl text-white rounded-2xl focus:border-[#EFA765]/50"
                  />
                </div>
              ))}
            </div>

            <div className="bg-[#1D2B3F] p-6 md:p-10 rounded-[2rem] border border-[#EFA765]/20 shadow-xl relative overflow-hidden">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#EFA765] mb-8 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Validated Gateways
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['stripe', 'cod'].map((method) => (
                  <div key={method} className="flex items-center justify-between p-6 bg-[#141F2D]/50 rounded-2xl border border-[#EFA765]/10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#EFA765]/10 rounded-xl text-[#EFA765]"><Zap size={20} /></div>
                      <span className="font-black uppercase tracking-tighter text-white italic text-sm">{method === 'stripe' ? 'Digital' : 'Cash'}</span>
                    </div>
                    <Switch 
                      checked={(config.paymentMethods as any)[method]} 
                      onCheckedChange={(val) => setConfig({
                        ...config, 
                        paymentMethods: {...config.paymentMethods, [method]: val}
                      })}
                      className="data-[state=checked]:bg-[#EFA765]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 4. SECURITY */}
          <TabsContent value="system" className="space-y-4 md:space-y-8 outline-none animate-in fade-in slide-in-from-bottom-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Maintenance */}
              <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${config.maintenanceMode ? 'bg-orange-500/10 border-orange-500/40' : 'bg-[#1D2B3F] border-[#EFA765]/20'}`}>
                <div className="flex items-center justify-between mb-6">
                  <ShieldAlert className={`w-10 h-10 ${config.maintenanceMode ? 'text-orange-500' : 'text-[#EFA765]/20'}`} />
                  <Switch 
                    checked={config.maintenanceMode} 
                    onCheckedChange={(val) => setConfig({...config, maintenanceMode: val})}
                    className="data-[state=checked]:bg-orange-500 scale-125"
                  />
                </div>
                <h3 className="text-2xl font-black uppercase italic text-white leading-none">Maintenance</h3>
                <p className="text-[10px] text-white/40 mt-2 font-bold uppercase tracking-widest">Freeze Public API Access.</p>
              </div>

              {/* Catalog Limit */}
              <div className="bg-[#1D2B3F] p-8 rounded-[2rem] border border-[#EFA765]/20 shadow-xl lg:col-span-1">
                <div className="flex items-center gap-4 mb-6">
                  <Globe className="text-[#EFA765] w-6 h-6" />
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EFA765]">Catalog Limit</label>
                </div>
                <Input 
                  type="number" 
                  value={config.featuredLimit} 
                  onChange={(e) => setConfig({...config, featuredLimit: Number(e.target.value)})}
                  className="h-16 bg-[#141F2D] border-[#EFA765]/10 text-4xl font-black text-white focus:border-[#EFA765] rounded-2xl w-full"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* MOBILE FLOATING ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#141F2D]/80 backdrop-blur-2xl border-t border-[#EFA765]/20 z-50">
        <Button
          onClick={handleUpdate}
          disabled={saving}
          className="w-full bg-[#EFA765] text-[#141F2D] h-16 rounded-2xl font-black uppercase text-sm gap-3"
        >
          {saving ? <Activity className="animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Optimizing..." : "Sync Settings"}
        </Button>
      </div>
    </div>
  );
}