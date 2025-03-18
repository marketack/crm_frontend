const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // Use .env or fallback to local

export const getProfileImage = (imagePath?: string): string => {
  if (!imagePath) return "/default-avatar.png"; // ✅ Fallback for missing images

  // ✅ If the path is already an absolute URL, return it as is
  if (imagePath.startsWith("http") || imagePath.startsWith("//")) return imagePath;

  // ✅ Otherwise, append the backend URL
  return `${API_BASE_URL}${imagePath}`;
};
