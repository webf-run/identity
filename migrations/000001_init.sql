-- CreateTable
CREATE TABLE "email_config" (
    "id" UUID NOT NULL,
    "from_name" TEXT NOT NULL,
    "from_email" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "service" TEXT NOT NULL,

    CONSTRAINT "email_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_app" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "hash_fn" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "client_app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "expiry_at" TIMESTAMPTZ NOT NULL,
    "publication_id" BIGINT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_user" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hash_fn" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_user" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,

    CONSTRAINT "tenant_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_app_token" (
    "id" TEXT NOT NULL,
    "generated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "client_app_id" UUID NOT NULL,

    CONSTRAINT "client_app_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_token" (
    "id" TEXT NOT NULL,
    "generated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_password_request" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "reset_password_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempt" (
    "user_id" UUID NOT NULL,
    "attempts" INTEGER NOT NULL,
    "last_attempt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "login_attempt_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "publication" (
    "id" BIGSERIAL NOT NULL,
    "from_email" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "tenant_id" UUID NOT NULL,

    CONSTRAINT "publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quota" (
    "id" BIGINT NOT NULL,
    "size_in_mb" INTEGER NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "occupied" INTEGER NOT NULL,

    CONSTRAINT "quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_user" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "publication_id" BIGINT NOT NULL,

    CONSTRAINT "publication_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_publication_role" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "publication_id" BIGINT NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_publication_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" BIGSERIAL NOT NULL,
    "owner_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "canonical_url" TEXT,
    "publication_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "published_at" TIMESTAMPTZ,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_version" (
    "id" UUID NOT NULL,
    "post_id" BIGINT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,

    CONSTRAINT "post_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_meta" (
    "id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_id" UUID,

    CONSTRAINT "post_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tag" (
    "post_id" BIGINT NOT NULL,
    "tag_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "post_tag_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "asset_storage" (
    "id" SERIAL NOT NULL,
    "cloud_type" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "upload_url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "asset_storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset" (
    "id" UUID NOT NULL,
    "source_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "size_unit" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "publication_id" BIGINT NOT NULL,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" UUID NOT NULL,
    "caption" JSONB NOT NULL,
    "alt_text" TEXT NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_image" (
    "image_id" UUID NOT NULL,
    "revision_id" UUID NOT NULL,

    CONSTRAINT "post_image_pkey" PRIMARY KEY ("image_id","revision_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation_code_key" ON "invitation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "invitation_email_publication_id_key" ON "invitation"("email", "publication_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_request_code_key" ON "reset_password_request"("code");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_request_user_id_key" ON "reset_password_request"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "publication_public_url_key" ON "publication"("public_url");

-- CreateIndex
CREATE UNIQUE INDEX "publication_user_user_id_publication_id_key" ON "publication_user"("user_id", "publication_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_publication_role_user_id_publication_id_role_id_key" ON "user_publication_role"("user_id", "publication_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_slug_key" ON "tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "post_publication_id_slug_key" ON "post"("publication_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "post_version_post_id_version_key" ON "post_version"("post_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "asset_storage_cloud_type_region_bucket_key" ON "asset_storage"("cloud_type", "region", "bucket");

-- CreateIndex
CREATE UNIQUE INDEX "asset_file_name_key" ON "asset"("file_name");

-- CreateIndex
CREATE INDEX "asset_source_id_idx" ON "asset"("source_id");

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_user" ADD CONSTRAINT "tenant_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_user" ADD CONSTRAINT "tenant_user_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_app_token" ADD CONSTRAINT "client_app_token_client_app_id_fkey" FOREIGN KEY ("client_app_id") REFERENCES "client_app"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reset_password_request" ADD CONSTRAINT "reset_password_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_attempt" ADD CONSTRAINT "login_attempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication" ADD CONSTRAINT "publication_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quota" ADD CONSTRAINT "quota_id_fkey" FOREIGN KEY ("id") REFERENCES "publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_user" ADD CONSTRAINT "publication_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_user" ADD CONSTRAINT "publication_user_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_publication_role" ADD CONSTRAINT "user_publication_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_publication_role" ADD CONSTRAINT "user_publication_role_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_publication_role" ADD CONSTRAINT "user_publication_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_version" ADD CONSTRAINT "post_version_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_meta" ADD CONSTRAINT "post_meta_id_fkey" FOREIGN KEY ("id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_meta" ADD CONSTRAINT "post_meta_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tag" ADD CONSTRAINT "post_tag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tag" ADD CONSTRAINT "post_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "asset_storage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_id_fkey" FOREIGN KEY ("id") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "post_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
