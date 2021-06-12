import { objectType } from 'nexus';

import { errorUnion } from './helper';


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


export const Status = objectType({
  name: 'Status',
  definition(t) {
    t.boolean('status');
  }
});


export const StatusResponse = errorUnion('StatusResponse', 'Status');
