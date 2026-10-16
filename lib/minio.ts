import * as Minio from "minio";

const endPoint = process.env.MINIO_ENDPOINT || "cvs.hubani.org";
const port = parseInt(process.env.MINIO_PORT || "443", 10);
const useSSL = process.env.MINIO_USE_SSL === "true";
const accessKey = process.env.MINIO_ACCESS_KEY || "";
const secretKey = process.env.MINIO_SECRET_KEY || "";

export const minioClient = new Minio.Client({
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey,
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "careers-2026";

/**
 * Uploads a resume buffer to private MinIO storage and generates a secure presigned download URL.
 */
export async function uploadResumeToMinio(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  jobSlug: string
): Promise<{ objectName: string; presignedUrl: string }> {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const timestamp = Date.now();
  const objectName = `${jobSlug}/${timestamp}-${sanitizedName}`;

  // Ensure bucket exists or putObject directly
  await minioClient.putObject(
    BUCKET_NAME,
    objectName,
    fileBuffer,
    fileBuffer.length,
    {
      "Content-Type": contentType || "application/octet-stream",
    }
  );

  // Generate 7-day presigned GET URL for internal HR review
  const presignedUrl = await minioClient.presignedGetObject(
    BUCKET_NAME,
    objectName,
    7 * 24 * 60 * 60 // 7 days in seconds
  );

  return { objectName, presignedUrl };
}
