import { Calendar, Clock, Music, Play } from "lucide-react";

export default function HowToUseSection() {
  return (
    <section id="how-to-use" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">How to Use Our Service</h2>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Follow these simple steps to enjoy your K-pop recording experience
        </p>
        
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="text-center">
            <div className="glass p-8 rounded-3xl mb-6 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[hsl(var(--k-pink))] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <Calendar className="text-[hsl(var(--k-pink))] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-3">Book on Klook</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Reserve your session through Klook platform. Choose your preferred date and time slot.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="glass p-8 rounded-3xl mb-6 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[hsl(var(--k-purple))] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <Clock className="text-[hsl(var(--k-purple))] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-3">Arrive 30 Min Early</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Come to the cafe 30 minutes before your reservation time to check in and prepare.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="glass p-8 rounded-3xl mb-6 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[hsl(var(--k-coral))] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <Music className="text-[hsl(var(--k-coral))] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-3">Submit Your Song</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Find your song's instrumental version on YouTube and submit the link to our staff.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="glass p-8 rounded-3xl mb-6 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[hsl(var(--k-blue))] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <Play className="text-[hsl(var(--k-blue))] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-3">Start Recording</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Enter the professional recording booth and create your K-pop masterpiece!
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-blue-500/20 border border-blue-500/40 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-blue-200 font-semibold mb-2">💡 Pro Tip</p>
            <p className="text-blue-100 text-sm leading-relaxed">
              Each session is 10 minutes time-based, not song-based. Plan your time wisely to make the most of your recording experience. 
              You can record multiple takes or even parts of different songs within your 10-minute slot.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}