import { PrismaClient } from '@prisma/client';

declare global {
  var __db__: PrismaClient;
}

let prisma = global.__db__;

if (process.env.NODE_ENV === 'production') {
  prisma = getClient();
} else if (!global.__db__) {
  prisma = global.__db__ = getClient();
}

function getClient() {
  const client = new PrismaClient();

  client.$connect();

  return client;
}

export { prisma };
