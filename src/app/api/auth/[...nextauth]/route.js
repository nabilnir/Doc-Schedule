import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // ১. ডাটাবেস কানেকশন
          await connectMongoDB();

          // ২. ইউজার খোঁজা
          const user = await User.findOne({ email });
          if (!user) {
            return null; // ইউজার না পেলে নাল রিটার্ন
          }

          // ৩. পাসওয়ার্ড চেক করা
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null; // পাসওয়ার্ড ভুল হলে নাল রিটার্ন
          }

          // ৪. সব ঠিক থাকলে ইউজার অবজেক্ট রিটার্ন করা
          return user;
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // আপনার কাস্টম লগইন পেজের লিংক
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.role = user.role; // সেশনে role সেভ করার জন্য
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role; // ক্লায়েন্ট সাইডে role পাওয়ার জন্য
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
