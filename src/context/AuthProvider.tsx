"use client";
import { ImageKitProvider } from "@imagekit/next";

import { SessionProvider } from "next-auth/react";

const urlEndPoing = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={30 * 60}>
      <ImageKitProvider urlEndpoint={urlEndPoing}>{children}</ImageKitProvider>
    </SessionProvider>
  );
}
