"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useBookTrip } from "@/hooks/public/UseBookTrip";
import SuccessPopup from "@/components/ui/SuccessPopup";

const TripDetailPage: React.FC = () => {
  const { id: tripId } = useParams() as { id: string };

  const {
    trip,
    isLoading,
    error,
    formData,
    isSubmitting,
    bookingError,
    bookingSuccess,
    handleChange,
    handleSubmitBooking,
    setBookingSuccess,
  } = useBookTrip(tripId);

  if (isLoading) return <div className="p-16 text-2xl text-center">Loading Trip...</div>;
  if (error || !trip) return <div className="p-16 text-2xl text-center text-red-500">❌ {error || "Trip not found."}</div>;

  const isFull = trip.remainingSeats <= 0;
  const bookingDisabled = isFull || isSubmitting;

  return (
    <div className="container mx-auto p-6 md:p-12 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {trip.imageUrl && (
          <img src={trip.imageUrl} alt={trip.title} className="w-full h-80 object-cover" />
        )}

        <div className="p-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{trip.title}</h1>
          <p className="text-xl font-semibold text-blue-600 mb-6">📍 {trip.location}</p>
          <p className="text-gray-700 text-lg mb-8">{trip.description}</p>
          <div className="grid grid-cols-2 gap-4 text-lg mb-8 border-t pt-4">
            <p><span className="font-bold">Starts:</span> {new Date(trip.startDate).toLocaleDateString()}</p>
            <p><span className="font-bold">Ends:</span> {new Date(trip.endDate).toLocaleDateString()}</p>
            <p><span className="font-bold">Price:</span> <span className="text-green-600 font-extrabold text-2xl">${trip.price.toLocaleString()}</span></p>
            <p className={`font-bold ${isFull ? 'text-red-500' : 'text-orange-500'}`}>
                Seats Left: {isFull ? 'Sold Out' : trip.remainingSeats}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 border-t">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Secure Your Spot</h2>
          
          {bookingSuccess && (
            <SuccessPopup 
              message="✅ Booking successful! Your reservation has been confirmed." 
              onClose={() => setBookingSuccess(false)} 
              autoCloseMs={5000}
            />
          )}

          {bookingError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              ❌ Booking Error: {bookingError}
            </div>
          )}

          {isFull ? (
            <div className="text-2xl text-red-600 font-bold p-4 bg-red-50 rounded-lg">
                This trip is currently fully booked. Please check back later!
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitBooking();
              }}
            >
              <div className="space-y-4">
                {/* FULL NAME */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  />

                </div>

                {/* EMAIL */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* Email validation */}
                  {formData.email !== "" && !formData.email.includes("@") && (
                    <p className="mt-1 text-sm text-red-600">Invalid email format</p>
                  )}
                </div>

                {/* PHONE */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow digits only
                      if (/^\d*$/.test(value)) {
                        // Limit to 11 digits
                        if (value.length <= 11) {
                          handleChange(e);
                        }
                      }
                    }}
                    required
                    placeholder="09123456789"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {formData.phone !== "" && formData.phone.length < 11 && (
                    <p className="mt-1 text-sm text-red-600">
                      Phone number must be exactly 11 digits (current: {formData.phone.length})
                    </p>
                  )}
                </div>

                {/* TRAVELERS */}
                <div>
                  <label htmlFor="numPersons" className="block text-sm font-medium text-gray-700">
                    Number of Travelers
                  </label>
                  <input
                    type="text"
                    id="numPersons"
                    name="numPersons"
                    min="1"
                    max={trip.remainingSeats}
                    required
                    value={formData.numPersons}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                  />

                  {Number(formData.numPersons) > trip.remainingSeats && (
                    <p className="text-sm text-red-600 mt-1">
                      Maximum allowed travelers is {trip.remainingSeats}.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 text-2xl font-bold text-gray-800">
                Total Cost: ${(formData.numPersons * trip.price).toLocaleString()}
              </div>

              <button
                type="submit"
                className={`mt-6 w-full py-3 px-4 rounded-md shadow-lg font-semibold text-white transition duration-300 ${
                  bookingDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={bookingDisabled}
              >
                {isSubmitting ? "Processing Booking..." : "Confirm and Pay"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
