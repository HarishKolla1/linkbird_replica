ALTER TABLE "leads" DROP CONSTRAINT "leads_campaign_id_campaigns_id_fk";
--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "total_leads" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "total_leads" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "successful_leads" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "successful_leads" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "response_rate" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "response_rate" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "user_id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "email" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "company" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "campaign_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" DROP COLUMN "last_contact_date";--> statement-breakpoint
ALTER TABLE "leads" DROP COLUMN "interaction_history";--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_email_unique" UNIQUE("email");