import { NextResponse } from "next/server";

/**
 * POST /api/user/offline
 * Called by navigator.sendBeacon() when the user's tab closes.
 *
 * NOTE: We can't use the Firebase client SDK here (server-side).
 * The actual Firestore write is done via the Firebase REST API so no
 * Admin SDK is required — only the project ID and a public write is
 * allowed by Firestore security rules for authenticated users.
 *
 * The Firestore client SDK's setDoc in usePresence also fires on
 * beforeunload, so this route is only a best-effort backup.
 */
export async function POST(req) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ ok: false }, { status: 400 });

        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        if (!projectId) return NextResponse.json({ ok: false }, { status: 500 });

        const key = email.replace(/[@.+]/g, "_");
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/presence/${key}`;

        // Firestore REST API PATCH (merge semantics via updateMask)
        const body = {
            fields: {
                isOnline: { booleanValue: false },
                lastSeen: { timestampValue: new Date().toISOString() },
            },
        };

        await fetch(`${url}?updateMask.fieldPaths=isOnline&updateMask.fieldPaths=lastSeen`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Offline route error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
