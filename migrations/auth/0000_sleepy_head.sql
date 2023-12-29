CREATE TABLE IF NOT EXISTS "api_key" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"token" text NOT NULL,
	"hash_fn" text NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "local_login" (
	"user_id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"hash_fn" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "username" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "login_attempt" (
	"user_id" text PRIMARY KEY NOT NULL,
	"attempts" smallint NOT NULL,
	"last_attempt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_login" (
	"id" text PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "provider_unique_id" UNIQUE("provider_id","subject_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reset_password_request" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "code" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "key" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant_user" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "membership" UNIQUE("tenant_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_email" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"verified" boolean NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "email" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_token" (
	"id" text PRIMARY KEY NOT NULL,
	"generated_at" timestamp with time zone NOT NULL,
	"duration" integer NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "local_login" ADD CONSTRAINT "local_login_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "login_attempt" ADD CONSTRAINT "login_attempt_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_login" ADD CONSTRAINT "provider_login_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reset_password_request" ADD CONSTRAINT "reset_password_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenant_user" ADD CONSTRAINT "tenant_user_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenant_user" ADD CONSTRAINT "tenant_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_email" ADD CONSTRAINT "user_email_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_token" ADD CONSTRAINT "user_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
