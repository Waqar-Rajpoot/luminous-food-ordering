import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" },
                code: { label: "2FA Code", type: "text" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [{ username: credentials.identifier }, { email: credentials.identifier }]
                    });

                    if (!user) throw new Error("User not found.");
                    if (!user.isVerified) throw new Error("Please verify your account before login.");

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) throw new Error("Invalid password.");

                    if (user.twoFactorEnabled) {
                        if (!credentials.code) {
                            throw new Error("2FA_REQUIRED");
                        }

                        const isOtpValid = user.verifyCode === credentials.code && 
                                        new Date(user.verifyCodeExpire) > new Date();

                        if (!isOtpValid) {
                            throw new Error("Invalid or expired 2FA code.");
                        }
                    }

                    return user;
                } catch (error: any) {
                    throw new Error(error.message);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.role = user.role;
                token.twoFactorEnabled = user.twoFactorEnabled; 
            }

            if (trigger === "update" && session?.user) {
                token.twoFactorEnabled = session.user.twoFactorEnabled;
                token.username = session.user.username;
                token.name = session.user.name;
            }
            
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.role = token.role;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.twoFactorEnabled = token.twoFactorEnabled; 
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
};