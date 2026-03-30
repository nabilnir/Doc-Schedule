"use client";

import React, { useState, useEffect } from "react";
import { 
    Clock9, 
    Plus, 
    Trash2, 
    Save, 
    CalendarRange, 
    CalendarX, 
    Info, 
    CalendarDays,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { getDoctorSchedule, updateDoctorSchedule } from "@/app/actions/doctor-schedule";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function DoctorSchedule() {
    const [slots, setSlots] = useState([]);
    const [blockedDates, setBlockedDates] = useState([]);
    const [selectedBlockDate, setSelectedBlockDate] = useState(null);
    const [newSlot, setNewSlot] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getDoctorSchedule();
                setSlots(data.time_slots || []);
                setBlockedDates(data.blockedSlots || []);
            } catch (error) {
                toast.error("Failed to load schedule.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleAddSlot = (e) => {
        e.preventDefault();
        if (!newSlot) return;
        
        if (slots.includes(newSlot)) {
            toast.warning("This slot already exists.");
            return;
        }

        const updated = [...slots, newSlot].sort((a, b) => {
            const timeA = convertTo24Hours(a);
            const timeB = convertTo24Hours(b);
            return timeA.localeCompare(timeB);
        });
        
        setSlots(updated);
        setNewSlot("");
        toast.info("Slot added to list (unsaved)");
    };

    const handleBlockDate = () => {
        if (!selectedBlockDate) {
            toast.warning("Please select a date first.");
            return;
        }

        const dateStr = selectedBlockDate.toISOString().split('T')[0];
        
        if (blockedDates.some(b => b.date === dateStr)) {
            toast.warning("This date is already blocked.");
            return;
        }

        // Blocking the entire day by adding it to blockedDates with empty slots (or logic for full block)
        setBlockedDates([...blockedDates, { date: dateStr, slots: [] }]);
        setSelectedBlockDate(null);
        toast.info("Date added to block list (unsaved)");
    };

    const removeBlockedDate = (dateStr) => {
        setBlockedDates(blockedDates.filter(b => b.date !== dateStr));
        toast.info("Date removed (unsaved)");
    };

    const convertTo24Hours = (timeStr) => {
        if (!timeStr) return "00:00";
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    const removeSlot = (index) => {
        const updated = slots.filter((_, i) => i !== index);
        setSlots(updated);
        toast.info("Slot removed (unsaved)");
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await updateDoctorSchedule({ 
                time_slots: slots,
                blockedSlots: blockedDates
            });
            if (res.success) {
                toast.success("Schedule updated successfully!");
            } else {
                toast.error(res.error || "Failed to save.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#7BA1C7]/30 border-t-[#7BA1C7] rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Reading your schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        My Availability
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3">Live</Badge>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Define your consulting hours. Changes are applied instantly to patient bookings.</p>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="h-14 px-8 bg-black hover:bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-200 flex gap-2 items-center transition-all hover:scale-[1.03]"
                >
                    {saving ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Managers */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Time Slots Card */}
                    <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-[40px] overflow-hidden bg-white">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-blue-50 rounded-xl">
                                    <Clock9 className="w-5 h-5 text-[#7BA1C7]" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Standard Slots</CardTitle>
                            </div>
                            <CardDescription className="text-base">Recurring weekly slots available for appointments.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <form onSubmit={handleAddSlot} className="flex gap-3 mb-8">
                                <div className="relative flex-1 group">
                                    <Clock9 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7BA1C7] transition-colors" />
                                    <Input 
                                        placeholder="e.g. 09:00 AM or 14:00" 
                                        className="h-14 pl-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#7BA1C7]/20 text-lg"
                                        value={newSlot}
                                        onChange={(e) => setNewSlot(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="h-14 px-6 bg-[#7BA1C7] hover:bg-[#6A8FB3] text-white rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95">
                                    <Plus className="w-6 h-6" />
                                </Button>
                            </form>

                            {slots.length === 0 ? (
                                <div className="bg-slate-50/50 rounded-3xl p-12 text-center border border-dashed border-slate-200">
                                    <Clock9 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">No slots added yet.</p>
                                    <p className="text-slate-400 text-sm mt-1">Add your first consultation time above.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {slots.map((slot, idx) => (
                                        <div 
                                            key={idx} 
                                            className="group relative bg-white border border-slate-100 hover:border-[#7BA1C7]/30 hover:shadow-xl hover:shadow-blue-50/50 p-4 rounded-2xl transition-all duration-300 flex items-center justify-between"
                                        >
                                            <span className="font-bold text-slate-700">{slot}</span>
                                            <button 
                                                onClick={() => removeSlot(idx)}
                                                className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Holiday & Emergency Blocks */}
                    <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-[40px] overflow-hidden bg-white">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-amber-50 rounded-xl">
                                    <CalendarX className="w-5 h-5 text-amber-500" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Holiday & Emergency Blocks</CardTitle>
                            </div>
                            <CardDescription className="text-base">Block specific dates from being booked. This overrides your standard slots for that day.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full h-14 justify-start text-left font-normal rounded-2xl bg-slate-50 border-none px-4",
                                                    !selectedBlockDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarDays className="mr-2 h-5 w-5 text-[#7BA1C7]" />
                                                {selectedBlockDate ? format(selectedBlockDate, "PPP") : <span>Pick a date to block</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={selectedBlockDate}
                                                onSelect={setSelectedBlockDate}
                                                initialFocus
                                                disabled={(date) => date < new Date().setHours(0,0,0,0)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Button 
                                    onClick={handleBlockDate}
                                    className="h-14 px-8 bg-black hover:bg-slate-800 text-white rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Block Date
                                </Button>
                            </div>

                            {blockedDates.length === 0 ? (
                                <div className="bg-slate-50/50 rounded-3xl p-12 text-center border border-dashed border-slate-200">
                                    <CalendarRange className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">No dates blocked.</p>
                                    <p className="text-slate-400 text-sm mt-1">Select a date above to prevent bookings.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {[...blockedDates].sort((a,b) => new Date(a.date) - new Date(b.date)).map((block, idx) => (
                                        <div 
                                            key={idx} 
                                            className="group bg-white border border-slate-100 hover:border-amber-100 hover:bg-amber-50/10 p-5 rounded-[24px] transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                                                    <CalendarX className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{format(new Date(block.date), "EEEE, do MMMM")}</p>
                                                    <p className="text-xs text-amber-600 font-semibold tracking-wider uppercase">Full day blocked</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => removeBlockedDate(block.date)}
                                                className="p-2.5 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Status/Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] rounded-[40px] bg-[#7BA1C7] text-white p-8">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                            <Info className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight text-white/90">Quick Tips</h3>
                        <ul className="space-y-4 text-white/80 text-sm font-medium">
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 shrink-0" />
                                Use 30 or 60 minute intervals for best patient experience.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 shrink-0" />
                                Review pending appointments before deleting a slot.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 shrink-0" />
                                Patients see these slots in real-time when booking.
                            </li>
                        </ul>
                    </Card>

                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 flex flex-col items-center text-center">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <CalendarRange className="w-8 h-8 text-[#7BA1C7]" />
                         </div>
                         <h4 className="font-bold text-slate-900 mb-1">Calendar Sync</h4>
                         <p className="text-slate-500 text-xs px-4">All confirmed bookings are automatically synced to your Google Calendar.</p>
                         <button className="mt-4 text-[#7BA1C7] font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                             View Calendar <ChevronRight className="w-3 h-3" />
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
