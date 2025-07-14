import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto", // Required for R2
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2({
  fileBuffer,
  fileName,
  contentType,
}: {
  fileBuffer: Buffer;
  fileName: string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read",
  });

  await r2Client.send(command);

  const publicUrl = process.env.R2_PUBLIC_URL!;
  return `${publicUrl}/${fileName}`;
}

/**
 * Updates the ACL of an existing object in R2 to 'public-read' without re-uploading.
 * It does this by "copying" the object onto itself with the new ACL.
 * @param key The object key (e.g., 'creators/user-slug/video.mp4')
 */
export async function makeObjectPublic(key: string) {
    const command = new CopyObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        CopySource: `${process.env.R2_BUCKET!}/${key}`, // Source object to copy
        Key: key, // Destination key (the same object)
        ACL: 'public-read', // The new ACL to apply
        MetadataDirective: 'COPY', // We are not changing metadata, just copying
    });

    await r2Client.send(command);
} 