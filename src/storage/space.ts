import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { Conditions } from '@aws-sdk/s3-presigned-post/dist/types/types';


export function makeClient(region: string, endpoint: string, key: string, secret: string) {

  const client = new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId: key,
      secretAccessKey: secret
    }
  });

  return client;
}


export interface UrlOption {
  bucket: string;
  fileName: string;
  maxSize: number;

  // The pattern to match against start-with
  contentType?: string;

  // If false, it is private otherwise it is public-read
  isPublic?: boolean;

  // Link expiry seconds, otherwise 5 minutes
  expiry?: number;
}

export interface SignedUrl {
  url: string;
  fields: [string, string][];
}


export async function generateSignedUrl(client: S3Client, opts: UrlOption): Promise<SignedUrl> {

  const { expiry, isPublic, contentType, bucket, fileName, maxSize } = opts;

  const conditions: Conditions[] = [
    ['content-length-range', 1, maxSize]
  ];


  if (isPublic) {
    conditions.push(['eq', '$acl', 'public-read']);
  }

  if (contentType) {
    conditions.push(['starts-with', '$Content-Type', contentType]);
  }

  const expiresInSeconds = expiry || 5 * 60;

  // https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
  const url = await createPresignedPost(client, {
    Bucket: bucket,
    Key: fileName,
    Conditions: conditions,
    Expires: expiresInSeconds
  });

  const fields = Object.entries(url.fields);

  if (isPublic) {
    fields.push(['acl', 'public-read']);
  }

  return { url: url.url, fields };
}
