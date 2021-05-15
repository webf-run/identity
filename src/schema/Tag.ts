import { extendType, inputObjectType, list, nullable, objectType } from 'nexus';

import { createTag } from '../domain/content/tag';
import { R } from '../domain/R';
import { errorUnion } from './helper';


export const TagObj = objectType({
  name: 'Tag',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('slug');
    t.string('description');
    t.boolean('approved');
  }
});


export const TagInput = inputObjectType({
  name: 'TagInput',
  definition(t) {
    t.string('name');
    t.nullable.string('slug');
    t.nullable.string('description');
  }
});


export const TagResponse = errorUnion('TagResponse', 'Tag');


export const TagQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getTags', {
      type: list(TagObj),
      args: {
        search: nullable('String'),
        top: 'Int',
        skip: 'Int',
        approved: 'Boolean'
      },
      resolve(_root, _args, ctx) {
        throw 'err';
      }
    });
  }
});

export const TagMutation = extendType({
  type: 'Mutation',
  definition(t) {

    t.field('createTag', {
      type: 'TagResponse',
      args: { tag: TagInput },
      resolve(_root, args, ctx) {
        const tag = createTag(ctx, args.tag);
        const mapped = R.map((y) => ({ ...y, id: y.id.toString() }), tag);

        return R.unpack(mapped);
      }
    });

    t.field('updateTag', {
      type: TagObj,
      args: { tag: TagInput },
      resolve() {
        throw 'err';
      }
    });

    t.field('approveTag', {
      type: TagObj,
      args: { tagId: 'ID', approved: 'Boolean' },
      resolve() {
        throw 'err';
      }
    });
  }
});
