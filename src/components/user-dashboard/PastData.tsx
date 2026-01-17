// "use client";

// import { Package, Calendar } from "lucide-react";
// import { format, parse } from "date-fns";

// export const PastOrdersTable = ({ latestOrders }: any) => {
//   const getStatusClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return "bg-indigo-700/20 text-indigo-300 border-indigo-700/40";
//       case "paid":
//         return "bg-green-700/20 text-green-300 border-green-700/40";
//       case "canceled":
//         return "bg-red-700/20 text-red-300 border-red-700/40";
//       default:
//         return "bg-gray-700/20 text-gray-300 border-gray-700/40";
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <h4 className="text-xl font-bold text-[#EFA765] flex items-center p-2 bg-slate-700 rounded-t-lg">
//         <Package className="h-5 w-5 mr-2" /> All Orders
//       </h4>
//       <div className="flex-grow max-h-[400px] overflow-y-auto border border-slate-700 rounded-b-lg bg-slate-800">
//         <table className="min-w-full divide-y divide-slate-700">
//           <thead className="bg-slate-700 sticky top-0 shadow-md text-center">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 Order ID
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 Total
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 Date
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 Status
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 shipping Progress
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-700">
//             {latestOrders.map((latestOrders) => (
//               <tr
//                 key={latestOrders._id}
//                 className="text-sm text-gray-300 hover:bg-slate-700 transition duration-150 cursor-pointer"
//               >
//                 <td className="px-4 py-4 font-medium text-white">
//                   {latestOrders._id?.substring(0, 15) || "N/A"}
//                 </td>
//                 <td className="px-4 py-2">
//                   PKR {(latestOrders.totalAmount || 0).toFixed(2)}
//                 </td>
//                 <td className="px-4 py-2">
//                   {new Date(latestOrders.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-4 py-2">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusClass(latestOrders.orderStatus)}`}
//                   >
//                     {latestOrders.orderStatus || "N/A"}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2">
//                   <span
//                       className={`mt-2 sm:mt-0 ml-2 px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${latestOrders.shippingProgress === "processing" ? "bg-yellow-500 text-slate-800" : latestOrders.shippingProgress === "shipped" ? "bg-blue-500 text-slate-800" : latestOrders.shippingProgress === "delivered" ? "bg-green-500 text-slate-800" : latestOrders.shippingProgress === "canceled" ? "bg-red-500 text-white" : "bg-gray-500 text-white"}`}
//                     >
//                       {latestOrders.shippingProgress}
//                     </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // --- Sub-Component: Past Bookings Table ---

// export const PastBookingsTable = ({ latestBookings }: any) => {
//   const getStatusClass = (status) => {
//     switch (status) {
//       case true:
//         return "bg-green-700/20 text-green-300 border-green-700/40";
//       case false:
//         return "bg-yellow-700/20 text-yellow-300 border-yellow-700/40";
//       case "canceled":
//         return "bg-red-700/20 text-red-300 border-red-700/40";
//       default:
//         return "bg-gray-700/20 text-gray-300 border-gray-700/40";
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <h4 className="text-xl font-bold text-[#EFA765] flex items-center p-2 bg-slate-700 rounded-t-lg">
//         <Calendar className="h-5 w-5 mr-2" /> All Bookings
//       </h4>

//       <div className="flex-grow max-h-[400px] overflow-y-auto border border-slate-700 rounded-b-lg bg-slate-800">
//         <table className="min-w-full divide-y divide-slate-700">
//           <thead className="bg-slate-700 sticky top-0 shadow-md">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 Name
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 Guests
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 Date
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 Time
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-700">
//             {latestBookings.map((booking) => (
//               <tr
//                 key={booking._id || booking.id}
//                 className="text-sm text-gray-300 hover:bg-slate-700 transition duration-150 cursor-pointer"
//               >
//                 <td className="px-4 py-4 font-medium text-white">
//                   {booking.name?.substring(0, 8) || "N/A"}
//                 </td>
//                 <td className="px-4 py-2">Guests {booking.guests || "N/A"}</td>
//                 <td className="px-4 py-2">
//                   {new Date(booking.date).toLocaleDateString()}
//                 </td>
//                 <td className="px-4 py-2 font-semibold">
//                   {booking.time
//                     ? format(parse(booking.time, "HH:mm", new Date()), "h:mm a")
//                     : "N/A"}
//                 </td>
//                 <td className="px-4 py-2">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusClass(booking.isConfirmed)}`}
//                   >
//                     {booking.isConfirmed ? "Confirmed" : "Pending"}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };






"use client";

import { Package, Calendar } from "lucide-react";
import { format, parse } from "date-fns";


