"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/18633320003?text=Hello%2C%20I%20need%20support%20from%20Cheftag."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[calc(11rem+env(safe-area-inset-bottom))] left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#20BA5A] hover:shadow-xl xl:bottom-8 xl:left-auto xl:right-8"
      aria-label="Contact support on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
