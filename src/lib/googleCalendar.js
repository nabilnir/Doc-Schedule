import { google } from 'googleapis';

/**
 * @param {string} accessToken - নাঈম ভাই (Auth) থেকে প্রাপ্ত টোকেন
 * @returns Google Calendar Instance
 */
export const getCalendarClient = (accessToken) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  return google.calendar({ version: 'v3', auth: oauth2Client });
};

/**
 * function for new appointment event
 */
export const createAppointmentEvent = async (calendar, details) => {
  const { patientName, doctorName, startTime, endTime, zoomLink } = details;

  const event = {
    summary: `Appointment: ${patientName} with Dr. ${doctorName}`,
    // description: `Healthcare booking via DocSchedule. Consultation Link: ${zoomLink || 'In-person'}`,
    start: {
      dateTime: startTime, // Format: '2026-02-16T10:00:00Z'
      timeZone: 'Asia/Dhaka',
    },
    end: {
      dateTime: endTime,
      timeZone: 'Asia/Dhaka',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};