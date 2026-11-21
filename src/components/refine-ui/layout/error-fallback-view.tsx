import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Home,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

function ErrorFallbackView({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-border/60 shadow-lg">
        <CardHeader className="text-center pb-2">
          {/* Subtle Glowing Icon */}
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
            <AlertTriangle className="size-6" />
          </div>

          <CardTitle className="text-xl font-bold tracking-tight">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            An unexpected error occurred while rendering this page.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {error?.message && (
            <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-left">
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Error details</span>
                {showDetails ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>

              {showDetails && (
                <div className="mt-2 max-h-48 overflow-auto rounded bg-background/80 p-2 font-mono text-xs text-destructive">
                  <p className="font-semibold">
                    {error.name}: {error.message}
                  </p>
                  {error.stack && (
                    <pre className="mt-1.5 text-[11px] text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {error.stack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="size-4 mr-1.5" />
            Go Home
          </Button>

          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={onReset}
          >
            <RotateCcw className="size-4 mr-1.5" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ErrorFallbackView;

ErrorFallbackView.displayName = "ErrorFallbackView";
