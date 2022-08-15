export interface JsonArray extends Array<JsonValue> {}
export type JsonObject = { [Key in string]?: JsonValue; };
export type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

export type EmailConfig = {
  id: string;
  fromName: string;
  fromEmail: string;
  apiKey: string;
  service: string;
}

export type ClientApp = {
  id: string;
  description: string;
  secret: string;
  hashFn: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Tenant = {
  id: string;
  name: string;
}

export type Invitation = {
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

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hashFn: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TenantUser = {
  id: string;
  userId: string;
  tenantId: string;
}

export type ClientAppToken = {
  id: string;
  generatedAt: Date;
  duration: number;
  clientAppId: string;
}

export type UserToken = {
  id: string;
  generatedAt: Date;
  duration: number;
  userId: string;
}

export type ResetPasswordRequest = {
  id: string;
  code: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LoginAttempt = {
  userId: string;
  attempts: number;
  lastAttempt: Date;
}

export type Publication = {
  id: bigint;
  fromEmail: string;
  publicUrl: string;
  tenantId: string;
}

export type Quota = {
  id: bigint;
  sizeInMB: number;
  maxCapacity: number;
  occupied: number;
}


export type UserPublicationRole = {
  id: string;
  userId: string;
  publicationId: bigint;
  roleId: number;
}

export type Role = {
  id: number;
  name: string;
  displayName: string;
}

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Post = {
  id: bigint;
  ownerId: string;
  slug: string;
  canonicalUrl: string | null;
  publicationId: bigint;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export type PostVersion = {
  id: string;
  postId: bigint;
  version: number;
  title: string;
  content: JsonValue;
}

export type PostMeta = {
  id: bigint;
  title: string;
  description: string;
  imageId: string | null;
}

export type PostTag = {
  postId: bigint;
  tagId: string;
  order: number;
}

export type AssetStorage = {
  id: number;
  cloudType: string;
  region: string;
  bucket: string;
  publicUrl: string;
  uploadUrl: string;
  key: string;
  secret: string;
}


export type Asset = {
  id: string;
  storageId: number;
  title: string;
  fileName: string;
  contentType: string;
  size: number;
  sizeUnit: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  publicationId: bigint;
}


export type Image = {
  id: string;
  caption: JsonValue;
  altText: string;
}


export type PostImage = {
  imageId: string;
  revisionId: string;
}
