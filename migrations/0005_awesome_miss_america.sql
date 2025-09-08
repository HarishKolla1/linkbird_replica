ALTER TABLE "campaigns" ALTER COLUMN "total_leads" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "total_leads" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "successful_leads" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "successful_leads" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "response_rate" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "response_rate" DROP NOT NULL;