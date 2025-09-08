ALTER TABLE "leads" DROP CONSTRAINT "leads_email_unique";--> statement-breakpoint
ALTER TABLE "leads" DROP CONSTRAINT "leads_campaign_id_campaigns_id_fk";
--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "status" SET DEFAULT 'Draft';--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "total_leads" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "total_leads" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "successful_leads" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "successful_leads" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "response_rate" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "response_rate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "company" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "campaign_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "status" SET DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "last_contact_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "interaction_history" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "interaction_history" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" DROP COLUMN "created_at";