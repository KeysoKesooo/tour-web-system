import { NextResponse, NextRequest } from "next/server";
import { BookingService } from "@/core/services/BookingService";
import { ZodError } from "zod";
import {
  PublicCreateBookingDTO,
  PublicCreateBookingInput,
} from "@/core/dto/booking.dto"; // Assuming DTOs are imported correctly

const bookingService = new BookingService();

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();

    // 1. Validate incoming data against the external Public DTO
    const validatedPublicData: PublicCreateBookingInput =
      PublicCreateBookingDTO.parse(rawData);

    // 2. Call the service method (which handles mapping, price, and status)
    const newBooking = await bookingService.publicCreateBooking(
      validatedPublicData
    );

    // 3. Success Response (201 Created)
    return NextResponse.json(
      {
        id: newBooking.id,
        fullName: newBooking.fullName,
        email: newBooking.email,
        tripId: newBooking.tripId,
        message: newBooking.message,
        status: newBooking.status,
      },
      { status: 201 }
    );
  } catch (err: any) {
    let status = 500;
    let message = "An unknown server error occurred.";

    // 1. Handle Generic Errors & JSON Parsing Failures (400)
    if (err.message?.includes("Unexpected end of JSON input")) {
      status = 400;
      message = "Invalid request format: Request body must be valid JSON.";

      // 2. Handle Business Logic Errors (Capacity, Trip Not Found, 409)
    } else if (
      err.message?.includes("capacity") ||
      err.message?.includes("Trip not found")
    ) {
      status = 409;
      message = err.message;

      // 3. Safely Handle Zod Validation Errors (400)
    } else if (err.name === "ZodError" && Array.isArray(err.errors)) {
      status = 400;
      message =
        "Validation failed: " +
        err.errors
          .map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join("; ");

      // 4. General Server Crash (500)
    } else {
      console.error("Uncaught Booking API Error:", err);
      message = "Failed to process booking due to a server error.";
    }

    return NextResponse.json({ error: message }, { status });
  }
}
