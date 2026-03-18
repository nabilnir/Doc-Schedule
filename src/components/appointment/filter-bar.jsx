"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Local state to manage the search input value before pushing to URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Debounce logic: update the URL only after user stops typing for 500ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // Reset to page 1 on new search
      router.push(`?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]);

  // Handle status filter change immediately
  const handleStatusChange = (status) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-3 w-full md:w-auto">
      {/* Live Search Input */}
      <div className="relative flex-1 md:w-64">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm transition-all"
        />
      </div>

      {/* Live Status Filter */}
      <select
        defaultValue={searchParams.get("status") || ""}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm cursor-pointer"
      >
        <option value="">All Statuses</option>
        <option value="confirmed">Confirmed</option>
        <option value="pending">Pending</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
}