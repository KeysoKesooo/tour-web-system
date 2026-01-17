import { Client as QStashClient } from "@upstash/qstash";

export const qstash = new QStashClient({
  // Use QSTASH_TOKEN here (ensure this matches your Vercel Env Vars)
  token: process.env.QSTASH_TOKEN || "",
});

/**
 * Enqueues a background job.
 * Handles local development by skipping cloud publishing to localhost.
 */
export async function enqueueJob(
  jobName: string,
  payload: Record<string, unknown>,
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 1. Check if we are in development or if the URL points to localhost
  const isLocal =
    process.env.NODE_ENV === "development" || baseUrl?.includes("localhost");

  if (isLocal) {
    console.log(`[QSTASH MOCK] Job: ${jobName}`, payload);
    // In local dev, we don't publish to the cloud because QStash can't hit localhost
    return { skipped: true };
  }

  // 2. Ensure we have a valid URL before publishing
  if (!baseUrl || !baseUrl.startsWith("http")) {
    console.warn("QStash skipped: NEXT_PUBLIC_BASE_URL is missing or invalid.");
    return;
  }

  try {
    await qstash.publishJSON({
      url: `${baseUrl}/api/qstash/${jobName}`,
      body: payload,
    });
  } catch (error) {
    // We log the error but don't THROW it.
    // This prevents a background job failure from crashing your User/Trip creation.
    console.error("QStash Publish Error:", error);
  }
}
