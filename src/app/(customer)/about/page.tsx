// "use client"; // This component will run on the client-side

// import { Image } from "@imagekit/next";
// import React from "react"; // Import React for JSX
// import {
//   IMAGEKIT_URL_ENDPOINT,
//   aboutImage1Src,
//   AboutHeroImageSrc,  
// } from "@/utils/imagekit-images";

// export default function AboutUs() {
//   return (
//     <>
//       {/* Hero Section - Same as Home Page */}
//       <div className="relative w-full h-[60vh] overflow-hidden">
//         {AboutHeroImageSrc && (
//           <Image
//             urlEndpoint={IMAGEKIT_URL_ENDPOINT}
//             src={AboutHeroImageSrc}
//             alt="A premium and Authentic Restaurant Interior"
//             width={1920}
//             height={1080}
//             priority
//             className="absolute inset-0 w-full h-full object-cover rounded-b-[40px]"
//           />
//         )}
//         <div className="absolute inset-0 bg-[rgba(20,31,45,0.8)] z-10"></div>
//         <div className="absolute inset-0 flex items-center justify-center z-20 p-8">
//           {" "}
//           {/* Centered text */}
//           <h2 className="yeseva-one text-[80px] leading-[1.1] text-[rgb(239,167,101)] text-6xl md:text-8xl font-bold drop-shadow-lg text-center">
//             Who Are We
//           </h2>
//         </div>
//       </div>

//       {/* Section 2: Centered Text and Full-Width Image */}
//       <section className="flex flex-col items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
//         <div className="w-full text-center p-4 max-w-4xl mx-auto">
//           <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
//             About us
//           </h3>
//           <p className="text-gray-300 text-xl leading-relaxed text-justify">
//             At <span className="font-bold text-[rgb(239,167,101)]">Luminous Bistro</span>, we are more
//             than just a restaurant; we are a destination where culinary artistry
//             meets exceptional value. Our kitchen is home to some of the{" "}
//             <span className="font-bold">best cooks of world</span>, whose
//             passion for flavor translates into every meticulously crafted dish,
//             consistently winning{" "}
//             <span className="font-bold">worldwide cooking competitions</span>{" "}
//             for their unparalleled taste. This global recognition underscores
//             our commitment to delivering delicious, high-quality{" "}
//             <span className="font-bold">halal food</span>. Beyond the plate, our
//             dedicated staff are renowned for their{" "}
//             <span className="font-bold">best behavior</span> and genuine warmth,
//             ensuring every customer interaction is a delightful experience. We
//             pride ourselves on offering these gourmet experiences at{" "}
//             <span>very cheap rates</span>, making exquisite dining accessible to
//             everyone in Sahiwal. From our striking American-inspired glass
//             architecture to our luminous, comfortable interiors, every aspect of{" "}
//             <span className="font-bold">Luminous Bistro</span> is designed to
//             create a memorable and inviting atmosphere for all our cherished
//             guests.
//           </p>
//         </div>
//         <div className="w-full rounded-lg overflow-hidden shadow-xl border border-[#efa765]">
//           {/* Placeholder for your image */}
//           {aboutImage1Src && ( // Using galleryImage1Src as a placeholder
//             <Image
//               urlEndpoint={IMAGEKIT_URL_ENDPOINT}
//               src={aboutImage1Src}
//               alt="About Us Image"
//               width={1200}
//               height={700}
//               className="w-full h-auto object-cover rounded-lg"
//             />
//           )}
//         </div>
//       </section>

//       {/* Section 3: History */}
//       <section className="flex flex-col items-center justify-center p-8 lg:p-16 bg-[#141f2d] gap-10 lg:gap-20">
//         <div className="w-full text-center p-4 max-w-4xl mx-auto">
//           <h3 className="yeseva-one second-heading text-4xl md:text-5xl font-bold mb-4 text-[rgb(239,167,101)] drop-shadow-md">
//             Our Story & History
//           </h3>
//           <p className="text-gray-300 text-xl leading-relaxed text-justify">
//             {/* Placeholder for your history text */}
//             <span className="font-bold">Luminous</span> proudly opened
//             its doors in 2005, a vision brought to life by{" "}
//             <span className="font-bold text-[rgb(239,167,101)]">Muhammad Waqar</span>, a dedicated
//             student from{" "}
//             <span className="font-bold text-[rgb(239,167,101)]">Government College Sahiwal</span>.
//             Nestled in the heart of <span className="font-bold">Sahiwal</span>,
//             Pakistan, our establishment stands as a unique architectural marvel,
//             drawing inspiration from American design principles. This blend of
//             local charm and international aesthetics creates an inviting
//             atmosphere unlike any other. From its inception, Luminous Bistro was
//             conceived with a clear purpose: to offer an unparalleled dining
//             experience rooted in quality and tradition. We are committed to
//             serving 100% halal food, ensuring every dish meets the highest
//             standards of preparation and taste for our diverse clientele. After
//             two years of dedicated effort and passion, we are thrilled to be
//             actively serving the community, continuously striving to provide
//             delicious meals and a memorable ambiance. Luminous Bistro is more
//             than just a restaurant; it is a testament to local talent and a
//             beacon of culinary excellence in Sahiwal.
//           </p>
//         </div>
//       </section>
//     </>
//   );
// }