const getOrderStatusBadge = (status: any) => {
  const lowerStatus = status?.toLowerCase();
  let className = "bg-gray-700/20 text-gray-300 border-gray-700/40";
  let text = status || "N/A";

  switch (lowerStatus) {
    case "pending":
      className = "bg-blue-700/20 text-blue-300 border-blue-700/40 border uppercase";
      break;
    case "paid":
      className = "bg-green-700/20 text-green-300 border-green-700/40 border uppercase";
      break;
    case "canceled":
      className = "bg-red-700/20 text-red-300 border-red-700/40 border uppercase";
      break;
    default:
      className = "bg-gray-700/20 text-gray-300 border-gray-700/40 border uppercase";
      text = "Unknown";
  }

  return { className, text: text.charAt(0).toUpperCase() + text.slice(1) };
};

// For Shipping Progress (Processing, Shipped, Delivered, Canceled)
const getShippingProgressBadge = (progress : any) => {
  const lowerProgress = progress?.toLowerCase();
  let className = "bg-gray-500 text-white";
  let text = progress || "N/A";

  switch (lowerProgress) {
    case "processing":
      className = "bg-yellow-700/20 text-yellow-300 border-yellow-700/40 border";
      break;
    case "shipped":
      className = "bg-blue-700/20 text-blue-300 border-blue-700/40 border";
      break;
    case "delivered":
      className = "bg-green-700/20 text-green-300 border-green-700/40 border";
      break;
    case "canceled":
      className = "bg-red-700/20 text-red-300 border-red-700/40 border";
      break;
    default:
      className = "bg-gray-700/20 text-gray-300 border-gray-700/40 border";
      text = "Unknown";
  }

  return { className, text: text.charAt(0).toUpperCase() + text.slice(1) };
};

// For Booking Status (Confirmed, Pending)
const getBookingStatusBadge = (isConfirmed: any) => {
  let className;
  let text;

  if (isConfirmed === "canceled") {
    className = "bg-red-700/20 text-red-300 border-red-700/40 border uppercase";
    text = "Canceled";
  } else if (isConfirmed === "confirmed") {
    className = "bg-green-700/20 text-green-300 border-green-700/40 border uppercase";
    text = "Confirmed";
  } else if (isConfirmed === "pending") {
    className = "bg-yellow-700/20 text-yellow-300 border-yellow-700/40 border uppercase";
    text = "Pending";
  } else {
    className = "bg-gray-700/20 text-gray-300 border-gray-700/40 border uppercase";
    text = "Unknown";
  }

  return { className, text };
};

export const PastOrdersTable = ({ allOrders }: any) => {

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-xl font-bold text-[#EFA765] flex items-center p-2 bg-slate-700 rounded-t-lg">
        <Package className="h-5 w-5 mr-2" /> All Orders
      </h4>
      <div className="flex-grow max-h-[400px] overflow-y-auto border border-slate-700 rounded-b-lg bg-slate-800">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700 sticky top-0 shadow-md text-center">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Shipping Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {allOrders.map((allOrders: any) => {
              const orderStatusBadge = getOrderStatusBadge(allOrders.orderStatus);
              const shippingBadge = getShippingProgressBadge(allOrders.shippingProgress);
              
              return (
                <tr
                  key={allOrders._id}
                  className="text-sm text-gray-300 hover:bg-slate-700 transition duration-150 cursor-pointer"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {allOrders._id?.substring(0, 15) || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    PKR {(allOrders.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(allOrders.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${orderStatusBadge.className}`}
                    >
                      {orderStatusBadge.text}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${shippingBadge.className}`}
                    >
                      {shippingBadge.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Past Bookings Table Component ---

export const PastBookingsTable = ({ allBookings }: any) => {

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-xl font-bold text-[#EFA765] flex items-center p-2 bg-slate-700 rounded-t-lg">
        <Calendar className="h-5 w-5 mr-2" /> All Bookings
      </h4>

      <div className="flex-grow max-h-[400px] overflow-y-auto border border-slate-700 rounded-b-lg bg-slate-800">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700 sticky top-0 shadow-md">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Guests
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {allBookings.map((booking : any) => {
              const bookingStatusBadge = getBookingStatusBadge(booking.isConfirmed);

              return (
                <tr
                  key={booking._id || booking.id}
                  className="text-sm text-gray-300 hover:bg-slate-700 transition duration-150 cursor-pointer"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {booking.name?.substring(0, 8) || "N/A"}
                  </td>
                  <td className="px-4 py-2">Guests {booking.guests || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {booking.time
                      ? format(parse(booking.time, "HH:mm", new Date()), "h:mm a")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${bookingStatusBadge.className}`}
                    >
                      {bookingStatusBadge.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};