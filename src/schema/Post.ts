import { extendType, inputObjectType, objectType } from 'nexus';

import { ErrorCode, makeAppError } from '../domain/AppError';
import { createNewPost } from '../domain/post/new';
import { publishPost, unpublishPost } from '../domain/post/publish';
import { updatePost, updatePostSettings } from '../domain/post/update';
import { R } from '../domain/R';
import { tryBigInt } from '../util/unit';
import { errorUnion } from './helper';


export const PostMeta = objectType({
  name: 'PostMeta',
  definition(t) {
    t.string('title');
    t.string('description');
  }
});


export const UpdatePostPayload = objectType({
  name: 'UpdatePostPayload',
  definition(t) {
    t.id('id');
    t.string('slug');
    t.string('title');
    t.json('content');
    t.field('meta', { type: 'PostMeta' });
  }
});


export const Post = objectType({
  name: 'Post',
  definition(t) {
    UpdatePostPayload.value.definition(t as any);
    t.list.field('tags', { type: 'Tag' });
  }
});


export const PostSettings = objectType({
  name: 'PostSettings',
  definition(t) {
    t.nullable.string('canonicalUrl');
    t.field('meta', { type: 'PostMeta' });
    t.string('slug');
    t.list.field('tags', { type: 'Tag' });
  }
});


export const PostMetaInput = inputObjectType({
  name: 'PostMetaInput',
  definition(t) {
    t.string('title');
    t.string('description');
  }
});


export const PostSettingsInput = inputObjectType({
  name: 'PostSettingsInput',
  definition(t) {
    t.nullable.string('slug');
    t.nullable.list.id('tags');
    t.nullable.field('meta', { type: 'PostMetaInput' });
    t.nullable.string('canonicalUrl');
  }
});


export const PostInput = inputObjectType({
  name: 'PostInput',
  definition(t) {
    t.string('title');
    t.json('content');
  }
});


export const PostResponse = errorUnion('PostResponse', 'Post');
export const UpdatePostPayloadResponse = errorUnion('UpdatePostPayloadResponse', 'UpdatePostPayload');
export const PostSettingsResponse = errorUnion('PostSettingsResponse', 'PostSettings');


export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPost', {
      type: 'UpdatePostPayloadResponse',
      args: {
        post: 'PostInput'
      },
      async resolve(_root, args, ctx) {
        const result = createNewPost(ctx, args.post);
        const mapped = R.map((value) => ({
          ...value,
          id: value.id.toString(),
          // TODO: Need actual data
          content: {},
          title: ''
        }), result);

        return R.unpack(mapped);
      }
    });

    t.field('updatePost', {
      type: 'UpdatePostPayloadResponse',
      args: {
        postId: 'ID',
        post: 'PostInput'
      },
      resolve(_root, args, ctx) {
        const postId = tryBigInt(args.postId);

        if (!postId) {
          return makeAppError(ErrorCode.NOT_FOUND, 'Post not found');
        }

        const response = updatePost(ctx, postId, args.post);

        const mapped = R.map((value) => ({
          ...value,
          id: value.id.toString()
        }), response);

        return R.unpack(mapped);
      }
    });

    t.field('publishPost', {
      type: 'ResultResponse',
      args: {
        postId: 'ID',
      },
      resolve(_root, args, ctx) {
        const postId = tryBigInt(args.postId);

        if (!postId) {
          return makeAppError(ErrorCode.NOT_FOUND, 'Post not found');
        }

        return R.unpack(publishPost(ctx, postId));
      }
    });

    t.field('unpublishPost', {
      type: 'ResultResponse',
      args: {
        postId: 'ID',
      },
      resolve(_root, args, ctx) {
        const postId = tryBigInt(args.postId);

        if (!postId) {
          return makeAppError(ErrorCode.NOT_FOUND, 'Post not found');
        }

        return R.unpack(unpublishPost(ctx, postId));
      }
    });

    t.field('updatePostSettings', {
      type: 'PostSettingsResponse',
      args: {
        postId: 'ID',
        settings: 'PostSettingsInput'
      },
      resolve(_root, args, ctx) {
        const postId = tryBigInt(args.postId);
        const tags = args.settings.tags || [];

        if (!postId) {
          return makeAppError(ErrorCode.NOT_FOUND, 'Post not found');
        }

        if (!sanitizeTags(tags)) {
          return makeAppError(ErrorCode.INVALID_DATA, 'Invalid tags');
        }

        return R.unpack(updatePostSettings(ctx, postId, {
          ...args.settings,
          tags
        }));
      }
    });

    t.field('deletePost', {
      type: 'PostResponse',
      args: { postId: 'ID' },
      resolve(_root, _args, _ctx) {
        throw 'not implemented';
      }
    });
  }
});


function sanitizeTags(tags: (string | null)[]): tags is string[] {
  return tags.every((x) => !!x);
}
