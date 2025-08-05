import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PolicyDialogProps {
  type: "privacy" | "terms" | "cancellation";
  isOpen: boolean;
  onClose: () => void;
}

export default function PolicyDialog({ type, isOpen, onClose }: PolicyDialogProps) {
  const getTitle = () => {
    switch (type) {
      case "privacy":
        return "Privacy Policy";
      case "terms":
        return "Terms of Service";
      case "cancellation":
        return "Cancellation Policy";
      default:
        return "";
    }
  };

  const getContent = () => {
    switch (type) {
      case "privacy":
        return (
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
              <p className="mb-3">
                We collect information you provide directly to us, such as when you create an account, 
                make a booking, or contact us for support. This includes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Personal information (name, email address, phone number)</li>
                <li>Booking details and preferences</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communication records when you contact us</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Process and manage your bookings</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send booking confirmations and important updates</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Information Sharing</h3>
              <p className="mb-3">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Service providers who assist in operating our business</li>
                <li>Payment processors for transaction processing</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@k-recordingcafe.com or visit our studio in Sinsa-dong, Seoul.
              </p>
            </section>
          </div>
        );

      case "terms":
        return (
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-3">Acceptance of Terms</h3>
              <p>
                By accessing and using K-Recording Cafe's services, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Service Description</h3>
              <p className="mb-3">
                K-Recording Cafe provides professional recording studio services combined with a cafe experience. 
                Our services include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Recording studio sessions with professional equipment</li>
                <li>Audio mixing and mastering services</li>
                <li>Video recording and editing</li>
                <li>LP vinyl record production</li>
                <li>Global music distribution services</li>
                <li>Cafe and beverage services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Booking and Payment</h3>
              <p className="mb-3">
                Bookings can be made through our website or through authorized partners like Klook. 
                Payment terms include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Full payment is required at the time of booking</li>
                <li>Prices are subject to change without notice</li>
                <li>Additional services may incur extra charges</li>
                <li>Refunds are subject to our cancellation policy</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">User Responsibilities</h3>
              <p className="mb-3">Users agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Arrive on time for scheduled sessions</li>
                <li>Respect studio equipment and facilities</li>
                <li>Comply with studio rules and staff instructions</li>
                <li>Not engage in illegal or inappropriate activities</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Intellectual Property</h3>
              <p>
                Recordings made at our studio remain the intellectual property of the customer. 
                However, we reserve the right to use anonymized content for promotional purposes 
                with customer consent.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
              <p>
                K-Recording Cafe shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>
          </div>
        );

      case "cancellation":
        return (
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-3">Cancellation Policy Overview</h3>
              <p>
                We understand that plans can change. Our cancellation policy is designed to be fair 
                to both our customers and our business operations.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Direct Bookings</h3>
              <h4 className="font-semibold mb-2">Free Cancellation:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>Cancel up to 48 hours before your session for a full refund</li>
                <li>No questions asked, full refund processed within 5-7 business days</li>
              </ul>
              
              <h4 className="font-semibold mb-2">Late Cancellation:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>24-48 hours before session: 50% refund</li>
                <li>Less than 24 hours: 25% refund</li>
                <li>No-show: No refund</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Klook Bookings</h3>
              <p className="mb-3">
                For bookings made through Klook, the cancellation policy follows Klook's standard terms:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Free cancellation if cancelled more than 1 day before activity</li>
                <li>5% cancellation fee if cancelled between 1 day to 1 hour before</li>
                <li>10% cancellation fee if cancelled less than 1 hour before</li>
                <li>No refund for no-shows</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Additional Services</h3>
              <h4 className="font-semibold mb-2">LP Record Production:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>Once production begins (after recording session), no refunds available</li>
                <li>Can be cancelled up to 24 hours after recording session</li>
                <li>Delivery address changes accepted up to production start</li>
              </ul>

              <h4 className="font-semibold mb-2">Video Services:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>Raw footage: Can be cancelled during session</li>
                <li>Edited video: Can be cancelled up to 24 hours after session</li>
              </ul>

              <h4 className="font-semibold mb-2">Global Distribution:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Once distribution process begins, no refunds available</li>
                <li>Can be cancelled up to 48 hours after recording session</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Rescheduling</h3>
              <p className="mb-3">
                We offer flexible rescheduling options:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Free rescheduling up to 24 hours before your session</li>
                <li>Subject to studio availability</li>
                <li>Maximum of 2 reschedules per booking</li>
                <li>Same-day rescheduling may incur additional charges</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Weather and Emergency</h3>
              <p>
                In case of severe weather conditions or emergency situations that prevent 
                studio operations, full refunds or free rescheduling will be provided.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">How to Cancel</h3>
              <p className="mb-3">To cancel your booking:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Email us at booking@k-recordingcafe.com with your booking reference</li>
                <li>Call us at +82-2-1234-5678 during business hours</li>
                <li>Visit our studio in person at Sinsa-dong, Seoul</li>
                <li>For Klook bookings, use the Klook app or website</li>
              </ul>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Effective Date: January 1, 2025
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {getContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}