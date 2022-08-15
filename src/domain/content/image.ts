import path from 'path';

import cuid from 'cuid';

import { Either } from '../../util/Either';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { R } from '../R';
import { generateImageUrl } from '../../infra/upload';
import { makeClient, SignedUrl } from '../../infra/space';
import { ImageInput } from '../Input';
import { apply, concat, isImageExtension, maxLen, minLen, notEmpty } from '../../util/validator';
import { getLRUAssetStorage } from './assetStore';


const imageV = apply<ImageInput>({
  title: concat(
    notEmpty('Title should not be empty'),
    minLen(2, 'Title should be at least 2 characters'),
    maxLen(48, 'Title should not be more than 48 characters')),

  extension: isImageExtension('Invalid image extension provided')
});


export async function createImageUploadIntent(ctx: Context, input: ImageInput): DomainResult<SignedUrl> {

  const { db } = ctx;
  const publicationId = '1';
  const title = path.basename(input.title).trim();
  const extension = input.extension;

  const result = imageV({ title, extension: input.extension });

  if (Either.isLeft(result)) {
    return R.ofError(ErrorCode.INVALID_DATA, result.value.join('\n'));
  }

  const storage = await getLRUAssetStorage(ctx);

  if (!storage) {
    return R.ofError(ErrorCode.NO_ASSET_STORAGE, 'At least one asset storage is required');
  }

  // TODO: Allow 50 images per user per 24 hours.
  const fileName = `${publicationId}/${title}-${cuid()}.${extension}`;

  const _results = await db.asset.createNewImage({
    altText: '',
    caption: '',
    title,
    fileName,
    size: 0,
    sizeUnit: 'byte',
    sourceId: storage.id,
    contentType: 'image/',
    publicationId,
    createdAt: new Date(),
    updatedAt: new Date(),
    verified: false
  });

  // Currently, support only Digital Ocean spaces
  const client = makeClient(storage.region, storage.uploadUrl, storage.key, storage.secret);
  const uploadUrl: SignedUrl = await generateImageUrl(client, storage.bucket, fileName);

  client.destroy();

  return R.of(uploadUrl);
}
