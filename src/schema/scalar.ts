import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export const dateTimeScalar = asNexusMethod(DateTimeResolver, 'datetime');
