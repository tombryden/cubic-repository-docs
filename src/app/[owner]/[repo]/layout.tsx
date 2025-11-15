import { KickoffWikiGeneration } from "./_components/kickoff-wiki-generation/kickoff-wiki-generation";

/**
 * Entry point to begin generating the wiki for this repository
 */
export default async function WikiLayout({
  children,
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
  children: React.ReactNode;
}) {
  const { owner, repo } = await params;

  // // Fetch the wiki pages, see if it exists
  // const resp = await fetch(`${ENV.API_URL}/wiki/${owner}/${repo}/pages`);
  // const data: GetWikiResponseDto = await resp.json();

  return (
    <KickoffWikiGeneration owner={owner} repo={repo}>
      {children}
    </KickoffWikiGeneration>
  );
}
