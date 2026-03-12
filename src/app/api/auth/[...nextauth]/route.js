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

                if (user.isBlocked) {
                    console.log("User is blocked.");
                    throw new Error("blocked");
                }

                // ── CHECK IF VERIFIED ──────────────────────────────────────────
                if (user.isVerified === false) {
                    console.log("User is not verified.");
                    throw new Error("unverified");
                }

                const valid = await user.comparePassword(credentials.password);
                if (!valid) {
                    const updated = await User.findOneAndUpdate(
                        { email: credentials.email.toLowerCase() },
                        { $inc: { loginAttempts: 1 } },
                        { new: true, upsert: false }
                    );

                    const attemptsUsed = updated.loginAttempts || 0;
                    const isNowBlocked = attemptsUsed >= 5;

                    if (isNowBlocked) {
                        await User.updateOne({ _id: updated._id }, { $set: { isBlocked: true } });
                        throw new Error("blocked");
                    }
                    return null;
                }

                // Reset login attempts on success
                if (user.loginAttempts > 0) {
                    await User.findOneAndUpdate(
                        { email: credentials.email.toLowerCase() },
                        { $set: { loginAttempts: 0 } }
                    );
                }

                // ── HARDCODE ADMIN ROLE ──────────────────────────────────────
                // You can change this email to your desired admin email
                const adminEmail = "docschedule.noreply@gmail.com";
                let userRole = (user.role || "patient").toLowerCase();
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
                    } else {
                        let needsUpdate = false;

                        // If they exist but aren't verified, verify them since they used a trusted OAuth provider
                        if (!existing.isVerified) {
                            existing.isVerified = true;
                            needsUpdate = true;
                        }

                        // If it's a credentials account, maybe update it to reflect social login, or leave as is.
                        // We will just verify them.

                        if (existing.role !== assignedRole && existing.email === adminEmail) {
                            // Ensure existing user gets admin role if email matches
                            existing.role = "admin";
                            needsUpdate = true;
                        }

                        if (needsUpdate) {
                            await existing.save();
                        }
                    }
                } catch (err) {
                    console.error("Error saving/linking OAuth user:", err);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, account, trigger, session }) {
            // Initial sign in
            if (user && account) {
                token.id = user.id;
                token.role = (user.role || "patient").toLowerCase();
                token.phone = user.phone;
                token.provider = account.provider;
                token.email = user.email; // explicitly set email to match the provider email
            }

            // For OAuth providers, we need to fetch the local user data from DB 
            // on subsequent calls or ensures we have the correct DB ID/Role
            if (token.provider && token.provider !== "credentials" && !token.dbCheck) {
                try {
                    await connectDB();
                    const dbUser = await User.findOne({ email: token.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.role = (dbUser.role || "patient").toLowerCase();
                        token.phone = dbUser.phone;
                        token.dbCheck = true; // Cache the check for this session
                    }
                } catch (err) {
                    console.error("JWT Callback DB Check Error:", err);
                }
            }

            if (trigger === "update" && session) {
                if (session.user) {
                    token.name = session.user.name || token.name;
                    token.email = session.user.email || token.email;
                    token.picture = session.user.image || token.picture;
                    token.phone = session.user.phone || token.phone;
                    // Support role update (e.g. after onboarding)
                    token.role = session.user.role || token.role;
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