import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";
import { unlink } from "fs/promises";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Get available time slots for a specific date
  app.get("/api/timeslots/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const timeSlots = await storage.getAvailableTimeSlots(date);
      // Return just the time strings for easier frontend handling
      const availableTimes = timeSlots.map(slot => slot.time);
      res.json(availableTimes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time slots" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Calculate total price from addons only (no base package price)
      let totalPrice = 0;

      // Add addon prices
      if (validatedData.selectedAddons && validatedData.selectedAddons.length > 0) {
        for (const addonId of validatedData.selectedAddons) {
          const addon = await storage.getAddon(addonId);
          if (addon) {
            totalPrice += addon.price;
          }
        }
      }

      const bookingData = {
        ...validatedData,
        totalPrice,
        status: "confirmed" as const,
      };

      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
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

  // Admin routes
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/admin/bookings/:id/status", async (req, res) => {
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

  // Admin management routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      res.json(admins);
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Failed to fetch admin users" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const { email, username, role } = req.body;
      
      if (!email || !username) {
        return res.status(400).json({ message: "Email and username are required" });
      }

      const newAdmin = await storage.createAdmin({ email, username, role: role || "admin" });
      res.json({ 
        message: "Admin user created successfully", 
        user: { ...newAdmin, password: undefined } // Don't send password back
      });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  app.patch("/api/admin/users/:id/status", async (req, res) => {
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

  app.delete("/api/admin/users/:id", async (req, res) => {
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

  app.post("/api/admin/bookings/:id/send-email", async (req, res) => {
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
  app.post("/api/admin/download-youtube-audio", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
