"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebaseClient";
import {
    collection, doc, query, where, orderBy, onSnapshot,
    addDoc, updateDoc, setDoc, serverTimestamp, getDoc,
} from "firebase/firestore";
import { cn } from "@/lib/utils";
import {
    Send, Search, MessageSquare, Plus, X, ArrowLeft,
    CheckCheck, Phone, Video, MoreVertical, Smile,
    Paperclip, Check,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */

/** Generate a deterministic, Firestore-safe conversation ID from two emails */
function getConvId(email1, email2) {
    return [email1, email2]
        .sort()
        .map(e => e.replace(/[@.+]/g, "_"))
        .join("___");
}

/** Human-readable relative timestamp */
function formatTime(timestamp) {
    if (!timestamp) return "";
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diff < 604_800_000) return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

/** Group messages by date for section headers */
function groupByDate(messages) {
    const groups = {};
    messages.forEach(msg => {
        const date = msg.timestamp?.toDate
            ? msg.timestamp.toDate()
            : new Date(msg.timestamp || Date.now());
        const key = date.toDateString();
        if (!groups[key]) groups[key] = [];
        groups[key].push(msg);
    });
    return groups;
}

function friendlyDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "Today";
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

/* ─────────────────────────────────────────────────────────
   AVATAR
───────────────────────────────────────────────────────── */
function Avatar({ name = "", image = "", size = "md", ring = false }) {
    const sizes = { sm: "w-7 h-7 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-xl" };
    return (
        <div className={cn(
            sizes[size],
            "rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center font-black",
            ring && "ring-2 ring-[#7BA1C7]/40"
        )}>
            {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#7BA1C7] to-blue-700 flex items-center justify-center text-white">
                    {name?.charAt(0)?.toUpperCase() || "?"}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────────────────────────── */
function ConvSkeleton() {
    return (
        <div className="p-4 space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-2/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function MessagesPage() {
    const { data: session } = useSession();
    const userEmail  = session?.user?.email  || "";
    const userName   = session?.user?.name   || "Me";
    const userImage  = session?.user?.image  || "";
    const userRole   = (session?.user?.role  || "patient").toLowerCase();

    /* ── State ── */
    const [conversations,    setConversations]    = useState([]);
    const [activeConvId,     setActiveConvId]     = useState(null);
    const [messages,         setMessages]         = useState([]);
    const [newMessage,       setNewMessage]       = useState("");
    const [sending,          setSending]          = useState(false);
    const [contacts,         setContacts]         = useState([]);
    const [loadingContacts,  setLoadingContacts]  = useState(false);
    const [showNewChat,      setShowNewChat]      = useState(false);
    const [searchQuery,      setSearchQuery]      = useState("");
    const [loading,          setLoading]          = useState(true);
    const [mobileShowChat,   setMobileShowChat]   = useState(false);

    /* ── Refs ── */
    const messagesEndRef  = useRef(null);
    const textareaRef     = useRef(null);
    const msgUnsubRef     = useRef(null);

    /* ── Auto-scroll ── */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ─────────────────────────────────────────────────────
       REALTIME: Conversations list  (WebSocket via Firestore)
    ───────────────────────────────────────────────────── */
    useEffect(() => {
        if (!userEmail) return;

        // No orderBy here — avoids requiring a Firebase composite index.
        // We sort client-side by lastMessageAt instead.
        const q = query(
            collection(db, "conversations"),
            where("participantEmails", "array-contains", userEmail)
        );

        const unsub = onSnapshot(q, snap => {
            const convs = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => {
                    const aTime = a.lastMessageAt?.toMillis?.() ?? 0;
                    const bTime = b.lastMessageAt?.toMillis?.() ?? 0;
                    return bTime - aTime; // newest first
                });
            setConversations(convs);
            setLoading(false);
        }, err => {
            console.error("Conversations listener error:", err);
            setLoading(false);
        });

        return () => unsub();
    }, [userEmail]);

    /* ─────────────────────────────────────────────────────
       REALTIME: Messages in active conversation (WebSocket)
    ───────────────────────────────────────────────────── */
    useEffect(() => {
        // Tear down previous listener
        if (msgUnsubRef.current) { msgUnsubRef.current(); msgUnsubRef.current = null; }
        if (!activeConvId) { setMessages([]); return; }

        const q = query(
            collection(db, "conversations", activeConvId, "messages"),
            orderBy("timestamp", "asc")
        );

        msgUnsubRef.current = onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            markAsRead(activeConvId);
        });

        return () => { if (msgUnsubRef.current) msgUnsubRef.current(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConvId]);

    /* ─────────────────────────────────────────────────────
       Mark conversation as read
    ───────────────────────────────────────────────────── */
    const markAsRead = useCallback(async (convId) => {
        if (!convId || !userEmail) return;
        try {
            const key = userEmail.replace(/[@.]/g, "_");
            await updateDoc(doc(db, "conversations", convId), { [`unread.${key}`]: 0 });
        } catch { /* conversation might not yet fully exist—safe to ignore */ }
    }, [userEmail]);

    /* ─────────────────────────────────────────────────────
       Fetch appointment-based contacts
    ───────────────────────────────────────────────────── */
    useEffect(() => {
        if (!userEmail || !showNewChat) return;
        setLoadingContacts(true);
        fetch("/api/messages/contacts")
            .then(r => r.json())
            .then(d => { setContacts(d.contacts || []); setLoadingContacts(false); })
            .catch(() => setLoadingContacts(false));
    }, [userEmail, showNewChat]);

    /* ─────────────────────────────────────────────────────
       Start or open a conversation
    ───────────────────────────────────────────────────── */
    const openConversation = useCallback(async (contact) => {
        if (!userEmail || !contact?.email) return;
        const convId  = getConvId(userEmail, contact.email);
        const convRef = doc(db, "conversations", convId);
        const snap    = await getDoc(convRef);

        if (!snap.exists()) {
            await setDoc(convRef, {
                participantEmails: [userEmail, contact.email],
                participantNames:  { [userEmail]: userName,   [contact.email]: contact.name  },
                participantImages: { [userEmail]: userImage,  [contact.email]: contact.image || "" },
                participantRoles:  { [userEmail]: userRole,   [contact.email]: contact.role  },
                lastMessage:       "",
                lastMessageAt:     serverTimestamp(),
                lastMessageSender: "",
                unread: {
                    [userEmail.replace(/[@.]/g, "_")]:        0,
                    [contact.email.replace(/[@.]/g, "_")]:   0,
                },
                createdAt: serverTimestamp(),
            });
        }

        setActiveConvId(convId);
        setShowNewChat(false);
        setMobileShowChat(true);
        setTimeout(() => textareaRef.current?.focus(), 100);
    }, [userEmail, userName, userImage, userRole]);

    /* ─────────────────────────────────────────────────────
       Send a message
    ───────────────────────────────────────────────────── */
    const sendMessage = useCallback(async () => {
        const text = newMessage.trim();
        if (!text || !activeConvId || !userEmail || sending) return;

        setSending(true);
        setNewMessage("");
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        try {
            const convRef  = doc(db, "conversations", activeConvId);
            const convSnap = await getDoc(convRef);
            const convData = convSnap.data() || {};

            const recipientEmail = convData.participantEmails?.find(e => e !== userEmail) || "";
            const recipientKey   = recipientEmail.replace(/[@.]/g, "_");

            // Add message sub-document
            await addDoc(collection(db, "conversations", activeConvId, "messages"), {
                senderEmail: userEmail,
                senderName:  userName,
                text,
                timestamp:   serverTimestamp(),
                read:        false,
            });

            // Update conversation metadata
            const currentUnread = convData.unread?.[recipientKey] || 0;
            await updateDoc(convRef, {
                lastMessage:       text,
                lastMessageAt:     serverTimestamp(),
                lastMessageSender: userEmail,
                [`unread.${recipientKey}`]: currentUnread + 1,
            });
        } catch (err) {
            console.error("Send message error:", err);
        } finally {
            setSending(false);
            setTimeout(() => textareaRef.current?.focus(), 50);
        }
    }, [newMessage, activeConvId, userEmail, userName, sending]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    /* ─────────────────────────────────────────────────────
       Derived values for the active conversation
    ───────────────────────────────────────────────────── */
    const activeConv  = conversations.find(c => c.id === activeConvId);
    const otherEmail  = activeConv?.participantEmails?.find(e => e !== userEmail) || "";
    const otherName   = activeConv?.participantNames?.[otherEmail]  || "Unknown";
    const otherImage  = activeConv?.participantImages?.[otherEmail] || "";
    const otherRole   = activeConv?.participantRoles?.[otherEmail]  || "doctor";

    const getUnread = (conv) => conv.unread?.[userEmail.replace(/[@.]/g, "_")] || 0;

    const filteredConvs = conversations.filter(conv => {
        const other = conv.participantEmails?.find(e => e !== userEmail) || "";
        const name  = conv.participantNames?.[other] || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const messageGroups = groupByDate(messages);

    /* ===============================================================
       RENDER
    =============================================================== */
    return (
        <div className="h-[calc(100vh-130px)] flex rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/50 bg-white">

            {/* ══════════════════════════════════════
                LEFT PANEL — Conversation list
            ══════════════════════════════════════ */}
            <div className={cn(
                "w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 bg-white border-r border-slate-100 flex flex-col",
                mobileShowChat ? "hidden lg:flex" : "flex"
            )}>
                {/* Header */}
                <div className="p-5 pb-4 border-b border-slate-50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-slate-900">Messages</h2>
                        <button
                            id="new-message-btn"
                            onClick={() => setShowNewChat(true)}
                            title="New conversation"
                            className="w-9 h-9 bg-slate-900 hover:bg-[#7BA1C7] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search conversations…"
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-200 transition-colors"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? <ConvSkeleton /> : filteredConvs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center mt-8">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
                                <MessageSquare className="w-7 h-7 text-slate-300" />
                            </div>
                            <p className="font-bold text-slate-600 text-sm mb-0.5">No conversations yet</p>
                            <p className="text-slate-400 text-xs mb-4">Start a chat with your healthcare provider</p>
                            <button
                                onClick={() => setShowNewChat(true)}
                                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-[#7BA1C7] transition-colors"
                            >
                                + New Message
                            </button>
                        </div>
                    ) : (
                        filteredConvs.map(conv => {
                            const other  = conv.participantEmails?.find(e => e !== userEmail) || "";
                            const name   = conv.participantNames?.[other]  || "Unknown";
                            const image  = conv.participantImages?.[other] || "";
                            const unread = getUnread(conv);
                            const isMe   = conv.lastMessageSender === userEmail;
                            const active = conv.id === activeConvId;

                            return (
                                <button
                                    key={conv.id}
                                    id={`conv-${conv.id}`}
                                    onClick={() => { setActiveConvId(conv.id); setMobileShowChat(true); }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3.5 transition-all text-left border-b border-slate-50/80",
                                        active
                                            ? "bg-blue-50/70 border-l-2 border-l-[#7BA1C7]"
                                            : "hover:bg-slate-50/80"
                                    )}
                                >
                                    <div className="relative flex-shrink-0">
                                        <Avatar name={name} image={image} size="md" ring={active} />
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className={cn(
                                                "text-sm truncate",
                                                active ? "font-black text-[#7BA1C7]" : "font-bold text-slate-800"
                                            )}>
                                                {name}
                                            </p>
                                            <span className="text-[10px] text-slate-400 font-medium ml-2 flex-shrink-0">
                                                {formatTime(conv.lastMessageAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-1">
                                            <p className={cn(
                                                "text-xs truncate font-medium max-w-[170px]",
                                                unread > 0 ? "text-slate-700 font-semibold" : "text-slate-400"
                                            )}>
                                                {isMe && <span className="text-[#7BA1C7]">You: </span>}
                                                {conv.lastMessage || "Start chatting…"}
                                            </p>
                                            {unread > 0 && (
                                                <span className="min-w-[18px] h-[18px] bg-[#7BA1C7] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 flex-shrink-0">
                                                    {unread > 9 ? "9+" : unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════
                RIGHT PANEL — Chat window
            ══════════════════════════════════════ */}
            <div className={cn(
                "flex-1 flex flex-col bg-[#F8FAFC] min-w-0",
                mobileShowChat ? "flex" : "hidden lg:flex"
            )}>
                {activeConvId && activeConv ? (
                    <>
                        {/* Chat header */}
                        <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-slate-100 shadow-sm">
                            <button
                                onClick={() => setMobileShowChat(false)}
                                className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 text-slate-500" />
                            </button>

                            <Avatar name={otherName} image={otherImage} size="md" />

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-sm leading-tight">{otherName}</p>
                                <p className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                    Online · <span className="capitalize">{otherRole}</span>
                                </p>
                            </div>

                            {/* Header actions */}
                            <div className="flex items-center gap-1 ml-auto">
                                <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Voice call (coming soon)">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Video call (coming soon)">
                                    <Video className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages area */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
                            {Object.entries(messageGroups).map(([dateKey, msgs]) => (
                                <div key={dateKey}>
                                    {/* Date separator */}
                                    <div className="flex items-center gap-3 my-4">
                                        <div className="flex-1 h-px bg-slate-200/60" />
                                        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                            {friendlyDate(dateKey)}
                                        </span>
                                        <div className="flex-1 h-px bg-slate-200/60" />
                                    </div>

                                    {/* Messages in this date group */}
                                    <div className="space-y-1">
                                        {msgs.map((msg, i) => {
                                            const isMe       = msg.senderEmail === userEmail;
                                            const prevMsg    = msgs[i - 1];
                                            const nextMsg    = msgs[i + 1];
                                            const isFirst    = !prevMsg || prevMsg.senderEmail !== msg.senderEmail;
                                            const isLast     = !nextMsg || nextMsg.senderEmail !== msg.senderEmail;
                                            const msgTime    = msg.timestamp?.toDate
                                                ? msg.timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                                : "";

                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={cn(
                                                        "flex items-end gap-2",
                                                        isMe ? "justify-end" : "justify-start",
                                                        isFirst ? "mt-3" : "mt-0.5"
                                                    )}
                                                >
                                                    {/* Avatar — only show for last consecutive message from other person */}
                                                    {!isMe && (
                                                        <div className={cn("flex-shrink-0 mb-0.5", isLast ? "opacity-100" : "opacity-0")}>
                                                            <Avatar name={otherName} image={otherImage} size="sm" />
                                                        </div>
                                                    )}

                                                    {/* Bubble */}
                                                    <div className={cn("max-w-[72%] flex flex-col gap-0.5", isMe ? "items-end" : "items-start")}>
                                                        {isFirst && !isMe && (
                                                            <span className="text-[10px] font-bold text-slate-400 ml-1 mb-0.5">
                                                                {otherName}
                                                            </span>
                                                        )}
                                                        <div className={cn(
                                                            "group relative px-4 py-2.5 text-sm font-medium leading-relaxed shadow-sm",
                                                            isMe
                                                                ? cn(
                                                                    "bg-slate-900 text-white",
                                                                    isFirst  ? "rounded-t-2xl" : "rounded-t-lg",
                                                                    isLast   ? "rounded-bl-2xl rounded-br-md" : "rounded-b-lg"
                                                                )
                                                                : cn(
                                                                    "bg-white text-slate-800 border border-slate-100",
                                                                    isFirst  ? "rounded-t-2xl" : "rounded-t-lg",
                                                                    isLast   ? "rounded-br-2xl rounded-bl-md" : "rounded-b-lg"
                                                                )
                                                        )}>
                                                            {msg.text}
                                                            {/* Hover timestamp */}
                                                            <span className={cn(
                                                                "absolute -bottom-5 text-[9px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",
                                                                isMe ? "right-1" : "left-1"
                                                            )}>
                                                                {msgTime}
                                                            </span>
                                                        </div>
                                                        {/* Read receipt — only on last sent message */}
                                                        {isMe && isLast && (
                                                            <div className="flex items-center gap-1 mr-1">
                                                                <CheckCheck className="w-3 h-3 text-[#7BA1C7]" />
                                                                <span className="text-[9px] text-slate-300 font-medium">{msgTime}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center pb-10">
                                    <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                                        <MessageSquare className="w-7 h-7 text-[#7BA1C7]" />
                                    </div>
                                    <p className="font-bold text-slate-600 text-sm">No messages yet</p>
                                    <p className="text-slate-400 text-xs mt-1">Say hello to {otherName}!</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-6" />
                        </div>

                        {/* Input bar */}
                        <div className="bg-white border-t border-slate-100 px-4 py-3">
                            <div className="flex items-end gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-transparent focus-within:border-[#7BA1C7]/30 focus-within:bg-white transition-all shadow-sm">
                                <textarea
                                    ref={textareaRef}
                                    id="message-input"
                                    value={newMessage}
                                    onChange={e => {
                                        setNewMessage(e.target.value);
                                        e.target.style.height = "auto";
                                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Message ${otherName}…`}
                                    rows={1}
                                    className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none resize-none min-h-[22px] max-h-[120px] leading-relaxed"
                                />
                                <button
                                    id="send-message-btn"
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim() || sending}
                                    className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 mb-0.5",
                                        newMessage.trim()
                                            ? "bg-slate-900 text-white hover:bg-[#7BA1C7] hover:scale-105 shadow-md"
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    {sending
                                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : <Send className="w-4 h-4" />
                                    }
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-slate-300 font-medium mt-2">
                                Enter to send · Shift+Enter for new line
                            </p>
                        </div>
                    </>
                ) : (
                    /* ─── Empty / Welcome state ─── */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-28 h-28 bg-white rounded-[36px] shadow-xl shadow-slate-100 flex items-center justify-center mb-6 border border-slate-100">
                            <MessageSquare className="w-14 h-14 text-[#7BA1C7]" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Your Messages</h3>
                        <p className="text-slate-400 font-medium max-w-xs leading-relaxed">
                            Select a conversation or start a new one with your healthcare provider.
                            <br />
                            <span className="text-[11px] mt-1 inline-block text-[#7BA1C7] font-semibold">
                                🔴 Live via Firebase WebSocket
                            </span>
                        </p>
                        <button
                            onClick={() => setShowNewChat(true)}
                            className="mt-6 px-7 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-[#7BA1C7] transition-all hover:scale-[1.02] shadow-lg shadow-slate-200/60 text-sm"
                        >
                            + Start New Conversation
                        </button>
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════
                NEW CHAT MODAL
            ══════════════════════════════════════ */}
            {showNewChat && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={e => { if (e.target === e.currentTarget) setShowNewChat(false); }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">New Message</h3>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                    {userRole === "patient" ? "Your booked doctors" : "Your patients"}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNewChat(false)}
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>

                        {/* Contacts list */}
                        <div className="p-4 max-h-80 overflow-y-auto">
                            {loadingContacts ? (
                                <div className="space-y-3 animate-pulse py-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3 p-2">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 bg-slate-100 rounded w-2/3" />
                                                <div className="h-3 bg-slate-100 rounded w-1/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : contacts.length === 0 ? (
                                <div className="text-center py-10">
                                    <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                    <p className="font-bold text-slate-500 text-sm">No contacts found</p>
                                    <p className="text-slate-400 text-xs mt-1 max-w-[220px] mx-auto leading-relaxed">
                                        {userRole === "patient"
                                            ? "Book an appointment first to message a doctor."
                                            : "Your patients will appear here once they book with you."}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {contacts.map((contact, i) => (
                                        <button
                                            key={i}
                                            id={`contact-${i}`}
                                            onClick={() => openConversation(contact)}
                                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left group border border-transparent hover:border-slate-100"
                                        >
                                            <Avatar name={contact.name} image={contact.image} size="md" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-800 text-sm truncate">{contact.name}</p>
                                                <p className="text-xs text-slate-400 font-medium capitalize truncate">
                                                    {contact.specialty || contact.role}
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-[#7BA1C7] flex items-center justify-center transition-colors flex-shrink-0">
                                                <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
