"use client";

import { useState } from "react";
import { FileText, Save, Check } from "lucide-react";

export default function AdminLegalPage() {
  const [form, setForm] = useState({
    version: "v1.0",
    trPrivacy: "6698 sayılı KVKK kapsamında kişisel verileriniz B2B görüşme talebi takibi amacıyla işlenmektedir.",
    enPrivacy: "Your personal data is processed for B2B meeting request tracking under data protection law.",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "legal", data: form }),
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
          <FileText className="w-6 h-6 text-[#d4af37]" />
          <h1 className="text-2xl font-serif font-bold text-white">Yasal Metinler & Consent Versiyonları</h1>
        </div>
        <p className="text-xs text-gray-400">
          Formlarda gösterilen KVKK / Gizlilik aydınlatma metinleri ve aktif sürüm numarası.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Yasal metin versiyonu yayınlandı.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Aktif Sürüm Kodu</label>
            <input
              type="text"
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">KVKK Metni (TR)</label>
            <textarea
              rows={3}
              value={form.trPrivacy}
              onChange={(e) => setForm({ ...form, trPrivacy: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Privacy Notice (EN)</label>
            <textarea
              rows={3}
              value={form.enPrivacy}
              onChange={(e) => setForm({ ...form, enPrivacy: e.target.value })}
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
            <span>Yeni Sürümü Yayınla</span>
          </button>
        </div>
      </form>
    </div>
  );
}
