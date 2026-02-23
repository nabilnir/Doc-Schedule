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
                if (user.isVerified === false) {
                    console.log("User is not verified.");
                    throw new Error("unverified");
                }

                const valid = await user.comparePassword(credentials.password);
                if (!valid) {
                    console.log("Invalid password.");
                    return null;
                }

                // ── HARDCODE ADMIN ROLE ──────────────────────────────────────
                // You can change this email to your desired admin email
                const adminEmail = "docschedule.noreply@gmail.com";
                let userRole = user.role;
                if (user.email.toLowerCase() === adminEmail.toLowerCase()) {
                    userRole = "admin";
                }

                console.log("Login successful. Role:", userRole);
                return {
                    id: user._id.toString(),
                    name: user.fullName,
                    email: user.email,
                    role: userRole,
                    image: user.image,
                    phone: user.phone,
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

                    // Admin check for OAuth
                    const adminEmail = "docschedule.noreply@gmail.com";
                    const assignedRole = user.email.toLowerCase() === adminEmail.toLowerCase() ? "admin" : "patient";

                    if (!existing) {
                        await User.create({
                            fullName: user.name || "Unknown",
                            email: user.email,
                            image: user.image || "",
                            provider: account.provider,
                            role: assignedRole,
                            isVerified: true,
                        });
                    } else if (existing.role !== assignedRole && existing.email === adminEmail) {
                        // Ensure existing user gets admin role if email matches
                        existing.role = "admin";
                        await existing.save();
                    }
                } catch (err) {
                    console.error("Error saving OAuth user:", err);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, account, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.phone = user.phone;
            }
            if (account) {
                token.provider = account.provider;
            }
            if (trigger === "update" && session) {
                // When calling update() on the client, the new data is passed here
                if (session.user) {
                    token.name = session.user.name || token.name;
                    token.email = session.user.email || token.email;
                    token.picture = session.user.image || token.picture;
                    token.phone = session.user.phone || token.phone;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.phone = token.phone;
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