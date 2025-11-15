import { Button } from "@/components/ui/button";
import { FileText, Github, Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center px-4 mx-auto">
        <div className="flex items-center space-x-2">
          <FileText className="size-5 text-primary" />
          <span className="font-semibold text-lg">RepoScribe</span>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Github className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
