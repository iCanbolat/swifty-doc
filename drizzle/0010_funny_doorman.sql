CREATE TYPE "public"."webhook_delivery_status" AS ENUM('queued', 'delivered', 'failed');--> statement-breakpoint
CREATE TABLE "webhook_deliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"endpoint_id" text NOT NULL,
	"event_id" varchar(120) NOT NULL,
	"event_type" varchar(120) NOT NULL,
	"request_body" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "webhook_delivery_status" DEFAULT 'queued' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"response_code" integer,
	"last_error_message" text,
	"source_delivery_id" text,
	"last_attempted_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_endpoints" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"url" varchar(500) NOT NULL,
	"secret" text NOT NULL,
	"subscribed_events" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpoint_id_webhook_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."webhook_endpoints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "webhook_deliveries_org_created_idx" ON "webhook_deliveries" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "webhook_deliveries_endpoint_status_idx" ON "webhook_deliveries" USING btree ("endpoint_id","status");--> statement-breakpoint
CREATE INDEX "webhook_endpoints_org_enabled_idx" ON "webhook_endpoints" USING btree ("organization_id","enabled");