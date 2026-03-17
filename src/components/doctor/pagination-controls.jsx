"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: true });
  };

  return (
    <div className="flex items-center justify-center gap-4">

      <Button
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="rounded-xl px-5 h-11 font-semibold"
      >
        <ChevronLeft size={16} />
      </Button>

      <div className="px-6 py-3 bg-white shadow-md rounded-2xl text-sm font-bold text-slate-700">
        {currentPage} / {totalPages}
      </div>

      <Button
        variant="outline"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="rounded-xl px-5 h-11 font-semibold"
      >
        <ChevronRight size={16} />
      </Button>

    </div>
  );
}