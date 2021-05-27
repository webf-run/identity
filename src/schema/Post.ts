import { extendType, inputObjectType, objectType } from 'nexus';
import { errorUnion } from './helper';


export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('slug');
    t.json('content');
    t.field('meta', {
      type: 'PostMeta'
    });
  }
});


export const PostMeta = objectType({
  name: 'PostMeta',
  definition(t) {
    t.id('postId');
    t.string('title');
    t.string('description');
  }
});


export const PostMetaInput = inputObjectType({
  name: 'PostMetaInput',
  definition(t) {
    t.string('title');
    t.string('description');
  }
});

export const PostInput = inputObjectType({
  name: 'PostInput',
  definition(t) {
    t.string('title');
    t.string('slug');
    t.json('content');

    t.list.id('tags', {
      description: 'Id of the tags that you want to associate' });

    t.field('meta', { type: 'PostMetaInput' });
  }
});


export const PostResponse = errorUnion('PostResponse', 'Post');


export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPost', {
      type: 'PostResponse',
      args: { post: 'PostInput' },
      resolve(_root, _args, _ctx) {
        throw 'not implemented';
      }
    });

    t.field('updatePost', {
      type: 'PostResponse',
      args: { postId: 'ID', post: 'PostInput' },
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
