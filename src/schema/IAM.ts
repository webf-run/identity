import { extendType, inputObjectType, nonNull, objectType } from 'nexus';

export const UserInput = inputObjectType({
  name: 'UserInput',
  description: 'New User Input',
  definition(t) {
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('password');
  }
});

export const BlogInput = inputObjectType({
  name: 'NewBlogInput',
  definition(t) {
    t.string('name');
    t.string('publicUrl');
    t.string('fromEmail');
    t.field('firstUser', { type: UserInput });
  }
});

export const Blog = objectType({
  name: 'Blog',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('fromEmail');
    t.string('publicUrl');
  }
});


export const IAMQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('getBlogs', {
      type: 'Blog',
      resolve(_root, _args, ctx) {
        return ctx.db.blog.findMany({
          include: {
            project: {}
          }
        }).then((x) =>
          x.map((y) => ({
            id: y.project.id.toString(),
            name: y.project.name,
            fromEmail: y.project.fromEmail,
            publicUrl: y.publicUrl
          })));
      }
    })
  }
});

export const IAMMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createBlog', {
      type: 'Blog',
      args: {
        input: BlogInput
      },
      resolve(_root, args, ctx) {
        const input = args.input;

        // ctx.db.blog.create({
        //   data: {

        //   }
        // })

        ctx.db.project.create({
          data: {
            name: input.name,
            fromEmail: input.fromEmail,
            blog: {
              create: {
                publicUrl: input.publicUrl
              }
            }
          }
        })
        .then((x) => console.log('done', x))
        .catch((err) => console.log(err));

        return { id: '1', name: '1234', fromEmail: '', publicUrl: ''  };
      }
    });
  }
});
