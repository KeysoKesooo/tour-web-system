'use client';
import { useState, useEffect } from 'react';
import { IAnalytics, Trend, TopTrip } from '@/types/IntAnalytics';

export function useDashboard() {
  const [analytics, setAnalytics] = useState<IAnalytics | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [topTrips, setTopTrips] = useState<TopTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch main analytics
      const res = await fetch('/api/dashboard', { credentials: 'include' });
      const data: IAnalytics = await res.json();
      if (!res.ok) throw new Error((data as any).error || 'Failed to fetch dashboard');
      setAnalytics(data);

      // Fetch trends
      const trendsRes = await fetch('/api/dashboard/trends', { credentials: 'include' });
      const trendsData: Trend[] = await trendsRes.json();
      setTrends(trendsData);

      // Fetch top trips
      const topTripsRes = await fetch('/api/dashboard/top-trips', { credentials: 'include' });
      const tripsData: TopTrip[] = await topTripsRes.json();
      setTopTrips(tripsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter top trips by search term
  const filteredTrips = topTrips.filter(trip =>
    trip.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    analytics,
    trends,
    topTrips: filteredTrips,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refresh: fetchDashboard,
  };
}
