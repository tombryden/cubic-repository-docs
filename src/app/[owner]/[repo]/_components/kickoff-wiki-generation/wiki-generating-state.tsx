import { Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function WikiGeneratingState() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-card border border-border rounded-xl shadow-xl p-8 md:p-12 space-y-8">
          {/* Icon Header */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative bg-primary/10 p-6 rounded-2xl border border-primary/20">
                <Spinner className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Generating Your Wiki
            </h1>
            <p className="text-muted-foreground text-lg">
              AI is analyzing your repository and creating comprehensive
              documentation
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <p className="text-sm font-medium animate-pulse">
                  Analyzing repository structure
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:150ms]" />
                <p className="text-sm font-medium animate-pulse [animation-delay:150ms]">
                  Fetching source files
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:300ms]" />
                <p className="text-sm font-medium animate-pulse [animation-delay:300ms]">
                  Generating documentation pages
                </p>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  This may take a few minutes
                </p>
                <p className="text-xs text-muted-foreground">
                  We&apos;re using AI to understand your codebase and create
                  detailed documentation. Feel free to close this page and come
                  back later.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Generation typically takes 2-5 minutes depending on repository size
          </p>
        </div>
      </div>
    </div>
  );
}
