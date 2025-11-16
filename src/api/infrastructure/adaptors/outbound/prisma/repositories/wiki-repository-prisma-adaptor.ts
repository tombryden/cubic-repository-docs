import { WikiRepositoryPort } from "@/api/core/ports/outbound/wiki-repository-port";
import { PrismaClient } from "@prisma/client";
import { PrismaDomainMapper } from "../mappers/prisma-domain-mapper";
import { Wiki, WikiStatus } from "@/api/core/entities/wiki";

export class WikiRepositoryPrismaAdaptor implements WikiRepositoryPort {
  private readonly prisma = new PrismaClient();

  async existsByRepository(owner: string, repo: string): Promise<boolean> {
    const repository = Wiki.getRepositoryString(owner, repo);

    const count = await this.prisma.wiki.count({
      where: { repository },
    });

    return count > 0;
  }

  async findOneByRepository(owner: string, repo: string): Promise<Wiki | null> {
    const repository = Wiki.getRepositoryString(owner, repo);

    const wiki = await this.prisma.wiki.findUnique({
      where: { repository },
    });

    if (!wiki) {
      return null;
    }

    return PrismaDomainMapper.wiki.toDomain(wiki);
  }

  async upsert(wiki: Wiki): Promise<Wiki> {
    const wikiData = PrismaDomainMapper.wiki.fromDomain(wiki);

    const upsertedWiki = await this.prisma.wiki.upsert({
      where: { repository: wiki.repository },
      create: wikiData,
      update: { status: wiki.status, branch: wiki.branch },
    });

    return PrismaDomainMapper.wiki.toDomain(upsertedWiki);
  }

  async updateStatus(wikiId: string, status: WikiStatus): Promise<Wiki> {
    const updatedWiki = await this.prisma.wiki.update({
      where: { id: wikiId },
      data: { status },
    });

    return PrismaDomainMapper.wiki.toDomain(updatedWiki);
  }
}
