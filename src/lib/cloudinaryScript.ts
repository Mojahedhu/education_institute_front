import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

const SCRIPT_ID = "cloudinary-upload-widget-script";
const SCRIPT_SRC = "https://upload-widget.cloudinary.com/latest/global/all.js";

// Hoisted so the object is created once, not on every effect run.
const WIDGET_OPTIONS = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
  multiple: false,
  folder: "upload",
  maxFileSize: 5_000_000,
  clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
} as const;

/* -------------------------------------------------------------------------- */
/* Script loader: one <script>, one promise, shared by every instance          */
/* -------------------------------------------------------------------------- */

let scriptPromise: Promise<void> | null = null;

function loadCloudinaryScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Cloudinary script can only run in the browser."),
    );
  }
  if (window.cloudinary) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => {
      // Clean up so a later mount can retry instead of stuck on a dead tag.
      script.remove();
      scriptPromise = null;
      reject(new Error("Failed to load cloudinary upload widget script."));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

type ScriptStatus = "loading" | "error" | "ready";

export { ScriptStatus, loadCloudinaryScript, WIDGET_OPTIONS };
