import { AppError } from './domain/AppError';
import { Either } from './util/Either';

// I do not like this patching but it is very convenient
// as long as I am not patching global object for values.
// I am only making few types available globally.
declare global {
  type AsyncResult<L, R> = Promise<Either<L, R>>;
  type DomainResult<T> = AsyncResult<T, AppError>;
}
