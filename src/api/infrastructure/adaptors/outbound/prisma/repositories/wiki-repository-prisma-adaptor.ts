import { WikiRepositoryPort } from "@/api/core/ports/outbound/wiki-repository-port";
import { PrismaClient } from "@prisma/client";
import { PrismaDomainMapper } from "../mappers/prisma-domain-mapper";
import { Wiki } from "@/api/core/entities/wiki";

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

  async insert(wiki: Wiki): Promise<Wiki> {
    const newWiki = await this.prisma.wiki.create({
      data: PrismaDomainMapper.wiki.fromDomain(wiki),
    });

    return PrismaDomainMapper.wiki.toDomain(newWiki);
  }
}
