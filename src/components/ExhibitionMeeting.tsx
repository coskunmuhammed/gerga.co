"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Calendar, Building2, Globe2, Mail, Phone, MessageSquare, Info } from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface ExhibitionMeetingProps {
  lang: string;
}

export default function ExhibitionMeeting({ lang }: ExhibitionMeetingProps) {
  const dict = getDictionary(lang);
  const formDict = dict.b2bMeeting.form;

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    country: "",
    email: "",
    phone: "",
    areaOfInterest: "",
    message: "",
    preferredLanguage: lang === "en" ? "English" : "Türkçe",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/b2b-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          company: "",
          country: "",
          email: "",
          phone: "",
          areaOfInterest: "",
          message: "",
          preferredLanguage: lang === "en" ? "English" : "Türkçe",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || formDict.errorMsg);
      }
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(formDict.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="b2b-meeting" className="py-28 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-[#d4af37]" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
            {dict.b2bMeeting.tag}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light">
              {dict.b2bMeeting.title}
            </h2>
            <p className="mt-3 text-sm sm:text-lg text-gray-300 font-light max-w-2xl">
              {dict.b2bMeeting.subtitle}
            </p>
          </div>
        </div>

        {/* Meeting Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Info & Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 glass-card p-8 rounded-3xl border border-[#d4af37]/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-[#d4af37]" />
                <h3 className="font-serif text-2xl text-white font-medium">
                  B2B Görüşme Talebi
                </h3>
              </div>

              <p className="text-xs text-gray-300 font-light leading-relaxed mb-6">
                {dict.b2bMeeting.subtitle}
              </p>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Görüşme Konuları
                </div>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    <span>Ürün Tedariği ve Toptan İhracat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    <span>Ticari İncir Fidanı Temini</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    <span>Anahtar Teslim Bahçe Kurulumu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    <span>Distribütörlük ve Bölge Temsilciliği</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <Info className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>{formDict.devNotice}</span>
            </div>
          </motion.div>

          {/* Right Column: Actual Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7 glass-card p-6 sm:p-10 rounded-3xl border border-white/10"
          >
            {submitStatus === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-white font-medium mb-3">
                  Talebiniz Alındı
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-light max-w-md mb-8">
                  {formDict.successMsg}
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="px-6 py-3 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/20 transition-all min-h-[44px]"
                >
                  Yeni Görüşme Talebi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitStatus === "error" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Form Fields: Single Column on Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                      {formDict.fullName} *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="e.g. Ahmet Yılmaz / John Doe"
                    />
                  </div>

                  {/* Company */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                      {formDict.company}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="e.g. Global Foods Ltd."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Country */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                      {formDict.country} *
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="e.g. Germany / Türkiye"
                    />
                  </div>

                  {/* Area of Interest */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                      {formDict.areaOfInterest} *
                    </label>
                    <select
                      name="areaOfInterest"
                      required
                      value={formData.areaOfInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    >
                      <option value="">{formDict.selectInterest}</option>
                      <option value="Product Supply">{formDict.interests.supply}</option>
                      <option value="Wholesale">{formDict.interests.wholesale}</option>
                      <option value="Saplings">{formDict.interests.saplings}</option>
                      <option value="Orchard Establishment">{formDict.interests.orchard}</option>
                      <option value="Consultancy">{formDict.interests.consultancy}</option>
                      <option value="Distribution">{formDict.interests.distribution}</option>
                      <option value="Other">{formDict.interests.other}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                      {formDict.email} *
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

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                      {formDict.phone}
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
                </div>

                {/* Preferred Language & Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                    {formDict.message} *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="Görüşmek istediğiniz detayları belirtiniz..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 min-h-[48px] rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#e5c158] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? formDict.submitting : formDict.submit}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
