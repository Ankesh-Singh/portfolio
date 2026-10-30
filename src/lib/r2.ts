import { getRequestContext } from "@cloudflare/next-on-pages";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const R2_PUBLIC_URL = "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev";

function getR2Credentials() {
  let accountId = process.env.R2_ACCOUNT_ID;
  let accessKeyId = process.env.R2_ACCESS_KEY_ID;
  let secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  let bucketName = process.env.R2_BUCKET_NAME || "assh";
  let publicUrl = process.env.R2_PUBLIC_URL || R2_PUBLIC_URL;

  try {
    const ctx = getRequestContext();
    const env = ctx?.env;
    if (env && typeof env === "object") {
      if ("R2_ACCOUNT_ID" in env && env.R2_ACCOUNT_ID) accountId = env.R2_ACCOUNT_ID as string;
      if ("R2_ACCESS_KEY_ID" in env && env.R2_ACCESS_KEY_ID) accessKeyId = env.R2_ACCESS_KEY_ID as string;
      if ("R2_SECRET_ACCESS_KEY" in env && env.R2_SECRET_ACCESS_KEY) secretAccessKey = env.R2_SECRET_ACCESS_KEY as string;
      if ("R2_BUCKET_NAME" in env && env.R2_BUCKET_NAME) bucketName = env.R2_BUCKET_NAME as string;
      if ("R2_PUBLIC_URL" in env && env.R2_PUBLIC_URL) publicUrl = env.R2_PUBLIC_URL as string;
    }
  } catch {}

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl };
}

export async function uploadToR2(key: string, data: ArrayBuffer, contentType: string): Promise<string> {
  const { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl } = getR2Credentials();

  // 1. Try native Cloudflare R2 binding
  try {
    const ctx = getRequestContext();
    const r2 = ctx?.env?.R2 as unknown as import("@cloudflare/workers-types").R2Bucket | undefined;
    if (r2 && typeof r2.put === "function") {
      await r2.put(key, data, {
        httpMetadata: { contentType: contentType || "application/octet-stream" },
      });
      return `${publicUrl}/${key}`;
    }
  } catch {}

  // 2. Fallback to S3 Client
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials not configured");
  }

  const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: Buffer.from(data),
      ContentType: contentType || "application/octet-stream",
    })
  );

  return `${publicUrl}/${key}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  const { accountId, accessKeyId, secretAccessKey, bucketName } = getR2Credentials();

  // 1. Try native Cloudflare R2 binding
  try {
    const ctx = getRequestContext();
    const r2 = ctx?.env?.R2 as unknown as import("@cloudflare/workers-types").R2Bucket | undefined;
    if (r2 && typeof r2.delete === "function") {
      await r2.delete(key);
      return;
    }
  } catch {}

  // 2. Fallback to S3 Client
  if (!accountId || !accessKeyId || !secretAccessKey) return;

  try {
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
  } catch (err) {
    console.error("Failed to delete R2 object:", key, err);
  }
}

export function extractR2Key(url: string): string | null {
  const { publicUrl } = getR2Credentials();
  const prefix = publicUrl || R2_PUBLIC_URL;
  if (!url || !url.startsWith(prefix)) return null;
  return url.slice(prefix.length + 1);
}
