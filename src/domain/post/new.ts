
import { v4 } from 'uuid';
import { generateSlug } from '../../data/code';

import { isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PostInput } from '../Input';
import { Post } from '../Output';
import { R } from '../R';


export async function createNewPost(ctx: Context, post: PostInput): DomainResult<Post> {

  const { db, access } = ctx;

  if (!isUser(access) || !access.scopeId) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const user = access.user;
  const publicationId = access.scopeId;

  // TODO: Validation

  const slug = generateSlug(post.title);

  // TODO: Attempt to derive the description from the content.

  const meta = {
    title: post.title,
    description: ''
  };

  const createdAt = new Date();

  const results = await db.post.createPost({
    title: post.title,
    description: '',
    slug,
    canonicalUrl: null,
    ownerId: user.id,
    publicationId: publicationId.toString(),
    createdAt,
    updatedAt: createdAt,
    content: post.content as any,
    version: 0,
    versionId: v4()
  });

  const response = results[0];

  const newPost: Post = {
    id: BigInt(response.id),
    ownerId: user.id,
    publicationId,
    canonicalUrl: null,
    createdAt,
    updatedAt: createdAt,
    publishedAt: null,
    slug,
    meta: {
      id: BigInt(response.id),
      description: '',
      imageId: null,
      title: response.title
    },
    tags: []
  };

  return R.of(newPost);
}
