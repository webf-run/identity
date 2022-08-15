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

  await db.post.setPublishDate({
    postId: postId.toString(),
    publishedAt: new Date()
  });

  return R.of({ status: true });
}


export async function unpublishPost(ctx: Context, postId: bigint): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  return db.transaction(async (db) => {
    const post = await getPostForAccess(db, postId, access);

    if (!post) {
      return R.ofError(ErrorCode.NOT_FOUND, 'Post not found');
    }

    const isPublished = !!post.publishedAt;

    if (!isPublished) {
      return R.of({ status: false });
    }

    await db.post.unsetPublishDate({
      postId: postId.toString(),
      updatedAt: new Date()
    });

    await db.post.deleteStalePostVersions({
      postId: postId.toString()
    });

    return R.of({ status: true });
  });

}
