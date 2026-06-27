import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import * as s3Service from '../services/s3.service';

/**
 * POST /uploads/presign
 * body: { fileName, contentType, folder? }
 */
export const getUploadUrl = asyncHandler(async (req: Request, res: Response) => {
  const { fileName, contentType, folder } = req.body as {
    fileName?: string;
    contentType?: string;
    folder?: string;
  };

  if (!fileName || !contentType) {
    throw new ApiError(400, 'fileName and contentType are required');
  }

  const data = await s3Service.createUploadUrl(fileName, contentType, folder);

  res.status(201).json({ success: true, data });
});

/**
 * GET /uploads/presign?key=...
 */
export const getDownloadUrl = asyncHandler(async (req: Request, res: Response) => {
  const key = req.query.key as string | undefined;

  if (!key) {
    throw new ApiError(400, 'key is required');
  }

  const data = await s3Service.createDownloadUrl(key);

  res.status(200).json({ success: true, data });
});

/**
 * DELETE /uploads?key=...
 */
export const deleteUpload = asyncHandler(async (req: Request, res: Response) => {
  const key = req.query.key as string | undefined;

  if (!key) {
    throw new ApiError(400, 'key is required');
  }

  await s3Service.deleteObject(key);

  res.status(200).json({ success: true, message: 'File deleted', data: { key } });
});
