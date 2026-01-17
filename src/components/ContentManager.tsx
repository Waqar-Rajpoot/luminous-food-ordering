// "use client";

// import React from 'react';
// import { usePage } from '@/context/PageContext';
// import AppRouter from './AppRouter'; // The Cart Router

// interface ContentManagerProps {
//     children: React.ReactNode;
// }

// const ContentManager: React.FC<ContentManagerProps> = ({ children }) => {
//     const { currentPage } = usePage();

//     // The condition to switch from file-based routing to SPA routing
//     const isCartFlowActive = currentPage === 'cart' || currentPage === 'checkout';

//     return (
//         // 🎯 This is the ONLY <main> tag for the entire page content.
//         <main className="min-h-screen pt-4 pb-12">
//             {isCartFlowActive ? (
//                 // If true, render the Cart/Checkout flow.
//                 <AppRouter />
//             ) : (
//                 // If false, render the default Next.js page (e.g., /about, /menu, /products)
//                 children
//             )}
//         </main>
//     );
// };

// export default ContentManager;



"use client";

import React from 'react';
import { usePage } from '@/context/PageContext';
import AppRouter from './AppRouter'; // The Cart/Checkout flow

interface ContentManagerProps {
  children: React.ReactNode;
}

const ContentManager: React.FC<ContentManagerProps> = ({ children }) => {
  const { currentPage } = usePage();

  // Determine if we should show the AppRouter (Cart/Checkout) or the regular page
  // We use .toLowerCase() to prevent errors if the state was set to "Cart" vs "cart"
  const normalizedPage = currentPage?.toLowerCase();
  const isCartFlowActive = normalizedPage === 'cart' || normalizedPage === 'checkout';

  return (
    <main className="min-h-screen pt-4 pb-12">
      {isCartFlowActive ? (
        /* When isCartFlowActive is true, Next.js 'children' (the products page) 
           are hidden and the AppRouter (Cart/Checkout flow) is shown.
        */
        <AppRouter />
      ) : (
        /* Default Next.js page content (Home, Products, About, etc.)
        */
        children
      )}
    </main>
  );
};

export default ContentManager;