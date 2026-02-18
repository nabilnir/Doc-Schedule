"use client";
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function BookingSystem({ doctorId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  
  // 3 day after quick select option
  const quickDates = Array.from({ length: 4 }, (_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    const fetchSlots = async () => {
      // Api Call
      // const res = await fetch(`/api/slots?date=${format(selectedDate, 'yyyy-MM-dd')}`);
      const dummySlots = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM", "05:30 PM"];
      setAvailableSlots(dummySlots);
      setSelectedSlot(null);
    };
    fetchSlots();
  }, [selectedDate]);

  return (
    <div className="space-y-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
      
      {/* 1. calender Section */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">Select Appointment Date</label>
        <div className="flex flex-wrap gap-3 items-center">
          
          {/* Quick Date */}
          {quickDates.map((date) => (
            <button
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium border transition-all",
                format(selectedDate, 'PP') === format(date, 'PP')
                  ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-100"
                  : "bg-white text-slate-600 hover:border-sky-200"
              )}
            >
              {format(date, 'PP') === format(new Date(), 'PP') ? "Today" : format(date, 'EEE, d MMM')}
            </button>
          ))}

          {/* Main calender */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "rounded-full pl-3 text-left font-normal text-xs h-9",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-sky-500" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < startOfToday()} // past date disable
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 2. Time slot selection */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-emerald-500" />
          <h4 className="text-sm font-bold text-slate-800">Available Slots</h4>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={cn(
                "py-2.5 text-[11px] font-semibold rounded-lg border transition-all",
                selectedSlot === slot
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-50"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-transparent"
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Conformation footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-dashed">
        <div className="text-center sm:text-left">
           <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Selected Schedule</p>
           <p className="text-sm font-semibold text-slate-700">
             {selectedSlot ? `${format(selectedDate, 'do MMMM')} at ${selectedSlot}` : "Please select a time"}
           </p>
        </div>
        
        <Button 
          disabled={!selectedSlot}
          className="w-full sm:w-auto bg-[#00c58d] hover:bg-[#00b07d] text-white px-10 py-6 rounded-xl font-bold transition-all transform active:scale-95"
        >
          Confirm & Proceed
        </Button>
      </div>
    </div>
  );
}