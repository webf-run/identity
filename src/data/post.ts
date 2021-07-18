import { PrismaClient } from '@prisma/client';


export function findPostByOwner(db: PrismaClient, postId: bigint, ownerId: bigint) {
  return db.post.findFirst({
    where: {
      id: postId,
      ownerId
    },
    include: {
      postMeta: true,
      tags: true
    }
  });
}


export function findPostByPublication(db: PrismaClient, postId: bigint, publicationId: bigint) {
  return db.post.findFirst({
    where: {
      id: postId,
      publicationId
    },
    include: {
      postMeta: true,
      tags: true
    }
  });
}
