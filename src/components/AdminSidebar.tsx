// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { signOut } from 'next-auth/react';
// import {
//   Box,
//   LayoutDashboard,
//   Settings,
//   Menu,
//   Star,
//   MessageSquare,
//   ListOrdered,
//   Users,
//   ShieldCheck,
//   ChevronRight,
//   LogOut
// } from 'lucide-react';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";

// export default function AdminNavbar() {
//   const pathname = usePathname();

//   const navLinks = [
//     { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
//     { href: '/admin/product-management', label: 'Products', icon: Box },
//     { href: '/admin/orders', label: 'Orders', icon: ListOrdered },
//     { href: '/admin/reviews', label: 'Reviews', icon: Star },
//     { href: '/admin/users', label: 'Users', icon: Users },
//     { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
//     { href: '/admin/settings', label: 'Settings', icon: Settings },
//   ];

//   const handleLogout = () => {
//     signOut({ callbackUrl: '/' });
//   };

//   return (
//     <nav className="fixed top-0 left-0 w-full z-[100] bg-[#141F2D]/90 border-b border-white/5">
//       <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
//         {/* Left: Brand Identity */}
//         <div className="flex items-center gap-3 min-w-fit">
//           <ShieldCheck size={24} className="text-[#EFA765]" />
//           <h1 className="text-xs font-black uppercase tracking-[0.3em] text-white">
//             Admin<span className="text-[#EFA765]">Core</span>
//           </h1>
//         </div>

//         {/* Center: Clean Text-Only Navigation (Desktop) */}
//         <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
//           {navLinks.map((link) => {
//             const isActive = pathname === link.href;
//             return (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={`relative px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 group ${
//                   isActive ? 'text-[#EFA765]' : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 {link.label}
//                 {/* Premium underline indicator */}
//                 <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EFA765] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
//               </Link>
//             );
//           })}
//         </div>

//         {/* Right: Actions */}
//         <div className="flex items-center gap-4">
//           {/* Desktop Logout - Simplified */}
//           <button 
//             onClick={handleLogout}
//             className="hidden md:flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest"
//           >
//             <LogOut size={14} />
//             <span>Sign Out</span>
//           </button>

//           {/* Mobile Toggle */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="md:hidden h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-[#EFA765]"
//               >
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent
//               side="left"
//               className="w-72 bg-[#141F2D] border-r border-[#EFA765]/20 p-0 text-white"
//             >
//               <SheetHeader className="p-8 border-b border-white/5 text-left">
//                 <SheetTitle>
//                   <span className="text-2xl font-black italic tracking-tighter uppercase text-white">
//                     Luminous<span className="text-[#EFA765]">.</span>
//                   </span>
//                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mt-2">Management</p>
//                 </SheetTitle>
//               </SheetHeader>
              
//               <nav className="p-4 space-y-1 mt-4">
//                 {navLinks.map((link) => {
//                   const isActive = pathname === link.href;
//                   return (
//                     <Link
//                       key={link.href}
//                       href={link.href}
//                       className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
//                         isActive 
//                         ? 'bg-[#EFA765] text-[#141F2D]' 
//                         : 'text-gray-400 hover:bg-white/5'
//                       }`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <link.icon size={18} />
//                         <span className="text-xs font-black uppercase tracking-widest">{link.label}</span>
//                       </div>
//                       <ChevronRight size={14} className={isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} />
//                     </Link>
//                   );
//                 })}

//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-4 p-4 mt-6 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-black uppercase tracking-widest text-xs"
//                 >
//                   <LogOut size={18} />
//                   Sign Out
//                 </button>
//               </nav>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </nav>
//   );
// }




'use client';

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
  Tag // Added for Deals
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

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/product-management', label: 'Products', icon: Box },
    { href: '/admin/orders', label: 'Orders', icon: ListOrdered },
    { href: '/admin/deals', label: 'Deals', icon: Tag }, // New Link Added
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#141F2D]/90 border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 min-w-fit">
          <ShieldCheck size={24} className="text-[#EFA765]" />
          <h1 className="text-xs font-black uppercase tracking-[0.3em] text-white hidden xs:block">
            Admin<span className="text-[#EFA765]">Core</span>
          </h1>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
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
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#EFA765] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Logout */}
          <button 
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          {/* Mobile Toggle (Visible on both tablet and mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-[#EFA765]"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 bg-[#141F2D] border-r border-[#EFA765]/20 p-0 text-white overflow-y-auto"
            >
              <SheetHeader className="p-8 border-b border-white/5 text-left">
                <SheetTitle>
                  <span className="text-2xl font-black italic tracking-tighter uppercase text-white">
                    Luminous<span className="text-[#EFA765]">.</span>
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mt-2">Management</p>
                </SheetTitle>
              </SheetHeader>
              
              <nav className="p-4 space-y-1 mt-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
                        isActive 
                        ? 'bg-[#EFA765] text-[#141F2D]' 
                        : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <link.icon size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">{link.label}</span>
                      </div>
                      <ChevronRight size={14} className={isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} />
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 mt-6 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-black uppercase tracking-widest text-xs"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}