import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs"; // এটি যোগ করতে হবে পাসওয়ার্ড চেক করার জন্য

export const authOptions = {
  providers: [
    // ১. গুগল লগইন
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ২. ক্রেডেনশিয়াল লগইন (ইমেইল ও পাসওয়ার্ড)
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { email, password } = credentials;

        // ডাটাবেজ কানেক্ট করুন
        const usersCollection = await dbConnect("users");
        const user = await usersCollection.findOne({ email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // পাসওয়ার্ড চেক করুন (bcryptjs ব্যবহার করে)
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        // লগইন সফল হলে ইউজার ডাটা রিটার্ন করুন
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // গুগল দিয়ে লগইন করলে ইউজারকে ডাটাবেজে চেক/সেভ করার জন্য
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const usersCollection = await dbConnect("users");
          const existingUser = await usersCollection.findOne({
            email: user.email,
          });

          if (!existingUser) {
            // যদি ইউজার নতুন হয়, তবে তাকে ডাটাবেজে সেভ করো role: "user" দিয়ে
            await usersCollection.insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user", // ডিফল্ট রোল
              provider: account.provider,
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error("Error saving google user:", error);
          return false; // লগইন বাতিল করবে যদি ডাটাবেজে সেভ না হয়
        }
      }
      return true;
    },

    // JWT টোকেনে রোল (Role) এবং আইডি যোগ করা
    async jwt({ token, user }) {
      // যখন প্রথমবার লগইন হবে, তখন ইউজার ডাটা টোকেনে রাখা
      if (user) {
        token.role = user.role;
        token.id = user.id;
      } else {
        // পরবর্তী রিকোয়েস্টগুলোতে ডাটাবেজ থেকে লেটেস্ট রোল নিয়ে আসা (নিরাপত্তার জন্য)
        const usersCollection = await dbConnect("users");
        const dbUser = await usersCollection.findOne({ email: token.email });
        token.role = dbUser?.role || "user";
        token.id = dbUser?._id.toString();
      }
      return token;
    },

    // সেশনে রোল (Role) পাঠানো যাতে ফ্রন্টএন্ডে session.user.role পাওয়া যায়
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // ৩০ দিন সেশন থাকবে
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
