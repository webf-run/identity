
import { generateSlug } from '../../data/code';

import { isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PostInput } from '../Input';
import { Post, Result } from '../Output';
import { R } from '../R';
import { getPostForAccess } from './find';


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
