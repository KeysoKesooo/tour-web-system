'use client';

import { useDashboard } from '@/hooks/UseAnalytics';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function DashboardPage() {
  const { analytics, trends, topTrips, loading, error, searchTerm, setSearchTerm, refresh } =
    useDashboard();

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Total Bookings</h2>
          <p className="text-2xl">{analytics?.totalBookings}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Total Revenue</h2>
          <p className="text-2xl">${analytics?.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Total Trips</h2>
          <p className="text-2xl">{analytics?.totalTrips}</p>
        </div>
      </div>

      {/* Most Booked Trip */}
      {analytics?.mostBookedTrip && (
        <div className="p-4 bg-yellow-100 rounded shadow">
          <h2 className="font-semibold">Most Booked Trip</h2>
          <p>
            {analytics.mostBookedTrip.title} ({analytics.mostBookedTrip.bookings} bookings)
          </p>
        </div>
      )}

      {/* Trends Chart */}
      <div className="p-4 bg-white shadow rounded">
        <h2 className="font-semibold mb-4">Bookings & Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalBookings" stroke="#8884d8" name="Bookings" />
            <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" name="Revenue ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Trips Table */}
      <div className="p-4 bg-white shadow rounded space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Top Trips</h2>
          <input
            type="text"
            placeholder="Search trips..."
            className="border px-2 py-1 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {topTrips.length === 0 ? (
          <p>No trips found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left">Title</th>
                <th className="border px-2 py-1 text-left">Bookings</th>
                <th className="border px-2 py-1 text-left">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topTrips.map((trip) => (
                <tr key={trip.id}>
                  <td className="border px-2 py-1">{trip.title}</td>
                  <td className="border px-2 py-1">{trip.bookings}</td>
                  <td className="border px-2 py-1">${trip.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Refresh Button */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={refresh}
      >
        Refresh
      </button>
    </div>
  );
}
