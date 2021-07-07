import { AssetSource, ClientApp, PostMeta, Prisma } from '@prisma/client';


const publicationDetails = Prisma.validator<Prisma.PublicationArgs>()({
  include: { project: true }
});

const postDetails = Prisma.validator<Prisma.PostArgs>()({
  include: {
    postMeta: true,
    tags: true,
  }
});

export interface Result {
  status: boolean;
}

export type Publication = Prisma.PublicationGetPayload<typeof publicationDetails>;
export type Post = Prisma.PostGetPayload<typeof postDetails>;

export interface AuthToken {
  id: string;
  generatedAt: Date;
  duration: number;
  type: string;
};

// export type PostMeta = X & {};

export { AssetSource, ClientApp, PostMeta };
