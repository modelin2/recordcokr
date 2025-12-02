import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";
import { unlink } from "fs/promises";
import { insertBookingSchema, insertNaverBookingSchema, insertVisitorPhotoSchema } from "@shared/schema";
import { z } from "zod";
import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini AI with Replit AI Integrations
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: { 
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL 
  }
});

// Life stage prompt configurations - childhood to future music journey
const lifeStagePrompts = {
  "infancy": {
    name: "Infancy",
    nameKr: "유아기",
    ageRange: "0-2세",
    clothing: [
      "wearing a cute baby onesie with musical notes pattern",
      "wearing a soft pastel-colored baby outfit with a tiny bow tie",
      "wearing a cozy knitted baby sweater and tiny pants",
      "wearing an adorable baby romper with cartoon characters"
    ],
    pose: [
      "sitting on a blanket holding a tiny acoustic guitar that is bigger than the baby, looking curious",
      "sitting on the floor reaching for piano keys with tiny fingers, eyes wide with wonder",
      "lying on a soft mat holding a colorful rattle like a microphone, giggling",
      "sitting in a baby chair banging on a small toy drum with chubby hands"
    ],
    background: [
      "background is a warm cozy living room with soft natural light from a window",
      "background is a nursery room with pastel walls and wooden toys",
      "background is a sunny playroom with stuffed animals",
      "background is a family home interior with vintage wallpaper from the 80s"
    ],
    style: [
      "1980s home photography style, heavy sepia tone, faded colors, soft focus, nostalgic family album feel, slight yellowing, vintage Polaroid aesthetic",
      "old film camera quality, warm brown tones, gentle blur, the photo looks like it was taken 30+ years ago",
      "classic 80s baby photo style, overexposed highlights, muted pastel colors, authentic vintage snapshot"
    ]
  },
  "middleschool": {
    name: "Middle School",
    nameKr: "중학교",
    ageRange: "14-15세",
    clothing: [
      "wearing a Korean middle school uniform with a blazer",
      "wearing casual band practice clothes - graphic t-shirt and jeans",
      "wearing a cool hoodie with headphones around neck",
      "wearing trendy 2000s youth fashion, slightly rebellious style"
    ],
    pose: [
      "playing electric guitar intensely in a school band practice room",
      "sitting behind a drum set, drumsticks in hand, looking cool",
      "singing passionately into a microphone at a school festival",
      "playing bass guitar with friends in a garage band setup"
    ],
    background: [
      "background is a school band practice room with instruments and amplifiers",
      "background is a small garage converted into a band practice space",
      "background is a school festival stage with simple lighting",
      "background is a music academy band room with posters of rock bands"
    ],
    style: [
      "mid 2000s digital photo quality, decent resolution but still has that era's color processing, authentic youth band photo",
      "2000s camera phone quality mixed with digital camera, casual snapshot aesthetic, energetic youth vibe",
      "early social media era photo style, slightly over-processed colors, typical of Cyworld or early Facebook uploads"
    ]
  },
  "future": {
    name: "Hanbok Star",
    nameKr: "미래",
    ageRange: "한복스타",
    clothing: [
      "wearing a gorgeous traditional Korean hanbok (jeogori and chima for women, durumagi and baji for men) with luxurious silk fabric and intricate embroidery, NOT modernized hanbok",
      "wearing an elegant authentic Korean traditional hanbok with beautiful color combinations like pink jeogori with blue chima or navy durumagi, with golden embroidery details",
      "wearing a stunning classic hanbok in royal style, traditional silhouette with wide sleeves and flowing skirt or loose pants, precious fabric with traditional patterns"
    ],
    pose: [
      "waving gracefully to the audience like a star at an award ceremony, confident smile",
      "waving elegantly with one hand raised, standing like a celebrity receiving applause",
      "smiling warmly and waving to fans, looking like a beloved star at a traditional ceremony",
      "standing proudly and waving with both hands, like receiving a cultural award"
    ],
    background: [
      "background is a prestigious award ceremony stage with elegant lighting and traditional Korean decorative elements",
      "background is a grand award show venue with red carpet and cameras flashing",
      "background is a beautiful stage with traditional Korean palace-style backdrop",
      "background is a glamorous ceremony hall with spotlights and audience applauding"
    ],
    style: [
      "professional award show photography, elegant lighting, 8K quality, glamorous atmosphere, celebrity portrait style",
      "magazine cover quality, perfect studio lighting, high fashion editorial with traditional elegance",
      "broadcast award ceremony quality, warm glamorous lighting, Korean Wave star aesthetic"
    ]
  }
};

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTransformPromptForLifeStage(stage: keyof typeof lifeStagePrompts, personCount: number = 1): string {
  const config = lifeStagePrompts[stage];
  const clothing = getRandomElement(config.clothing);
  const pose = getRandomElement(config.pose);
  const background = getRandomElement(config.background);
  const style = getRandomElement(config.style);
  
  if (stage === "future") {
    if (personCount === 2) {
      return `Transform the TWO people in this photo into famous Korean stars at an award ceremony wearing traditional hanbok. IMPORTANT: Keep BOTH people's facial features exactly the same. Men should wear traditional male hanbok (durumagi or baji-jeogori), women should wear traditional female hanbok (jeogori and chima). NOT modernized hanbok, traditional authentic hanbok only. Both people should be ${clothing}, ${pose}, ${background}. Apply this visual style: ${style}. Make it look like a prestigious award ceremony photo featuring both of them together as beloved Korean stars known for looking beautiful in traditional hanbok.`;
    }
    return `Transform the person in this photo into a famous Korean star at an award ceremony wearing traditional hanbok. IMPORTANT: Keep the same facial features. If the person appears male, dress them in traditional male hanbok (durumagi or baji-jeogori). If the person appears female, dress them in traditional female hanbok (jeogori and chima). NOT modernized hanbok, traditional authentic Korean hanbok only. They should be ${clothing}, ${pose}, ${background}. Apply this visual style: ${style}. Make it look like a prestigious award ceremony photo of a beloved Korean star known for looking beautiful in traditional hanbok.`;
  }
  
  if (personCount === 2) {
    return `Transform the TWO people in this photo into ${config.ageRange} old children versions of themselves. IMPORTANT: Keep BOTH people's facial features exactly the same, just make them younger as ${config.nameKr} (${config.name}) aged children. Both children should be ${clothing}, ${pose}, ${background}. Apply authentic vintage photography style: ${style}. This should look like a real childhood photo from a family album, showing both people as young children enjoying music together.`;
  }
  
  return `Transform the person in this photo into a ${config.ageRange} old child version of themselves. IMPORTANT: Keep the same facial features, just make them younger as a ${config.nameKr} (${config.name}) aged child. The child should be ${clothing}, ${pose}, ${background}. Apply authentic vintage photography style: ${style}. This should look like a real childhood photo from a family album, showing what this person looked like as a young child enjoying music.`;
}

