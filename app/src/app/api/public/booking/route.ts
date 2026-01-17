import { NextResponse, NextRequest } from "next/server";
import { BookingService } from "@/core/services/BookingService";
import { ZodError } from "zod";
import {
  PublicCreateBookingDTO,
  PublicCreateBookingInput,
} from "@/core/dto/booking.dto";

const bookingService = new BookingService();

export async function POST(req: NextRequest) {
  try {
    // Next.js 16 is stricter with empty bodies; ensure we catch it early
    const rawData = await req.json().catch(() => null);

    if (!rawData) {
      return NextResponse.json(
        { error: "Invalid request format: Request body must be valid JSON." },
        { status: 400 },
      );
    }

    // 1. Validate incoming data
    const validatedPublicData: PublicCreateBookingInput =
      PublicCreateBookingDTO.parse(rawData);

    // 2. Call the service
    const newBooking =
      await bookingService.publicCreateBooking(validatedPublicData);

    // 3. Success Response
    return NextResponse.json(
      {
        id: newBooking.id,
        fullName: newBooking.fullName,
        email: newBooking.email,
        tripId: newBooking.tripId,
        message: newBooking.message,
        status: newBooking.status,
      },
      { status: 201 },
    );
  } catch (err: any) {
    let status = 500;
    let message = "An unknown server error occurred.";

    // Handle Zod Errors (Next.js 16/Zod compatibility)
    if (err instanceof ZodError) {
      status = 400;
      message =
        "Validation failed: " +
        err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    }
    // Handle Business Logic Errors
    else if (
      err.message?.includes("capacity") ||
      err.message?.includes("not found")
    ) {
      status = 409;
      message = err.message;
    } else {
      console.error("Uncaught Booking API Error:", err);
      message = "Failed to process booking due to a server error.";
    }

    return NextResponse.json({ error: message }, { status });
  }
}
