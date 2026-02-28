"use client";
import React, { useState, useEffect } from "react";
import { format, addDays, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { bookAppointment, getBookedSlots } from "@/app/actions/book-appointment";
import { useSession } from "next-auth/react";

export default function BookingSystem({ doctor }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const { data: session, update } = useSession();

  // Patient Information State
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    email: "",
  });

  // When the date changes, the booked slot will be fetched from the database.
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (doctor?._id) {
        const slots = await getBookedSlots(doctor._id, selectedDate);
        setBookedSlots(slots);
        setSelectedSlot(null); // Changing the date will reset the previously selected slot.
      }
    };
    fetchBookedSlots();
  }, [selectedDate, doctor?._id]);

  useEffect(() => {
    if (session?.user) {
      setPatientInfo((prev) => ({
        ...prev,
        // যদি আগে থেকে নাম/ইমেইল না থাকে (খালি থাকে), তবেই সেশনের ডাটা বসবে
        name: prev.name || session.user.name || "",
        email: prev.email || session.user.email || "",
      }));
    }
  }, [session]);

  const quickDates = Array.from({ length: 4 }, (_, i) =>
    addDays(startOfToday(), i),
  );

  const dummySlots = doctor?.time_slots || [
    "09:00 AM",
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "04:00 PM",
    "05:30 PM",
  ];

  const handleInputChange = (e) => {
    setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = async () => {
    if (!patientInfo.name || !patientInfo.age || !patientInfo.email)
      return alert("Please fill name, age and email");

    setIsPending(true);
    const result = await bookAppointment({
      doctorId: doctor?._id,
      doctorName: doctor?.name,
      date: selectedDate,
      slot: selectedSlot,
      patientDetails: patientInfo,
    });

    if (result.success) {
      alert("Appointment Booked Successfully!");
      setIsModalOpen(false);
      setSelectedSlot(null);
      // If the booking is successful, you can fetch again to update the slot list.
      const updatedSlots = await getBookedSlots(doctor._id, selectedDate);
      setBookedSlots(updatedSlots);
    } else {
      alert("Error: " + result.error);
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="h-[1px] bg-slate-100 w-full mb-6" />

      {/* Date Select */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700">
          Select Appointment Date
        </label>
        <div className="flex flex-wrap gap-2 items-center">
          {quickDates.map((date) => (
            <button
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-semibold border transition-all",
                format(selectedDate, "PP") === format(date, "PP")
                  ? "bg-[#7BA1C7] text-white border-[#7BA1C7] shadow-lg shadow-blue-100"
                  : "bg-white text-slate-600 hover:border-[#7BA1C7]/30",
              )}
            >
              {format(date, "PP") === format(new Date(), "PP")
                ? "Today"
                : format(date, "EEE, d MMM")}
            </button>
          ))}
          {/* Popover Calendar remains same */}
        </div>
      </div>

      {/* Slots Section */}
      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-inner">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {dummySlots.map((slot) => {
            const isBooked = bookedSlots.includes(slot); // Check if the slot is booked or not.
            return (
              <button
                key={slot}
                disabled={isBooked} // Will be disabled if booked.
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "py-3 text-xs font-bold rounded-2xl border transition-all relative overflow-hidden",
                  isBooked
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
                    : selectedSlot === slot
                      ? "bg-white text-[#7BA1C7] border-[#7BA1C7] ring-2 ring-slate-100"
                      : "bg-white text-slate-500 hover:border-[#7BA1C7]/30",
                )}
              >
                {slot}
                {isBooked && (
                  <span className="absolute inset-0 flex items-center justify-center bg-gray-100/50 text-[8px] font-black uppercase text-gray-400">
                    Booked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer and Modal remain same as your code */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-dashed">
        <div className="text-sm font-bold text-slate-700">
          {selectedSlot
            ? `${format(selectedDate, "do MMMM")} at ${selectedSlot}`
            : "Please select a time"}
        </div>

        <Button
          disabled={!selectedSlot}
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-black hover:bg-slate-800 text-white px-10 py-7 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200"
        >
          Confirm & Proceed
        </Button>
      </div>

      {/* Patient Info Modal remains same as your code */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/* ... Modal Content ... */}
        <DialogContent className="sm:max-w-[425px] rounded-[32px] bg-white p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Patient Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input
                name="name"
                value={patientInfo.name}
                placeholder="Full Name"
                onChange={handleInputChange}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                name="email"
                type="email"
                value={patientInfo.email}
                placeholder="email@example.com"
                onChange={handleInputChange}
                className="rounded-xl h-12"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  name="age"
                  type="number"
                  value={patientInfo.age}
                  placeholder="Age"
                  onChange={handleInputChange}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Input
                  name="bloodGroup"
                  value={patientInfo.bloodGroup}
                  placeholder="A+"
                  onChange={handleInputChange}
                  className="rounded-xl h-12"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleFinalSubmit} disabled={isPending} className="w-full bg-black hover:bg-slate-800 text-white py-7 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200">
              {isPending ? "Processing..." : "Submit Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
