import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface WikiErrorStateProps {
  owner: string;
  repo: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function WikiErrorState({
  owner,
  repo,
  onRetry,
  isRetrying = false,
}: WikiErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-card border border-destructive/50 rounded-xl shadow-xl p-8 md:p-12 space-y-8">
          {/* Icon Header */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full" />
              <div className="relative bg-destructive/10 p-6 rounded-2xl border border-destructive/20">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Generation Failed
            </h1>
            <p className="text-muted-foreground text-lg">
              We encountered an error while generating documentation for{" "}
              <span className="font-mono text-foreground">
                {owner}/{repo}
              </span>
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 space-y-3">
            <p className="text-sm font-medium">Common causes:</p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Repository might be private or inaccessible</li>
              <li>Repository might be too large to process</li>
              <li>Temporary service interruption</li>
              <li>Rate limit exceeded</li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={onRetry}
              variant="default"
              disabled={isRetrying}
            >
              <RefreshCw
                className={`w-5 h-5 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
