import { ENV } from "./env";
import Prisma from "@prisma/client";

declare const global: typeof globalThis & { prisma?: Prisma.PrismaClient };

export const prisma =
  global.prisma ||
  new Prisma.PrismaClient({
    log: ENV.IS_DEVELOPMENT ? ["info", "query", "error", "warn"] : undefined,
  });

if (ENV.IS_DEVELOPMENT) global.prisma = prisma;

export * from "@prisma/client";
