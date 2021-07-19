import type Model from '@prisma/client';
import { Prisma } from '@prisma/client';


export interface Result {
  status: boolean;
}


export type AssetSource = Model.AssetSource;
export type ClientApp = Model.ClientApp;
export type PostMeta = Model.PostMeta;


const publicationDetails = Prisma.validator<Prisma.PublicationArgs>()({
  include: { project: true }
});


export interface PostBase {
  title: Model.PostVersion['title'];
  content: Prisma.JsonObject;
  meta: {
    title: string;
    description: string;
  };
}


export type UpdatePostPayload = Model.Post & PostBase;
export type Post = UpdatePostPayload & { tags: Model.Tag[]; };


export type Publication = Prisma.PublicationGetPayload<typeof publicationDetails>;


export interface PostSettings {
  canonicalUrl?: string | null;
  meta: Model.PostMeta;
  slug: string;
  tags: Model.Tag[];
};


export interface AuthToken {
  id: string;
  generatedAt: Date;
  duration: number;
  type: string;
};
