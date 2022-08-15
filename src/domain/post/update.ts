import { v4 } from 'uuid';

import { isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PostInput, PostSettingsInput } from '../Input';
import { PostSettings, PostWithContent } from '../Output';
import { R } from '../R';
import { getPostForAccess } from './find';


export async function updatePostSettings(
  ctx: Context,
  postId: bigint,
  settings: PostSettingsInput): DomainResult<PostSettings> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  return await db.transaction(async (db) => {
    const post = await getPostForAccess(db, postId, access);
    const postIdStr = postId.toString();

    if (!post) {
      return R.ofError(ErrorCode.NOT_FOUND, 'Post not found');
    }

    const { tags } = post;

    const toUpdate = { ...post };

    if (settings.slug) {
      toUpdate.slug = settings.slug;
    }

    if (typeof settings.canonicalUrl === 'string') {
      // If canonical URL is blank, then set to null
      toUpdate.canonicalUrl = settings.canonicalUrl.trim() || null;
    }

    await db.post.updatePost({
      postId: postIdStr,
      slug: toUpdate.slug,
      canonicalUrl: toUpdate.canonicalUrl,
      updatedAt: new Date()
    });

    if (settings.meta) {
      await db.post.updatePostMetadata({
        postId: postIdStr,
        title: settings.meta.title,
        description: settings.meta.description
      });
    }

    if (settings.tags) {

      const tagsToDelete = tags.filter((x) => !settings.tags!.find((y) => x.tagId === y));

      if (tagsToDelete.length > 0) {
        await db.post.detachTags({
          postId: postIdStr,
          tags: tagsToDelete.map((x) => x.tagId)
        });
      }

      if (settings.tags.length > 0) {
        await db.post.attachTags({
          tags: settings.tags.map((tagId, order) => ({
            postId: postIdStr,
            tagId,
            order
          }))
        });
      }
    }

    const result: PostSettings = {
      canonicalUrl: toUpdate.canonicalUrl,
      meta: toUpdate.meta,
      slug: toUpdate.slug,
      tags: []
    };

    return R.of(result);
  });
}


export async function updatePost(
  ctx: Context, postId: bigint, postInput: PostInput): DomainResult<PostWithContent> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const post = await getPostForAccess(db, postId, access);

  if (!post) {
    return R.ofError(ErrorCode.NOT_FOUND, 'Post not found');
  }

  // TODO: Image extraction
  const version = post.publishedAt ? 1 : 0;

  const results = await db.post.createOrUpdatePostContent({
    id: v4(),
    title: postInput.title,
    content: postInput.content as any,
    version,
    postId: postId.toString()
  });

  const result = results.at(0);

  if (result) {
    const updatedPost: PostWithContent = {
      ...post,
      title: postInput.title,
      content: postInput.content
    };

    return R.of(updatedPost);
  }

  return R.ofError(ErrorCode.INTERNAL_ERROR, '');
}
