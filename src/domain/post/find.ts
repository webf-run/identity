import { IGetPostByOwnerResult } from '../../db/post';
import { isAuthor, isEditor, isOwner, UserAccess } from '../Access';
import { DbContext } from '../DbContext';
import { Post } from '../Output';


export function getPostForAccess(db: DbContext, postId: bigint, access: UserAccess): Promise<Post | null> {

  const postRq = (isEditor(access) || isOwner(access)) && access.scopeId
    ? findPostByPublication(db, postId, access.scopeId)
    : isAuthor(access)
      ? findPostByOwner(db, postId, access.user.id)
      : Promise.resolve(null);

  return postRq;
}

export async function findPostByOwner(db: DbContext, postId: bigint, ownerId: string) {

  const results = await db.post.getPostByOwner({
    ownerId,
    postId: postId.toString()
  });

  return mapToPost(results[0]);
}


export async function findPostByPublication(db: DbContext, postId: bigint, publicationId: bigint) {
  const results = await db.post.getPostByPublication({
    publicationId: publicationId.toString(),
    postId: postId.toString()
  });

  return mapToPost(results[0]);
}


function mapToPost(result?: IGetPostByOwnerResult): Post | null {
  if (result) {
    const postId = BigInt(result.id);;

    return {
      id: postId,
      canonicalUrl: null,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      ownerId: result.ownerId,
      publicationId: BigInt(result.publicationId),
      publishedAt: result.publishedAt,
      slug: result.slug,
      meta: {
        id: postId,
        description: '',
        imageId: null,
        title: result.title
      },
      tags: []
    };
  }

  return null;
}
