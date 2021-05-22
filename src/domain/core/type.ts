import { NexusGenInputs, NexusGenObjects } from '../../NexusTypegen';


export type UserInput = NexusGenInputs['UserInput'];
export type NewPublication = NexusGenInputs['NewPublication'];
export type TokenInput = NexusGenInputs['TokenInput'];

// TODO: These should be Prisma objects instead of Nexus objects
export type Publication = NexusGenObjects['Publication'];
export type AuthToken = NexusGenObjects['AuthToken'];
