// lib/qstash/qstashWrapper.ts
import { Client as QStashClient } from "@upstash/qstash";

export const qstash = new QStashClient({
  // Use QSTASH_TOKEN here (ensure this matches your Vercel Env Vars)
  token: process.env.QSTASH_TOKEN!,
});

/**
 * Enqueues a background job.
 * FIX: Changed 'payload: any' to 'payload: Record<string, unknown>'
 * or 'object' to satisfy ESLint.
 */
export async function enqueueJob(
  jobName: string,
  payload: Record<string, unknown>,
) {
  await qstash.publishJSON({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/qstash/${jobName}`,
    body: payload,
  });
}
