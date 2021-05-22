import path from 'path';

import { AssetSource } from '@prisma/client';
import cuid from 'cuid';

import { Context } from '../../context';
import { Either } from '../../util/Either';
import { ErrorCode } from '../AppError';
import { R } from '../R';
import { apply, concat, inSet, isImageExtension, maxLen, minLen, notEmpty } from '../validator';
import { AssetSourceInput, ImageInput } from './type';


const assetSourceV = apply({
  cloudType: inSet(['do'], 'Only Digital Ocean is supported'),
  region: notEmpty('Region is required'),
  bucket: notEmpty('Bucket is required'),
  publicUrl: notEmpty('Public Url is required'),
  uploadUrl: notEmpty('Upload Url is required'),
  key: notEmpty('Key is required'),
  secret: notEmpty('Secret is required')
});


const imageV = apply<ImageInput>({
  title: concat(
    notEmpty('Title should not be empty'),
    minLen(2, 'Title should be at least 2 characters'),
    maxLen(48, 'Title should not be more than 48 characters')),

  extension: isImageExtension('Invalid image extension provided')
});


export async function createAssetSource(ctx: Context, source: AssetSourceInput): DomainResult<AssetSource> {

  const { db } = ctx;

  const result = assetSourceV(source);

  if (Either.isLeft(result)) {
    return R.ofError(ErrorCode.INVALID_DATA, result.value.join('\n'));
  }

  const value = result.value;

  const newAssetSource = await db.assetSource.create({
    data: {
      cloudType: value.cloudType,
      region: value.region.trim(),
      bucket: value.bucket.trim(),
      publicUrl: value.publicUrl.trim(),
      uploadUrl: value.uploadUrl.trim(),
      key: value.key.trim(),
      secret: value.secret.trim()
    }
  });


  return R.of(newAssetSource);
}


export async function makeImageUploadIntent(ctx: Context, image: ImageInput) {

  const { db } = ctx;
  const title = path.basename(image.title);

  const result = imageV({ title, extension: image.extension });

  if (Either.isLeft(result)) {
    return R.ofError(ErrorCode.INVALID_DATA, result.value.join('\n'));
  }

  // const fileName = cuid();

  // TODO: Pending work.
  
}
