'use client';

import { useState } from 'react'; // Added React and useState
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Box,
  LayoutDashboard,
  Settings,
  Menu,
  Star,
  MessageSquare,
  ListOrdered,
  Users,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Tag
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function AdminNavbar() {
  const pathname = usePathname();
  // State to control mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/product-management', label: 'Products', icon: Box },
    { href: '/admin/orders', label: 'Orders', icon: ListOrdered },
    { href: '/admin/deals', label: 'Deals', icon: Tag },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    setIsMenuOpen(false); // Close menu on logout
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="fixed top-0 left-0 w-full max-w-full z-100 bg-[#141F2D]/95 border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between overflow-hidden">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ShieldCheck size={28} className="text-[#EFA765] sm:w-8 sm:h-8" />
          <h1 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white hidden xs:block">
            Admin<span className="text-[#EFA765]">Core</span>
          </h1>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden xl:flex items-center space-x-1 flex-1 justify-center px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 xl:px-3 py-2 text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all duration-300 group whitespace-nowrap ${
                  isActive ? 'text-[#EFA765]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#EFA765] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={handleLogout}
            className="hidden xl:flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={14} />
            <span className="hidden xxl:block">Sign Out</span>
          </button>

          {/* Mobile Toggle */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white/5 border border-white/10 text-[#EFA765] hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-70 sm:w-72 bg-[#141F2D] border-r border-[#EFA765]/20 p-0 text-white"
            >
              <div className="flex flex-col h-full">
                <SheetHeader className="px-6 sm:p-8 border-b border-white/5 text-left shrink-0 pt-20">
                  <SheetTitle>
                    <span className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-white">
                      Admin<span className="text-[#EFA765]">Hub.</span>
                    </span>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mt-2">Management</p>
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex-1 px-4 mt-2 overflow-y-auto custom-scrollbar">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)} // Auto-close on link click
                        className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl transition-all duration-300 group ${
                          isActive 
                          ? 'bg-[#EFA765] text-[#141F2D]' 
                          : 'text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <link.icon size={18} />
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{link.label}</span>
                        </div>
                        <ChevronRight size={14} className={isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} />
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 font-black uppercase tracking-widest text-[10px] sm:text-xs"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}