// app/trips/[location]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Use the dedicated public hook file
import { fetchTripsByLocation } from '@/hooks/public/UseTrip'; 
import { ITrip } from "@/types";

// Use ITrip directly for state
type TripData = ITrip;

// Helper function to format the location slug for the display title
const formatSlugForDisplay = (slug: string): string => {
    if (!slug) return '';
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const TripListingPage: React.FC = () => {
    const params = useParams();
    const locationSlug = params.location as string; 
    
    const [trips, setTrips] = useState<TripData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formattedLocation = formatSlugForDisplay(locationSlug || '');

    // Data Fetching Logic
    useEffect(() => {
        if (!locationSlug) return;

        const loadTrips = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchTripsByLocation(locationSlug);
                setTrips(data);
            } catch (err: any) {
                if (err.message && err.message.includes('404')) {
                    setTrips([]); 
                } else {
                    setError('Could not load trips for this destination.');
                    console.error('Loading Error:', err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadTrips();
    }, [locationSlug]);


    // --- Render Logic ---
    if (isLoading) {
        return (/* ... Loading spinner ... */ <div className="p-16 text-2xl text-center text-blue-600">...</div>);
    }

    if (error) {
        return <div className="p-16 text-2xl text-center text-red-500">❌ {error}</div>;
    }

    return (
        <div className="container mx-auto p-6 md:p-12 min-h-screen">
            <h1 className="text-5xl font-extrabold mb-12 text-center text-gray-800">
                🗺️ Available Tours in **{formattedLocation}**
            </h1>

            {trips.length === 0 ? (
                /* ... No trips message ... */ <div className="bg-gray-100 p-10 rounded-xl text-center shadow-inner">...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trips.map((trip) => {
                        const isSoldOut = trip.remainingSeats <= 0;
                        const isLowStock = trip.remainingSeats > 0 && trip.remainingSeats <= 5;
                        
                        return (
                            <div key={trip.id} className={`... ${isSoldOut ? 'opacity-80 border-4 border-red-300' : isLowStock ? 'border-4 border-yellow-400/50' : ''}`}>
                                {/* ... Image, Low Stock/Sold Out tags ... */}
                                <div className="p-6">
                                    {/* ... Title, Description, Dates ... */}
                                    <div className="text-lg font-medium mb-4">
                                        <span className="font-bold text-gray-700">Seats: </span> 
                                        {isSoldOut ? (
                                            <span className="text-red-600 font-bold">Fully Booked ({trip.capacity})</span>
                                        ) : (
                                            <span className="text-orange-600">
                                                {trip.remainingSeats} available of {trip.capacity}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-4xl font-extrabold text-green-600">${trip.price.toLocaleString()}</span>
                                        {isSoldOut ? (
                                            <span className="text-white bg-red-600 px-6 py-3 rounded-full font-semibold opacity-70 cursor-not-allowed shadow-md">Sold Out</span>
                                        ) : (
                                            <Link href={`/trip/${trip.id}`} className="text-white bg-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md">
                                                Book Now
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TripListingPage;