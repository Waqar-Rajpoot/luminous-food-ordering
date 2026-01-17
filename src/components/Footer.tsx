import Link from "next/link";
import { Mail, MapPin, Instagram, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#0F172A] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[#EFA765]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* --- BRAND SECTION --- */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
              Luminous<span className="text-[#EFA765]">.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
              Crafting elite digital experiences and premium selections for the modern connoisseur. Excellence is our only standard.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Twitter size={18} />, color: "hover:text-[#1DA1F2]", href: "#" },
                { icon: <Linkedin size={18} />, color: "hover:text-[#0A66C2]", href: "#" },
                { icon: <Instagram size={18} />, color: "hover:text-[#E1306C]", href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className={`h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:bg-white/10 hover:border-white/20`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* --- CONTACT INFO --- */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EFA765]">Architect</h4>
            <ul className="space-y-4">
              <li className="group">
                <a href="mailto:rajpoottony61@gmail.com" className="flex items-start gap-3 group">
                  <Mail size={18} className="text-[#EFA765] mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Email</p>
                    <p className="text-gray-300 group-hover:text-white transition-colors">rajpoottony61@gmail.com</p>
                  </div>
                </a>
              </li>
              <li className="group">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#EFA765] mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Location</p>
                    <p className="text-gray-300">Govt College Sahiwal, Pakistan</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* --- HOURS --- */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EFA765]">Availability</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Mon — Fri</span>
                <span className="text-gray-300 font-medium">08:00 — 14:00</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Saturday</span>
                <span className="text-gray-300 font-medium">08:00 — 16:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#EFA765] font-bold italic">Sunday</span>
                <span className="text-white font-black">24 / 7</span>
              </div>
            </div>
          </div>

          {/* --- LEGAL / LINKS --- */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EFA765]">Resources</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Documentation'].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-1 group transition-colors text-sm">
                    {item}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            &copy; {new Date().getFullYear()} Luminous Bistro <span className="mx-2 text-white/10">|</span> Developed by Muhammad Waqar
          </p>
          <div className="flex gap-6">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EFA765] animate-pulse">
               System Status: Operational
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
}