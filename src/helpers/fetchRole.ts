export const fetchRole = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/auth/check-role");
    const data = await response.json();
    return data.data.role || null;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
};