// Simple session middleware for demo purposes
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

// Middleware to check if user is authenticated
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Middleware to check if user is admin or super_admin
const requireAdmin = async (req: any, res: any, next: any) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication error" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Optimized login endpoint for production
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      // Trim whitespace and validate input
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      if (!trimmedUsername || !trimmedPassword) {
        return res.status(400).json({ message: "Invalid username or password format" });
      }

      const user = await storage.getUserByUsername(trimmedUsername);
      
      if (!user || user.password !== trimmedPassword) {
        // Add small delay to prevent timing attacks
        await new Promise(resolve => setTimeout(resolve, 200));
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is disabled" });
      }

      // Set session user ID directly for better compatibility
      req.session.userId = user.id;
      
      // Add a delay to ensure session is saved before responding
      setTimeout(() => {
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
            return res.status(500).json({ message: "Login failed" });
          }
          
          console.log("Session saved successfully. User ID:", req.session.userId);
          console.log("Session ID:", req.session.id);
          console.log("Cookie settings:", req.session.cookie);
          
          res.json({ 
            message: "Login successful", 
            user: { 
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              isActive: user.isActive,
              createdAt: user.createdAt
            } 
          });
        });
      }, 100); // Small delay to ensure session persistence
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current user with detailed logging
  app.get("/api/auth/user", async (req, res) => {
    try {
      console.log("Auth check - Session ID:", req.session.id);
      console.log("Auth check - User ID in session:", req.session.userId);
      
      if (!req.session?.userId) {
        console.log("No session or user ID found");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(req.session.userId);
      console.log("Found user:", user ? { id: user.id, username: user.username, role: user.role } : "not found");
      
      if (!user) {
        console.log("User not found in database");
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isActive) {
        console.log("User account is inactive");
        return res.status(401).json({ message: "Account is disabled" });
      }

      res.json({ 
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error("Auth user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Optimized logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({ message: "Logout successful" });
      });
    } else {
      res.json({ message: "Already logged out" });
    }
  });

  // Get all packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // Get all addons
  app.get("/api/addons", async (req, res) => {
    try {
      const addons = await storage.getAllAddons();
      res.json(addons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch addons" });
    }
  });

  // Get all Naver partner addons (50% discount)
  app.get("/api/naver/addons", async (req, res) => {
    try {
      const naverAddons = await storage.getAllPartnerAddons("naver");
      res.json(naverAddons);
    } catch (error) {
      console.error("Failed to fetch Naver addons:", error);
      res.status(500).json({ message: "Failed to fetch Naver addons" });
    }
  });

  // Get available time slots for a specific date
  app.get("/api/timeslots/:date", async (req, res) => {
    try {
      const { date } = req.params;
      console.log('Fetching timeslots for date:', date);
      const timeSlots = await storage.getAvailableTimeSlots(date);
      console.log('Found timeslots:', timeSlots.length);
      // Return just the time strings for easier frontend handling
      const availableTimes = timeSlots.map(slot => slot.time);
      console.log('Available times:', availableTimes);
      res.json(availableTimes);
    } catch (error) {
      console.error('Timeslot fetch error:', error);
      res.status(500).json({ message: "Failed to fetch time slots" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Calculate time-based price for direct bookings
      let basePrice = 0;
      if (validatedData.bookingType === "direct" && validatedData.bookingTime) {
        const time = validatedData.bookingTime;
        const hour = parseInt(time.split(':')[0]);
        const minute = parseInt(time.split(':')[1]);
        const timeInMinutes = hour * 60 + minute;
        
        // Time-based pricing in Korean won
        if (timeInMinutes >= 600 && timeInMinutes <= 770) {
          // AM10:00~PM12:50 - ₩40,000
          basePrice = 40000;
        } else if (timeInMinutes >= 780 && timeInMinutes <= 1070) {
          // PM01:00~PM05:50 - ₩50,000  
          basePrice = 50000;
        } else if (timeInMinutes >= 1080 && timeInMinutes <= 1320) {
          // PM06:00~PM10:00 - ₩44,000
          basePrice = 44000;
        }
      }

      // Add addon prices
      let addonPrice = 0;
      if (validatedData.selectedAddons && validatedData.selectedAddons.length > 0) {
        for (const addonId of validatedData.selectedAddons) {
          const addon = await storage.getAddon(addonId);
          if (addon) {
            addonPrice += addon.price;
          }
        }
      }

      const totalPrice = basePrice + addonPrice;

      const bookingData = {
        ...validatedData,
        // For direct bookings, bookingDate and bookingTime are required and already set
        // For klook bookings, these can be null
        bookingDate: validatedData.bookingType === "klook" && !validatedData.bookingDate ? undefined : validatedData.bookingDate,
        bookingTime: validatedData.bookingType === "klook" && !validatedData.bookingTime ? undefined : validatedData.bookingTime,
        totalPrice,
        status: "pending" as const,
      };

      const booking = await storage.createBooking(bookingData);
      console.log('Created booking response:', booking);
      res.json(booking);
    } catch (error) {
      console.error("Booking creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create booking" });
      }
    }
  });

  // Get all bookings (for admin purposes)
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Create a Naver booking with partner addons
  app.post("/api/naver/bookings", async (req, res) => {
    try {
      const validatedData = insertNaverBookingSchema.parse(req.body);
      
      // Calculate addon prices from partner addons
      let addonPrice = 0;
      if (validatedData.selectedPartnerAddons && validatedData.selectedPartnerAddons.length > 0) {
        for (const addonId of validatedData.selectedPartnerAddons) {
          const addon = await storage.getPartnerAddon(addonId);
          if (addon && !addon.isManualProcessing) {
            addonPrice += addon.discountedPrice;
          }
        }
      }

      // For Naver bookings, base amount is already paid via Naver
      // totalPrice represents only the addon upsell amount
      const totalPrice = addonPrice;

      const bookingData = {
        ...validatedData,
        totalPrice,
        status: "pending" as const,
      };

      const booking = await storage.createBooking(bookingData);
      console.log('Created Naver booking:', booking);
      res.json(booking);
    } catch (error) {
      console.error("Naver booking creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create Naver booking" });
      }
    }
  });

  // Admin routes (require admin access)
  app.get("/api/admin/bookings", requireAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/admin/bookings/:id/status", requireAdmin, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const booking = await storage.updateBookingStatus(bookingId, status);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(booking);
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Admin management routes (require admin access)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      res.json(admins);
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Failed to fetch admin users" });
    }
  });

  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const { email, username, password, role } = req.body;
      
      if (!email || !username || !password) {
        return res.status(400).json({ message: "Email, username, and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      const newAdmin = await storage.createAdmin({ email, username, password, role: role || "admin" });
      res.json({ 
        message: "Admin user created successfully", 
        user: { ...newAdmin, password: undefined } // Don't send password back
      });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  app.patch("/api/admin/users/:id/status", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { isActive } = req.body;
      
      const updatedUser = await storage.updateUserStatus(userId, isActive);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User status updated successfully", user: updatedUser });
    } catch (error: any) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      const deleted = await storage.deleteAdmin(userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      res.json({ message: "Admin user deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting admin:", error);
      res.status(500).json({ message: "Failed to delete admin user" });
    }
  });

  app.post("/api/admin/bookings/:id/send-email", requireAdmin, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { subject, message } = req.body;
      
      if (!subject || !message) {
        return res.status(400).json({ message: "Subject and message are required" });
      }

      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // For now, we'll just simulate email sending
      // In a real app, you would integrate with SendGrid or another email service
      console.log(`Sending email to ${booking.email}:`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      res.json({ 
        message: "Email sent successfully",
        recipient: booking.email,
        subject,
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // YouTube audio download endpoint
  app.post("/api/admin/download-youtube-audio", requireAdmin, async (req, res) => {
    try {
      const { youtubeUrl, bookingId } = req.body;
      
      if (!youtubeUrl) {
        return res.status(400).json({ message: "YouTube URL is required" });
      }

      // Extract video ID from URL for filename
      const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : 'unknown';
      
      const outputPath = `/tmp/audio_${bookingId}_${videoId}.mp3`;
      
      // Use yt-dlp to extract audio
      const ytDlp = spawn('yt-dlp', [
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', '192K',
        '-o', outputPath,
        youtubeUrl
      ]);

      let errorOutput = '';
      
      ytDlp.stderr.on('data', (data: Buffer) => {
        errorOutput += data.toString();
      });

      ytDlp.on('close', async (code: number) => {
        if (code === 0) {
          // Success - send file for download
          res.download(outputPath, `audio_${bookingId}_${videoId}.mp3`, async (err) => {
            if (err) {
              console.error('Download error:', err);
              if (!res.headersSent) {
                res.status(500).json({ message: "Failed to download file" });
              }
            }
            // Clean up temporary file
            try {
              await unlink(outputPath);
            } catch (unlinkErr) {
              console.error('Failed to delete temp file:', unlinkErr);
            }
          });
        } else {
          console.error('yt-dlp error:', errorOutput);
          if (!res.headersSent) {
            // Check if it's a bot protection error
            if (errorOutput.includes("Sign in to confirm you're not a bot")) {
              res.status(500).json({ 
                message: "YouTube는 현재 봇 보호 정책으로 인해 다운로드가 제한되었습니다. 실제 서비스에서는 유료 API나 대안 방법을 사용해야 합니다.",
                error: "YouTube bot protection activated" 
              });
            } else {
              res.status(500).json({ 
                message: "YouTube 영상에서 음원 추출에 실패했습니다",
                error: errorOutput 
              });
            }
          }
        }
      });

    } catch (error: any) {
      console.error("Error downloading YouTube audio:", error);
      res.status(500).json({ message: "Failed to process download request" });
    }
  });

  // ==================== Visitor Photo Routes ====================

  // Get all visitor photos (admin only)
  app.get("/api/photos", requireAdmin, async (req, res) => {
    try {
      const photos = await storage.getAllVisitorPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Error fetching visitor photos:", error);
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  // Get single visitor photo
  app.get("/api/photos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.getVisitorPhoto(id);
      
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.json(photo);
    } catch (error) {
      console.error("Error fetching photo:", error);
      res.status(500).json({ message: "Failed to fetch photo" });
    }
  });

  // Upload visitor photo (admin only)
  app.post("/api/photos", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertVisitorPhotoSchema.parse(req.body);
      const photo = await storage.createVisitorPhoto(validatedData);
      res.status(201).json(photo);
    } catch (error) {
      console.error("Error creating visitor photo:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid photo data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create photo" });
    }
  });

  // Update photo print status
  app.patch("/api/photos/:id/print", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isPrinted } = req.body;
      
      const updatedPhoto = await storage.updateVisitorPhotoStatus(id, isPrinted);
      
      if (!updatedPhoto) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.json(updatedPhoto);
    } catch (error) {
      console.error("Error updating photo status:", error);
      res.status(500).json({ message: "Failed to update photo status" });
    }
  });

  // Delete visitor photo
  app.delete("/api/photos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVisitorPhoto(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.json({ message: "Photo deleted successfully" });
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Get customer names from bookings for photo selection
  app.get("/api/photos/customers/list", requireAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      const customers = bookings.map(b => ({
        id: b.id,
        name: b.name,
        bookingDate: b.bookingDate,
        bookingTime: b.bookingTime,
        selectedDrink: b.selectedDrink,
        drinkTemperature: b.drinkTemperature,
        createdAt: b.createdAt
      }));
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // AI Image Generation API - Generate life stage images using Gemini with source photo
  app.post("/api/photos/generate-ai", requireAdmin, async (req, res) => {
    try {
      const { lifeStage, sourceImageBase64 } = req.body;
      
      if (!sourceImageBase64 || !lifeStage) {
        return res.status(400).json({ message: "Source image and life stage are required" });
      }
      
      const validStages = ["infancy", "kindergarten", "elementary", "middleschool"];
      if (!validStages.includes(lifeStage)) {
        return res.status(400).json({ message: "Invalid life stage. Must be one of: infancy, kindergarten, elementary, middleschool" });
      }
      
      const prompt = generateTransformPromptForLifeStage(lifeStage as keyof typeof lifeStagePrompts);
      console.log(`Generating ${lifeStage} image with prompt: ${prompt}`);
      
      const base64Data = sourceImageBase64.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = sourceImageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ 
          role: "user", 
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: prompt }
          ] 
        }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        }
      });
      
      let imageData = null;
      let textResponse = "";
      
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.mimeType?.startsWith("image/")) {
            imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
          if (part.text) {
            textResponse = part.text;
          }
        }
      }
      
      if (!imageData) {
        console.log("No image generated, response:", textResponse);
        return res.status(500).json({ message: "Failed to generate image", details: textResponse });
      }
      
      const stageConfig = lifeStagePrompts[lifeStage as keyof typeof lifeStagePrompts];
      
      res.json({ 
        success: true, 
        imageData,
        lifeStage,
        stageName: stageConfig.name,
        stageNameKr: stageConfig.nameKr,
        ageRange: stageConfig.ageRange,
        prompt
      });
    } catch (error: any) {
      console.error("Error generating AI image:", error);
      res.status(500).json({ message: "Failed to generate AI image", error: error.message });
    }
  });

  // Generate all 3 life stage images at once using the uploaded source photo (1 person)
  app.post("/api/photos/generate-all-stages", requireAdmin, async (req, res) => {
    try {
      const { sourceImageBase64, personCount = 1 } = req.body;
      
      if (!sourceImageBase64) {
        return res.status(400).json({ message: "Source image is required" });
      }
      
      const base64Data = sourceImageBase64.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = sourceImageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
      
      // 3 stages: infancy, middleschool, future
      const stages: (keyof typeof lifeStagePrompts)[] = ["infancy", "middleschool", "future"];
      const results: any[] = [];
      
      // Generate images sequentially to avoid rate limiting
      for (const stage of stages) {
        const prompt = generateTransformPromptForLifeStage(stage, personCount);
        console.log(`Generating ${stage} image (${personCount} person) with prompt: ${prompt}`);
        
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [{ 
              role: "user", 
              parts: [
                { inlineData: { mimeType, data: base64Data } },
                { text: prompt }
              ] 
            }],
            config: {
              responseModalities: [Modality.TEXT, Modality.IMAGE],
            }
          });
          
          let imageData = null;
          
          if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData?.mimeType?.startsWith("image/")) {
                imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              }
            }
          }
          
          const stageConfig = lifeStagePrompts[stage];
          results.push({
            lifeStage: stage,
            stageName: stageConfig.name,
            stageNameKr: stageConfig.nameKr,
            ageRange: stageConfig.ageRange,
            imageData,
            prompt,
            success: !!imageData
          });
        } catch (stageError: any) {
          console.error(`Error generating ${stage} image:`, stageError);
          const stageConfig = lifeStagePrompts[stage];
          results.push({
            lifeStage: stage,
            stageName: stageConfig.name,
            stageNameKr: stageConfig.nameKr,
            ageRange: stageConfig.ageRange,
            imageData: null,
            prompt,
            success: false,
            error: stageError.message
          });
        }
        
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      res.json({ 
        success: true, 
        results
      });
    } catch (error: any) {
      console.error("Error generating all life stage images:", error);
      res.status(500).json({ message: "Failed to generate images", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
