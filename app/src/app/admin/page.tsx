"use client";

import { useEffect, useState } from "react";
import { IAnalytics } from "@/types/IntAnalytics";
import { StatCard } from "@/components/ui/StatCard";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<IAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");

        if (!res.ok) {
          const text = await res.text(); // get raw response for debugging
          throw new Error(`API error: ${res.status} - ${text}`);
        }

        // Make sure response is JSON
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`Invalid JSON: ${text}`);
        }

        setAnalytics(data.latest ?? data); // safely handle undefined
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <StatCard title="Total Bookings" value={analytics?.totalBookings ?? 0} />
      <StatCard
        title="Total Revenue"
        value={`$${analytics?.totalRevenue ?? 0}`}
      />
      <StatCard title="Total Trips" value={analytics?.totalTrips ?? 0} />
    </div>
  );
}
