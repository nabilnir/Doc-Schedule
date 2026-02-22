"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const specialties = [
  "Cardiologist",
  "Gynecologist",
  "Orthopedic",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Psychiatrist",
  "Ophthalmologist",
  "Dentist",
  "Urologist",
];

export default function DoctorFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");

  // Real-time search and filter logic
  useEffect(() => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    // debounce effect manually or just push
    const delayDebounceFn = setTimeout(() => {
      router.push(`/all-doctors?${params.toString()}`); // Path-ti check kore niben (/doctors na ki /all-doctors)
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, router]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Specialty Category Select */}
      <div className="md:w-64">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-4 py-2 rounded w-full cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All Specialties</option>
          {specialties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Button ekhon optional, karon real-time e kaj korbe */}
      <button
        disabled
        className="hidden md:block bg-gray-100 text-gray-400 px-6 py-2 rounded cursor-not-allowed"
      >
        Filtering...
      </button>
    </div>
  );
}