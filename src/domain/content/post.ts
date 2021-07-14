import { Prisma } from '@prisma/client';

import { generateSlug } from '../../data/code';
import { findPostByOwner, findPostByPublication } from '../../data/post';

import { isAuthor, isEditor, isOwner, isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PostInput, PostSettingsInput } from '../Input';
import { Post, PostSettings } from '../Output';
import { R } from '../R';


export async function createNewPost(ctx: Context, post: PostInput): DomainResult<Post> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const user = access.user;
  const publicationId = user.projectId;

  // TODO: Validation

  const slug = generateSlug(post.title);

  // TODO: Attempt to derive the description from the content.

  const meta = {
    title: post.title,
    description: ''
  };

  const response = await db.post.create({
    data: {
      slug,
      ownerId: user.id,
      publicationId,
      versions: {
        create: {
          title: post.title,
          content: post.content,
          version: 0
        }
      },
      postMeta: {
        create: meta
      }
    }
  });

  const newPost: Post = {
    ...response,
    meta,
    tags: [],
    title: post.title,
    content: post.content
  };

  return R.of(newPost);
}


export async function updatePostSettings(ctx: Context, postId: bigint, settings: PostSettingsInput): DomainResult<PostSettings> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const postRq = isEditor(access) || isOwner(access)
    ? findPostByPublication(db, postId, access.user.projectId)
    : isAuthor(access)
      ? findPostByOwner(db, postId, access.user.id)
      : Promise.resolve(null);

  const post = await postRq;

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
