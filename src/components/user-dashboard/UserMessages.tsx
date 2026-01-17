// export const UserMessages = ({ messages }) => {
//   return (
//     <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
//       <h3 className="text-2xl font-semibold text-white mb-4">My Messages</h3>
//       {messages.length === 0 ? (
//         <p className="text-gray-400">No messages found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {messages.map((message) => (
//             <li key={message._id} className="border-b border-slate-700 pb-4 last:border-b-0">
//               <p className="font-semibold text-white">Send By: {message.name}</p>
//               <p className="font-semibold text-white">Subject: {message.subject}</p>
//               <p className="text-gray-400 text-sm mt-1">{message.message}</p>
//               <p className="text-xs text-gray-500 mt-2">on {new Date(message.createdAt).toLocaleDateString()}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };





"use client";
import React from 'react';

export const UserMessages = ({ messages }: any) => {
  return (
    // Ensure width is set to full for better dashboard layout integration
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <h3 className="font-semibold text-white mb-4 third-heading">My Messages</h3>
      
      {messages.length === 0 ? (
        <p className="text-gray-400">No messages found.</p>
      ) : (
        // --- Added Fixed Height (max-h-[400px]) and Vertical Scrolling (overflow-y-auto) ---
        <div className="max-h-100 overflow-y-auto pr-2">
          <ul className="space-y-4">
            {messages.map((message: any) => (
              <li 
                key={message._id} 
                className="border-b border-slate-700 pb-4 last:border-b-0 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                <div className="flex flex-col">
                  <p className="font-semibold text-white">
                    <span className="text-gray-400 font-normal">From:</span> {message.name}
                  </p>
                  <p className="font-semibold text-[#EFA765]">
                    <span className="text-gray-400 font-normal">Subject:</span> {message.subject}
                  </p>
                  <p className="text-gray-300 text-sm mt-2 line-clamp-2">{message.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Received on {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMessages;

