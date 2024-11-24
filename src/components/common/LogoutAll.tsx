"use client";

import { useState } from "react";
import { logoutAllDevices } from "@/lib/auth-actions";
import { Button } from "../ui/button";

export default function LogoutAllButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutAll = async () => {
    try {
      setIsLoading(true);
      await logoutAllDevices();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogoutAll}
      disabled={isLoading}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      {isLoading ? "Logging out..." : "Logout from all devices"}
    </Button>
  );
}
