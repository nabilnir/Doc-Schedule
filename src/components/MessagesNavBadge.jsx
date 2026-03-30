"use client";
/**
 * MessagesNavBadge
 * 
 * Attaches a real-time Firestore listener (WebSocket under the hood) and
 * shows a live unread-message count badge in the sidebar nav.
 * Renders nothing when there are zero unread messages.
 */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebaseClient";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function MessagesNavBadge({ collapsed = false }) {
    // Temporarily disabled Firestore listener to debug Hydration Issue
    return null;
}

