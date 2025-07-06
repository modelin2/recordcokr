export default function Footer() {
  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-6 text-center">
        <div className="text-3xl font-bold gradient-text mb-4">STUDIO VIBES</div>
        <p className="text-gray-400 mb-8">Creating K-pop memories in the heart of Seoul</p>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 mb-8">
          <a href="#" className="hover:text-[hsl(var(--k-pink))] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[hsl(var(--k-pink))] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[hsl(var(--k-pink))] transition-colors">Cancellation Policy</a>
          <a href="#" className="hover:text-[hsl(var(--k-pink))] transition-colors">FAQ</a>
          <a href="#" className="hover:text-[hsl(var(--k-pink))] transition-colors">Support</a>
        </div>
        
        <div className="text-gray-500">
          © 2024 Studio Vibes. All rights reserved. | Business License: 123-45-67890
        </div>
      </div>
    </footer>
  );
}
