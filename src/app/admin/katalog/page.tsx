"use client";

import { useState } from "react";
import { BookOpen, Save, Check } from "lucide-react";

export default function AdminCataloguePage() {
  const [form, setForm] = useState({
    titleTr: "GERGA 2026 Kurumsal & B2B İhracat Kataloğu",
    titleEn: "GERGA 2026 Corporate & B2B Export Catalogue",
    printVisible: true,
    pdfDownloadVisible: true,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "catalogue", data: form }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      }
    } catch {
      // Error
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-6 h-6 text-[#d4af37]" />
          <h1 className="text-2xl font-serif font-bold text-white">Dijital Katalog Yönetimi</h1>
        </div>
        <p className="text-xs text-gray-400">
          /tr/katalog ve /en/catalogue sayfalarındaki başlık, yazdırma ve PDF indirme ayarlarını yönetin.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Katalog ayarları kaydedildi.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Katalog Başlığı (TR)</label>
            <input
              type="text"
              value={form.titleTr}
              onChange={(e) => setForm({ ...form, titleTr: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Catalogue Title (EN)</label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={status === "saving"}
            className="px-6 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158]"
          >
            <Save className="w-4 h-4" />
            <span>Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
