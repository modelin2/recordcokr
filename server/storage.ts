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

    // Initialize addons
    const memoryPack: Addon = {
      id: this.currentAddonId++,
      name: "Memory Pack",
      price: 50000,
      description: "Mixed & mastered complete song with backing track",
      icon: "fas fa-music",
    };

    const releasePack: Addon = {
      id: this.currentAddonId++,
      name: "Release Pack",
      price: 200000,
      description: "Custom backing track production + professional mixing",
      icon: "fas fa-star",
    };

    const globalRelease: Addon = {
      id: this.currentAddonId++,
      name: "Global Release",
      price: 300000,
      description: "Spotify, Apple Music & YouTube distribution",
      icon: "fas fa-globe",
    };

    const idolMakeup: Addon = {
      id: this.currentAddonId++,
      name: "Idol Makeup",
      price: 150000,
      description: "Professional K-pop idol styling",
      icon: "fas fa-palette",
    };

    const makingVideo: Addon = {
      id: this.currentAddonId++,
      name: "Making Video",
      price: 100000,
      description: "Behind-the-scenes recording footage",
      icon: "fas fa-video",
    };

    const videoEditing: Addon = {
      id: this.currentAddonId++,
      name: "Video + Editing",
      price: 300000,
      description: "Professional video recording and editing",
      icon: "fas fa-edit",
    };

    const musicVideo: Addon = {
      id: this.currentAddonId++,
      name: "Music Video",
      price: 1000000,
      description: "Full music video production with location shooting",
      icon: "fas fa-film",
    };

    this.addons.set(memoryPack.id, memoryPack);
    this.addons.set(releasePack.id, releasePack);
    this.addons.set(globalRelease.id, globalRelease);
    this.addons.set(idolMakeup.id, idolMakeup);
    this.addons.set(makingVideo.id, makingVideo);
    this.addons.set(videoEditing.id, videoEditing);
    this.addons.set(musicVideo.id, musicVideo);

    // Initialize time slots for the next 30 days
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Create time slots from 10:00 to 21:00 (every hour)
      for (let hour = 10; hour <= 21; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
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
      nickname: insertBooking.nickname || null,
      email: insertBooking.email,
      phone: insertBooking.phone,
      selectedDrink: insertBooking.selectedDrink,
      drinkTemperature: insertBooking.drinkTemperature || null,
      youtubeTrackUrl: insertBooking.youtubeTrackUrl,
      selectedAddons: insertBooking.selectedAddons || [],
      bookingDate: insertBooking.bookingDate,
      bookingTime: insertBooking.bookingTime,
      totalPrice: insertBooking.totalPrice,
      status: insertBooking.status || "confirmed",
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);

    // Mark the time slot as unavailable
    const timeSlot = Array.from(this.timeSlots.values()).find(
      slot => slot.date === booking.bookingDate && slot.time === booking.bookingTime
    );
    if (timeSlot) {
      timeSlot.isAvailable = false;
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
