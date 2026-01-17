// app/payment-cancel/page.tsx
'use client'; // This is a Client Component for immediate client-side interactivity

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765] font-[Varela Round]">
      <div className="bg-[#1D2B3F] p-10 rounded-3xl shadow-xl max-w-md mx-auto text-center border border-[#EFA765]/20">
        <div className="text-4xl mb-6 text-red-500 transform transition-transform duration-500 ease-out">
          ❌
        </div>
        <h1 className="text-4xl font-extrabold mb-4 leading-tight yeseva-one">Payment Canceled</h1>
        <p className="text-lg text-red-500 mb-4">
          Your payment was canceled or did not complete successfully.
        </p>
        <p className="text-white text-opacity-80 mb-6">
          If this was unintentional, you can try checking out again.
        </p>

        <div className="flex justify-center flex-col mt-8 space-y-4 md:space-y-4">
          <Link href="/products">
            <Button className="w-full md:w-auto bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full">
              Go to Product page
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full md:w-auto border-[#EFA765] text-[#EFA765] hover:bg-[#EFA765]/10 transition-colors duration-300 rounded-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
