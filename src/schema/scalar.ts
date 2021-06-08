import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export const dateTimeScalar = asNexusMethod(DateTimeResolver, 'datetime', 'Date');
export const jsonObjectScalar = asNexusMethod(JSONObjectResolver, 'json');
