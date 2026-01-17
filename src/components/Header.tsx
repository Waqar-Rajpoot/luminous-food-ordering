// "use client";
// import React, { useRef } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import {
//   LogOut,
//   LayoutDashboard,
//   LogIn,
//   ShoppingCart,
//   UserCircle,
//   Menu,
// } from "lucide-react";

// import { useCart } from "@/context/CartContext";
// import { usePage } from "@/context/PageContext";

// export default function Header() {
//   const { data: session, status } = useSession();
//   const pathname = usePathname();
//   const { setCurrentPage } = usePage();
//   const headerRef = useRef<HTMLElement>(null);
//   const { cartCount } = useCart();

//   const userId = session?.user?._id;

//   const handlePageNavigation = () => {
//     setCurrentPage("products" as any);
//   };

//   const handleCartClick = () => {
//     setCurrentPage("cart" as any);
//   };

//   const handleSignOut = () => {
//     handlePageNavigation();
//     signOut({ callbackUrl: "/" });
//   };

//   const baseNavLinks = [
//     { name: "Home", href: "/" },
//     { name: "About", href: "/about" },
//     { name: "Contact", href: "/contact" },
//     { name: "Products", href: "/products" },
//   ];

//   const getDashboardLink = () => {
//     if (session?.user?.role === "user") {
//       return { href: `/user-dashboard/${userId}`, text: "My Dashboard" };
//     }
//     return null;
//   };

//   const dashboardInfo = getDashboardLink();

//   return (
//     <>
//       <header
//         ref={headerRef}
//         className="fixed top-0 w-full bg-[#141F2D] border-b border-white/10 backdrop-blur-xl z-50 transition-all duration-300"
//       >
//         <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link
//               href="/"
//               onClick={handlePageNavigation}
//               className="text-2xl font-black italic tracking-tighter text-white hover:text-[#EFA765] transition-all duration-300 uppercase"
//             >
//               Luminous<span className="text-[#EFA765]">.</span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {baseNavLinks.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <Link
//                   key={link.name}
//                   href={link.href}
//                   onClick={handlePageNavigation}
//                   className={`relative text-xs font-black uppercase tracking-[0.2em] transition-colors group ${
//                     isActive
//                       ? "text-[#EFA765]"
//                       : "text-gray-400 hover:text-[#EFA765]"
//                   }`}
//                 >
//                   {link.name}
//                   <span
//                     className={`absolute -bottom-1 left-0 h-[2px] bg-[#EFA765] transition-all duration-300 ${
//                       isActive ? "w-full" : "w-0 group-hover:w-full"
//                     }`}
//                   />
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Actions */}
//           <div className="flex items-center space-x-3">
//             {/* --- UPDATED: Cart icon logic --- */}
//             {status === "authenticated" && session?.user?.role !== "admin" && (
//               <button
//                 onClick={handleCartClick}
//                 className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#EFA765] hover:bg-[#EFA765] hover:text-[#141F2D] transition-all duration-500 group"
//               >
//                 <ShoppingCart className="h-5 w-5" />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-[#141F2D] font-black group-hover:bg-[#141F2D] group-hover:text-white transition-colors">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>
//             )}

