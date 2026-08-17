"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, AlertCircle, Package } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import { getStoredLeadSource } from "@/lib/source-tracking";
import { trackEvent } from "@/lib/analytics";

interface SampleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export default function SampleRequestModal({ isOpen, onClose, lang }: SampleRequestModalProps) {
  const dict = getDictionary(lang);
  const sampleDict = dict.sampleRequest;
  const isEn = lang === "en";

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    country: "",
    email: "",
    phone: "",
    interestedProduct: sampleDict.productsList[0] || "Ege Kuru İncir (Aydın Sarılop)",
    estimatedVolume: "",
    message: "",
    privacyConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    if (isOpen) {
      trackEvent("sample_request_start");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    trackEvent("sample_request_submit", { interestedProduct: formData.interestedProduct });

    try {
      const source = getStoredLeadSource();
      const response = await fetch("/api/sample-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source,
          preferredLanguage: isEn ? "EN" : "TR",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setReferenceNumber(data.referenceNumber || "");
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || dict.offline.connectionError);
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage(dict.offline.connectionError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-card bg-[#0e120e] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
                {sampleDict.title}
              </h3>
              <p className="text-xs text-gray-300 font-light mt-0.5">
                {sampleDict.subtitle}
              </p>
            </div>
          </div>

          {submitStatus === "success" ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl text-white font-medium mb-2">
                {sampleDict.successTitle}
              </h4>
              <p className="text-sm text-gray-300 font-light max-w-md mb-4 leading-relaxed">
                {sampleDict.successMsg}
              </p>
              {referenceNumber && (
                <div className="mb-6 px-4 py-2 rounded-xl bg-black/60 border border-[#d4af37]/40 text-xs font-mono text-[#d4af37]">
                  <span>{isEn ? "Reference No:" : "Referans Kodu:"} </span>
                  <strong className="font-semibold">{referenceNumber}</strong>
                </div>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#e5c158] transition-all min-h-[44px]"
              >
                {isEn ? "Close" : "Kapat"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {submitStatus === "error" && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium shrink-0 border border-red-500/40"
                  >
                    {dict.offline.retry}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                    {sampleDict.fullName} *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="Ahmet Yılmaz / John Doe"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                    {sampleDict.company}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                    {sampleDict.country} *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="Germany / Türkiye"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                    {sampleDict.email} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                    {sampleDict.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                    {sampleDict.product} *
                  </label>
                  <select
                    name="interestedProduct"
                    required
                    value={formData.interestedProduct}
                    onChange={handleChange}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                  >
                    {sampleDict.productsList.map((prod: string, idx: number) => (
                      <option key={idx} value={prod} className="bg-black text-white">
                        {prod}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                  {sampleDict.estimatedVolume}
                </label>
                <input
                  type="text"
                  name="estimatedVolume"
                  value={formData.estimatedVolume}
                  onChange={handleChange}
                  className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                  placeholder="e.g. 5 Tons / Month or 500 Boxes"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                  {sampleDict.message} *
                </label>
                <textarea
                  name="message"
                  rows={3}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                  placeholder={isEn ? "Specify your sample specs or project requirements..." : "Numune kalibresi ve projeniz hakkındaki detayları belirtiniz..."}
                />
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="samplePrivacyConsent"
                  name="privacyConsent"
                  required
                  checked={formData.privacyConsent}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black text-[#d4af37] focus:ring-[#d4af37]"
                />
                <label htmlFor="samplePrivacyConsent" className="text-xs text-gray-400 font-light leading-snug cursor-pointer">
                  {sampleDict.privacyConsent}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 min-h-[48px] rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#e5c158] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? sampleDict.submitting : sampleDict.submitBtn}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
