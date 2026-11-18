import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to safely get the first full Unicode code point/character
const getFirstCodePoint = (str: string) =>
  (Array.from(str)[0] ?? "").toUpperCase();

export const getInitials = (
  name: string,
  position: "first" | "full" = "full",
) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (position === "first") {
    return parts.slice(0, 2).map(getFirstCodePoint).join("");
  }

  if (parts.length === 1) {
    return getFirstCodePoint(parts[0]);
  }

  const firstInitial = getFirstCodePoint(parts[0]);
  const lastInitial = getFirstCodePoint(parts[parts.length - 1]);

  return `${firstInitial}${lastInitial}`;
};

// a helper function that loads the image into an off-screen <canvas> and calculates the average luminance using the standard ITU-R formula:
export async function getImageBrightness(
  imageUrl: string,
): Promise<"light" | "dark"> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("dark");

      ctx.drawImage(img, 0, 0, 1, 1); // Sample average color
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

      // Perceived luminance calculation
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      resolve(luminance > 128 ? "light" : "dark");
    };

    img.onerror = () => resolve("dark");
  });
}
