import type Model from '@prisma/client';
import { Prisma } from '@prisma/client';


export interface Result {
  status: boolean;
}


export type AssetStorage = Model.AssetStorage;
export type ClientApp = Model.ClientApp;
export type PostMeta = Model.PostMeta;
export type Publication = Model.Publication;

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
