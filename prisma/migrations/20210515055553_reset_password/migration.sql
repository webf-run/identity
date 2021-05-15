-- CreateTable
CREATE TABLE "reset_password_request" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempt" (
    "user_id" BIGINT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "last_attempt" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_request.code_unique" ON "reset_password_request"("code");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_request.user_id_unique" ON "reset_password_request"("user_id");

-- AddForeignKey
ALTER TABLE "reset_password_request" ADD FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_attempt" ADD FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
