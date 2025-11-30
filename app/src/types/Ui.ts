// src/types.ts

import React from "react";
import { LucideIcon } from "lucide-react"; // Use LucideIcon for type safety

// --- Interfaces ---

export interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
}

export interface ValueProp {
  // Use LucideIcon type for better type checking
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface Destination {
  id: number;
  name: string;
  themeColor: string;
  tagline: string;
  price: number;
  icon: string;
  // REMOVED 'path: string;' as it was unused and dynamically generated
}

// NOTE: Ensure your ITrip interface (from previous steps) is also here
// export interface ITrip { ... }
