// app/admin/settings/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Loader2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Utensils,
  BookOpen,
  CalendarCheck,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Assuming you have a Label component
import { Switch } from "@/components/ui/switch"; // Assuming you have a Switch component

// --- INTERFACE (Same as defined above) ---
interface IRestaurantSettings {
  _id: string;
  openingTime: string; // e.g., "10:00"
  closingTime: string; // e.g., "22:00"
  isClosedToday: boolean;
  lastOrderTime: string; // e.g., "21:30"
  maxPartySize: number;
  reservationEnabled: boolean;
  phoneNumber: string;
  publicEmail: string;
  address: string;
}

interface ErrorResponse {
  message?: string;
}

const initialSettings: IRestaurantSettings = {
    _id: "",
    openingTime: "10:00",
    closingTime: "22:00",
    isClosedToday: false,
    lastOrderTime: "21:30",
    maxPartySize: 6,
    reservationEnabled: true,
    phoneNumber: "",
    publicEmail: "",
    address: "",
}

export default function RestaurantSettingsPage() {
  const [settings, setSettings] = useState<IRestaurantSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. Fetch Current Settings ---
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<IRestaurantSettings>(`/api/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to load restaurant settings."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: keyof IRestaurantSettings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [id]: checked }));
  };

  // --- 2. Save Updated Settings ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const {...updatePayload } = settings; 
      
      await axios.patch(`/api/settings`, updatePayload);
      toast.success("Restaurant settings updated successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to save settings."
      );
    } finally {
      setIsSaving(false);
    }
  };


  // --- Helper for consistent Card UI ---
  const SettingsCard = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <Card className="bg-[#1c2a3b] border-[#efa765]/50 hover:border-[#efa765]/70 transition-all shadow-xl">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <div className="text-[#efa765]">{icon}</div>
        <CardTitle className="text-xl font-bold text-white uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-[#0d141b]">
        <Loader2 className="h-10 w-10 animate-spin text-[#efa765]" />
        <span className="ml-4 text-2xl text-[#efa765]">
            Loading settings...
        </span>
      </div>
    );
  }

  // --- 3. Render the Form with Components ---
  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 min-h-screen bg-[#0d141b] text-white">
      <div className="mb-8">
        <h1
          className="text-4xl font-bold mb-2 tracking-wide"
          style={{ color: "rgb(239, 167, 101)" }}
        >
          Restaurant Operational Settings
        </h1>
        <p className="text-gray-400">
          Manage core operating hours, service limits, and public contact information.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* OPERATING HOURS CARD */}
          <SettingsCard title="Operating Hours" icon={<Clock className="h-6 w-6" />}>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="openingTime" className="text-gray-300">Daily Opening Time</Label>
                    <Input
                        id="openingTime"
                        type="time"
                        value={settings.openingTime}
                        onChange={handleChange}
                        className="bg-[#0d141b] text-white border-gray-700 focus:border-[#efa765]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="closingTime" className="text-gray-300">Daily Closing Time</Label>
                    <Input
                        id="closingTime"
                        type="time"
                        value={settings.closingTime}
                        onChange={handleChange}
                        className="bg-[#0d141b] text-white border-gray-700 focus:border-[#efa765]"
                    />
                </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d141b] border border-gray-700">
                <div className="flex items-center space-x-3">
                    {settings.isClosedToday ? <ToggleLeft className="text-red-500"/> : <ToggleRight className="text-green-500"/>}
                    <Label htmlFor="isClosedToday" className="text-white font-semibold">
                        Temporary Closure Today
                    </Label>
                </div>
                <Switch
                    id="isClosedToday"
                    checked={settings.isClosedToday}
                    onCheckedChange={(checked) => handleSwitchChange('isClosedToday', checked)}
                    className="data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-500"
                />
            </div>
          </SettingsCard>

          {/* ORDERING & RESERVATION CARD */}
          <SettingsCard title="Ordering & Reservations" icon={<Utensils className="h-6 w-6" />}>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d141b] border border-gray-700">
                <div className="flex items-center space-x-3">
                    <CalendarCheck className="text-[#efa765]"/>
                    <Label htmlFor="reservationEnabled" className="text-white font-semibold">
                        Online Reservations
                    </Label>
                </div>
                <Switch
                    id="reservationEnabled"
                    checked={settings.reservationEnabled}
                    onCheckedChange={(checked) => handleSwitchChange('reservationEnabled', checked)}
                    className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-500"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="lastOrderTime" className="text-gray-300">Last Order/Takeout Time</Label>
                    <Input
                        id="lastOrderTime"
                        type="time"
                        value={settings.lastOrderTime}
                        onChange={handleChange}
                        className="bg-[#0d141b] text-white border-gray-700 focus:border-[#efa765]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxPartySize" className="text-gray-300">Max Reservation Party Size</Label>
                    <Input
                        id="maxPartySize"
                        type="number"
                        min="1"
                        value={settings.maxPartySize}
                        onChange={handleChange}
                        className="bg-[#0d141b] text-white border-gray-700 focus:border-[#efa765]"
                    />
                </div>
            </div>
          </SettingsCard>
        </div>

        {/* CONTACT INFORMATION CARD (Full Width) */}
        <SettingsCard title="Public Contact Information" icon={<Phone className="h-6 w-6" />}>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-300 flex items-center"><Phone className="h-4 w-4 mr-2"/> Phone Number</Label>
              <Input
                id="phoneNumber"
                value={settings.phoneNumber}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className="bg-[#0d141b] text-white border-gray-700 focus:border-[#efa765]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicEmail" className="text-gray-300 flex items-center"><Mail className="h-4 w-4 mr-2"/> Public Email</Label>
              <Input
                id="publicEmail"
                type="email"
                value={settings.publicEmail}
                onChange={handleChange}
                placeholder="info@restaurant.com"
                className="bg-[#0d141b] text-white border-gray-700 focus:border-[#efa765]"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="address" className="text-gray-300 flex items-center"><MapPin className="h-4 w-4 mr-2"/> Physical Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={handleChange}
                placeholder="123 Main Street, Lahore"
                className="bg-[#0d141b] text-white border-gray-700 focus:border-[#efa765]"
              />
            </div>
          </div>
        </SettingsCard>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="px-8 py-2 bg-[#efa765] text-gray-900 font-bold hover:bg-[#d5985b] transition-colors duration-200 shadow-lg"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <BookOpen className="h-5 w-5 mr-2" />
            )}
            {isSaving ? "Saving Settings..." : "Save All Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}

