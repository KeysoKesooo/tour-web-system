// lib/qstash/qstsashWrapper.ts
import { Client as QStashClient } from "@upstash/qstash";

export const qstash = new QStashClient({
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function enqueueJob(jobName: string, payload: any) {
  await qstash.publishJSON({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/qstash/${jobName}`,
    body: payload,
  });
}
