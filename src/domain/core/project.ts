import { Context } from '../../context';

import { ErrorCode } from '../AppError';
import { R } from '../R';

import { Blog, NewBlog } from './type';


export function createNewBlog(ctx: Context, blog: NewBlog): DomainResult<Blog> {

  return ctx.db.project.create({
    data: {
      name: blog.name,
      fromEmail: blog.fromEmail,
      blog: {
        create: {
          publicUrl: blog.publicUrl
        }
      }
    },
    include: {
      blog: true
    }
  })
  .then(R.map((x) => ({
    id: x.id.toString(),
    name: x.name,
    publicUrl: x.blog!.publicUrl,
    fromEmail: x.fromEmail
  })))
  .catch(R.liftDbError('P2002', ErrorCode.UNIQUE_URL, 'Blog URL is already taken'));
}
