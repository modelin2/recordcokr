import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";
import { unlink } from "fs/promises";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

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
  // Simple login endpoint (for demo - in production use proper authentication)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("로그인 요청:", { username, password: "***" });
      
      if (!username || !password) {
        console.log("필수 정보 누락");
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      console.log("사용자 조회 결과:", user ? { id: user.id, username: user.username, email: user.email } : "사용자 없음");
      
      if (!user || user.password !== password) {
        console.log("인증 실패:", !user ? "사용자 없음" : "비밀번호 불일치");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        console.log("비활성 계정");
        return res.status(401).json({ message: "Account is disabled" });
      }

      req.session.userId = user.id;
      console.log("로그인 성공:", { userId: user.id, username: user.username });
      res.json({ message: "Login successful", user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current user
  app.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
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

  // TossPayments integration routes
  
  // Create payment order
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const { bookingId, customerName, customerEmail, customerPhone } = req.body;

      if (!bookingId || !customerName || !customerEmail || !customerPhone) {
        return res.status(400).json({ 
          message: "Missing required payment information" 
        });
      }

      // Get booking details
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Generate unique order ID
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create payment order
      const paymentOrder = await storage.createPaymentOrder({
        orderId,
        bookingId,
        amount: booking.totalPrice,
        customerName,
        customerEmail,
        customerPhone,
      });

      res.json(paymentOrder);
    } catch (error: any) {
      console.error("Create payment order error:", error);
      res.status(500).json({ message: "Failed to create payment order" });
    }
  });

  // Confirm payment with TossPayments
  app.post("/api/payments/confirm", async (req, res) => {
    try {
      const { paymentKey, orderId, amount } = req.body;

      if (!paymentKey || !orderId || !amount) {
        return res.status(400).json({ 
          message: "Missing required payment confirmation data" 
        });
      }

      // Get TossPayments secret key from environment
      const secretKey = process.env.TOSS_SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ 
          message: "TossPayments secret key not configured" 
        });
      }

      // Confirm payment with TossPayments API
      const confirmResponse = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: parseInt(amount),
        }),
      });

      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json();
        console.error("TossPayments confirm error:", errorData);
        return res.status(400).json({ 
          message: "Payment confirmation failed",
          error: errorData 
        });
      }

      const paymentData = await confirmResponse.json();

      // Update payment order status
      const updatedPayment = await storage.updatePaymentOrder(orderId, {
        paymentKey,
        status: "done",
        method: paymentData.method,
        approvedAt: new Date(paymentData.approvedAt),
        receipt: paymentData.receipt?.url,
      });

      // Update booking status to confirmed
      await storage.updateBookingStatus(updatedPayment.bookingId, "confirmed");

      res.json(paymentData);
    } catch (error: any) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  // Get payment status
  app.get("/api/payments/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const paymentOrder = await storage.getPaymentOrderByOrderId(orderId);
      
      if (!paymentOrder) {
        return res.status(404).json({ message: "Payment order not found" });
      }

      res.json(paymentOrder);
    } catch (error: any) {
      console.error("Get payment error:", error);
      res.status(500).json({ message: "Failed to get payment status" });
    }
  });

  // Cancel payment
  app.post("/api/payments/:orderId/cancel", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { cancelReason } = req.body;

      const paymentOrder = await storage.getPaymentOrderByOrderId(orderId);
      if (!paymentOrder || !paymentOrder.paymentKey) {
        return res.status(404).json({ message: "Payment not found or not confirmed" });
      }

      const secretKey = process.env.TOSS_SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ 
          message: "TossPayments secret key not configured" 
        });
      }

      // Cancel payment with TossPayments API
      const cancelResponse = await fetch(`https://api.tosspayments.com/v1/payments/${paymentOrder.paymentKey}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancelReason: cancelReason || "고객 요청",
        }),
      });

      if (!cancelResponse.ok) {
        const errorData = await cancelResponse.json();
        console.error("TossPayments cancel error:", errorData);
        return res.status(400).json({ 
          message: "Payment cancellation failed",
          error: errorData 
        });
      }

      const cancelData = await cancelResponse.json();

      // Update payment order status
      await storage.updatePaymentOrder(orderId, {
        status: "canceled",
        cancelReason: cancelReason || "고객 요청",
      });

      // Update booking status back to pending
      await storage.updateBookingStatus(paymentOrder.bookingId, "pending");

      res.json(cancelData);
    } catch (error: any) {
      console.error("Payment cancellation error:", error);
      res.status(500).json({ message: "Failed to cancel payment" });
    }
  });

  // Payment API endpoints
  app.post('/api/payments/initialize', async (req, res) => {
    try {
      const { bookingId, amount, customerName, customerEmail } = req.body;

      console.log('Payment initialization request:', { bookingId, amount, customerName, customerEmail });
      
      if (!bookingId || !amount || !customerName || !customerEmail) {
        console.log('Missing required fields:', { 
          bookingId: !!bookingId, 
          amount: !!amount, 
          customerName: !!customerName, 
          customerEmail: !!customerEmail 
        });
        return res.status(400).json({
          success: false,
          message: '필수 결제 정보가 누락되었습니다.'
        });
      }

      // Generate unique order ID
      const orderId = `booking-${bookingId}-${Date.now()}`;
      
      // Create payment record in storage
      const payment = await storage.createPaymentOrder({
        bookingId: parseInt(bookingId),
        amount: parseInt(amount),
        orderId,
        status: 'ready',
        customerName,
        customerEmail,
        customerPhone: '',
      });

      res.json({
        success: true,
        orderId: payment.orderId,
        message: '결제가 초기화되었습니다.'
      });
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      res.status(500).json({
        success: false,
        message: '결제 초기화 중 오류가 발생했습니다.'
      });
    }
  });

  app.post('/api/payments/confirm', async (req, res) => {
    try {
      const { paymentKey, orderId, amount } = req.body;

      if (!paymentKey || !orderId || !amount) {
        return res.status(400).json({
          success: false,
          message: '결제 확인 정보가 누락되었습니다.'
        });
      }

      // Confirm payment with TossPayments
      const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: parseInt(amount.toString()),
        }),
      });

      const tossData = await tossResponse.json();

      if (tossResponse.ok) {
        // Update payment status in storage
        const payment = await storage.updatePaymentOrder(orderId, {
          paymentKey,
          status: 'done',
          method: tossData.method,
          approvedAt: new Date(tossData.approvedAt),
          receipt: tossData.receipt?.url,
        });

        // Update booking status to confirmed
        if (payment) {
          await storage.updateBookingStatus(payment.bookingId, 'confirmed');
          const booking = await storage.getBooking(payment.bookingId);

          res.json({
            success: true,
            message: '결제가 성공적으로 완료되었습니다.',
            data: {
              payment: {
                ...payment,
                method: tossData.method,
                approvedAt: tossData.approvedAt,
              },
              booking,
            }
          });
        } else {
          throw new Error('결제 업데이트 실패');
        }
      } else {
        // Handle payment failure
        await storage.updatePaymentOrder(orderId, {
          status: 'aborted',
          failReason: tossData.message || '결제 실패'
        });
        
        res.status(400).json({
          success: false,
          message: tossData.message || '결제 확인에 실패했습니다.'
        });
      }
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      res.status(500).json({
        success: false,
        message: '결제 확인 중 오류가 발생했습니다.'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
