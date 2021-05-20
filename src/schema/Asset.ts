import { inputObjectType, objectType } from 'nexus';


export const ImageInput = inputObjectType({
  name: 'ImageInput',
  definition(t) {
    t.string('title');
    t.string('extension');
  }
});
