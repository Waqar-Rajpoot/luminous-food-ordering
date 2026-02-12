"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, Receipt, Trash2, Settings } from "lucide-react";
import ProfileTab from "@/components/settings/ProfileTab";
import SecurityTab from "@/components/settings/SecurityTab";
import BillingTab from "@/components/settings/BillingTab";
import DangerTab from "@/components/settings/DangerTab";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "danger", label: "Danger Zone", icon: Trash2 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-10 min-h-screen font-sans selection:bg-[#EFA765]/30">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-[#EFA765]/10 rounded-2xl border border-[#EFA765]/20">
          <Settings className="text-[#EFA765]" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your culinary profile and security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 flex flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? "bg-[#EFA765] text-black border-[#EFA765]"
                  : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/10"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content Area */}
        <main className="lg:col-span-9 bg-[#1e293b]/40 rounded-[2rem] border border-white/5 p-6 sm:p-10 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "security" && <SecurityTab />}
              {activeTab === "billing" && <BillingTab />}
              {activeTab === "danger" && <DangerTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}