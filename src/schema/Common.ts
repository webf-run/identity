import { objectType } from 'nexus';


export const Error = objectType({
  name: 'Error',
  definition(t) {
    t.string('code');
    t.string('message');
  }
});


export const AppError = objectType({
  name: 'AppError',
  definition(t) {
    t.list.field('errors', { type: Error })
  }
});
