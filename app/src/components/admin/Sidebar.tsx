// src/components/admin/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";

const links = [
  { name: "Dashboard", href: "/admin" },
  { name: "Users", href: "/admin/users" },
  { name: "Trips", href: "/admin/trips" },
  { name: "Bookings", href: "/admin/bookings" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 flex flex-col gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-4 py-2 rounded hover:bg-green-200 font-medium text-gray-800"
        >
          {link.name}
        </Link>
      ))}
    </aside>
  );
};
