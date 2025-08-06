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
  selectedAddons: integer("selected_addons").array().default([]),
  lpDeliveryAddress: text("lp_delivery_address"), // For LP Record Production addon
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

// Payment orders table for TossPayments integration
export const paymentOrders = pgTable("payment_orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(), // Unique order identifier
  paymentKey: text("payment_key"), // From TossPayments
  bookingId: integer("booking_id").notNull(),
  amount: integer("amount").notNull(), // Payment amount in Korean won
  status: text("status").notNull().default("ready"), // ready, in_progress, waiting_for_deposit, done, canceled, partial_canceled, aborted, expired
  method: text("method"), // Card payment method
  approvedAt: timestamp("approved_at"),
  requestedAt: timestamp("requested_at").defaultNow(),
  failReason: text("fail_reason"), // If payment failed
  cancelReason: text("cancel_reason"), // If payment canceled
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  isPartialCancelable: boolean("is_partial_cancelable").default(false),
  receipt: text("receipt"), // Receipt URL from TossPayments
  checkoutUrl: text("checkout_url"), // Payment checkout URL
  metadata: text("metadata"), // Additional payment metadata JSON
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  totalPrice: true,
  status: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  bookingType: z.enum(["direct", "klook"]).default("direct"),
  klookBookingId: z.string().optional(),
  selectedDrink: z.string().min(1, "Drink selection is required"),
  drinkTemperature: z.string().optional(),
  youtubeTrackUrl: z.string().url("Valid YouTube URL is required"),
  selectedAddons: z.array(z.number()).default([]),
  lpDeliveryAddress: z.string().optional(),
  bookingDate: z.string().optional(), // Optional for klook bookings
  bookingTime: z.string().optional(), // Optional for klook bookings
});

export const insertRevenueStatsSchema = createInsertSchema(revenueStats).omit({
  id: true,
  lastUpdated: true,
});

export const insertTimeSlotSchema = createInsertSchema(timeSlots).omit({
  id: true,
});

export const insertPaymentOrderSchema = createInsertSchema(paymentOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  orderId: z.string().min(1, "Order ID is required"),
  bookingId: z.number().int().positive("Valid booking ID is required"),
  amount: z.number().int().positive("Amount must be positive"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
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
export type PaymentOrder = typeof paymentOrders.$inferSelect;
export type InsertPaymentOrder = z.infer<typeof insertPaymentOrderSchema>;
