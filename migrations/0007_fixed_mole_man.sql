ALTER TABLE "leads" ALTER COLUMN "interaction_history" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "interaction_history" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "responded" integer DEFAULT 0 NOT NULL;