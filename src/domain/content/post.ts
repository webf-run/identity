import { isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PostInput } from '../Input';
import { Post } from '../Output';
import { R } from '../R';


export async function createNewPost(ctx: Context, post: PostInput, tags: bigint[]): DomainResult<Post> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const user = access.user;
  const scope = access.scope;

  if (!scope) {
    return R.ofError(ErrorCode.INVALID_SCOPE, 'Scope is required to create a post');
  }

  const newPost = await db.post.create({
    data: {
      slug: 'abc',
      content: post.content,
      title: post.title,
      ownerId: user.id,
      publicationId: scope.id,
      tags: {
        createMany: {
          data: tags.map((tagId, order) => ({ tagId, order })),
          skipDuplicates: true
        }
      }
    },
    include: {
      tags: true,
      postMeta: true
    }
  });

  return R.of(newPost);
}
