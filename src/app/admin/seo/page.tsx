"use client";

import { useState, useEffect } from "react";
import { Search, Save, Check } from "lucide-react";

export default function AdminSeoPage() {
  const [form, setForm] = useState({
    siteWideTitleTr: "GERGA | Ege İnciri & B2B İhracat",
    siteWideTitleEn: "GERGA | Aegean Dried Figs & B2B Export",
    siteWideDescTr: "Ege'nin köklü mirasıyla premium kuru incir üretimi, fidanlık ve bahçe kurulumu.",
    siteWideDescEn: "Premium Aegean dried fig production, sapling nursery and orchard establishment.",
    indexingEnabled: true,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.seo) {
          setForm((prev) => ({ ...prev, ...d.seo }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
          <Search className="w-6 h-6 text-[#d4af37]" />
          <h1 className="text-2xl font-serif font-bold text-white">SEO & Metadata Yönetimi</h1>
        </div>
        <p className="text-xs text-gray-400">
          Arama motoru başlıkları, meta açıklamaları ve indeksleme seçeneklerini yönetin.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>SEO ayarları güncellendi.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Site Meta Title (TR)</label>
            <input
              type="text"
              value={form.siteWideTitleTr}
              onChange={(e) => setForm({ ...form, siteWideTitleTr: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Site Meta Title (EN)</label>
            <input
              type="text"
              value={form.siteWideTitleEn}
              onChange={(e) => setForm({ ...form, siteWideTitleEn: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Site Meta Description (TR)</label>
            <textarea
              rows={2}
              value={form.siteWideDescTr}
              onChange={(e) => setForm({ ...form, siteWideDescTr: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Site Meta Description (EN)</label>
            <textarea
              rows={2}
              value={form.siteWideDescEn}
              onChange={(e) => setForm({ ...form, siteWideDescEn: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
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
