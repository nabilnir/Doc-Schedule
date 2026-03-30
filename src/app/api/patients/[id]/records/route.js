import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Record from "@/models/Record"; // Record model toiri thakte hobe

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const records = await Record.find({ patientId: id }).sort({ createdAt: -1 });
    return NextResponse.json(records);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    
    const newRecord = await Record.create({
      patientId: id,
      ...body
    });

    return NextResponse.json(newRecord);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}