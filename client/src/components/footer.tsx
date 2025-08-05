import { useState } from "react";
import PolicyDialog from "./policy-dialog";

export default function Footer() {
  const [openDialog, setOpenDialog] = useState<"privacy" | "terms" | "cancellation" | null>(null);

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFAQ = () => {
    const faqSection = document.querySelector('#faq');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6 lg:px-8 xl:px-12 text-center max-w-7xl">
          <div className="text-3xl font-bold gradient-text mb-4">Crowdfunding Center</div>
          <p className="text-gray-400 mb-8">Creating K-pop memories in the heart of Seoul</p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 mb-8">
            <button 
              onClick={() => setOpenDialog("privacy")}
              className="hover:text-[hsl(var(--k-pink))] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setOpenDialog("terms")}
              className="hover:text-[hsl(var(--k-pink))] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setOpenDialog("cancellation")}
              className="hover:text-[hsl(var(--k-pink))] transition-colors cursor-pointer"
            >
              Cancellation Policy
            </button>
            <button 
              onClick={scrollToFAQ}
              className="hover:text-[hsl(var(--k-pink))] transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button 
              onClick={scrollToContact}
              className="hover:text-[hsl(var(--k-pink))] transition-colors cursor-pointer"
            >
              Support
            </button>
          </div>
          
          <div className="text-gray-500">
            <p>© 2025 Korea Crowdfunding Association. All rights reserved. The trademark and service model (BM) are patents protected.</p>
            <p className="text-xs mt-2">
              TMMT Co., Ltd. | Business Registration No. 113-86-03777 | 
              Telecommunications Sales Business No. 2011-Seoul Songpa-0554
            </p>
          </div>
        </div>
      </footer>

      <PolicyDialog 
        type={openDialog!}
        isOpen={openDialog !== null}
        onClose={() => setOpenDialog(null)}
      />
    </>
  );
}
