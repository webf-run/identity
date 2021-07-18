import { Prisma } from '@prisma/client';

import { isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PostInput, PostSettingsInput } from '../Input';
import { Post, PostSettings } from '../Output';
import { R } from '../R';
import { getPostForAccess } from './find';


export async function updatePostSettings(ctx: Context, postId: bigint, settings: PostSettingsInput): DomainResult<PostSettings> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const post = await getPostForAccess(db, postId, access);

  if (!post?.postMeta) {
    return R.ofError(ErrorCode.NOT_FOUND, 'Post not found');
  }

  const { tags } = post;

  const request: Prisma.PostUpdateInput = {};

  if (settings.slug) {
    request.slug = settings.slug;
  }

  if (typeof settings.canonicalUrl === 'string') {
    // If canonical URL is blank, then set to null
    request.canonicalUrl = settings.canonicalUrl.trim() || null;
  }

  if (settings.meta) {
    request.postMeta = {
      update: {
        title: settings.meta.title,
        description: settings.meta.description
      }
    };
  }

  if (settings.tags) {

    const tagsToDelete = tags.filter((x) => !settings.tags?.find((y) => x.tagId === y));

    request.tags = {
      deleteMany: {
        postId,
        tagId: {
          in: tagsToDelete.map((x) => x.tagId)
        }
      },
      upsert: settings.tags.map((tagId, order) => ({
        update: { tagId, order },
        create: { tagId, order },
        where: {
          postId_tagId: {
            postId,
            tagId
          }
        }
      }))
    };
  }

  const response = await db.post.update({
    data: request,
    where: {
      id: postId
    },
    include: {
      postMeta: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  return R.of({
    slug: response.slug,
    canonicalUrl: response.canonicalUrl,
    meta: response.postMeta!,
    tags: response.tags.map((x) => x.tag)
  });

}


export async function updatePost(ctx: Context, postId: bigint, postInput: PostInput): DomainResult<Post> {

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

  const response = await db.post.update({
    data: {
      versions: {
        connectOrCreate: {
          create: {
            title: postInput.title,
            content: postInput.content,
            version
          },
          where: {
            postId_version: { postId, version }
          }
        }
      }
    },
    where: {
      id: postId
    }
  });

  const updatedPost: Post = {
    ...response,
    title: postInput.title,
    content: postInput.content,
    meta: {
      title: '',
      description: ''
    },
    tags: []
  };

  return R.of(updatedPost);
}
