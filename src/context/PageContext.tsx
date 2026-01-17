// // src/context/PageContext.tsx
// "use client"; // Important for Next.js app router client components

// import React, { createContext, useContext, useState, ReactNode } from 'react';

// type PageContextType = {
//   // Use a type union for strong typing if your pages are fixed
//   currentPage: 'home' | 'products' | 'cart' | 'checkout' | string; 
//   setCurrentPage: (page: string) => void;
// };

// const PageContext = createContext<PageContextType | null>(null);

// // Custom hook to consume the context
// export const usePage = () => {
//   const context = useContext(PageContext);
//   if (!context) {
//     throw new Error('usePage must be used within a PageProvider');
//   }
//   return context;
// };

// // Provider component
// export const PageProvider = ({ children }: { children: ReactNode }) => {
//   // Start on the 'home' page by default
//   const [currentPage, setCurrentPage] = useState<PageContextType['currentPage']>('home'); 

//   const contextValue: PageContextType = {
//     currentPage,
//     setCurrentPage,
//   };

//   return (
//     <PageContext.Provider value={contextValue}>
//       {children}
//     </PageContext.Provider>
//   );
// };



"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define strictly allowed pages
export type PageName = 'products' | 'cart' | 'home' | 'checkout';

type PageContextType = {
  currentPage: PageName;
  setCurrentPage: React.Dispatch<React.SetStateAction<PageName>>;
};

const PageContext = createContext<PageContextType | null>(null);

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) throw new Error('usePage must be used within a PageProvider');
  return context;
};

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<PageName>('products'); 

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};