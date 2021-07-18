import { PrismaClient } from '@prisma/client';

import { findPostByPublication, findPostByOwner } from '../../data/post';
import { isAuthor, isEditor, isOwner, UserAccess } from '../Access';


export function getPostForAccess(db: PrismaClient, postId: bigint, access: UserAccess) {

  const postRq = isEditor(access) || isOwner(access)
    ? findPostByPublication(db, postId, access.user.projectId)
    : isAuthor(access)
      ? findPostByOwner(db, postId, access.user.id)
      : Promise.resolve(null);

  return postRq;
}
