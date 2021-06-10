-- CreateTable
CREATE TABLE "EmailConfig" (
    "id" BIGSERIAL NOT NULL,
    "from_email" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "service" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quota" (
    "id" BIGINT NOT NULL,
    "size_in_byte" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" BIGINT NOT NULL,
    "super_admin" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "admin" ADD FOREIGN KEY ("id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quota" ADD FOREIGN KEY ("id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
