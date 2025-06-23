import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  gameType: text("game_type").notNull(),
  host: text("host").notNull(),
  hostAvatar: text("host_avatar").notNull(),
  entryFee: integer("entry_fee").notNull(), // in cents (USDC)
  prizePool: integer("prize_pool").notNull(), // in cents (USDC)
  maxPlayers: integer("max_players").notNull(),
  currentPlayers: integer("current_players").notNull().default(0),
  lockTime: timestamp("lock_time").notNull(),
  status: text("status").notNull(), // 'live', 'filling', 'starting', 'waiting', 'locked'
  gameIcon: text("game_icon").notNull(),
  rules: text("rules").array().notNull(),
  hostGamesHosted: integer("host_games_hosted").notNull().default(0),
  hostRating: integer("host_rating").notNull().default(50), // rating * 10 (e.g., 48 = 4.8)
  // Smart contract integration fields
  blockchainType: text("blockchain_type"), // 'flow' | 'ethereum' | null
  contractAddress: text("contract_address"),
  gameContractId: text("game_contract_id"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
