import { Prisma } from '@prisma/client';

import { Context } from '../../context';
import { ErrorCode } from '../AppError';
import { R } from '../R';
import { hashPassword } from './auth';
import { Blog, NewBlog } from './type';


export async function createNewBlog(ctx: Context, blog: NewBlog): DomainResult<Blog> {

  let request: Prisma.ProjectCreateInput;

  const user = blog.firstUser;

  request = {
    name: blog.name,
    fromEmail: blog.fromEmail,
    blog: {
      create: {
        publicUrl: blog.publicUrl
      }
    }
  };

  if (user) {
    const [password, hashAlgo] = await (user && hashPassword(user.password));

    request.users = {
      create: {
        ...user,
        password,
        passwordHash: hashAlgo
      }
    }
  }

  return ctx.db.project.create({
    data: request,
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
  .catch((x) => { console.log(x); throw x; })
  .catch(R.liftDbError('P2002', ErrorCode.UNIQUE_URL, 'Blog URL is already taken'));
}
