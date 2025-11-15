import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MarkdownRenderer } from "./_components/markdown-renderer";
import { LeftSidebar } from "./_components/left-sidebar";
import { Header } from "./_components/header";
import { RightSidebar } from "./_components/right-sidebar";
import { getGithubUrl } from "@/lib/utils";

export default async function WikiPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;

  // Full markdown content
  const markdownContent = `
# Overview

A comprehensive introduction to the codebase architecture, features, and implementation details.

## Purpose and Scope

This document provides a high-level introduction to the codebase. It covers the service's purpose, core concepts, architectural approach, and technology stack. For detailed setup instructions, see Getting Started. For in-depth architectural patterns, see Architecture.

## Key Features

The service provides several key capabilities:

- **High Performance** - Optimized for speed and efficiency with advanced caching mechanisms
- **Secure by Default** - Built-in security features with industry-standard encryption
- **Modular Architecture** - Clean separation of concerns with hexagonal architecture pattern
- **Type Safe** - Full TypeScript support with comprehensive type definitions

## Architecture Overview

The system follows a hexagonal architecture pattern with clear separation between core business logic and infrastructure concerns.

\`\`\`
project/
├── src/
│   ├── core/              # Core domain layer
│   │   ├── entities/      # Domain entities
│   │   ├── usecases/      # Business logic
│   │   └── ports/         # Interface contracts
│   └── infrastructure/    # Infrastructure layer
│       ├── http/          # HTTP routes
│       └── persistence/   # Database layer
└── tests/                 # Test suites
\`\`\`

## Technology Stack

| Technology   | Version | Purpose                            |
| ------------ | ------- | ---------------------------------- |
| Express      | 5.1.0   | HTTP server and routing            |
| TypeORM      | 0.3.27  | Database ORM                       |
| TypeScript   | 5.6.0   | Type-safe development              |
| Jest         | 30.2.0  | Testing framework                  |
| Pino         | 10.1.0  | Structured logging                 |

## Getting Started

Follow these steps to get the project running locally:

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/owner/repo.git
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Start the development server

\`\`\`bash
npm run dev
\`\`\`

> **Note:** Make sure you have Node.js version 18 or higher installed before starting.
`;

  return (
    <div>
      <Header githubUrl={getGithubUrl(owner, repo)} />

      <div className="px-4 container mx-auto">
        <div className="flex gap-6 lg:gap-10">
          <LeftSidebar />

          {/* Main Content */}
          <main className="flex-1 min-w-0 py-8">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <div className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
                <a
                  href={getGithubUrl(owner, repo, false)}
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                >
                  {owner}
                </a>
                <span>/</span>
                <a
                  href={getGithubUrl(owner, repo)}
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                >
                  {repo}
                </a>
              </div>

              {/* Content Sections */}
              <div className="markdown-content">
                <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
              </div>

              {/* Navigation Footer */}
              <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                <Button variant="outline" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </main>

          <RightSidebar
            markdown={markdownContent}
            githubUrl={getGithubUrl(owner, repo)}
          />
        </div>
      </div>
    </div>
  );
}
