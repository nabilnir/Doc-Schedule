'use client'
import React, { useState } from "react";

import { format, addDays } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ArrowRightLeft,
  CheckCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const page = () => {


    const [days, setDays] = useState(1);
  const [date, setDate] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hours, setHours] = useState(0); 

  
  const getDiscountPercentage = () => {
    if (days >= 7) return "20%";
    if (days > 1) return "10%";
    return "0%";
  };

  
  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  
  const parseTimeToHours = (time) => {
    return parseInt(time.split(":")[0]);
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto p-6 bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-2xl space-y-8">
        {/* Section: Number of Days */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold text-gray-800">
              Duration
            </Label>
           
          </div>

          
        </div>

        <Separator className="bg-gray-100" />

        {/* Section: Date & Time Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Picker */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-600">
              {days === 1 ? "Select a Date" : "Date Range"}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal rounded-xl border-gray-200 hover:bg-gray-50",
                    !date && !dateRange?.from && "text-gray-400",
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-green-500" />
                  {days === 1
                    ? date
                      ? format(date, "PPP")
                      : "Pick a date"
                    : dateRange?.from && dateRange?.to
                      ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
                      : "Select range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border-none">
                <Calendar
                  mode={days === 1 ? "single" : "range"}
                  selected={days === 1 ? date : dateRange}
                  onSelect={(val) =>
                    days === 1 ? setDate(val) : setDateRange(val)
                  }
                  numberOfMonths={days > 1 ? 2 : 1}
                  disabled={(d) => d < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Location Input */}
        </div>

        {/* Section: Time Schedule */}
        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              Daily Schedule
            </Label>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-tight">
              {hours > 0 ? `${hours} Hours total` : "Select times"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="h-11 rounded-lg bg-white border-gray-200">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.slice(0, -1).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select
                value={endTime}
                onValueChange={setEndTime}
                disabled={!startTime}
              >
                <SelectTrigger className="h-11 rounded-lg bg-white border-gray-200">
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots
                    .filter(
                      (t) =>
                        !startTime ||
                        parseTimeToHours(t) > parseTimeToHours(startTime),
                    )
                    .map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {startTime && endTime && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-700 bg-green-100/50 py-2 rounded-lg">
              <ArrowRightLeft className="w-4 h-4" />
              <span>
                Your session runs from <b>{startTime}</b> to <b>{endTime}</b>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
