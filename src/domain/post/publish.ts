import { isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { Result } from '../Output';
import { R } from '../R';
import { getPostForAccess } from './find';


export async function publishPost(ctx: Context, postId: bigint): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const post = await getPostForAccess(db, postId, access);

  if (!post) {
    return R.ofError(ErrorCode.NOT_FOUND, 'Post not found');
  }

  const isPublished = !!post.publishedAt;

  if (isPublished) {
    return R.of({ status: false });
  }

  const _response = await db.post.update({
    data: {
      publishedAt: new Date()
    },
    where: { id: postId }
  });

  return R.of({ status: true });
}


export async function unpublishPost(ctx: Context, postId: bigint): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const post = await getPostForAccess(db, postId, access);

  if (!post) {
    return R.ofError(ErrorCode.NOT_FOUND, 'Post not found');
  }

  const isPublished = !!post.publishedAt;

  if (isPublished) {
    return R.of({ status: false });
  }

  const versions = await db.postVersion.count({ where: { postId } });

  if (versions > 1) {

    const req1 = db.postVersion.deleteMany({
      where: {
        version: { lt: (versions - 1) }
      }
    });

    const req2 = db.postVersion.updateMany({
      data: { version: 0 },
      where: { postId }
    });

    await db.$transaction([req1, req2]);
  }

  await db.post.update({
    data: {
      publishedAt: null
    },
    where: { id: postId }
  });

  return R.of({ status: true });
}
