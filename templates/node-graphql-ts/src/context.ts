import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface GraphQLContext {
  prisma: PrismaClient;
}

export default async function context(): Promise<GraphQLContext> {
  return {
    prisma,
  };
}
