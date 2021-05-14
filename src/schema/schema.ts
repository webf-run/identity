import { join } from 'path';

import { makeSchema } from 'nexus';

import * as types from './types';

// TODO: Improve this later.
// We must expose the directory value as a CLI argument.
// First problem: ES modules doesn't allow to use __dirname.
// Second problem: Webpack bundling messes up __dirname.
// There is no reliable way to use __dirname and hence
// it should be exposed as CLI argument.
const currentDir = process.cwd();

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(currentDir, 'src', 'NexusTypegen.ts'),
    schema: join(currentDir, 'schema.graphql')
  },
  contextType: {
    module: join(currentDir, 'src', 'context.ts'),
    export: 'Context'
  },
  nonNullDefaults: {
    input: true,
    output: true
  },
  sourceTypes: {
    modules: [],
    mapping: {
      DateTime: 'Date',
    }
  }
});
