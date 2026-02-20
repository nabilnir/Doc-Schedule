import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
    providers: [
        // ── Google ──────────────────────────────────────────────────────────────
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        // ── GitHub ──────────────────────────────────────────────────────────────
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
                if (!credentials?.email || !credentials?.password) return null;

                await connectDB();
                const user = await User.findOne({ email: credentials.email.toLowerCase() });

                if (!user || !user.password) return null;

                const valid = await user.comparePassword(credentials.password);
                if (!valid) return null;

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

    // ── Callbacks ──────────────────────────────────────────────────────────────
    callbacks: {
        /**
         * Fired after every sign-in.
         * For OAuth providers we auto-create users in MongoDB on their first login.
         */
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
                            role: "patient", // default role for OAuth users
                        });
                    }
                } catch (err) {
                    console.error("Error saving OAuth user to MongoDB:", err);
                    return false; // Block sign-in on DB error
                }
            }
            return true;
        },

        /** Expose role + id to the JWT */
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

        /** Expose role + id to the client session */
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
