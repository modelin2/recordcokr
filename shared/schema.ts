import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for production
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

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

// Partner-specific addons (e.g., Naver with discounted prices)
export const partnerAddons = pgTable("partner_addons", {
  id: serial("id").primaryKey(),
  partner: text("partner").notNull(), // "naver", etc.
  name: text("name").notNull(),
  nameKo: text("name_ko").notNull(), // Korean name
  originalPrice: integer("original_price").notNull(),
  discountRate: integer("discount_rate").notNull(), // percentage (e.g., 50 for 50%)
  discountedPrice: integer("discounted_price").notNull(),
  description: text("description").notNull(),
  descriptionKo: text("description_ko").notNull(), // Korean description
  icon: text("icon").notNull(),
  isManualProcessing: boolean("is_manual_processing").default(false), // For "custom quote" items
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bookingType: text("booking_type").notNull().default("direct"), // "direct", "klook", or "naver"
  klookBookingId: text("klook_booking_id"), // For klook reservations
  naverReservationId: text("naver_reservation_id"), // For naver reservations
  naverBaseAmount: integer("naver_base_amount"), // Base amount already paid via Naver
  naverMetadata: text("naver_metadata"), // Additional Naver booking metadata (JSON)
  selectedDrink: text("selected_drink"),
  drinkTemperature: text("drink_temperature"), // "hot" or "iced"
  youtubeTrackUrl: text("youtube_track_url"),
  selectedAddons: integer("selected_addons").array().default([]),
  selectedPartnerAddons: integer("selected_partner_addons").array().default([]), // For Naver addons
  selectedServices: text("selected_services"), // JSON string of selected services with names and prices
  lpDeliveryAddress: text("lp_delivery_address"), // For LP Record Production addon
  bookingDate: text("booking_date"), // Optional for klook/naver bookings
  bookingTime: text("booking_time"), // Optional for klook/naver bookings
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").notNull().default("unpaid"), // "unpaid", "paid", "pending"
  paymentMethod: text("payment_method"), // "online" or "offline"
  paidAmount: integer("paid_amount"), // Amount paid via online payment (PayPal)
  paypalOrderId: text("paypal_order_id"), // PayPal order ID for tracking
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

// Visitor photos for newspaper-style printing
export const visitorPhotos = pgTable("visitor_photos", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  photoData: text("photo_data").notNull(), // Base64 encoded image data
  headline: text("headline"), // Optional custom headline
  isPrinted: boolean("is_printed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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

export const insertPartnerAddonSchema = createInsertSchema(partnerAddons).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  totalPrice: true,
  status: true,
  paymentStatus: true,
  paypalOrderId: true,
  paidAmount: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  bookingType: z.enum(["direct", "klook", "naver"]).default("direct"),
  klookBookingId: z.string().optional(),
  naverReservationId: z.string().optional(),
  naverBaseAmount: z.number().optional(),
  naverMetadata: z.string().optional(),
  selectedDrink: z.string().optional(),
  drinkTemperature: z.string().optional(),
  youtubeTrackUrl: z.string().optional(),
  selectedAddons: z.array(z.number()).default([]),
  selectedPartnerAddons: z.array(z.number()).default([]),
  selectedServices: z.string().optional(), // JSON string of selected services
  lpDeliveryAddress: z.string().optional(),
  bookingDate: z.string().optional(), // Optional for klook/naver bookings
  bookingTime: z.string().optional(), // Optional for klook/naver bookings
  paymentStatus: z.enum(["unpaid", "paid", "pending"]).optional(), // Payment status
  paymentMethod: z.enum(["online", "offline"]).optional(), // Payment method
  paidAmount: z.number().optional(), // Amount paid via online payment
  paypalOrderId: z.string().optional(), // PayPal order ID
});

// Naver-specific booking schema
export const insertNaverBookingSchema = insertBookingSchema.extend({
  bookingType: z.literal("naver"),
  naverReservationId: z.string().min(1, "Naver reservation ID is required"),
  selectedDrink: z.string().min(1, "Beverage selection is required"),
  drinkTemperature: z.string().min(1, "Drink temperature is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  bookingTime: z.string().min(1, "Booking time is required"),
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
export type PartnerAddon = typeof partnerAddons.$inferSelect;
export type InsertPartnerAddon = z.infer<typeof insertPartnerAddonSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertNaverBooking = z.infer<typeof insertNaverBookingSchema>;
export type TimeSlot = typeof timeSlots.$inferSelect;
export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type RevenueStats = typeof revenueStats.$inferSelect;
export type InsertRevenueStats = z.infer<typeof insertRevenueStatsSchema>;
export type PaymentOrder = typeof paymentOrders.$inferSelect;
export type InsertPaymentOrder = z.infer<typeof insertPaymentOrderSchema>;

export const insertVisitorPhotoSchema = createInsertSchema(visitorPhotos).omit({
  id: true,
  createdAt: true,
  isPrinted: true,
}).extend({
  customerName: z.string().min(1, "Customer name is required"),
  photoData: z.string().min(1, "Photo is required"),
  headline: z.string().optional(),
});

export type VisitorPhoto = typeof visitorPhotos.$inferSelect;
export type InsertVisitorPhoto = z.infer<typeof insertVisitorPhotoSchema>;

// Visit reservations for marketing customers (Instagram, etc.)
export const visitReservations = pgTable("visit_reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  reservationDate: text("reservation_date").notNull(),
  reservationTime: text("reservation_time").notNull(),
  numberOfPeople: integer("number_of_people").notNull().default(1), // 1-4 people
  totalAmountUsd: integer("total_amount_usd").notNull().default(28), // Amount in USD
  paymentStatus: text("payment_status").notNull().default("pending"), // "pending", "paid"
  paypalOrderId: text("paypal_order_id"),
  status: text("status").notNull().default("confirmed"), // "confirmed", "cancelled", "visited"
  source: text("source").default("instagram"), // Marketing source
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVisitReservationSchema = createInsertSchema(visitReservations).omit({
  id: true,
  createdAt: true,
  paypalOrderId: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  reservationDate: z.string().min(1, "Date is required"),
  reservationTime: z.string().min(1, "Time is required"),
  numberOfPeople: z.number().min(1).max(4).default(1),
  totalAmountUsd: z.number().default(28),
  paymentStatus: z.enum(["pending", "paid"]).default("pending"),
  status: z.enum(["confirmed", "cancelled", "visited"]).default("confirmed"),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export type VisitReservation = typeof visitReservations.$inferSelect;
export type InsertVisitReservation = z.infer<typeof insertVisitReservationSchema>;
