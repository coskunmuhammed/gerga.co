"use client";

import { useState } from "react";
import { GraduationCap, Save, Check } from "lucide-react";

export default function AdminAcademyPage() {
  const [form, setForm] = useState({
    trHeading: "Ege İnciri Yetiştiriciliği & GERGA Akademi",
    enHeading: "Aegean Fig Cultivation & GERGA Academy",
    trDesc: "Büyük Menderes Havzası'nın mikroklima dengesinden fidan seçimine kadar teknik rehberler.",
    enDesc: "Technical guides from microclimate dynamics of the Büyük Menderes Basin to sapling selection.",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "academy", data: form }),
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
          <GraduationCap className="w-6 h-6 text-[#d4af37]" />
          <h1 className="text-2xl font-serif font-bold text-white">GERGA Akademi Yönetimi</h1>
        </div>
        <p className="text-xs text-gray-400">
          Akademi başlıklarını, öne çıkan teknik notları ve rehber içeriklerini yönetin.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Akademi içeriği güncellendi.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Akademi Başlığı (TR)</label>
            <input
              type="text"
              value={form.trHeading}
              onChange={(e) => setForm({ ...form, trHeading: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Academy Heading (EN)</label>
            <input
              type="text"
              value={form.enHeading}
              onChange={(e) => setForm({ ...form, enHeading: e.target.value })}
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
