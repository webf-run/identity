import { Context } from '../../context';

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
  .catch((_err) => R.ofOne('', ''));
}
