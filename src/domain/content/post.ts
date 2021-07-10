import { isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PostInput } from '../Input';
import { Post } from '../Output';
import { R } from '../R';


export async function createNewPost(ctx: Context, post: PostInput): DomainResult<Post> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const user = access.user;
  const publicationId = user.projectId;


  throw 'err';
}
