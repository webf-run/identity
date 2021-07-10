import { arg, extendType, idArg, inputObjectType, list, nullable, objectType } from 'nexus';
import { createNewPost } from '../domain/content/post';
import { R } from '../domain/R';

import { errorUnion } from './helper';


const tagListArgs = list(idArg({ description: 'Ids of the tags that you want to associate' }));


export const PostMeta = objectType({
  name: 'PostMeta',
  definition(t) {
    // t.id('postId', { resolve: (x) => x.id.toString() });
    t.string('title');
    t.string('description');
  }
});


export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.id('id', { resolve: (x) => x.id.toString() });
    // t.string('title');
    // t.string('slug');
    // t.json('content');
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


export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPost', {
      type: 'PostResponse',
      args: {
        post: 'PostInput'
      },
      resolve(_root, args, ctx) {
        // const tags = args.tags.map(BigInt);

        return R.unpack(createNewPost(ctx, args.post));
      }
    });

    t.field('updatePost', {
      type: 'PostResponse',
      args: {
        postId: 'ID',
        post: 'PostInput',
        tags: tagListArgs
      },
      resolve(_root, _args, _ctx) {
        throw 'not implemented';
      }
    });

    t.field('updatePostSettings', {
      type: 'PostResponse',
      args: {
        postId: 'ID',
        tags: tagListArgs
      },
      resolve(_root, _args, _ctx) {
        throw 'not implemented';
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
