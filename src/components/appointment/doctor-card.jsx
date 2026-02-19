// components/appointment/doctor-card.jsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, MapPin } from "lucide-react";
import Image from "next/image";

export function DoctorCard({ doctor, isExpanded }) {
  return (
    <Card className={`p-4 mb-4 ${isExpanded ? "border-primary" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* <Image src={'https://i.ibb.co/RGh95m3d/portrait-happy-ethnic-student-cheerful-600nw-2163470599.webp'} className="w-12 h-12 rounded-full" alt={'this is name'} /> */}
          <Image
            src={
              "https://i.ibb.co/RGh95m3d/portrait-happy-ethnic-student-cheerful-600nw-2163470599.webp"
            }
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
            alt={"this is name"}
          />

          <div>
            <h3 className="font-bold">{}jeo</h3>
            <p className="text-sm text-muted-foreground">
              {}This is my demo description
            </p>
          </div>
        </div>

        {/* Expanded actions like in your image */}
        {isExpanded && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-emerald-500 text-white"
            >
              <Phone size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-sky-400 text-white"
            >
              <MessageSquare size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-slate-600 text-white"
            >
              <MapPin size={16} />
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline">View Profile</Button>
          <Button className="bg-sky-500 hover:bg-sky-600">Book Now</Button>
        </div>
      </div>
    </Card>
  );
}
