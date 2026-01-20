import { 
  users, packages, addons, partnerAddons, bookings, timeSlots, paymentOrders, visitorPhotos, visitReservations, hotelBookings,
  type User, type InsertUser, type InsertAdmin,
  type Package, type InsertPackage,
  type Addon, type InsertAddon,
  type PartnerAddon, type InsertPartnerAddon,
  type Booking, type InsertBooking,
  type TimeSlot, type InsertTimeSlot,
  type PaymentOrder, type InsertPaymentOrder,
  type VisitorPhoto, type InsertVisitorPhoto,
  type VisitReservation, type InsertVisitReservation,
  type HotelBooking, type InsertHotelBooking
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Admin management
  createAdmin(admin: { email: string; username: string; password: string; role: string }): Promise<User>;
  getAllAdmins(): Promise<User[]>;
  updateUserStatus(userId: number, isActive: boolean): Promise<User | undefined>;
  deleteAdmin(userId: number): Promise<boolean>;
  
  getAllPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  
  getAllAddons(): Promise<Addon[]>;
  getAddon(id: number): Promise<Addon | undefined>;
  createAddon(addon: InsertAddon): Promise<Addon>;
  
  // Partner addons (Naver, etc.)
  getAllPartnerAddons(partner: string): Promise<PartnerAddon[]>;
  getPartnerAddon(id: number): Promise<PartnerAddon | undefined>;
  createPartnerAddon(addon: InsertPartnerAddon): Promise<PartnerAddon>;
  
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  updateBookingPaymentStatus(id: number, paymentStatus: string, paypalOrderId?: string, paidAmount?: number): Promise<Booking | undefined>;
  
  getAvailableTimeSlots(date: string): Promise<TimeSlot[]>;
  createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot>;
  updateTimeSlotAvailability(id: number, isAvailable: boolean): Promise<TimeSlot | undefined>;
  
  // Payment operations
  createPaymentOrder(paymentOrder: InsertPaymentOrder): Promise<PaymentOrder>;
  getPaymentOrderByOrderId(orderId: string): Promise<PaymentOrder | undefined>;
  updatePaymentOrder(orderId: string, updates: Partial<PaymentOrder>): Promise<PaymentOrder>;
  
  // Visitor photo operations
  getAllVisitorPhotos(): Promise<VisitorPhoto[]>;
  getVisitorPhoto(id: number): Promise<VisitorPhoto | undefined>;
  createVisitorPhoto(photo: InsertVisitorPhoto): Promise<VisitorPhoto>;
  updateVisitorPhotoStatus(id: number, isPrinted: boolean): Promise<VisitorPhoto | undefined>;
  deleteVisitorPhoto(id: number): Promise<boolean>;
  
  // Visit reservation operations (marketing customers)
  getAllVisitReservations(): Promise<VisitReservation[]>;
  getVisitReservation(id: number): Promise<VisitReservation | undefined>;
  createVisitReservation(reservation: InsertVisitReservation): Promise<VisitReservation>;
  updateVisitReservationStatus(id: number, status: string): Promise<VisitReservation | undefined>;
  updateVisitReservationPayment(id: number, paymentStatus: string, paypalOrderId?: string): Promise<VisitReservation | undefined>;
  deleteVisitReservation(id: number): Promise<boolean>;
  
  // Hotel booking operations
  getAllHotelBookings(): Promise<HotelBooking[]>;
  getHotelBooking(id: number): Promise<HotelBooking | undefined>;
  createHotelBooking(booking: InsertHotelBooking): Promise<HotelBooking>;
  updateHotelBookingStatus(id: number, status: string): Promise<HotelBooking | undefined>;
  deleteHotelBooking(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private packages: Map<number, Package>;
  private addons: Map<number, Addon>;
  private bookings: Map<number, Booking>;
  private timeSlots: Map<number, TimeSlot>;
  private paymentOrders: Map<number, PaymentOrder>;
  private currentUserId: number;
  private currentPackageId: number;
  private currentAddonId: number;
  private currentBookingId: number;
  private currentTimeSlotId: number;
  private currentPaymentOrderId: number;

  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.addons = new Map();
    this.bookings = new Map();
    this.timeSlots = new Map();
    this.paymentOrders = new Map();
    this.currentUserId = 1;
    this.currentPackageId = 1;
    this.currentAddonId = 1;
    this.currentBookingId = 1;
    this.currentTimeSlotId = 1;
    this.currentPaymentOrderId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Initialize admin users
    const superAdmin: User = {
      id: this.currentUserId++,
      username: "super_admin",
      password: "admin123",
      email: "admin@k-recording-cafe.com",
      role: "super_admin",
      isActive: true,
      createdAt: new Date("2025-08-01T09:00:00Z"),
    };
    this.users.set(superAdmin.id, superAdmin);

    const staffAdmin1: User = {
      id: this.currentUserId++,
      username: "staff_minsu",
      password: "staff123",
      email: "minsu.kim@k-recording-cafe.com",
      role: "admin",
      isActive: true,
      createdAt: new Date("2025-08-02T10:30:00Z"),
    };
    this.users.set(staffAdmin1.id, staffAdmin1);

    const staffAdmin2: User = {
      id: this.currentUserId++,
      username: "staff_jiyoung",
      password: "staff456",
      email: "jiyoung.park@k-recording-cafe.com",
      role: "admin",
      isActive: true,
      createdAt: new Date("2025-08-03T14:15:00Z"),
    };
    this.users.set(staffAdmin2.id, staffAdmin2);

    const inactiveStaff: User = {
      id: this.currentUserId++,
      username: "staff_suhyun",
      password: "staff789",
      email: "suhyun.lee@k-recording-cafe.com",
      role: "admin",
      isActive: false,
      createdAt: new Date("2025-07-20T11:00:00Z"),
    };
    this.users.set(inactiveStaff.id, inactiveStaff);

    // Initialize packages with time-based pricing (using base price for regular hours)
    const singleSongPackage: Package = {
      id: this.currentPackageId++,
      name: "1 Song Package",
      price: 37500, // Base price for 13:00-18:00
      description: "Perfect introduction to K-pop recording",
      features: ["1 Premium Drink", "1 Song Recording", "Raw Recording File", "Free Self-Photography"],
      songCount: 1,
      isPopular: false,
    };

    const doubleSongPackage: Package = {
      id: this.currentPackageId++,
      name: "2 Songs Package",
      price: 75000, // Base price for 13:00-18:00
      description: "Most popular choice for K-pop fans",
      features: ["1 Premium Drink", "2 Song Recordings", "Raw Recording Files", "Free Self-Photography"],
      songCount: 2,
      isPopular: true,
    };

    const quadrupleSongPackage: Package = {
      id: this.currentPackageId++,
      name: "4 Songs Package",
      price: 150000, // Base price for 13:00-18:00
      description: "Ultimate K-pop recording experience",
      features: ["1 Premium Drink", "4 Song Recordings", "Raw Recording Files", "Free Self-Photography"],
      songCount: 4,
      isPopular: false,
    };

    const hangangTourPackage: Package = {
      id: this.currentPackageId++,
      name: "Hangang Park Tour + Recording",
      price: 85000,
      description: "Recording session + authentic Korean riverside experience",
      features: ["1 Song Recording", "Premium Drink", "Hangang Park Walking Tour", "Choose: K-Drama Ramyeon Experience OR Han River Cruise OR Floating Starbucks Visit", "Professional Photos at Scenic Spots", "Local Guide Included"],
      songCount: 1,
      isPopular: true,
    };

    const garosugilTourPackage: Package = {
      id: this.currentPackageId++,
      name: "Garosu-gil Tour + Recording", 
      price: 75000,
      description: "Recording session + trendy Gangnam district exploration",
      features: ["1 Song Recording", "Premium Drink", "Garosu-gil Walking Tour", "K-Fashion Boutique Visits", "Trendy Cafe Photo Spots", "Street Art & Culture Guide", "Shopping Recommendations"],
      songCount: 1,
      isPopular: false,
    };

    this.packages.set(singleSongPackage.id, singleSongPackage);
    this.packages.set(doubleSongPackage.id, doubleSongPackage);
    this.packages.set(quadrupleSongPackage.id, quadrupleSongPackage);
    this.packages.set(hangangTourPackage.id, hangangTourPackage);
    this.packages.set(garosugilTourPackage.id, garosugilTourPackage);

    // Initialize addons with updated Korean won pricing
    const fullTrackMixing: Addon = {
      id: this.currentAddonId++,
      name: "Full Track Mixing",
      price: 100000, // ₩100,000
      description: "Professional mixing and mastering of your recording",
      icon: "fas fa-music",
    };

    const recordingVideoRaw: Addon = {
      id: this.currentAddonId++,
      name: "Recording Video - Raw footage only",
      price: 50000, // ₩50,000
      description: "Raw recording video footage",
      icon: "fas fa-video",
    };

    const recordingVideoEdited: Addon = {
      id: this.currentAddonId++,
      name: "Recording Video - Edited with song",
      price: 100000, // ₩100,000
      description: "Professionally edited recording video with your song",
      icon: "fas fa-video",
    };

    const makeup: Addon = {
      id: this.currentAddonId++,
      name: "Makeup Service",
      price: 100000, // ₩100,000
      description: "Professional K-pop makeup styling",
      icon: "fas fa-palette",
    };

    const lpProduction: Addon = {
      id: this.currentAddonId++,
      name: "LP Record Production",
      price: 300000, // ₩300,000
      description: "Create your own physical LP vinyl record. Includes Full Track Mixing. Production takes 2-3 weeks.",
      icon: "fas fa-compact-disc",
    };

    const globalDistribution: Addon = {
      id: this.currentAddonId++,
      name: "Global Distribution",
      price: 1300000, // ₩1,300,000
      description: "Worldwide distribution to Spotify, Apple Music, YouTube Music and more",
      icon: "fas fa-globe",
    };

    this.addons.set(fullTrackMixing.id, fullTrackMixing);
    this.addons.set(recordingVideoRaw.id, recordingVideoRaw);
    this.addons.set(recordingVideoEdited.id, recordingVideoEdited);
    this.addons.set(makeup.id, makeup);
    this.addons.set(lpProduction.id, lpProduction);
    this.addons.set(globalDistribution.id, globalDistribution);

    // Initialize time slots for the next 30 days
    const today = new Date();
    console.log('Initializing time slots starting from:', today.toISOString().split('T')[0]);
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Create time slots from 10:00 to 22:00 (every 50 minutes for realistic booking slots)
      const timeSlots = [
        "10:00", "10:50", "11:40", "12:30", // Morning slots
        "13:00", "13:50", "14:40", "15:30", "16:20", "17:10", // Afternoon slots  
        "18:00", "18:50", "19:40", "20:30", "21:20", "22:00"  // Evening slots
      ];
      
      timeSlots.forEach(timeStr => {
        const timeSlot: TimeSlot = {
          id: this.currentTimeSlotId++,
          date: dateStr,
          time: timeStr,
          isAvailable: true,
        };
        this.timeSlots.set(timeSlot.id, timeSlot);
      });
    }
    
    console.log(`Initialized ${this.timeSlots.size} time slots total`);
    console.log('Sample dates with slots:', Array.from(this.timeSlots.values()).slice(0, 5).map(slot => `${slot.date} ${slot.time}`));

    // Initialize sample bookings for admin testing
    this.initializeSampleBookings();
  }

  private initializeSampleBookings() {
    // No sample bookings - they will be created through the API
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => 
      user.username === username || user.email === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || null,
      role: insertUser.role || "user",
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async createAdmin(insertAdmin: { email: string; username: string; password: string; role: string }): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertAdmin.username,
      password: insertAdmin.password, // Use provided password
      email: insertAdmin.email,
      role: insertAdmin.role,
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllAdmins(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => 
      user.role === "admin" || user.role === "super_admin"
    );
  }

  async updateUserStatus(userId: number, isActive: boolean): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.isActive = isActive;
      this.users.set(userId, user);
    }
    return user;
  }

  async deleteAdmin(userId: number): Promise<boolean> {
    const user = this.users.get(userId);
    if (user && (user.role === "admin" || user.role === "super_admin")) {
      this.users.delete(userId);
      return true;
    }
    return false;
  }

  async getAllPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = this.currentPackageId++;
    const pkg: Package = { ...insertPackage, id, isPopular: insertPackage.isPopular ?? false };
    this.packages.set(id, pkg);
    return pkg;
  }

  async getAllAddons(): Promise<Addon[]> {
    return Array.from(this.addons.values());
  }

  async getAddon(id: number): Promise<Addon | undefined> {
    return this.addons.get(id);
  }

  async createAddon(insertAddon: InsertAddon): Promise<Addon> {
    const id = this.currentAddonId++;
    const addon: Addon = { ...insertAddon, id };
    this.addons.set(id, addon);
    return addon;
  }

  async getAllPartnerAddons(partner: string): Promise<PartnerAddon[]> {
    // MemStorage doesn't store partner addons, use DatabaseStorage for partner features
    return [];
  }

  async getPartnerAddon(id: number): Promise<PartnerAddon | undefined> {
    // MemStorage doesn't store partner addons, use DatabaseStorage for partner features
    return undefined;
  }

  async createPartnerAddon(insertAddon: InsertPartnerAddon): Promise<PartnerAddon> {
    // MemStorage doesn't support partner addons, use DatabaseStorage
    throw new Error("Partner addons are not supported in MemStorage");
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      id,
      name: insertBooking.name,
      email: insertBooking.email,
      phone: insertBooking.phone,
      bookingType: insertBooking.bookingType || "direct",
      klookBookingId: insertBooking.klookBookingId || null,
      naverReservationId: insertBooking.naverReservationId || null,
      naverBaseAmount: insertBooking.naverBaseAmount || null,
      naverMetadata: insertBooking.naverMetadata || null,
      selectedDrink: insertBooking.selectedDrink || null,
      drinkTemperature: insertBooking.drinkTemperature || null,
      youtubeTrackUrl: insertBooking.youtubeTrackUrl || null,
      selectedAddons: insertBooking.selectedAddons || [],
      selectedPartnerAddons: insertBooking.selectedPartnerAddons || [],
      lpDeliveryAddress: insertBooking.lpDeliveryAddress || null,
      bookingDate: insertBooking.bookingDate || null,
      bookingTime: insertBooking.bookingTime || null,
      totalPrice: 0, // Will be calculated separately
      status: "pending",
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);

    // Mark the time slot as unavailable (only for direct bookings with date/time)
    if (booking.bookingDate && booking.bookingTime) {
      const timeSlot = Array.from(this.timeSlots.values()).find(
        slot => slot.date === booking.bookingDate && slot.time === booking.bookingTime
      );
      if (timeSlot) {
        timeSlot.isAvailable = false;
      }
    }

    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
    }
    return booking;
  }

  async updateBookingPaymentStatus(id: number, paymentStatus: string, paypalOrderId?: string, paidAmount?: number): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.paymentStatus = paymentStatus;
      if (paypalOrderId) booking.paypalOrderId = paypalOrderId;
      if (paidAmount !== undefined) booking.paidAmount = paidAmount;
    }
    return booking;
  }

  async getAvailableTimeSlots(date: string): Promise<TimeSlot[]> {
    console.log('Looking for timeslots on date:', date);
    console.log('Total timeslots in storage:', this.timeSlots.size);
    
    const allSlots = Array.from(this.timeSlots.values());
    const datesInStorage = Array.from(new Set(allSlots.map(slot => slot.date))).slice(0, 10);
    console.log('Sample dates in storage:', datesInStorage);
    
    const slotsForDate = allSlots.filter(slot => slot.date === date && slot.isAvailable);
    console.log(`Found ${slotsForDate.length} available slots for ${date}`);
    
    return slotsForDate;
  }

  async createTimeSlot(insertTimeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const id = this.currentTimeSlotId++;
    const timeSlot: TimeSlot = { ...insertTimeSlot, id, isAvailable: insertTimeSlot.isAvailable ?? true };
    this.timeSlots.set(id, timeSlot);
    return timeSlot;
  }

  async updateTimeSlotAvailability(id: number, isAvailable: boolean): Promise<TimeSlot | undefined> {
    const timeSlot = this.timeSlots.get(id);
    if (timeSlot) {
      timeSlot.isAvailable = isAvailable;
    }
    return timeSlot;
  }

  // Payment operations
  async createPaymentOrder(insertPaymentOrder: InsertPaymentOrder): Promise<PaymentOrder> {
    const id = this.currentPaymentOrderId++;
    const paymentOrder: PaymentOrder = {
      id,
      orderId: insertPaymentOrder.orderId,
      paymentKey: insertPaymentOrder.paymentKey || null,
      bookingId: insertPaymentOrder.bookingId,
      amount: insertPaymentOrder.amount,
      status: insertPaymentOrder.status || "ready",
      method: insertPaymentOrder.method || null,
      approvedAt: insertPaymentOrder.approvedAt || null,
      requestedAt: new Date(),
      failReason: insertPaymentOrder.failReason || null,
      cancelReason: insertPaymentOrder.cancelReason || null,
      customerName: insertPaymentOrder.customerName,
      customerEmail: insertPaymentOrder.customerEmail,
      customerPhone: insertPaymentOrder.customerPhone,
      isPartialCancelable: insertPaymentOrder.isPartialCancelable || false,
      receipt: insertPaymentOrder.receipt || null,
      checkoutUrl: insertPaymentOrder.checkoutUrl || null,
      metadata: insertPaymentOrder.metadata || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.paymentOrders.set(id, paymentOrder);
    return paymentOrder;
  }

  async getPaymentOrderByOrderId(orderId: string): Promise<PaymentOrder | undefined> {
    return Array.from(this.paymentOrders.values()).find(order => order.orderId === orderId);
  }

  async updatePaymentOrder(orderId: string, updates: Partial<PaymentOrder>): Promise<PaymentOrder> {
    const paymentOrder = await this.getPaymentOrderByOrderId(orderId);
    if (!paymentOrder) {
      throw new Error("Payment order not found");
    }

    const updatedOrder = {
      ...paymentOrder,
      ...updates,
      updatedAt: new Date(),
    };

    this.paymentOrders.set(paymentOrder.id, updatedOrder);
    return updatedOrder;
  }

  // Visitor photo operations (MemStorage doesn't support, use DatabaseStorage)
  async getAllVisitorPhotos(): Promise<VisitorPhoto[]> {
    return [];
  }

  async getVisitorPhoto(id: number): Promise<VisitorPhoto | undefined> {
    return undefined;
  }

  async createVisitorPhoto(photo: InsertVisitorPhoto): Promise<VisitorPhoto> {
    throw new Error("Visitor photos are not supported in MemStorage");
  }

  async updateVisitorPhotoStatus(id: number, isPrinted: boolean): Promise<VisitorPhoto | undefined> {
    return undefined;
  }

  async deleteVisitorPhoto(id: number): Promise<boolean> {
    return false;
  }

  // Visit reservation operations (MemStorage doesn't support)
  async getAllVisitReservations(): Promise<VisitReservation[]> {
    return [];
  }

  async getVisitReservation(id: number): Promise<VisitReservation | undefined> {
    return undefined;
  }

  async createVisitReservation(reservation: InsertVisitReservation): Promise<VisitReservation> {
    throw new Error("Visit reservations are not supported in MemStorage");
  }

  async updateVisitReservationStatus(id: number, status: string): Promise<VisitReservation | undefined> {
    return undefined;
  }

  async updateVisitReservationPayment(id: number, paymentStatus: string, paypalOrderId?: string): Promise<VisitReservation | undefined> {
    return undefined;
  }

  async deleteVisitReservation(id: number): Promise<boolean> {
    return false;
  }

  // Hotel booking operations (MemStorage doesn't support)
  async getAllHotelBookings(): Promise<HotelBooking[]> {
    return [];
  }

  async getHotelBooking(id: number): Promise<HotelBooking | undefined> {
    return undefined;
  }

  async createHotelBooking(booking: InsertHotelBooking): Promise<HotelBooking> {
    throw new Error("Hotel bookings are not supported in MemStorage");
  }

  async updateHotelBookingStatus(id: number, status: string): Promise<HotelBooking | undefined> {
    return undefined;
  }

  async deleteHotelBooking(id: number): Promise<boolean> {
    return false;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  private initialized = false;

  private async initializeTimeSlots() {
    try {
      // Always check if time slots need to be created
      const existingSlots = await db.select().from(timeSlots).limit(1);
      if (existingSlots.length > 0 && this.initialized) {
        console.log('Time slots already exist, skipping initialization');
        return;
      }

      console.log('Initializing time slots in database...');
      
      // Initialize time slots for the next 30 days
      const today = new Date();
      const timeSlotsList = [
        "10:00", "10:50", "11:40", "12:30", // Morning slots
        "13:00", "13:50", "14:40", "15:30", "16:20", "17:10", // Afternoon slots  
        "18:00", "18:50", "19:40", "20:30", "21:20", "22:00"  // Evening slots
      ];

      const slotsToInsert: any[] = [];
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        timeSlotsList.forEach(timeStr => {
          slotsToInsert.push({
            date: dateStr,
            time: timeStr,
            isAvailable: true,
          });
        });
      }
      
      await db.insert(timeSlots).values(slotsToInsert);
      console.log(`Initialized ${slotsToInsert.length} time slots in database`);
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing time slots:', error);
      this.initialized = true; // Mark as initialized even if failed to avoid infinite retries
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeTimeSlots();
    }
  }
  async getUser(id: number): Promise<User | undefined> {
    await this.ensureInitialized();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log("Searching for user:", username);
    const [user] = await db.select().from(users).where(eq(users.username, username));
    console.log("Found user:", user ? { id: user.id, username: user.username, isActive: user.isActive } : "not found");
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async createAdmin(admin: { email: string; username: string; password: string; role: string }): Promise<User> {
    const [newAdmin] = await db.insert(users).values(admin).returning();
    return newAdmin;
  }

  async getAllAdmins(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'admin'));
  }

  async updateUserStatus(userId: number, isActive: boolean): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ isActive })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async deleteAdmin(userId: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId));
    return (result.rowCount || 0) > 0;
  }

  async getAllPackages(): Promise<Package[]> {
    return await db.select().from(packages);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [newPackage] = await db.insert(packages).values(pkg).returning();
    return newPackage;
  }

  async getAllAddons(): Promise<Addon[]> {
    return await db.select().from(addons);
  }

  async getAddon(id: number): Promise<Addon | undefined> {
    const [addon] = await db.select().from(addons).where(eq(addons.id, id));
    return addon;
  }

  async createAddon(addon: InsertAddon): Promise<Addon> {
    const [newAddon] = await db.insert(addons).values(addon).returning();
    return newAddon;
  }

  async getAllPartnerAddons(partner: string): Promise<PartnerAddon[]> {
    return await db.select().from(partnerAddons).where(eq(partnerAddons.partner, partner));
  }

  async getPartnerAddon(id: number): Promise<PartnerAddon | undefined> {
    const [addon] = await db.select().from(partnerAddons).where(eq(partnerAddons.id, id));
    return addon;
  }

  async createPartnerAddon(addon: InsertPartnerAddon): Promise<PartnerAddon> {
    const [newAddon] = await db.insert(partnerAddons).values(addon).returning();
    return newAddon;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    // Add required totalPrice field
    const bookingData = {
      ...booking,
      totalPrice: 0, // Will be calculated by the route handler
    };
    const [newBooking] = await db.insert(bookings).values(bookingData).returning();
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  async updateBookingPaymentStatus(id: number, paymentStatus: string, paypalOrderId?: string, paidAmount?: number): Promise<Booking | undefined> {
    const updates: any = { paymentStatus };
    if (paypalOrderId) updates.paypalOrderId = paypalOrderId;
    if (paidAmount !== undefined) updates.paidAmount = paidAmount;
    
    const [updatedBooking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  async getAvailableTimeSlots(date: string): Promise<TimeSlot[]> {
    await this.ensureInitialized();
    return await db
      .select()
      .from(timeSlots)
      .where(and(eq(timeSlots.date, date), eq(timeSlots.isAvailable, true)));
  }

  async createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const [newTimeSlot] = await db.insert(timeSlots).values(timeSlot).returning();
    return newTimeSlot;
  }

  async updateTimeSlotAvailability(id: number, isAvailable: boolean): Promise<TimeSlot | undefined> {
    const [updatedTimeSlot] = await db
      .update(timeSlots)
      .set({ isAvailable })
      .where(eq(timeSlots.id, id))
      .returning();
    return updatedTimeSlot;
  }

  async createPaymentOrder(paymentOrder: InsertPaymentOrder): Promise<PaymentOrder> {
    const [newPaymentOrder] = await db.insert(paymentOrders).values(paymentOrder).returning();
    return newPaymentOrder;
  }

  async getPaymentOrderByOrderId(orderId: string): Promise<PaymentOrder | undefined> {
    const [paymentOrder] = await db
      .select()
      .from(paymentOrders)
      .where(eq(paymentOrders.orderId, orderId));
    return paymentOrder;
  }

  async updatePaymentOrder(orderId: string, updates: Partial<PaymentOrder>): Promise<PaymentOrder> {
    const [updatedPaymentOrder] = await db
      .update(paymentOrders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(paymentOrders.orderId, orderId))
      .returning();
    return updatedPaymentOrder;
  }

  // Visitor photo operations
  async getAllVisitorPhotos(): Promise<VisitorPhoto[]> {
    return await db.select().from(visitorPhotos).orderBy(desc(visitorPhotos.createdAt));
  }

  async getVisitorPhoto(id: number): Promise<VisitorPhoto | undefined> {
    const [photo] = await db.select().from(visitorPhotos).where(eq(visitorPhotos.id, id));
    return photo;
  }

  async createVisitorPhoto(photo: InsertVisitorPhoto): Promise<VisitorPhoto> {
    const [newPhoto] = await db.insert(visitorPhotos).values(photo).returning();
    return newPhoto;
  }

  async updateVisitorPhotoStatus(id: number, isPrinted: boolean): Promise<VisitorPhoto | undefined> {
    const [updatedPhoto] = await db
      .update(visitorPhotos)
      .set({ isPrinted })
      .where(eq(visitorPhotos.id, id))
      .returning();
    return updatedPhoto;
  }

  async deleteVisitorPhoto(id: number): Promise<boolean> {
    const result = await db.delete(visitorPhotos).where(eq(visitorPhotos.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Visit reservation operations (marketing customers)
  async getAllVisitReservations(): Promise<VisitReservation[]> {
    return await db.select().from(visitReservations).orderBy(desc(visitReservations.createdAt));
  }

  async getVisitReservation(id: number): Promise<VisitReservation | undefined> {
    const [reservation] = await db.select().from(visitReservations).where(eq(visitReservations.id, id));
    return reservation;
  }

  async createVisitReservation(reservation: InsertVisitReservation): Promise<VisitReservation> {
    const [newReservation] = await db.insert(visitReservations).values(reservation).returning();
    return newReservation;
  }

  async updateVisitReservationStatus(id: number, status: string): Promise<VisitReservation | undefined> {
    const [updated] = await db
      .update(visitReservations)
      .set({ status })
      .where(eq(visitReservations.id, id))
      .returning();
    return updated;
  }

  async updateVisitReservationPayment(id: number, paymentStatus: string, paypalOrderId?: string): Promise<VisitReservation | undefined> {
    const updates: any = { paymentStatus };
    if (paypalOrderId) updates.paypalOrderId = paypalOrderId;
    
    const [updated] = await db
      .update(visitReservations)
      .set(updates)
      .where(eq(visitReservations.id, id))
      .returning();
    return updated;
  }

  async deleteVisitReservation(id: number): Promise<boolean> {
    const result = await db.delete(visitReservations).where(eq(visitReservations.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Hotel booking operations
  async getAllHotelBookings(): Promise<HotelBooking[]> {
    return await db.select().from(hotelBookings).orderBy(desc(hotelBookings.createdAt));
  }

  async getHotelBooking(id: number): Promise<HotelBooking | undefined> {
    const [booking] = await db.select().from(hotelBookings).where(eq(hotelBookings.id, id));
    return booking;
  }

  async createHotelBooking(booking: InsertHotelBooking): Promise<HotelBooking> {
    const [newBooking] = await db.insert(hotelBookings).values(booking).returning();
    return newBooking;
  }

  async updateHotelBookingStatus(id: number, status: string): Promise<HotelBooking | undefined> {
    const [updated] = await db
      .update(hotelBookings)
      .set({ status })
      .where(eq(hotelBookings.id, id))
      .returning();
    return updated;
  }

  async deleteHotelBooking(id: number): Promise<boolean> {
    const result = await db.delete(hotelBookings).where(eq(hotelBookings.id, id));
    return (result.rowCount || 0) > 0;
  }
}

// Use DatabaseStorage for production with persistent data
export const storage = new DatabaseStorage();
