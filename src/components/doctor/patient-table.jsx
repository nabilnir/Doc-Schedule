"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserCircle, FileText, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export default function PatientTable() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("recent");
  
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/patients?search=${search}&filter=${filter}`);
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Data fetch korte somossa hoyeche:", error);
      } finally {
        setLoading(false);
      }
    };
    const delayDebounce = setTimeout(fetchData, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, filter]);

  // --- Click Handlers ---

  const handleViewProfile = (id) => {
    router.push(`/dashboard/doctor/patients/${id}`);
  };

  const handleViewRecords = (id) => {
    router.push(`/dashboard/doctor/patients/${id}/records`);
  };

  const handleMessage = (phone) => {
    // WhatsApp e message pathanor logic (non-numeric characters remove kore)
    const cleanNumber = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name..."
            className="pl-10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full md:w-[180px] rounded-xl">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent Patients</SelectItem>
            <SelectItem value="frequent">Frequent Patients</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-[24px] border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold pl-6 md:pl-8">Name</TableHead>
              <TableHead className="font-bold text-center">Age/Gender</TableHead>
              <TableHead className="font-bold">Last Visit</TableHead>
              <TableHead className="font-bold text-center">Visits</TableHead>
              <TableHead className="font-bold text-right pr-6 md:pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="h-16 animate-pulse bg-slate-50/50 px-6 md:px-8" />
                </TableRow>
              ))
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground px-6 md:px-8">
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient._id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium pl-6 md:pl-8">
                    <div className="flex flex-col">
                      <span>{patient.name}</span>
                      <span className="text-xs text-muted-foreground">{patient.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center italic">
                    {patient.age}y / {patient.gender}
                  </TableCell>
                  <TableCell>
                    {format(new Date(patient.lastVisit), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-center font-bold text-blue-600">
                    {patient.totalVisits}
                  </TableCell>
                  <TableCell className="text-right pr-6 md:pr-8">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleViewProfile(patient._id)}
                        title="Profile"
                      >
                        <UserCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleViewRecords(patient._id)}
                        title="Records"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="text-blue-600"
                        onClick={() => handleMessage(patient.phone)}
                        title="WhatsApp"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}