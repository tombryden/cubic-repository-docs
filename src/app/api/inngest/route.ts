import { inngest } from "@/api/infrastructure/adaptors/inbound/inngest/client";
import { repositoryAnalyser } from "@/api/infrastructure/adaptors/inbound/inngest/functions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [repositoryAnalyser],
});
