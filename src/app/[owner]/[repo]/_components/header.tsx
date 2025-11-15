import { Button } from "@/components/ui/button";
import { FileText, Github, Search } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  githubUrl: string;
}
export function Header({ githubUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center px-4 mx-auto">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <FileText className="size-5 text-primary" />
            <span className="font-semibold text-lg">RepoScribe</span>
          </div>
        </Link>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <a href={githubUrl} target="_blank">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
