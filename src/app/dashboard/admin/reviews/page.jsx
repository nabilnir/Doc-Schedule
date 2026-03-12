"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Star, Flag, CheckCircle, Trash2, RefreshCw, MessageSquare, AlertTriangle, Filter } from "lucide-react";

function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
            ))}
        </div>
    );
}

export default function ReviewModerationPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState(null);

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/reviews?filter=${filter}`);
            if (!res.ok) throw new Error("Failed to fetch reviews");
            setReviews(await res.json());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    const handleAction = async (reviewId, action) => {
        setActionLoading(reviewId);
        try {
            await fetch("/api/admin/reviews", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId, action }),
            });
            await fetchReviews();
        } catch (e) { console.error(e); } finally {
            setActionLoading(null);
        }
    };

    const filterOptions = [
        { id: "all", label: "All Reviews" },
        { id: "flagged", label: "Flagged" },
        { id: "approved", label: "Approved" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review Moderation</h1>
                    <p className="text-slate-500 mt-1">Monitor, flag, and approve patient reviews before they go public</p>
                </div>
                <button
                    onClick={fetchReviews}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
                </div>
            )}

            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap">
                {filterOptions.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${filter === f.id
                            ? "bg-[#7BA1C7] text-white shadow-md shadow-[#7BA1C7]/30"
                            : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        <Filter className="w-3.5 h-3.5" />
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="py-20 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#7BA1C7] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-slate-200">
                    <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="font-bold text-slate-500">No reviews found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review._id} className={`bg-white rounded-[24px] border shadow-sm p-6 transition-all ${review.isFlagged ? "border-red-200 bg-red-50/30" : "border-slate-100"}`}>
                            <div className="flex flex-col md:flex-row gap-4 md:items-start">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <p className="font-bold text-slate-800">{review.patientName}</p>
                                        <StarRating rating={review.rating} />
                                        {review.isFlagged && (
                                            <span className="px-2 py-0.5 text-xs font-bold bg-red-50 text-red-500 border border-red-100 rounded-lg flex items-center gap-1">
                                                <Flag className="w-3 h-3" /> Flagged
                                            </span>
                                        )}
                                        {!review.isFlagged && review.isApproved && (
                                            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg">
                                                Approved
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mb-3">
                                        For: <span className="font-bold text-slate-600">{review.doctorName || "Unknown Doctor"}</span>
                                        {" · "}
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl">
                                        {review.comment}
                                    </p>
                                </div>
                                <div className="flex md:flex-col gap-2 shrink-0">
                                    {review.isFlagged ? (
                                        <button
                                            onClick={() => handleAction(review._id, "approve")}
                                            disabled={actionLoading === review._id}
                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Restore
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAction(review._id, "flag")}
                                            disabled={actionLoading === review._id}
                                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl text-sm font-bold hover:bg-amber-100 transition-colors disabled:opacity-50"
                                        >
                                            <Flag className="w-4 h-4" /> Flag
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleAction(review._id, "delete")}
                                        disabled={actionLoading === review._id}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
