import {
  AssetSource, ClientApp,
  Post as PostBase, PostMeta, PostVersion, Prisma, Tag } from '@prisma/client';


const publicationDetails = Prisma.validator<Prisma.PublicationArgs>()({
  include: { project: true }
});


export type Post = PostBase & {
  meta: {
    title: string;
    description: string;
  };
  tags: Tag[];
  title: PostVersion['title'];
  content: Prisma.JsonObject;
}


export interface Result {
  status: boolean;
}


export type Publication = Prisma.PublicationGetPayload<typeof publicationDetails>;


export interface AuthToken {
  id: string;
  generatedAt: Date;
  duration: number;
  type: string;
};


export { AssetSource, ClientApp, PostMeta };
