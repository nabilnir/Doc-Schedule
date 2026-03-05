import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DoctorReview from "@/models/DoctorReview";

export const dynamic = 'force-dynamic';

// GET /api/admin/reviews — fetch all reviews
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter"); // "flagged" | "approved" | "all"

        let query = {};
        if (filter === "flagged") query.isFlagged = true;
        else if (filter === "approved") query = { isFlagged: false, isApproved: true };

        const reviews = await DoctorReview.find(query).sort({ createdAt: -1 });
        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Fetch reviews error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH /api/admin/reviews — flag or approve a review
export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();

        const { reviewId, action } = await req.json();
        if (!reviewId || !action) return NextResponse.json({ error: "reviewId and action required" }, { status: 400 });

        const review = await DoctorReview.findById(reviewId);
        if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

        if (action === "flag") {
            review.isFlagged = true;
            review.isApproved = false;
        } else if (action === "approve") {
            review.isFlagged = false;
            review.isApproved = true;
        } else if (action === "delete") {
            await DoctorReview.findByIdAndDelete(reviewId);
            return NextResponse.json({ message: "Review deleted" });
        }

        await review.save();
        return NextResponse.json({ message: "Review updated", review });
    } catch (error) {
        console.error("Review update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
