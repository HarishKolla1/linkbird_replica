import { pgTable, text, timestamp, boolean, serial, varchar, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { create } from "domain";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});


// Campaign Status EnumA
export const campaignStatusEnum = pgEnum('campaign_status', ['Draft', 'Active', 'Paused', 'Completed']);

// Lead Status Enum
export const leadStatusEnum = pgEnum('lead_status', ['Pending', 'Contacted', 'Responded', 'Converted']);

// Campaigns Table
export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  status: campaignStatusEnum('status').notNull().default('Draft'),
  totalLeads: integer('total_leads').notNull().default(0),
  successfulLeads: integer('successful_leads').notNull().default(0),
  pending: integer('pending').notNull().default(0), // New column for pending leads
  responseRate: integer('response_rate').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  userId: varchar('user_id', { length: 255 }).notNull(),
});


// Leads Table
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  campaignId: integer('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  status: leadStatusEnum('status').notNull().default('Pending'),
  lastContactDate: timestamp('last_contact_date', { withTimezone: true }),
  interactionHistory: text('interaction_history').array().default([]),
});

// Relations
export const campaignRelations = relations(campaigns, ({ many }) => ({
  leads: many(leads),
}));

export const leadRelations = relations(leads, ({ one }) => ({
  campaign: one(campaigns, { fields: [leads.campaignId], references: [campaigns.id] }),
}));


export type Lead = typeof leads.$inferSelect;


export const schema = { user, session, account, verification, campaigns, leads };