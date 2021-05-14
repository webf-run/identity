import { Prisma } from '@prisma/client';
import argon2 from 'argon2';

import { Context } from '../../context';

import { ErrorCode } from '../AppError';
import { R } from '../R';

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
    const password = await (user && argon2.hash(user.password, { type: argon2.argon2id }));

    request.users = {
      create: {
        ...user,
        password,
        passwordHash: 'argon2id'
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
