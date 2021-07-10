import { generateSlug } from '../../data/code';

import { isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PostInput, PostSettingsInput } from '../Input';
import { Post } from '../Output';
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


// export function updatePostSettings(ctx: Context, postId: bigint, settings: PostSettingsInput) {

//   const { db, access } = ctx;

//   if (!isUser(access)) {
//     return R.ofError(ErrorCode.FORBIDDEN, '');
//   }

//   db.post.findFirst({
//     where: {
//       id: postId,
//       ownerId: access.user.id
//     },
//     include: {
//       postMeta: true
//     }
//   })

// }
