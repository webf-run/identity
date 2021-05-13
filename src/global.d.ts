import { NexusGenObjects } from '../nexus-typegen';

import { Either } from './util/Either';

// I do not like this patching.
declare global {
  type AsyncResult<L, R> = Promise<Either<L, R>>;
  type DomainResult<T> = AsyncResult<T, NexusGenObjects['ErrorList']>;
}
