export interface Result {
  status: boolean;
}

export type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

export interface JsonArray extends Array<JsonValue> {
}

export type JsonObject = {
  [Key in string]?: JsonValue;
};


export interface AssetStorage {
  id: number;
  cloudType: string;
  region: string;
  bucket: string;
  publicUrl: string;
  uploadUrl: string;
  key: string;
  secret: string;
}

export interface ClientApp {
  id: string;
  description: string;
  secret: string;
  hashFn: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailConfig {
  id: string;
  fromName: string;
  fromEmail: string;
  apiKey: string;
  service: string;
}


export interface Invitation {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  duration: number;
  expiryAt: Date;
  publicationId: bigint;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hashFn: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithToken {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  token: UserToken;
  roles: Array<{
    roleId: number;
    publication: Publication;
  }>;
}


export interface Post {
  id: bigint;
  ownerId: string;
  slug: string;
  canonicalUrl: string | null;
  publicationId: bigint;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  tags: PostTag[];
  meta: PostMeta;
}


export interface PostContent {
  title: string;
  content: JsonObject;
  meta: {
    title: string;
    description: string;
  };
}

export interface PostMeta {
  id: bigint;
  title: string;
  description: string;
  imageId: string | null;
}

export interface PostTag {
  postId: bigint;
  tagId: string;
  order: number;
}

export interface Publication {
  id: bigint;
  fromEmail: string;
  publicUrl: string;
  tenantId: string;
};


export type PostWithContent = Post & PostContent;


export interface PostSettings {
  canonicalUrl?: string | null;
  meta: PostMeta;
  slug: string;
  tags: Tag[];
}

export interface AuthToken {
  id: string;
  generatedAt: Date;
  duration: number;
  type: 'bearer';
}

export interface UserToken {
  id: string;
  generatedAt: Date;
  duration: number;
  userId: string;
}

export interface ClientAppToken {
  id: string;
  generatedAt: Date;
  duration: number;
  clientAppId: string;
}

export type Token = UserToken | ClientAppToken;


export interface UserPublicationRole {
  id: string;
  userId: string;
  publicationId: bigint;
  roleId: number;
}
