"use client";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { ApiError } from "next/dist/server/api-utils";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

   const searchParams = useSearchParams();
  const emailType = searchParams.get("emailType");



  // State for resend code loading
  // const [isResendingCode, setIsResendingCode] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {

  console.log("emailType in verify page", emailType);

    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
        emailType,
      });

      toast.success(response.data.message);
      if (emailType === 'RESET') {
         router.replace(`/reset-password?username=${params.username}&code=${data.code}`);
      } else {
        router.replace("/sign-in");
      }
    } catch (error) {
      console.error("Error in verifying account:", error); // Use console.error for errors
      const axiosError = error as AxiosError<ApiError>;
      toast.error(
        axiosError.response?.data?.message ??
          "An error occurred while verifying account."
      );
    }
  };

  return (
    // Outer container matching the signup page's min-h, flex, and padding
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      {/* Inner card matching the signup page's styling */}
      <div className="p-8 rounded-xl shadow-lg w-full max-w-md border border-[#efa765]">
        {/* Heading matching the signup page's h2 styling */}
        <h1 className="second-heading mb-6 text-center">Verify Your Account</h1>
        <p className="mb-6 text-center text">
          {/* Adjusted text color for readability on light background */}A
          6-digit verification code has been sent to your email address.it will
          expire in 5 minutes
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  {/* FormLabel matching signup page's styling */}
                  <FormLabel
                    className="varela-round block text-lg mb-4" // Adjusted font-size for label for better visibility
                    style={{ color: "rgb(239, 167, 101)" }}
                  >
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        {/* InputOTPSlot styling to match the Input component's "text" class */}
                        <InputOTPSlot
                          index={0}
                          className="text-gray-900 text border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        />
                        <InputOTPSlot
                          index={1}
                          className="text-gray-900 text border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        />
                        <InputOTPSeparator className="text"/>
                        <InputOTPSlot
                          index={2}
                          className="text-gray-900 text border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        />
                        <InputOTPSlot
                          index={3}
                          className="text-gray-900 text border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        />
                        <InputOTPSeparator className="text"/>
                        <InputOTPSlot
                          index={4}
                          className="text-gray-900 text border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        />
                        <InputOTPSlot
                          index={5}
                          className="text-gray-900 text border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  {/* FormDescription styling */}
                  <FormDescription className="mt-4 text varela-round">
                    Enter the 6-digit code from your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button styling matching signup page */}
            <Button
              type="submit"
              className="varela-round w-full py-3 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md"
              style={{
                backgroundColor: "rgb(239, 167, 101)",
                color: "rgb(20, 31, 45)",
              }}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : "Verify Account"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
