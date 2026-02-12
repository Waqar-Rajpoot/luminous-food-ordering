// "use client";
// import React from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   Cell,
// } from "recharts";

// export default function AnalyticsCharts({ data }: { data: any }) {
//   if (!data?.graphData) return null;

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
//       {/* Revenue Trend Area Chart */}
//       <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-sm">
//         <h3 className="text-lg font-bold yeseva-one text-[#efa765] mb-6 flex items-center gap-2">
//           <span className="w-2 h-2 bg-[#efa765] rounded-full animate-pulse" />
//           7-Day Revenue Trend
//         </h3>
//         <div className="h-[300px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={data.graphData}>
//               <defs>
//                 <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#efa765" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#efa765" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="#ffffff10"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="date"
//                 stroke="#64748b"
//                 fontSize={10}
//                 tickFormatter={(str) =>
//                   new Date(str).toLocaleDateString("en-US", {
//                     weekday: "short",
//                   })
//                 }
//               />
//               <YAxis stroke="#64748b" fontSize={10} />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#141f2d",
//                   border: "1px solid #efa765",
//                   borderRadius: "12px",
//                   fontSize: "12px",
//                 }}
//                 itemStyle={{ color: "#efa765" }}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#efa765"
//                 fillOpacity={1}
//                 fill="url(#colorRev)"
//                 strokeWidth={3}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Daily Performance Comparison */}
//       <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-sm">
//         <h3 className="text-lg font-bold yeseva-one text-[#efa765] mb-6">
//           Daily Sales Volume
//         </h3>
//         <div className="h-[300px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data.graphData}>
//               <XAxis
//                 dataKey="date"
//                 stroke="#64748b"
//                 fontSize={10}
//                 tickFormatter={(str) => str.split("-")[2]} // Show just the day number
//               />
//               <Tooltip
//                 cursor={{ fill: "#ffffff05" }}
//                 contentStyle={{
//                   backgroundColor: "#141f2d",
//                   border: "1px solid #efa765",
//                   borderRadius: "12px",
//                 }}
//               />
//               <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
//                 {data.graphData.map((entry: any, index: number) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={
//                       index === data.graphData.length - 1
//                         ? "#efa765"
//                         : "#efa76540"
//                     }
//                   />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

export default function AnalyticsDashboard({ analytics }: { analytics: any }) {
  if (!analytics?.graphData) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {/* Sales Trend Graph */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <h3 className="text-lg font-bold yeseva-one text-[#efa765] mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#efa765] rounded-full animate-pulse" />
          7-Day Revenue Trend
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.graphData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#efa765" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#efa765" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={10} 
                tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
              />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141f2d', border: '1px solid #efa765', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#efa765' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#efa765" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success Metrics Bar Chart */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <h3 className="text-lg font-bold yeseva-one text-[#efa765] mb-6">Daily Volume Comparison</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.graphData}>
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(str) => str.split('-')[2]} />
              <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#141f2d', border: '1px solid #efa765', borderRadius: '12px' }} />
              <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                {analytics.graphData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={index === analytics.graphData.length - 1 ? '#efa765' : '#efa76540'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}