"use client";

import { useEffect, useRef } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

/**
 * Real-time presence tracker using Firestore.
 *
 * Writes to: presence/{emailKey}  →  { isOnline, lastSeen }
 *
 * Strategy:
 *  1. Mark online immediately on mount.
 *  2. Send a heartbeat every HEARTBEAT_MS to keep `lastSeen` fresh.
 *     (Consumers treat lastSeen > 2 min ago as "offline" even if isOnline=true,
 *      which handles browser crashes where beforeunload never fires.)
 *  3. Mark offline on:
 *       - beforeunload  (tab close / hard navigation)
 *       - visibilitychange → hidden  (tab switched, minimized)
 *       - useEffect cleanup  (client-side navigation / sign-out)
 */

const HEARTBEAT_MS = 45_000; // 45 seconds

export function usePresence(userEmail) {
    const timerRef = useRef(null);

    useEffect(() => {
        if (!userEmail) return;

        const key = userEmail.toLowerCase().replace(/[@.]/g, "_");
        const ref = doc(db, "presence", key);

        const setOnline  = () =>
            setDoc(ref, { isOnline: true,  lastSeen: serverTimestamp() }, { merge: true });

        const setOffline = () =>
            setDoc(ref, { isOnline: false, lastSeen: serverTimestamp() }, { merge: true });

        const sendBeaconOffline = () => {
            const payload = new Blob(
                [JSON.stringify({ email: userEmail })],
                { type: "application/json" }
            );
            navigator.sendBeacon?.("/api/user/offline", payload);
        };

        // 1. Mark online immediately
        setOnline();

        // 2. Heartbeat
        timerRef.current = setInterval(setOnline, HEARTBEAT_MS);

        // 3a. Tab closed / hard reload
        const handleUnload = () => {
            clearInterval(timerRef.current);
            sendBeaconOffline();
            setOffline(); // Best effort
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            // 3b. Client-side navigation / sign-out
            clearInterval(timerRef.current);
            sendBeaconOffline();
            setOffline();
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [userEmail]);
}
