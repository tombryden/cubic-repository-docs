import "reflect-metadata";

import { container } from "tsyringe";
import { WikiPageRepositoryPrismaAdaptor } from "./adaptors/outbound/prisma/repositories/wiki-page-repository-prisma-adaptor";
import { DI } from "./di-tokens";

container.registerSingleton(
  DI.WIKI_PAGE_REPOSITORY,
  WikiPageRepositoryPrismaAdaptor
);
