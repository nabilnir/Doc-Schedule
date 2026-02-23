import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import mongoose from "mongoose";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DoctorFilter from "@/components/doctor/doctor-filter";
import Image from "next/image";

export default async function AllDoctorPage({ searchParams }) {
  try {
    await connectDB();

    // searchParams
    const params = await searchParams;
    const search = params?.search || "";
    const category = params?.category || "";

    // Query
    let query = {};
    if (search.trim() !== "") {
      query.name = { $regex: search, $options: "i" };
    }
    if (category && category !== "all" && category.trim() !== "") {
      query.specialty = category;
    }

    const dbName = mongoose.connection.name;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log("-----------------------------------------");
    console.log("🔍 DB Debug Info:");
    console.log("📦 Connected to DB:", dbName);
    console.log("📂 Collections in DB:", collectionNames);
    console.log("🎯 Targeting Collection:", Doctor.collection.name);
    console.log("Current Query:", query);

    const rawDoctors = await Doctor.find(query).lean();
    console.log("Total Doctors found:", rawDoctors.length);
    console.log("Total Doctors in model.countDocuments():", await Doctor.countDocuments());
    console.log("-----------------------------------------");

    const doctors = JSON.parse(JSON.stringify(rawDoctors));

    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Meet Our Doctors
        </h1>

        <DoctorFilter />

        {doctors && doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <Card
                key={doc._id}
                className="overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <CardHeader className="p-0">
                  <div className="h-52 w-full relative">
                    <Image
                      src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
                      alt="Doctor Illustration"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg leading-tight">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-semibold mb-2">
                    {doc.specialty}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <p>{doc.designation}</p>
                    <p className="line-clamp-1">{doc.hospital}</p>
                  </div>
                  <p className="mt-3 font-bold text-green-700">
                    Fee: ৳ {doc.fee}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/all-doctors/${doc._id}`} className="w-full">
                    <Button className="w-full">View Profile</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
            <h2 className="text-xl font-semibold text-gray-400">
              No Doctors Found
            </h2>
            <p className="text-gray-400 text-sm">
              Please try checking your spelling or change the filters.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Fetch Error:", error);
    return (
      <div className="text-center py-20 text-red-500">
        Error connecting to database.
      </div>
    );
  }
}
