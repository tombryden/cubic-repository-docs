import { CheckCircle, Send } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

export default function Home() {
  return (
    <div className="h-svh flex flex-col items-center justify-center relative">
      <div className="max-w-3xl w-full flex flex-col justify-center items-center px-6">
        <div className="text-center flex flex-col items-center justify-center">
          <h1 className="text-5xl mb-3 bg-linear-to-r from-white to-[#BABABA] bg-clip-text text-transparent font-semibold leading-tight">
            Transform Your Repository into Documentation
          </h1>
          <h2 className="mb-8 text-xl font-medium leading-tight">
            Generate beautiful, searchable documentation from any GitHub
            repository
          </h2>
          <div className="flex flex-col gap-4 w-full max-w-2xl">
            <InputGroup className="py-6 px-2 rounded-xl bg-background/50 dark:bg-background/50">
              <InputGroupInput placeholder="Enter GitHub repository URL..." />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="tertiary" size="icon-sm">
                  <Send />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
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
    </div>
  );
}
