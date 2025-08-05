import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
        for (const addonIdStr of validatedData.selectedAddons) {
          const addonId = parseInt(addonIdStr);
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
      const { spawn } = require('child_process');
      
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

      ytDlp.on('close', (code: number) => {
        if (code === 0) {
          // Success - send file for download
          res.download(outputPath, `audio_${bookingId}_${videoId}.mp3`, (err) => {
            if (err) {
              console.error('Download error:', err);
              res.status(500).json({ message: "Failed to download file" });
            }
            // Clean up temporary file
            require('fs').unlink(outputPath, () => {});
          });
        } else {
          console.error('yt-dlp error:', errorOutput);
          res.status(500).json({ 
            message: "Failed to extract audio from YouTube video",
            error: errorOutput 
          });
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
