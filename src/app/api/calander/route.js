import { NextResponse } from "next/server";
import { getCalendarClient, createAppointmentEvent } from "@/lib/googleCalendar";

/**
 * POST Handler for creating Google Calendar events.
 * This route connects the frontend booking action with the Google Calendar Service.
 */
export async function POST(req) {
  try {
    // 1. Extract data from the request body
    const body = await req.json();
    
    // Destructuring required fields
    const { accessToken, appointmentDetails } = body;

    // 2. Basic Validation: Ensure both token and details are present
    if (!accessToken || !appointmentDetails) {
      return NextResponse.json(
        { error: "Missing required fields: accessToken or appointmentDetails" },
        { status: 400 }
      );
    }

    // 3. Initialize the Google Calendar Client using  helper function
    const calendar = getCalendarClient(accessToken);

    // 4. Call the service to insert the event into the doctor's primary calendar
    const result = await createAppointmentEvent(calendar, appointmentDetails);

    // 5. Return success response with the event ID and Google Calendar link
    return NextResponse.json(
      { 
        success: true,
        message: "Event successfully added to Google Calendar!", 
        eventId: result.id,
        calendarLink: result.htmlLink 
      }, 
      { status: 201 }
    );

  } catch (error) {
    // Log the error for server-side debugging
    console.error("Google Calendar API Route Error:", error);
    
    // Return a 500 Internal Server Error if something goes wrong
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create calendar event", 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}