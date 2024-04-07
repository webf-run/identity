import { GraphQLSchema } from 'graphql';

import { builder } from './builder.js';

// Side effect imports
import './identity.js';

export const idSchema: GraphQLSchema = builder.toSchema();
