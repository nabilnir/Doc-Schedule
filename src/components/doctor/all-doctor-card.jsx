import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // shadcn/ui badge
import Link from "next/link";

export default function DoctorCard({ doctor }) {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <h3 className="font-bold text-xl text-primary">{doctor.name}</h3>
        <p className="text-sm font-medium text-muted-foreground">{doctor.designation}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <Badge variant="secondary">{doctor.specialty}</Badge>
        <p className="text-sm"><strong>Hospital:</strong> {doctor.hospital}</p>
        <p className="text-sm"><strong>Exp:</strong> {doctor.experience}</p>
        <p className="text-lg font-bold mt-2">৳ {doctor.fee}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/doctors/${doctor._id}`} className="w-full">
          <Button className="w-full" variant="outline">View Full Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}