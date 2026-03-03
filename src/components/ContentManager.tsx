"use client";

import React from 'react';
import { usePage } from '@/context/PageContext';
import AppRouter from './AppRouter'; // The Cart/Checkout flow

interface ContentManagerProps {
  children: React.ReactNode;
}

const ContentManager: React.FC<ContentManagerProps> = ({ children }) => {
  const { currentPage } = usePage();

  const normalizedPage = currentPage?.toLowerCase();
  const isCartFlowActive = normalizedPage === 'cart' || normalizedPage === 'checkout';

  return (
    <main className="min-h-screen pt-20 pb-12">
      {isCartFlowActive ? (
        
        <AppRouter />
      ) : (
        
        children
      )}
    </main>
  );
};

export default ContentManager;