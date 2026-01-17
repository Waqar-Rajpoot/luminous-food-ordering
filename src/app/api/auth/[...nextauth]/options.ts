import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Username or Email", type: "text", placeholder: "username or email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                try {
                    if (!credentials?.identifier || !credentials?.password) {
                        throw new Error("Please enter both identifier and password.");
                    }
    
                    const { identifier, password } = credentials;
    
                    const user = await UserModel.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    
                    if (!user) {
                        throw new Error("User not found.");
                    }
    
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login.");
                    }
    
                    const isPasswordValid = await bcrypt.compare(password, user.password);
    
                    if (!isPasswordValid) {
                        throw new Error("Invalid password.");
                    }
    
                    return user;
                } catch (error: any) {
                    throw new Error(error);
                    
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.role = token.role;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
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
}
