"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Github, Sparkles, FileText } from "lucide-react";
import { getGithubUrl } from "@/lib/utils";
import type { UseMutationResult } from "@tanstack/react-query";
import type { GenerateWikiResponseDto } from "@/app/api/wiki/[owner]/[repo]/generate/route";

interface WikiEmptyStateProps {
  owner: string;
  repo: string;
  generateMutation: UseMutationResult<GenerateWikiResponseDto, Error, void>;
}

export function WikiEmptyState({
  owner,
  repo,
  generateMutation: generateWikiMutation,
}: WikiEmptyStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-card border border-border rounded-xl shadow-xl p-8 md:p-12 space-y-8">
          {/* Icon Header */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative bg-primary/10 p-6 rounded-2xl border border-primary/20">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Wiki Documentation Not Found
            </h1>
            <p className="text-muted-foreground text-lg">
              Generate comprehensive documentation for your repository
            </p>
          </div>

          {/* GitHub Repo Info */}
          <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Github className="w-4 h-4" />
              <span className="font-medium">Repository</span>
            </div>
            <div className="flex items-center gap-2 text-lg font-mono">
              <span className="text-muted-foreground">{owner}</span>
              <span className="text-muted-foreground">/</span>
              <a
                href={getGithubUrl(owner, repo)}
                target="_blank"
                className="text-foreground hover:text-primary transition-colors font-semibold"
              >
                {repo}
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-background border border-border rounded-lg p-4 space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">AI-Powered</h3>
              <p className="text-xs text-muted-foreground">
                Intelligent documentation generation
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-4 space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Comprehensive</h3>
              <p className="text-xs text-muted-foreground">
                Covers all aspects of your code
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-4 space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Structured</h3>
              <p className="text-xs text-muted-foreground">
                Organised and easy to navigate
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full"
              onClick={() => generateWikiMutation.mutate()}
              disabled={generateWikiMutation.isPending}
            >
              <Sparkles className="w-5 h-5" />
              {generateWikiMutation.isPending
                ? "Starting generation..."
                : "Generate Wiki Documentation"}
            </Button>
            {generateWikiMutation.isError && (
              <p className="text-center text-sm text-destructive">
                {generateWikiMutation.error instanceof Error
                  ? generateWikiMutation.error.message
                  : "An error occurred"}
              </p>
            )}
            <p className="text-center text-xs text-muted-foreground">
              This will analyse your repository and create comprehensive
              documentation
            </p>
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
