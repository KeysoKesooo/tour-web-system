"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/admin/Header";
import { Sidebar } from "@/components/admin/Sidebar";
import { Footer } from "@/components/admin/Footer";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login"); // redirect if not logged in
      } else if (user.role !== "ADMIN") {
        router.push("/access-denied"); // optional page
      } else {
        setReady(true);
      }
    }
  }, [user, loading, router]);

  if (loading || !ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex flex-col">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
