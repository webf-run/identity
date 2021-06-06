import { extendType, inputObjectType, objectType } from 'nexus';

import { isAppError } from '../domain/AppError';
import { createAssetSource } from '../domain/content/assetSource';
import { createImageUploadIntent } from '../domain/content/image';
import { R } from '../domain/R';
import { errorUnion, serializeId } from './helper';


export const AssetSourceInput = inputObjectType({
  name: 'AssetSourceInput',
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


export const AssetSource = objectType({
  name: 'AssetSource',
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


export const AssetSourceResponse = errorUnion('AssetSourceResponse', 'AssetSource');
export const SignedUrlResponse = errorUnion('SignedUrlResponse', 'SignedUrl');


export const AssetMutation = extendType({
  type: 'Mutation',

  definition(t) {

    t.field('createAssetSource', {
      type: 'AssetSourceResponse',
      args: {
        source: 'AssetSourceInput'
      },
      resolve(_root, args, ctx) {
        return R.unpack(R.map(serializeId, createAssetSource(ctx, args.source)));
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
