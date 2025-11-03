// src/app/layout.tsx
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Fullpack Tour and Travel",
  description: "Next.js + Tailwind v4 project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
