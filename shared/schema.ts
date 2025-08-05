import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  role: text("role").default("user"), // "super_admin", "admin", "user"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // in Korean won
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  songCount: integer("song_count").notNull(),
  isPopular: boolean("is_popular").default(false),
});

export const addons = pgTable("addons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bookingType: text("booking_type").notNull().default("direct"), // "direct" or "klook"
  klookBookingId: text("klook_booking_id"), // For klook reservations
  selectedDrink: text("selected_drink").notNull(),
  drinkTemperature: text("drink_temperature"), // "hot" or "iced"
  youtubeTrackUrl: text("youtube_track_url").notNull(),
  selectedAddons: text("selected_addons").array().default([]),
  bookingDate: text("booking_date"), // Optional for klook bookings
  bookingTime: text("booking_time"), // Optional for klook bookings
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Revenue statistics for Global Distribution users
export const revenueStats = pgTable("revenue_stats", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  trackTitle: text("track_title").notNull(),
  artistName: text("artist_name").notNull(),
  totalStreams: integer("total_streams").default(0),
  totalRevenue: integer("total_revenue").default(0), // in Korean won
  platformBreakdown: text("platform_breakdown").array().default([]), // JSON strings
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  isAvailable: boolean("is_available").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export const insertAdminSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  role: true,
}).extend({
  email: z.string().email("Valid email is required"),
  username: z.string().min(1, "Username is required"),
  role: z.enum(["admin", "super_admin"]).default("admin"),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

export const insertAddonSchema = createInsertSchema(addons).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  bookingType: z.enum(["direct", "klook"]).default("direct"),
  klookBookingId: z.string().optional(),
  selectedDrink: z.string().min(1, "Drink selection is required"),
  drinkTemperature: z.string().optional(),
  youtubeTrackUrl: z.string().url("Valid YouTube URL is required"),
  bookingDate: z.string().optional(), // Optional for klook bookings
  bookingTime: z.string().optional(), // Optional for klook bookings
  selectedAddons: z.array(z.string()).default([]),
});

export const insertRevenueStatsSchema = createInsertSchema(revenueStats).omit({
  id: true,
  lastUpdated: true,
});

export const insertTimeSlotSchema = createInsertSchema(timeSlots).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type User = typeof users.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Addon = typeof addons.$inferSelect;
export type InsertAddon = z.infer<typeof insertAddonSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type TimeSlot = typeof timeSlots.$inferSelect;
export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type RevenueStats = typeof revenueStats.$inferSelect;
export type InsertRevenueStats = z.infer<typeof insertRevenueStatsSchema>;