"use client";

import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Users, 
  ArrowRight, 
  Star, 
  Truck 
} from "lucide-react";

export default function AboutUs() {
  return (
    <div className="bg-[#141f2d] min-h-screen text-white">

      {/* --- PREMIUM TYPOGRAPHIC HERO --- */}
      <section className="pt-20 pb-20 px-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex flex-col gap-6 text-center md:text-left">
          <span className="text-[#efa765] text-xs font-black uppercase tracking-[0.6em]">
            Digital Gastronomy
          </span>
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none">
            Beyond <br /> 
            <span className="text-[#efa765]">Delivery.</span>
          </h1>
          <p className="max-w-2xl text-gray-400 text-lg md:text-xl font-light leading-relaxed mt-6">
            We are a high-performance food technology ecosystem dedicated to connecting 
            discerning palates with the finest culinary creations in the region.
          </p>
        </div>
      </section>

      {/* --- MISSION SECTION (The "Who We Are") --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-8">
              The Digital <span className="text-[#efa765]">Standard.</span>
            </h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-light">
              <p>
                Founded on the principles of efficiency and culinary excellence, 
                <span className="text-[#efa765] font-bold"> Luminous</span> has evolved 
                from a vision into Sahiwal’s premier online food platform. We don’t just 
                move food; we curate experiences.
              </p>
              <p>
                By leveraging advanced logistics and a rigorous quality-control network, 
                we ensure that every order maintains its integrity from the hand to chef of doorstep. Our platform serves as a bridge between 
                world-class flavors and the convenience of modern living.
              </p>
            </div>
          </div>

          {/* Stats/Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Partner Kitchens", val: "50+", icon: <Globe size={20} /> },
              { label: "Active Patrons", val: "10k+", icon: <Users size={20} /> },
              { label: "Average Delivery", val: "24m", icon: <Zap size={20} /> },
              { label: "Quality Rating", val: "4.9/5", icon: <Star size={20} /> },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col gap-4 hover:border-[#efa765]/50 transition-colors">
                <div className="text-[#efa765]">{stat.icon}</div>
                <div>
                  <div className="text-3xl font-black text-white italic">{stat.val}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CORE PILLARS SECTION --- */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Our Core <span className="text-[#efa765]">Pillars</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="group p-10 rounded-[3rem] bg-[#141f2d] border border-white/5 hover:border-[#efa765] transition-all duration-500">
              <ShieldCheck className="text-[#efa765] mb-6 h-10 w-10" />
              <h4 className="text-2xl font-bold uppercase italic tracking-tighter mb-4">Elite Vetting</h4>
              <p className="text-gray-400 font-light leading-relaxed">
                We only partner with kitchens that meet our Gold Standard of hygiene and flavor. 
                Every partner is audited to ensure 100% Halal and premium quality.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group p-10 rounded-[3rem] bg-[#141f2d] border border-white/5 hover:border-[#efa765] transition-all duration-500">
              <Truck className="text-[#efa765] mb-6 h-10 w-10" />
              <h4 className="text-2xl font-bold uppercase italic tracking-tighter mb-4">Smart Logistics</h4>
              <p className="text-gray-400 font-light leading-relaxed">
                Our proprietary routing algorithms minimize transit time, ensuring your 
                gourmet selection arrives at the precise temperature intended by the chef.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group p-10 rounded-[3rem] bg-[#141f2d] border border-white/5 hover:border-[#efa765] transition-all duration-500">
              <Zap className="text-[#efa765] mb-6 h-10 w-10" />
              <h4 className="text-2xl font-bold uppercase italic tracking-tighter mb-4">Pricing Integrity</h4>
              <p className="text-gray-400 font-light leading-relaxed">
                We believe luxury should be accessible. By optimizing digital operations, 
                we offer premium dining experiences at the most competitive rates in Sahiwal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CALL TO ACTION --- */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-10">
            Ready for <br /> <span className="text-[#efa765]">Excellence?</span>
          </h2>
          <button 
            onClick={() => window.location.href = '/products'}
            className="group relative inline-flex items-center gap-4 bg-[#efa765] text-[#141f2d] px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all overflow-hidden"
          >
            Explore Our Products
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer Decoration */}
      <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#efa765] to-transparent opacity-20" />
    </div>
  );
}