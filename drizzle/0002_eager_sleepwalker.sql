CREATE TYPE "public"."client_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."recipient_delivery_channel" AS ENUM('email', 'whatsapp', 'sms');--> statement-breakpoint
CREATE TYPE "public"."recipient_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('draft', 'sent', 'in_progress', 'completed', 'closed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."submission_item_status" AS ENUM('pending', 'provided', 'approved', 'rejected', 'changes_requested');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('in_progress', 'completed', 'reopened');--> statement-breakpoint
CREATE TYPE "public"."template_field_type" AS ENUM('text', 'textarea', 'number', 'date', 'single_select', 'multi_select', 'boolean', 'file');--> statement-breakpoint
CREATE TYPE "public"."template_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."template_version_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "answers" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"submission_item_id" text NOT NULL,
	"value" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"answered_by_type" varchar(32) DEFAULT 'recipient' NOT NULL,
	"answered_by_id" text,
	"source" varchar(32) DEFAULT 'portal' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"full_name" varchar(160) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(32),
	"locale" varchar(16) DEFAULT 'en' NOT NULL,
	"status" "contact_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"display_name" varchar(160) NOT NULL,
	"legal_name" varchar(160),
	"external_ref" varchar(120),
	"status" "client_status" DEFAULT 'active' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "recipients" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"contact_id" text,
	"label" varchar(160) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(32),
	"delivery_channel" "recipient_delivery_channel" DEFAULT 'email' NOT NULL,
	"status" "recipient_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"client_id" text NOT NULL,
	"template_id" text NOT NULL,
	"template_version_id" text NOT NULL,
	"request_code" varchar(64) NOT NULL,
	"title" varchar(160) NOT NULL,
	"message" text,
	"status" "request_status" DEFAULT 'draft' NOT NULL,
	"due_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_items" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"submission_id" text NOT NULL,
	"template_field_id" text NOT NULL,
	"status" "submission_item_status" DEFAULT 'pending' NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"request_id" text NOT NULL,
	"recipient_id" text NOT NULL,
	"status" "submission_status" DEFAULT 'in_progress' NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"submitted_at" timestamp with time zone,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_fields" (
	"id" text PRIMARY KEY NOT NULL,
	"template_version_id" text NOT NULL,
	"section_id" text NOT NULL,
	"field_key" varchar(120) NOT NULL,
	"label" varchar(160) NOT NULL,
	"help_text" text,
	"field_type" "template_field_type" NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"position" integer NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"validation_rules" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"conditional_rules" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"template_version_id" text NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text,
	"position" integer NOT NULL,
	"is_repeatable" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"version_number" integer NOT NULL,
	"status" "template_version_status" DEFAULT 'draft' NOT NULL,
	"change_summary" text,
	"schema_checksum" varchar(64),
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"name" varchar(160) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"description" text,
	"status" "template_status" DEFAULT 'draft' NOT NULL,
	"published_version_number" integer,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_submission_item_id_submission_items_id_fk" FOREIGN KEY ("submission_item_id") REFERENCES "public"."submission_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_contacts" ADD CONSTRAINT "client_contacts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_contacts" ADD CONSTRAINT "client_contacts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_contact_id_client_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."client_contacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_template_version_id_template_versions_id_fk" FOREIGN KEY ("template_version_id") REFERENCES "public"."template_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_items" ADD CONSTRAINT "submission_items_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_items" ADD CONSTRAINT "submission_items_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_items" ADD CONSTRAINT "submission_items_template_field_id_template_fields_id_fk" FOREIGN KEY ("template_field_id") REFERENCES "public"."template_fields"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_fields" ADD CONSTRAINT "template_fields_template_version_id_template_versions_id_fk" FOREIGN KEY ("template_version_id") REFERENCES "public"."template_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_fields" ADD CONSTRAINT "template_fields_section_id_template_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."template_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_sections" ADD CONSTRAINT "template_sections_template_version_id_template_versions_id_fk" FOREIGN KEY ("template_version_id") REFERENCES "public"."template_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_versions" ADD CONSTRAINT "template_versions_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_versions" ADD CONSTRAINT "template_versions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "answers_submission_item_key" ON "answers" USING btree ("submission_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "client_contacts_client_email_key" ON "client_contacts" USING btree ("client_id","email");--> statement-breakpoint
CREATE INDEX "clients_org_workspace_idx" ON "clients" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "clients_workspace_external_ref_key" ON "clients" USING btree ("workspace_id","external_ref");--> statement-breakpoint
CREATE UNIQUE INDEX "recipients_client_email_key" ON "recipients" USING btree ("client_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "requests_org_code_key" ON "requests" USING btree ("organization_id","request_code");--> statement-breakpoint
CREATE INDEX "requests_workspace_status_idx" ON "requests" USING btree ("workspace_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "submission_items_submission_field_key" ON "submission_items" USING btree ("submission_id","template_field_id");--> statement-breakpoint
CREATE UNIQUE INDEX "submissions_request_recipient_key" ON "submissions" USING btree ("request_id","recipient_id");--> statement-breakpoint
CREATE INDEX "submissions_request_status_idx" ON "submissions" USING btree ("request_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "template_fields_section_position_key" ON "template_fields" USING btree ("section_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "template_fields_version_field_key" ON "template_fields" USING btree ("template_version_id","field_key");--> statement-breakpoint
CREATE UNIQUE INDEX "template_sections_version_position_key" ON "template_sections" USING btree ("template_version_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "template_versions_template_version_key" ON "template_versions" USING btree ("template_id","version_number");--> statement-breakpoint
CREATE UNIQUE INDEX "templates_workspace_slug_key" ON "templates" USING btree ("workspace_id","slug");