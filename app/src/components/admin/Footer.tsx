// src/components/admin/Footer.tsx
"use client";

import React from "react";

export const Footer = () => {
  return (
    <footer className="p-4 bg-white text-center text-gray-500 border-t">
      &copy; {new Date().getFullYear()} Fullpack Tour and Travel. All rights
      reserved.
    </footer>
  );
};