//             {/* Auth Section */}
//             <div className="hidden md:block">
//               {status === "authenticated" ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       className="h-11 px-4 rounded-xl flex items-center gap-3 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-[#EFA765] hover:border-[#EFA765]/30 transition-all"
//                     >
//                       <UserCircle className="h-5 w-5 text-[#EFA765]" />
//                       <span className="text-xs font-black hover:text-[#EFA765] text-gray-400 uppercase tracking-widest">
//                         Profile
//                       </span>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent
//                     align="end"
//                     className="w-56 bg-[#141F2D] border-white/10 text-white p-2 rounded-2xl shadow-2xl backdrop-blur-2xl"
//                   >
//                     <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
//                       User Account
//                     </div>
//                     {dashboardInfo && (
//                       <DropdownMenuItem
//                         asChild
//                         className="rounded-xl focus:bg-[#EFA765] focus:text-[#141F2D] cursor-pointer py-3"
//                       >
//                         <Link
//                           href={dashboardInfo.href}
//                           className="flex items-center gap-3 font-bold"
//                         >
//                           <LayoutDashboard className="h-4 w-4" />
//                           {dashboardInfo.text}
//                         </Link>
//                       </DropdownMenuItem>
//                     )}
//                     <DropdownMenuSeparator className="bg-white/5 mx-2 my-2" />
//                     <DropdownMenuItem
//                       onClick={handleSignOut}
//                       className="rounded-xl focus:bg-red-500 focus:text-white text-red-400 cursor-pointer py-3 font-bold"
//                     >
//                       <LogOut className="h-4 w-4 mr-3" />
//                       Sign Out
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Button
//                   asChild
//                   className="h-11 px-6 rounded-xl bg-[#EFA765] text-[#141F2D] font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all duration-500 shadow-lg shadow-[#EFA765]/10"
//                 >
//                   <Link href="/sign-in">
//                     <LogIn className="h-4 w-4 mr-2" />
//                     Secure Access
//                   </Link>
//                 </Button>
//               )}
//             </div>

//             {/* Mobile Menu */}
//             <div className="md:hidden">
//               <Sheet>
//                 <SheetTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-white hover:bg-white/5 rounded-xl"
//                   >
//                     <Menu className="w-6 h-6" />
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent
//                   side="right"
//                   className="bg-[#141F2D] border-white/5 text-white w-[300px]"
//                 >
//                   <SheetHeader className="text-left border-b border-white/5 pb-6">
//                     <SheetTitle className="text-2xl font-black italic tracking-tighter text-white uppercase">
//                       Luminous<span className="text-[#EFA765]">.</span>
//                     </SheetTitle>
//                   </SheetHeader>
//                   <nav className="flex flex-col space-y-6 mt-10">
//                     {baseNavLinks.map((link) => {
//                       const isActive = pathname === link.href;
//                       return (
//                         <Link
//                           key={link.name}
//                           href={link.href}
//                           onClick={handlePageNavigation}
//                           className={`text-lg font-black uppercase tracking-widest transition-colors ${
//                             isActive ? "text-[#EFA765]" : "hover:text-[#EFA765]"
//                           }`}
//                         >
//                           {link.name}
//                         </Link>
//                       );
//                     })}
//                     <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
//                       {status === "authenticated" ? (
//                         <>
//                           {dashboardInfo && (
//                             <Link
//                               href={dashboardInfo.href}
//                               className={`flex items-center gap-3 text-lg font-bold ${pathname === dashboardInfo.href ? "text-[#EFA765]" : ""}`}
//                               onClick={handlePageNavigation}
//                             >
//                               <LayoutDashboard
//                                 className={
//                                   pathname === dashboardInfo.href
//                                     ? "text-[#EFA765]"
//                                     : "text-gray-400"
//                                 }
//                               />
//                               {dashboardInfo.text}
//                             </Link>
//                           )}
//                           <Button
//                             onClick={handleSignOut}
//                             className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl h-14 font-black uppercase tracking-widest"
//                           >
//                             <LogOut className="mr-2 h-4 w-4" /> Sign Out
//                           </Button>
//                         </>
//                       ) : (
//                         <Button
//                           asChild
//                           className="w-full bg-[#EFA765] text-[#141F2D] rounded-xl h-14 font-black uppercase tracking-widest"
//                         >
//                           <Link href="/sign-in">Secure Sign In</Link>
//                         </Button>
//                       )}
//                     </div>
//                   </nav>
//                 </SheetContent>
//               </Sheet>
//             </div>
//           </div>
//         </nav>
//       </header>
//       <div className="h-[76px] md:h-[84px]" />
//     </>
//   );
// }








