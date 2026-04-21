CREATE TYPE "public"."portal_link_purpose" AS ENUM('request_access', 'submission_access');--> statement-breakpoint
CREATE TYPE "public"."portal_link_status" AS ENUM('active', 'consumed', 'revoked', 'expired');--> statement-breakpoint
CREATE TABLE "portal_links" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"request_id" text NOT NULL,
	"submission_id" text,
	"recipient_id" text,
	"purpose" "portal_link_purpose" DEFAULT 'request_access' NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"status" "portal_link_status" DEFAULT 'active' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"max_uses" integer DEFAULT 1 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"last_used_at" timestamp with time zone,
	"created_by_user_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "portal_links" ADD CONSTRAINT "portal_links_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_links" ADD CONSTRAINT "portal_links_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_links" ADD CONSTRAINT "portal_links_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_links" ADD CONSTRAINT "portal_links_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_links" ADD CONSTRAINT "portal_links_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "portal_links_token_hash_key" ON "portal_links" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "portal_links_request_status_idx" ON "portal_links" USING btree ("request_id","status");--> statement-breakpoint
CREATE INDEX "portal_links_submission_idx" ON "portal_links" USING btree ("submission_id");