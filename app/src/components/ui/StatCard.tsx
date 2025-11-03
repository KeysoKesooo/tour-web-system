// src/components/ui/StatCard.tsx
"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 hover:shadow-md transition">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-500 uppercase">{title}</h3>
      </div>
      <div className="mb-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  );
};
