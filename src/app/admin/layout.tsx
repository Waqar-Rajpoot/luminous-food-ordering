

// src/app/admin/layout.tsx
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AdminSheetNav from '@/components/AdminSidebar';
import { authOptions } from '../api/auth/[...nextauth]/options';


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen bg-[#141f2d]">
      <div className="fixed top-22 left-0 z-50">
        <AdminSheetNav />
      </div>
      <main className="flex-1 p-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <Loader2 className="animate-spin h-12 w-12 text-[#efa765]" />
            <p className="text-white text-xl ml-4">Loading Admin Content...</p>
          </div>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  );
}