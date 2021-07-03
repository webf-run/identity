-- CreateTable
CREATE TABLE "email_config" (
    "id" BIGSERIAL NOT NULL,
    "from_name" TEXT NOT NULL,
    "from_email" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "service" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_app" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "hash_fn" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_type" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "from_email" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quota" (
    "id" BIGINT NOT NULL,
    "size_in_mb" INTEGER NOT NULL,
    "staff_capacity" INTEGER NOT NULL,
    "occupied" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "expiry_at" TIMESTAMPTZ NOT NULL,
    "project_id" BIGINT NOT NULL,
    "project_type" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_user" (
    "id" BIGSERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hash_fn" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_app_token" (
    "id" TEXT NOT NULL,
    "generated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "client_app_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_token" (
    "id" TEXT NOT NULL,
    "generated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "user_id" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_password_request" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempt" (
    "user_id" BIGINT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "last_attempt" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "publication" (
    "id" BIGINT NOT NULL,
    "project_type" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "publication_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role_id" INTEGER NOT NULL,

    PRIMARY KEY ("publication_id","user_id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "publication_id" BIGINT NOT NULL,
    "base_id" BIGINT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "published_at" TIMESTAMPTZ,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_meta" (
    "id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "post_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,
    "order" INTEGER NOT NULL,

    PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "asset_source" (
    "id" SERIAL NOT NULL,
    "cloud_type" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "upload_url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset" (
    "id" BIGSERIAL NOT NULL,
    "source_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "size_unit" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "project_id" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" BIGINT NOT NULL,
    "caption" JSONB NOT NULL,
    "alt_text" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_image" (
    "image_id" BIGINT NOT NULL,
    "project_id" BIGINT NOT NULL,

    PRIMARY KEY ("image_id","project_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project.id_project_type_unique" ON "project"("id", "project_type");

-- CreateIndex
CREATE UNIQUE INDEX "invitation.code_unique" ON "invitation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "invitation.email_project_id_unique" ON "invitation"("email", "project_id");

-- CreateIndex
CREATE INDEX "app_user.email_index" ON "app_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_request.code_unique" ON "reset_password_request"("code");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_request.user_id_unique" ON "reset_password_request"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "publication.public_url_unique" ON "publication"("public_url");

-- CreateIndex
CREATE UNIQUE INDEX "publication_id_project_type_unique" ON "publication"("id", "project_type");

-- CreateIndex
CREATE UNIQUE INDEX "staff.user_id_unique" ON "staff"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "role.id_project_type_unique" ON "role"("id", "project_type");

-- CreateIndex
CREATE UNIQUE INDEX "role.name_project_type_unique" ON "role"("name", "project_type");

-- CreateIndex
CREATE UNIQUE INDEX "tag.slug_unique" ON "tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "post.base_id_unique" ON "post"("base_id");

-- CreateIndex
CREATE UNIQUE INDEX "post.slug_base_id_unique" ON "post"("slug", "base_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_source.cloud_type_region_bucket_unique" ON "asset_source"("cloud_type", "region", "bucket");

-- CreateIndex
CREATE UNIQUE INDEX "asset.file_name_unique" ON "asset"("file_name");

-- CreateIndex
CREATE INDEX "asset.source_id_index" ON "asset"("source_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_image_image_id_unique" ON "post_image"("image_id");

-- AddForeignKey
ALTER TABLE "project" ADD FOREIGN KEY ("project_type") REFERENCES "project_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quota" ADD FOREIGN KEY ("id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD FOREIGN KEY ("project_id", "project_type") REFERENCES "project"("id", "project_type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD FOREIGN KEY ("role_id", "project_type") REFERENCES "role"("id", "project_type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_app_token" ADD FOREIGN KEY ("client_app_id") REFERENCES "client_app"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token" ADD FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reset_password_request" ADD FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_attempt" ADD FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication" ADD FOREIGN KEY ("id", "project_type") REFERENCES "project"("id", "project_type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD FOREIGN KEY ("project_type") REFERENCES "project_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD FOREIGN KEY ("owner_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD FOREIGN KEY ("base_id") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_meta" ADD FOREIGN KEY ("id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD FOREIGN KEY ("source_id") REFERENCES "asset_source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD FOREIGN KEY ("id") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD FOREIGN KEY ("project_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CUSTOM MIGRATION STARTS
ALTER TABLE "quota"
    ADD CONSTRAINT "max_capacity" CHECK ("occupied" <= "staff_capacity");

INSERT INTO "project_type"("id", "description")
    VALUES('publication', 'Blog or Publication');

ALTER TABLE "publication"
    ADD CONSTRAINT "project_must_be_publication" CHECK ("project_type" = 'publication');

INSERT INTO "role"("name", "display_name", "project_type")
    VALUES ('owner', 'Owner', 'publication');

INSERT INTO "role"("name", "display_name", "project_type")
    VALUES ('editor', 'Editor', 'publication');

INSERT INTO "role"("name", "display_name", "project_type")
    VALUES ('author', 'Author', 'publication');
-- CUSTOM MIGRATION ENDS
