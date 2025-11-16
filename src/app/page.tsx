"use client";

import { CheckCircle, Send } from "lucide-react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

  const parseGitHubUrl = (
    url: string
  ): { owner: string; repo: string } | null => {
    // Remove trailing slashes
    const cleanUrl = url.trim().replace(/\/+$/, "");

    // Match patterns like:
    // - https://github.com/owner/repo
    // - github.com/owner/repo
    // - owner/repo
    const patterns = [
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/\s]+)\/([^\/\s]+)$/,
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        return { owner: match[1], repo: match[2] };
      }
    }

    return null;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const parsed = parseGitHubUrl(repoUrl);
    if (parsed) {
      router.push(`/${parsed.owner}/${parsed.repo}`);
    } else {
      toast.error(
        "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo or owner/repo)"
      );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center relative bg-[url('/images/blur.png')] bg-cover bg-center min-h-svh">
      <div className="max-w-3xl w-full flex flex-col justify-center items-center px-6">
        <div className="text-center flex flex-col items-center justify-center">
          <h1 className="text-5xl mb-3 bg-linear-to-r from-white to-[#BABABA] bg-clip-text text-transparent font-semibold leading-tight">
            Transform Your Repository into Documentation
          </h1>
          <h2 className="mb-8 text-xl font-medium leading-tight">
            Generate beautiful, searchable documentation from any GitHub
            repository
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-2xl"
          >
            <InputGroup className="py-6 px-2 rounded-xl bg-background/50 dark:bg-background/50">
              <InputGroupInput
                placeholder="Enter GitHub repository URL..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="tertiary"
                  size="icon-sm"
                  type="submit"
                >
                  <Send />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
          <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              AI-Powered Analysis
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Auto-Generated Content
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Instant Updates
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
