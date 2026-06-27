import { randomUUID } from 'crypto';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config/env';
import { s3Client } from '../config/s3';

const URL_EXPIRES_IN = 60 * 5; // 5 minutes

/**
 * Build a unique object key, optionally inside a folder.
 */
const buildKey = (fileName: string, folder?: string): string => {
  const safeName = fileName.replace(/\s+/g, '-');
  const unique = `${Date.now()}-${randomUUID()}-${safeName}`;
  return folder ? `${folder.replace(/\/$/, '')}/${unique}` : unique;
};

/**
 * Generate a presigned URL the client can use to PUT a file directly to S3.
 */
export const createUploadUrl = async (
  fileName: string,
  contentType: string,
  folder?: string,
): Promise<{ key: string; uploadUrl: string; expiresIn: number }> => {
  const key = buildKey(fileName, folder);

  const command = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: URL_EXPIRES_IN });

  return { key, uploadUrl, expiresIn: URL_EXPIRES_IN };
};

/**
 * Generate a presigned URL to download/view a private object.
 */
export const createDownloadUrl = async (
  key: string,
): Promise<{ key: string; downloadUrl: string; expiresIn: number }> => {
  const command = new GetObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
  });

  const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: URL_EXPIRES_IN });

  return { key, downloadUrl, expiresIn: URL_EXPIRES_IN };
};

/**
 * Delete an object from the bucket.
 */
export const deleteObject = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
  });

  await s3Client.send(command);
};
