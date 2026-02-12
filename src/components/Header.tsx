"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogIn,
  ShoppingCart,
  UserCircle,
  Menu,
  ShieldCheck,
  Settings,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { usePage } from "@/context/PageContext";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { setCurrentPage } = usePage();
  const headerRef = useRef<HTMLElement>(null);
  const { cartCount } = useCart();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userId = session?.user?._id;

  const handlePageNavigation = () => {
    setCurrentPage("products" as any);
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    setIsMenuOpen(false);
    router.push("/checkout");
  };

  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Products", href: "/products" },
  ];

  const getDashboardLink = () => {
    if (!session?.user) return null;
    const role = session.user.role;
    if (role === "admin") {
      return { href: "/admin", text: "Admin Panel", icon: <ShieldCheck className="h-4 w-4" /> };
    }
    if (role === "user" || role === "staff") {
      return { 
        href: `/user-dashboard/${userId}`, 
        text: "My Dashboard", 
        icon: <LayoutDashboard className="h-4 w-4" /> 
      };
    }
    return null;
  };

  const dashboardInfo = getDashboardLink();

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 w-full bg-[#141F2D] border-b border-white/10 backdrop-blur-xl z-50 transition-all duration-300"
      >
        <nav className="flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              onClick={handlePageNavigation}
              className="text-2xl font-black italic tracking-tighter text-white hover:text-[#EFA765] transition-all duration-300 uppercase"
            >
              Luminous<span className="text-[#EFA765]">.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {baseNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-xs font-black uppercase tracking-[0.2em] transition-colors group ${
                    isActive ? "text-[#EFA765]" : "text-gray-400 hover:text-[#EFA765]"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#EFA765] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {status === "authenticated" && session?.user?.role !== "admin" && (
              <button
                onClick={handleCartClick}
                className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#EFA765] hover:bg-[#EFA765]/5 hover:text-[#EFA765]/60 transition-all duration-500 group"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#EFA765] text-[10px] text-[#141F2D] font-black shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Desktop Auth Section */}
            <div className="hidden md:block">
              {status === "authenticated" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-11 px-4 rounded-xl flex items-center gap-3 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-[#EFA765] hover:border-[#EFA765]/30 transition-all"
                    >
                      <UserCircle className="h-5 w-5 text-[#EFA765]" />
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Account
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 bg-[#141F2D] border-white/10 text-white p-2 rounded-2xl shadow-2xl backdrop-blur-2xl"
                  >
                    {dashboardInfo && (
                      <DropdownMenuItem asChild className="rounded-xl focus:bg-[#EFA765] focus:text-[#141F2D] cursor-pointer py-3 transition-colors">
                        <Link href={dashboardInfo.href} className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
                          {dashboardInfo.icon}
                          {dashboardInfo.text}
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild className="rounded-xl focus:bg-[#EFA765] focus:text-[#141F2D] cursor-pointer py-3 transition-colors">
                      <Link href="/settings" className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  className="h-12 px-6 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-[#EFA765] hover:border-[#EFA765]/30 text-[10px] rounded-xl font-black uppercase tracking-widest transition-all duration-500"
                >
                  <Link href="/sign-in">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/5 rounded-xl w-9 h-9">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="bg-[#141F2D] border-white/5 text-white w-[75vw] pl-8 pt-8 pr-8">
                  <div className="flex flex-col h-full">
                    <SheetHeader className="text-left border-b border-white/5 pb-6">
                      <SheetTitle className="text-2xl font-black italic tracking-tighter text-white uppercase">
                        Luminous<span className="text-[#EFA765]">.</span>
                      </SheetTitle>
                    </SheetHeader>
                    
                    <nav className="flex flex-col space-y-6 mt-8">
                      {baseNavLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-[12px] font-black uppercase tracking-widest text-gray-400 hover:text-[#EFA765]"
                        >
                          {link.name}
                        </Link>
                      ))}
                      
                      <div className="pt-6 border-t border-white/5 flex flex-col gap-6">
                        {status === "authenticated" ? (
                          <>
                            {dashboardInfo && (
                              <Link
                                href={dashboardInfo.href}
                                className="flex items-center gap-4 text-[12px] font-black uppercase tracking-widest text-gray-400"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {dashboardInfo.icon} {dashboardInfo.text}
                              </Link>
                            )}
                            <Link
                                href="/settings"
                                className="flex items-center gap-4 text-[12px] font-black uppercase tracking-widest text-gray-400"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Settings className="h-4 w-4 text-[#EFA765]" /> Settings
                            </Link>
                          </>
                        ) : (
                          <Button
                            asChild
                            className="h-12 w-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-[#EFA765] text-[10px] rounded-xl font-black uppercase tracking-widest"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Link href="/sign-in">
                              <LogIn className="h-4 w-4 mr-2" /> Sign In
                            </Link>
                          </Button>
                        )}
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>
      <div className="h-20" />
    </>
  );
}