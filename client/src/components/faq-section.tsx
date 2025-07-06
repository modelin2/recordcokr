import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Do I need any recording experience?",
    answer: "Not at all! Our professional sound engineers will guide you through the entire process. We welcome complete beginners and help you create your K-pop dream regardless of your experience level."
  },
  {
    question: "Can I record in languages other than Korean?",
    answer: "Yes! You can record in any language you're comfortable with - English, Japanese, Chinese, or your native language. Many international visitors record covers of K-pop songs in their own language."
  },
  {
    question: "How long does a recording session take?",
    answer: "Sessions typically last 1-2 hours depending on your package. This includes time for setup, recording, and basic mixing. Our engineers ensure you get the perfect take without feeling rushed."
  },
  {
    question: "What's included in the base price?",
    answer: "Every session includes: premium drink of your choice, professional recording equipment, sound engineer assistance, raw audio files, and free self-photography time in our studio space."
  },
  {
    question: "Can I bring friends to watch?",
    answer: "Due to our intimate studio setup, each recording session is designed for one person only. However, friends can wait in our cafe area and join you for photos after your session."
  },
  {
    question: "Do you provide backing tracks?",
    answer: "Yes! We have an extensive library of K-pop instrumental tracks, or you can bring your own backing track. We can also help you find the perfect instrumental for your chosen song."
  },
  {
    question: "When will I receive my recordings?",
    answer: "Raw files are provided immediately after your session via USB or email. If you've purchased add-on mixing/mastering services, professionally mixed tracks are delivered within 3-5 business days."
  },
  {
    question: "Is there an age limit?",
    answer: "We welcome all ages! Minors under 16 should be accompanied by an adult. Our K-pop experience is perfect for teens, young adults, and anyone young at heart who loves Korean music."
  },
  {
    question: "Can I record original songs?",
    answer: "Absolutely! Bring your original lyrics or melodies, and our engineers will help you bring your creativity to life. We love supporting aspiring artists and original compositions."
  },
  {
    question: "What if I'm not satisfied with my recording?",
    answer: "We guarantee your satisfaction! If you're not happy with your recording, we offer free re-recording within the same session time. Our goal is to ensure you leave with a recording you absolutely love."
  },
  {
    question: "Do you offer group packages?",
    answer: "While individual sessions are for one person, we can arrange consecutive bookings for groups. Each member records separately, ensuring everyone gets individual attention and the best possible recording quality."
  },
  {
    question: "Can I use my recordings commercially?",
    answer: "For cover songs, you'll need to obtain proper licensing for commercial use. For original compositions, you retain full rights to your recordings. We can provide guidance on music licensing if needed."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Frequently Asked Questions</h2>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="glass rounded-2xl overflow-hidden border border-white/10"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <h3 className="text-xl font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="text-[hsl(var(--k-pink))] flex-shrink-0" size={24} />
                ) : (
                  <ChevronDown className="text-[hsl(var(--k-pink))] flex-shrink-0" size={24} />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-xl text-gray-300 mb-6">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="tel:+82-2-123-4567"
              className="k-gradient-pink-purple px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform text-white border-0 inline-block"
            >
              Call Us: +82-2-123-4567
            </a>
            <a 
              href="mailto:hello@studiovibes.kr"
              className="glass px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform text-white border-white/30 inline-block"
            >
              Email: hello@studiovibes.kr
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}