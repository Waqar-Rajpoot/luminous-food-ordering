"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  LogIn,
  ShoppingCart,
  UserCircle,
  Menu,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { usePage } from "@/context/PageContext";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
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
    setCurrentPage("cart" as any);
  };

  const handleSignOut = () => {
    handlePageNavigation();
    setIsMenuOpen(false);
    signOut({ callbackUrl: "/sign-in" });
  };

  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Products", href: "/products" },
  ];

  // UPDATED: Logic to handle different folder structures based on role
  const getDashboardLink = () => {
    if (!session?.user) return null;

    const role = session.user.role;

    if (role === "admin") {
      return { href: "/admin", text: "Admin Panel", icon: <ShieldCheck className="h-4 w-4" /> };
    }

    // if (role === "staff") {
    //   return { 
    //     href: `/user-dashboard/${userId}`, 
    //     text: "My Dashboard", 
    //     icon: <LayoutDashboard className="h-4 w-4" /> 
    //   };
    // }

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
                  onClick={handlePageNavigation}
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
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-[#141F2D] font-black group-hover:bg-[#141F2D] group-hover:text-white transition-colors">
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
                        {session.user?.role === 'admin' ? 'Admin' : 'Profile'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#141F2D] border-white/10 text-white p-2 rounded-2xl shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Access Level: {session.user?.role}
                    </div>
                    {dashboardInfo && (
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl focus:bg-[#EFA765] focus:text-[#141F2D] cursor-pointer py-3"
                      >
                        <Link
                          href={dashboardInfo.href}
                          className="flex items-center gap-3 font-bold"
                        >
                          {dashboardInfo.icon}
                          {dashboardInfo.text}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/5 mx-2 my-2" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="rounded-xl focus:bg-red-500 focus:text-white text-red-400 cursor-pointer py-3 font-bold"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  className="h-12 px-4 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-[#EFA765] hover:border-[#EFA765]/30 text-[10px] rounded-xl font-black uppercase tracking-widest transition-all duration-500"
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
                
                <SheetContent side="right" className="bg-[#141F2D] border-white/5 text-white w-[60vw] max-w-75 pl-8 pt-8 pr-8 overflow-y-auto">
                  <div className="flex flex-col h-full">
                    <SheetHeader className="text-left border-b border-white/5 pb-6">
                      <SheetTitle className="text-2xl font-black italic tracking-tighter text-white uppercase">
                        Luminous<span className="text-[#EFA765]">.</span>
                      </SheetTitle>
                    </SheetHeader>
                    
                    <nav className="flex flex-col space-y-4 mt-4">
                      {baseNavLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => {
                                handlePageNavigation();
                                setIsMenuOpen(false);
                            }}
                            className={`text-[12px] font-bold uppercase tracking-widest transition-colors ${
                              isActive ? "text-[#EFA765]" : "text-gray-400 hover:text-[#EFA765]"
                            }`}
                          >
                            {link.name}
                          </Link>
                        );
                      })}
                      
                      <div className="pt-4 border-t border-white/5 flex flex-col gap-5 pb-10">
                        {status === "authenticated" ? (
                          <>
                            {dashboardInfo && (
                              <Link
                                href={dashboardInfo.href}
                                className={`flex items-center gap-4 text-[12px] font-bold uppercase tracking-widest ${
                                  pathname.includes(dashboardInfo.href) ? "text-[#EFA765]" : "text-gray-400"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {dashboardInfo.text}
                              </Link>
                            )}
                            <Button
                              onClick={handleSignOut}
                              className="w-32 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded h-8 font-black uppercase tracking-widest text-[10px]"
                            >
                              <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                          </>
                        ) : (
                          <Button
                            asChild
                            className="h-8 w-24 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-[#EFA765] hover:border-[#EFA765]/30 text-[10px] rounded font-black uppercase tracking-widest transition-all duration-500"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Link href="/sign-in">
                              <LogIn className="h-4 w-4 mr-2" />
                              Sign In
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
      <div className="h-19 md:h-21" />
    </>
  );
}