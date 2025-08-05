import { 
  users, packages, addons, bookings, timeSlots,
  type User, type InsertUser,
  type Package, type InsertPackage,
  type Addon, type InsertAddon,
  type Booking, type InsertBooking,
  type TimeSlot, type InsertTimeSlot
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  
  getAllAddons(): Promise<Addon[]>;
  getAddon(id: number): Promise<Addon | undefined>;
  createAddon(addon: InsertAddon): Promise<Addon>;
  
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  getAvailableTimeSlots(date: string): Promise<TimeSlot[]>;
  createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot>;
  updateTimeSlotAvailability(id: number, isAvailable: boolean): Promise<TimeSlot | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private packages: Map<number, Package>;
  private addons: Map<number, Addon>;
  private bookings: Map<number, Booking>;
  private timeSlots: Map<number, TimeSlot>;
  private currentUserId: number;
  private currentPackageId: number;
  private currentAddonId: number;
  private currentBookingId: number;
  private currentTimeSlotId: number;

  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.addons = new Map();
    this.bookings = new Map();
    this.timeSlots = new Map();
    this.currentUserId = 1;
    this.currentPackageId = 1;
    this.currentAddonId = 1;
    this.currentBookingId = 1;
    this.currentTimeSlotId = 1;

    this.initializeData();
  }

  private initializeData() {
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
      price: 150000, // ₩150,000
      description: "실물 LP판을 만들어 준다. (제작기간 2~3주 소요된다.)",
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
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Create time slots from 10:00 to 22:00 (every 10 minutes)
      for (let hour = 10; hour <= 22; hour++) {
        for (let minute = 0; minute < 60; minute += 10) {
          // Skip creating slots after 22:00
          if (hour === 22 && minute > 0) break;
          
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const timeSlot: TimeSlot = {
            id: this.currentTimeSlotId++,
            date: dateStr,
            time: timeStr,
            isAvailable: true,
          };
          this.timeSlots.set(timeSlot.id, timeSlot);
        }
      }
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
      selectedDrink: insertBooking.selectedDrink,
      drinkTemperature: insertBooking.drinkTemperature || null,
      youtubeTrackUrl: insertBooking.youtubeTrackUrl,
      selectedAddons: insertBooking.selectedAddons || [],
      bookingDate: insertBooking.bookingDate || null,
      bookingTime: insertBooking.bookingTime || null,
      totalPrice: insertBooking.totalPrice,
      status: insertBooking.status || "confirmed",
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

  async getAvailableTimeSlots(date: string): Promise<TimeSlot[]> {
    return Array.from(this.timeSlots.values()).filter(
      slot => slot.date === date && slot.isAvailable
    );
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
}

export const storage = new MemStorage();
