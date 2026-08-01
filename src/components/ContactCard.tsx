"use client";

import { motion } from "framer-motion";
import {
  Download,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface ContactCardProps {
  lang: string;
}

export default function ContactCard({ lang }: ContactCardProps) {
  const dict = getDictionary(lang);

  const generateVcard = () => {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
N:GERGA;Exhibition Desk;;;
FN:GERGA Aegean Agriculture Exhibition Desk
ORG:GERGA Agricultural Innovations
TITLE:International B2B Desk
TEL;TYPE=WORK,VOICE:+908508854374
EMAIL;TYPE=WORK:info@gerga.co
URL:https://gerga.co/${lang}
ADR;TYPE=WORK:;;Büyük Menderes Basin;Aydın;;;Turkey
NOTE:GERGA Aegean Figs, Saplings and Orchard Establishment
END:VCARD`;

    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `GERGA_Contact_${lang.toUpperCase()}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="contact" className="py-24 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-[#d4af37]" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
            {dict.contact.tag}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light">
              {dict.contact.title}
            </h2>
            <p className="mt-3 text-sm sm:text-lg text-[#d4af37] font-light max-w-2xl">
              {dict.contact.subtitle}
            </p>
          </div>
        </div>

        {/* Digital Business Card & Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Digital Business Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl border border-[#d4af37]/40 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl" />

            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#d4af37] flex items-center justify-center bg-black">
                  <span className="text-[#d4af37] font-serif font-bold text-lg">G</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white font-semibold tracking-wider">
                    GERGA
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    Digital Contact Card
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[10px] font-mono text-[#d4af37] uppercase">
                Official B2B
              </span>
            </div>

            {/* Verified Target QR Code Representation */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-8 bg-black/50 p-6 rounded-2xl border border-white/10">
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner">
                <svg
                  viewBox="0 0 100 100"
                  className="w-32 h-32 text-black"
                  fill="currentColor"
                >
                  <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                  <path d="M35,10 h10 v10 h-10 z M50,10 h10 v10 h-10 z M35,25 h20 v10 h-20 z" />
                  <path d="M10,35 h10 v20 h-10 z M25,40 h15 v10 h-15 z M45,45 h20 v10 h-20 z" />
                  <path d="M70,35 h20 v10 h-20 z M80,50 h15 v20 h-15 z M35,70 h10 v20 h-10 z" />
                  <path d="M50,80 h20 v15 h-20 z M75,80 h15 v15 h-15 z M60,60 h15 v15 h-15 z" />
                </svg>
                <span className="mt-2 text-[9px] font-mono text-gray-800 tracking-wider font-bold">
                  https://gerga.co/{lang}
                </span>
              </div>

              <div className="sm:col-span-7 flex flex-col justify-center">
                <h4 className="font-serif text-lg text-white font-medium mb-2">
                  {dict.contact.cardTitle}
                </h4>
                <p className="text-xs text-gray-300 font-light leading-relaxed mb-4">
                  {dict.contact.scanQr}
                </p>

                <button
                  onClick={generateVcard}
                  className="w-full py-3.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e5c158] transition-all flex items-center justify-center gap-2 shadow-lg min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>{dict.contact.downloadVcard}</span>
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <a
              href="https://wa.me/908508854374?text=Hello%20GERGA%20Team%2C%20I%20visited%20gerga.co"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{dict.contact.directWhatsapp}</span>
            </a>
          </motion.div>

          {/* Right Column: Contact Cards & PDF Catalog Status */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6 flex flex-col gap-4"
          >
            {/* PDF Catalog Area (Coming Soon) */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                    {dict.contact.pdfCatalogTitle}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[#d4af37]">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-light mt-1">
                  {dict.contact.pdfCatalogStatus}
                </p>
              </div>
            </div>

            {/* Address Card */}
            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                  {dict.contact.addressTitle}
                </span>
                <h4 className="font-serif text-base text-white font-medium mt-1">
                  {dict.contact.address}
                </h4>
              </div>
            </div>

            {/* Email Card */}
            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                  {dict.contact.emailTitle}
                </span>
                <a
                  href={`mailto:${dict.contact.email}`}
                  className="font-serif text-base text-[#d4af37] font-medium mt-1 block hover:underline"
                >
                  {dict.contact.email}
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                  {dict.contact.phoneTitle}
                </span>
                <a
                  href={`tel:${dict.contact.phone}`}
                  className="font-serif text-base text-white font-medium mt-1 block hover:text-[#d4af37]"
                >
                  {dict.contact.phone}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
