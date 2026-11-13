import { CLOUDINARY_CLOUD_NAME } from "@/constants";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";
import { Trash, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useCloudinaryScript } from "@/hooks/use-cloudinary-script";
import { WIDGET_OPTIONS } from "@/lib/cloudinaryScript";

const UploadWidget = ({
  value = null,
  onChange,
  disabled = false,
}: UploadWidgetProps) => {
  const status = useCloudinaryScript();
  const widgetRef = useRef<CloudinaryWidget>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Always keep latest onChange
  // Keep the latest callback without re-creating the widget when it changes.
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync external value → internal preview
  useEffect(() => {
    setPreview(value);
    if (!value) {
      setDeleteToken(null);
    }
  }, [value]);

  // Initialize cloudinary widget (client-side only)

  useEffect(() => {
    if (status !== "ready" || !window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      WIDGET_OPTIONS,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          setUploadError("Upload failed. Please try again.");
          return;
        }

        if (result?.event === "success") {
          const payload: UploadWidgetValue = {
            url: result.info.secure_url,
            publicId: result.info.public_id,
          };
          setUploadError(null);
          setPreview(payload);
          // Only present if the upload present has "Return delete token" enabled.
          setDeleteToken(result.info?.delete_token ?? "");
          onChangeRef.current?.(payload);
        }
      },
    );

    widgetRef.current = widget;

    return () => {
      void widget.destroy();
      widgetRef.current = null;
    };
  }, [status]);

  const canOpen = status === "ready" && !disabled;

  const openWidget = () => {
    if (!disabled) {
      widgetRef.current?.open();
    }
  };

  const removeFromCloudinary = async () => {
    if (!preview) return;

    // 1. If no delete token is available (e.g. existing image from DB),
    // we cannot delete directly from the browser without API secrets.
    if (!deleteToken) {
      console.warn(
        "Delete token is missing. Image cannot be deleted via client token.",
      );
      // Optional: If you want to prevent removing from UI when token is missing:
      setUploadError(
        "Cannot remove image directly: delete token expired or unavailable.",
      );
      return;
    }

    setIsRemoving(true);
    setUploadError(null);

    try {
      const params = new URLSearchParams();
      params.append("token", deleteToken);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
        {
          method: "POST",
          body: params,
        },
      );

      const data = await response.json();

      // Cloudinary delete_by_token returns { result: "ok" } on success
      if (!response.ok || data.result !== "ok") {
        throw new Error(data.error?.message || "Cloudinary deletion failed.");
      }
      // 2. Only clear preview and notify form if deletion was confirmed:
      setPreview(null);
      setDeleteToken(null);
      onChangeRef.current?.(null);
    } catch (e) {
      console.error("Failed to remove image from Cloudinary", e);
      setUploadError("Failed to remove image. Please try again.");
    } finally {
      // 3. Only reset the loading indicator in finally
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="upload file" />

          <Button
            type="button"
            size={"icon"}
            variant={"destructive"}
            onClick={removeFromCloudinary}
            disabled={isRemoving || disabled}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          className="upload-dropzone"
          role="button"
          disabled={!canOpen}
          aria-busy={status === "loading"}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              {status === "loading" ? (
                <p>Loading uploader...</p>
              ) : (
                <>
                  <p>Click to upload photo</p>
                  <p>PNG, JPG, up to 5MB</p>
                </>
              )}
            </div>
          </div>
        </button>
      )}
      {status === "error" && (
        <p role="alert" className="text-destructive text-sm">
          Failed to load uploader. Please refresh or try again later.
        </p>
      )}

      {uploadError && (
        <p role="alert" className="text-destructive text-sm">
          {uploadError}
        </p>
      )}
    </div>
  );
};

export default UploadWidget;
