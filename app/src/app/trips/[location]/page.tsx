'use client';

import React, { useEffect, useState, use } from 'react'; // Added 'use'
import Link from 'next/link';

// Use the dedicated public hook file
import { fetchTripsByLocation } from '@/hooks/public/UseTrip'; 
import { ITrip } from "@/types";

// Define the interface for the Next.js 15 Promise-based params
interface PageProps {
    params: Promise<{ location: string }>;
}

// Helper function to format the location slug for the display title
const formatSlugForDisplay = (slug: string): string => {
    if (!slug) return '';
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const TripListingPage = ({ params }: PageProps) => {
    // In Next.js 15, we use the 'use' hook to unwrap the params Promise
    const resolvedParams = use(params);
    const locationSlug = resolvedParams.location;
    
    const [trips, setTrips] = useState<ITrip[]>([]);
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
        return (
            <div className="flex items-center justify-center p-16 text-2xl text-center text-blue-600">
                <div className="animate-pulse">Loading tours for {formattedLocation}...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-12 text-center">
                <div className="bg-red-50 p-8 rounded-2xl inline-block">
                    <p className="text-2xl text-red-500 font-semibold">❌ {error}</p>
                    <Link href="/" className="mt-4 inline-block text-blue-600 underline">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-12 min-h-screen">
            <h1 className="text-5xl font-extrabold mb-12 text-center text-gray-800">
                🗺️ Available Tours in <span className="text-blue-600">{formattedLocation}</span>
            </h1>

            {trips.length === 0 ? (
                <div className="bg-gray-100 p-16 rounded-3xl text-center shadow-inner">
                    <p className="text-2xl text-gray-500">No tours found for this location yet.</p>
                    <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold">
                        Browse Other Destinations
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trips.map((trip) => {
                        const isSoldOut = trip.remainingSeats <= 0;
                        const isLowStock = trip.remainingSeats > 0 && trip.remainingSeats <= 5;
                        
                        return (
                            <div 
                                key={trip.id} 
                                className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] border-2 ${
                                    isSoldOut ? 'opacity-80 border-red-300' : isLowStock ? 'border-yellow-400' : 'border-transparent'
                                }`}
                            >
                                <div className="relative h-48 bg-gray-200">
                                    {trip.imageUrl && (
                                        <img 
                                            src={trip.imageUrl} 
                                            alt={trip.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    {isSoldOut && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="bg-red-600 text-white px-4 py-1 rounded-md font-bold uppercase tracking-widest">Sold Out</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{trip.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{trip.description}</p>
                                    
                                    <div className="text-lg font-medium mb-4">
                                        <span className="font-bold text-gray-700">Seats: </span> 
                                        {isSoldOut ? (
                                            <span className="text-red-600 font-bold">Fully Booked ({trip.capacity})</span>
                                        ) : (
                                            <span className={isLowStock ? "text-orange-600 font-bold" : "text-green-600"}>
                                                {trip.remainingSeats} available of {trip.capacity}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-3xl font-extrabold text-green-600">
                                            ${trip.price.toLocaleString()}
                                        </span>
                                        {isSoldOut ? (
                                            <button disabled className="text-white bg-gray-400 px-6 py-3 rounded-full font-semibold cursor-not-allowed">
                                                Sold Out
                                            </button>
                                        ) : (
                                            <Link 
                                                href={`/trip/${trip.id}`} 
                                                className="text-white bg-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md"
                                            >
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