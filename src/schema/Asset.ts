import { extendType, inputObjectType, objectType } from 'nexus';

import { isAppError } from '../domain/AppError';
import { createAssetStorage } from '../domain/content/assetStore';
import { createImageUploadIntent } from '../domain/content/image';
import { R } from '../domain/R';
import { errorUnion, serializeId } from './helper';


export const AssetStoreInput = inputObjectType({
  name: 'AssetStoreInput',
  definition(t) {
    t.string('cloudType');
    t.string('region');
    t.string('bucket');
    t.string('publicUrl');
    t.string('uploadUrl')
    t.string('key');
    t.string('secret');
  }
});


export const AssetStore = objectType({
  name: 'AssetStore',
  definition(t) {
    t.id('id');
    t.string('cloudType');
    t.string('region');
    t.string('bucket');
    t.string('publicUrl');
    t.string('uploadUrl');
    t.string('key');
  }
});


export const ImageInput = inputObjectType({
  name: 'ImageInput',
  definition(t) {
    t.string('title');
    t.string('extension');
  }
});


export const UrlFormField = objectType({
  name: 'UrlFormField',
  description: 'Form fields to be submitted along with Signed URL',
  definition(t) {
    t.string('key');
    t.string('value');
  }
});


export const SignedUrl = objectType({
  name: 'SignedUrl',
  definition(t) {
    t.string('url');
    t.list.field('fields', { type: 'UrlFormField' });
  }
});


export const AssetStoreResponse = errorUnion('AssetStoreResponse', 'AssetStore');
export const SignedUrlResponse = errorUnion('SignedUrlResponse', 'SignedUrl');


export const AssetMutation = extendType({
  type: 'Mutation',

  definition(t) {

    t.field('createAssetStore', {
      type: 'AssetStoreResponse',
      args: {
        store: 'AssetStoreInput'
      },
      resolve(_root, args, ctx) {
        return R.unpack(R.map(serializeId, createAssetStorage(ctx, args.store)));
      }
    });

    t.field('uploadImage', {
      type: 'SignedUrlResponse',
      args: {
        image: 'ImageInput'
      },
      async resolve(_root, args, ctx) {
        const result = await R.unpack(createImageUploadIntent(ctx, args.image));

        if (!isAppError(result)) {
          const fields = result.fields.map(([key, value]) => ({ key, value}));

          return { url: result.url, fields };
        }

        return result;
      }
    });
  }
});
