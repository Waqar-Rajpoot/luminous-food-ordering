'use client';
import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner'; 
import { Loader2 } from 'lucide-react'; 
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { reviewSchema } from '@/schemas/reviewSchema';
import * as z from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ReviewFormInputs = z.infer<typeof reviewSchema>;

function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const orderId = searchParams.get('orderId');
  const productId = searchParams.get('productId');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormInputs>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: '',
      email: '',
      rating: 5,
      review: '',
      userId: '',
      orderId: orderId || '',
      productId: productId || '',
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.setValue('name', session.user.name || '');
      form.setValue('email', session.user.email || '');
      form.setValue('userId', session.user._id as string);
    }
    if (orderId) form.setValue('orderId', orderId);
    if (productId) form.setValue('productId', productId);
  }, [session, orderId, productId, form]);

  const handleSubmitReview = async (data: ReviewFormInputs) => {
    if (!session) {
      toast.error('Please sign in first.');
      return router.push('/sign-in');
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/reviews', data);
      toast.success('Review submitted successfully!');
      router.push(`/order-details/${orderId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderId || !productId) {
    return (
      <div className="text-center text-[#EFA765] p-10">
        <p>Invalid Review Session. Please go back to your order details.</p>
        <Button onClick={() => router.back()} className="mt-4 bg-[#EFA765] text-[#141F2D] rounded-full">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="relative z-20 max-w-xl w-full bg-[#1D2B3F] p-8 md:p-12 rounded-3xl border border-[#efa765]/30 shadow-2xl">
        <h1 className="text-[#efa765] font-bold text-3xl text-center mb-2">How was it?</h1>
        <p className="text-white/40 text-center text-sm mb-8 italic">Reviewing Order #{orderId}</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765]">Rating (1 - 5 Stars)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={5} 
                      {...field} 
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        // Clamp value between 1 and 5
                        if (val > 5) field.onChange(5);
                        else if (val < 1) field.onChange(1);
                        else field.onChange(val);
                      }} 
                      className="bg-[#141F2D] border-[#efa765]/20 text-white focus-visible:ring-[#efa765]/50 h-12" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#efa765]">Detailed Review</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field} 
                      rows={4} 
                      className="w-full bg-[#141F2D] border border-[#efa765]/20 rounded-xl p-3 text-white focus:ring-1 focus:ring-[#efa765] outline-none transition-all" 
                      placeholder="What did you like or dislike?" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Button Centered Container */}
            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                variant="outline" 
                className="border-[#EFA765] text-[#EFA765] bg-[#141F2D] hover:bg-[#EFA765] hover:text-[#141F2D] rounded-full px-12 py-6 transition-all font-bold hover:cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Submitting...
                  </div>
                ) : 'Post Review'}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#141F2D]">
      <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-[#EFA765]" />}>
        <ReviewForm />
      </Suspense>
    </div>
  );
}