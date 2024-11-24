import { signOut } from "next-auth/react";

export async function logoutAllDevices() {
  try {
    await fetch("/api/auth/logout-all", {
      method: "POST",
    });

    await signOut({ redirect: true, callbackUrl: "/login" });
  } catch (error) {
    console.error("Logout all devices error:", error);
    throw error;
  }
}
