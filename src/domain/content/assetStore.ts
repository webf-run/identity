import { Either } from '../../util/Either';
import { apply, inSet, notEmpty } from '../../util/validator';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { AssetStoreInput } from '../Input';
import { R } from '../R';
import { AssetStorage } from '../Output';


const assetSTorageV = apply({
  cloudType: inSet(['do'], 'Only Digital Ocean is supported'),
  region: notEmpty('Region is required'),
  bucket: notEmpty('Bucket is required'),
  publicUrl: notEmpty('Public Url is required'),
  uploadUrl: notEmpty('Upload Url is required'),
  key: notEmpty('Key is required'),
  secret: notEmpty('Secret is required')
});


export async function createAssetStorage(ctx: Context, source: AssetStoreInput): DomainResult<AssetStorage> {

  const { db } = ctx;

  const result = assetSTorageV(source);

  if (Either.isLeft(result)) {
    return R.ofError(ErrorCode.INVALID_DATA, result.value.join('\n'));
  }

  const value = result.value;

  const newAssetSource = await db.assetStorage.create({
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


export async function getLRUAssetStorage(ctx: Context): Promise<AssetStorage | null> {

  const { db } = ctx;

  const results = await db.assetStorage.findMany({
    include: {
      _count: {
        select: {
          assets: true
        }
      }
    }
  });

  const record = results.length === 0
    ? null
    : results.reduce((current, next) =>
        (current._count?.assets || 0) >= (next._count?.assets || 0) ? current : next)

  return record;
}
