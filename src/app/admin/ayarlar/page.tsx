"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    liveMode: true,
    maintenanceMode: false,
    defaultLanguage: "tr",
    whatsappWidgetEnabled: true,
    catalogueEnabled: true,
    galleryEnabled: true,
  });

  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

  useEffect(() => {
    fetch("/api/admin/global-settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.settings) {
          setForm((prev) => ({ ...prev, ...d.settings }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/global-settings", {
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
          <Settings className="w-6 h-6 text-[#d4af37]" />
          <h1 className="text-2xl font-serif font-bold text-white">Sistem & Operasyon Ayarları</h1>
        </div>
        <p className="text-xs text-gray-400">
          Site canlı/bakım modları, varsayılan dil ve modül widget seçeneklerini kontrol edin.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Sistem ayarları başarıyla kaydedildi.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-6 bg-[#0d100d]">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div>
              <h4 className="text-xs font-semibold text-white">WhatsApp Canlı Destek Widget</h4>
              <p className="text-[11px] text-gray-400">Sitenin sağ alt köşesinde hızlı WhatsApp butonunu gösterir.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.whatsappWidgetEnabled}
                onChange={(e) => setForm({ ...form, whatsappWidgetEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div>
              <h4 className="text-xs font-semibold text-white">Dijital Katalog Modülü</h4>
              <p className="text-[11px] text-gray-400">/katalog ve /catalogue sayfalarını aktif tutar.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.catalogueEnabled}
                onChange={(e) => setForm({ ...form, catalogueEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div>
              <h4 className="text-xs font-semibold text-white">Galeri Modülü</h4>
              <p className="text-[11px] text-gray-400">Landing sayfasında galeri alanını görünür tutar.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.galleryEnabled}
                onChange={(e) => setForm({ ...form, galleryEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
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
