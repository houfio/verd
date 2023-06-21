import { PrismaClient } from '@prisma/client';

import { remember } from '~/utils/remember.server';

export const db = remember('prisma', new PrismaClient());
