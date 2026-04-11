"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/18633320003?text=Hello%2C%20I%20need%20support%20from%20Cheftag."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Contact support on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
