// src/database/prisma.ts
import { PrismaClient } from '@prisma/client';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

let prisma: PrismaClient | undefined = undefined;

export function getPrismaClient() {
  if (!prisma) {
    const isTest = process.env.NODE_ENV === 'test';
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: isTest ? ['error'] : ['query', 'error', 'warn'],
    });
  }
  return prisma;
}

export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = undefined;
  }
}
