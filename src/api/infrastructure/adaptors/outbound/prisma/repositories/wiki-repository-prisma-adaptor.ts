import { WikiRepositoryPort } from "@/api/core/ports/outbound/wiki-repository-port";
import { PrismaClient } from "@prisma/client";

export class WikiRepositoryPrismaAdaptor implements WikiRepositoryPort {
  private readonly prisma = new PrismaClient();

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.wiki.count({
      where: { repository: slug },
    });

    return count > 0;
  }
}
