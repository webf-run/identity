import { S3Client } from '@aws-sdk/client-s3';

import { generateSignedUrl } from './space';


export function generateUrl(client: S3Client, bucket: string, fileName: string) {
  return generateSignedUrl(client, {
    bucket,
    fileName,
    contentType: 'image/',
    expiry: 5 * 60,
    isPublic: true,
    maxSize: 4 * 1024 * 1024
  });
}