"use client";
import React, { useRef } from "react";
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
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { usePage } from "@/context/PageContext";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { setCurrentPage } = usePage();
  const headerRef = useRef<HTMLElement>(null);
  const { cartCount } = useCart();

  const userId = session?.user?._id;

  const handlePageNavigation = () => {
    setCurrentPage("products" as any);
  };

  const handleCartClick = () => {
    setCurrentPage("cart" as any);
  };

  const handleSignOut = () => {
    handlePageNavigation();
    signOut({ callbackUrl: "/" });
  };

  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Products", href: "/products" },
  ];

  const getDashboardLink = () => {
    if (session?.user?.role === "user") {
      return { href: `/user-dashboard/${userId}`, text: "My Dashboard" };
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
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
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
                    isActive
                      ? "text-[#EFA765]"
                      : "text-gray-400 hover:text-[#EFA765]"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-[#EFA765] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {status === "authenticated" && session?.user?.role !== "admin" && (
              <button
                onClick={handleCartClick}
                className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#EFA765] hover:bg-[#EFA765] hover:text-[#141F2D] transition-all duration-500 group"
              >
                <ShoppingCart className="h-5 w-5" />
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
                      <span className="text-xs font-black hover:text-[#EFA765] text-gray-400 uppercase tracking-widest">
                        Profile
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#141F2D] border-white/10 text-white p-2 rounded-2xl shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      User Account
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
                          <LayoutDashboard className="h-4 w-4" />
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
                  className="h-11 px-6 rounded-xl bg-[#EFA765] text-[#141F2D] font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all duration-500 shadow-lg shadow-[#EFA765]/10"
                >
                  <Link href="/sign-in">
                    <LogIn className="h-4 w-4 mr-2" />
                    Secure Access
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/5 rounded-xl"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                {/* UPDATED CLASSNAME: 
                   - Added 'pr-12' to ensure content never touches the right border.
                   - Added 'pl-8' for the left side.
                   - Increased width to 'w-[85vw]' and 'max-w-[340px]' for better responsiveness.
                */}
                <SheetContent
                  side="right"
                  className="bg-[#141F2D] border-white/5 text-white w-[85vw] max-w-[340px] pl-8 pr-12 pt-14 overflow-y-auto"
                >
                  <div className="flex flex-col h-full">
                    <SheetHeader className="text-left border-b border-white/5 pb-6">
                      <SheetTitle className="text-2xl font-black italic tracking-tighter text-white uppercase">
                        Luminous<span className="text-[#EFA765]">.</span>
                      </SheetTitle>
                    </SheetHeader>
                    
                    <nav className="flex flex-col space-y-7 mt-10">
                      {baseNavLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={handlePageNavigation}
                            className={`text-lg font-black uppercase tracking-widest transition-colors ${
                              isActive ? "text-[#EFA765]" : "text-gray-400 hover:text-[#EFA765]"
                            }`}
                          >
                            {link.name}
                          </Link>
                        );
                      })}
                      
                      <div className="pt-10 border-t border-white/5 flex flex-col gap-6 pb-12">
                        {status === "authenticated" ? (
                          <>
                            {dashboardInfo && (
                              <Link
                                href={dashboardInfo.href}
                                className={`flex items-center gap-4 text-lg font-bold ${
                                  pathname === dashboardInfo.href
                                    ? "text-[#EFA765]"
                                    : "text-gray-400"
                                }`}
                                onClick={handlePageNavigation}
                              >
                                <LayoutDashboard className="h-5 w-5" />
                                {dashboardInfo.text}
                              </Link>
                            )}
                            <Button
                              onClick={handleSignOut}
                              className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl h-14 font-black uppercase tracking-widest"
                            >
                              <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                          </>
                        ) : (
                          <Button
                            asChild
                            className="w-full bg-[#EFA765] text-[#141F2D] rounded-xl h-14 font-black uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-xl shadow-[#EFA765]/10"
                          >
                            <Link href="/sign-in">Secure Sign In</Link>
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
      <div className="h-[76px] md:h-[84px]" />
    </>
  );
}