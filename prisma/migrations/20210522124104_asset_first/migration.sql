-- CreateTable
CREATE TABLE "asset" (
    "id" BIGSERIAL NOT NULL,
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
CREATE UNIQUE INDEX "asset.file_name_unique" ON "asset"("file_name");

-- CreateIndex
CREATE UNIQUE INDEX "post_image_image_id_unique" ON "post_image"("image_id");

-- AddForeignKey
ALTER TABLE "image" ADD FOREIGN KEY ("id") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD FOREIGN KEY ("project_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
