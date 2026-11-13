import { loadCloudinaryScript, ScriptStatus } from "@/lib/cloudinaryScript";
import { useEffect, useState } from "react";

export const useCloudinaryScript = (): ScriptStatus => {
  // Always start as "loading" so server and client markup match on hydration

  const [status, setStatus] = useState<ScriptStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    loadCloudinaryScript()
      .then(() => {
        if (!cancelled) setStatus("ready");
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setStatus(err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
};
