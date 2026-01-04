import { useLocation } from "wouter";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin, Train, Clock, Phone, Camera, AlertTriangle, Calendar, Users } from "lucide-react";
import logoImage from "@assets/레코딩카페-한글로고_1764752892828.png";

export default function VisitConfirmationPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const people = searchParams.get("people") || "1";
  const name = searchParams.get("name") || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Link href="/">
            <img src={logoImage} alt="Logo" className="h-16 mx-auto mb-6 cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-2 border-green-500 shadow-xl">
            <CardContent className="pt-8 pb-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Reservation Confirmed!</h2>
              <p className="text-gray-600 text-center mb-6">
                Your payment has been received successfully.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Booking Details</h3>
                <div className="space-y-3">
                  {name && (
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Name
                      </span>
                      <span className="font-semibold text-gray-800">{decodeURIComponent(name)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date
                    </span>
                    <span className="font-semibold text-gray-800">{date}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Time
                    </span>
                    <span className="font-semibold text-gray-800">{time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Number of People
                    </span>
                    <span className="font-semibold text-gray-800">{people} {parseInt(people) === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-400 shadow-xl bg-orange-50">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                <Camera className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-orange-800 mb-2">Important: Please Screenshot This Page</h3>
                  <p className="text-orange-700">
                    We do not send confirmation emails or text messages. 
                    Please take a screenshot of this page as your booking confirmation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-400 shadow-xl bg-blue-50">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Please Arrive 30 Minutes Early</h3>
                  <p className="text-blue-700">
                    We recommend arriving at least 30 minutes before your scheduled time 
                    to complete check-in, choose your song, and prepare for your recording session.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">📍 How to Find Us</h3>
              
              <div className="max-w-sm mx-auto mb-6">
                <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.youtube.com/embed/PO2j8QzG3ZU"
                    title="Directions from Sinsa Station to Recording Cafe"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-center text-gray-500 text-sm mt-3">📍 Walk from Sinsa Station to Recording Cafe</p>
              </div>
              
              <p className="text-gray-600 text-center mb-6">
                Many visitors find it confusing to locate our recording cafe.<br />
                The easiest way is to go directly to <span className="text-pink-600 font-semibold">Riverside Hotel</span> first.<br />
                Our cafe is located just 1 minute from the main entrance of Riverside Hotel.
              </p>
              
              <div className="bg-gray-100 rounded-xl p-5 mb-6">
                <h4 className="font-bold text-gray-800 mb-3">From Sinsa Station Exit 5:</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Walk straight ahead for about 4 minutes toward Riverside Hotel</li>
                  <li>• Do not turn or change direction — just walk straight</li>
                  <li>• When you see Riverside Hotel,</li>
                  <li className="pl-4">→ Turn left once at the hotel</li>
                  <li className="pl-4">→ Walk about 1 minute</li>
                  <li className="pl-4">→ You will see the building on your left-hand side</li>
                </ul>
              </div>
              
              <p className="text-gray-600 text-center mb-4">
                Please enter through the main entrance, take the elevator to the <span className="text-purple-600 font-semibold">2nd floor</span>, and you will find our recording cafe.
              </p>
              
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200 mb-6">
                <p className="text-center text-gray-700">
                  📌 <span className="font-semibold">Tip:</span> If you search for "<span className="text-pink-600">Riverside Hotel Seoul</span>" on Google Maps or Naver Map, you will arrive very close to our location.
                </p>
              </div>

              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="text-pink-500" size={20} />
                  <span className="text-gray-700">2F. 21, Gangnam-daero 107-gil, Seocho-gu, Seoul</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Train className="text-purple-500" size={20} />
                  <span className="text-gray-700">4 mins walk from Sinsa Station (Line 3)</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Clock className="text-blue-500" size={20} />
                  <span className="text-gray-700">Open Daily: 12:00 PM - 09:00 PM</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="text-orange-500" size={20} />
                  <span className="text-gray-700">+82-2-6959-9338</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Link href="/">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
