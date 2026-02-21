import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
    providers: [
        // ── Google & GitHub (OAuth users are auto-verified) ──────────────────
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),

        // ── Email / Password ────────────────────────────────────────────────────
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials.");
                    return null;
                }

                await connectDB();
                const user = await User.findOne({ email: credentials.email.toLowerCase() });

                if (!user) {
                    console.log("User not found in DB.");
                    return null;
                }

                if (!user.password) {
                    console.log("User has no password (likely OAuth).");
                    return null;
                }

                // ── CHECK IF VERIFIED ──────────────────────────────────────────
                // If the user does not verify using the OTP, we will block the login.
                if (user.isVerified === false) {
                    console.log("User is not verified.");
                    throw new Error("unverified"); // This will be handled as an error on the frontend.
                }

                const valid = await user.comparePassword(credentials.password);
                if (!valid) {
                    console.log("Invalid password.");
                    return null;
                }

                console.log("Login successful.");
                return {
                    id: user._id.toString(),
                    name: user.fullName,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google" || account.provider === "github") {
                try {
                    await connectDB();

                    const existing = await User.findOne({ email: user.email });
                    if (!existing) {
                        await User.create({
                            fullName: user.name || "Unknown",
                            email: user.email,
                            image: user.image || "",
                            provider: account.provider,
                            role: "patient",
                            isVerified: true, // OAuth users are auto-verified
                        });
                    }
                } catch (err) {
                    console.error("Error saving OAuth user:", err);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            if (account) {
                token.provider = account.provider;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.provider = token.provider;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };