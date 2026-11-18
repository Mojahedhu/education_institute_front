import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (
  name: string,
  position: "first" | "full" = "full",
) => {
  if (!name) return "";
  if (position === "first") {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");
  }
  const parts = name.trim().split(" ");

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  const firstInitial = parts[0][0].toUpperCase();
  const lastInitial = parts[parts.length - 1][0].toUpperCase();

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
      canvas.width = img.width;
      canvas.height = img.height;
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
