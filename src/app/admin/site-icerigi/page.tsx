"use client";

import { useState, useEffect } from "react";
import { Save, Check, AlertCircle, Layers } from "lucide-react";

export default function AdminSiteContentPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const [heroForm, setHeroForm] = useState({
    trOverline: "Aydın / Ege Coğrafyası",
    enOverline: "Aydın / Aegean Origin",
    trHeadline: "Geleneksel Miras, Modern Standartlar",
    enHeadline: "Heritage Origin, Modern Standards",
    trDescription: "Büyük Menderes Havzası'nın kadim incir bahçelerinden doğan kalite.",
    enDescription: "Crafted from ancient fig orchards in the Büyük Menderes Basin.",
    trPrimaryCta: "Fuar Görüşmesi Planlayın",
    enPrimaryCta: "Schedule Exhibition Meeting",
    trSecondaryCta: "Dijital Kataloğu İnceleyin",
    enSecondaryCta: "View Digital Catalogue",
  });

  const [sections, setSections] = useState([
    { key: "hero", titleTr: "Hero Giriş Bölümü", titleEn: "Hero Section", active: true, sortOrder: 1 },
    { key: "intro", titleTr: "GERGA Tanıtımı", titleEn: "GERGA Introduction", active: true, sortOrder: 2 },
    { key: "aegean", titleTr: "Ege ve İncir Kökeni", titleEn: "Aegean & Fig Heritage", active: true, sortOrder: 3 },
    { key: "products", titleTr: "Ürün Seçkisi", titleEn: "Product Portfolio", active: true, sortOrder: 4 },
    { key: "nursery", titleTr: "Fidan Üretimi", titleEn: "Sapling Production", active: true, sortOrder: 5 },
    { key: "engineering", titleTr: "Bahçe Kurulumu", titleEn: "Orchard Engineering", active: true, sortOrder: 6 },
    { key: "academy", titleTr: "GERGA Akademi", titleEn: "GERGA Academy", active: true, sortOrder: 7 },
    { key: "postExhibition", titleTr: "Fuar Sonrası Aksiyonlar", titleEn: "Post-Exhibition Conversion", active: true, sortOrder: 8 },
    { key: "gallery", titleTr: "Galeri", titleEn: "Gallery", active: true, sortOrder: 9 },
    { key: "contact", titleTr: "İletişim", titleEn: "Contact", active: true, sortOrder: 10 },
  ]);

  useEffect(() => {
    fetch("/api/admin/site-content?key=hero")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.content) {
          setHeroForm((prev) => ({ ...prev, ...d.content }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero", data: heroForm }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMsg("Hero içeriği başarıyla güncellendi ve canlı siteye yansıtıldı.");
      } else {
        setStatus("error");
        setMsg(data.message || "Kaydetme hatası.");
      }
    } catch {
      setStatus("error");
      setMsg("Sunucu hatası.");
    }
  };

  const handleToggleSection = async (key: string, active: boolean) => {
    const updated = sections.map((s) => (s.key === key ? { ...s, active } : s));
    setSections(updated);
    const target = updated.find((s) => s.key === key);
    if (!target) return;

    await fetch("/api/admin/section-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionKey: key,
        active: target.active,
        sortOrder: target.sortOrder,
        titleTr: target.titleTr,
        titleEn: target.titleEn,
      }),
    });
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Layers className="w-6 h-6 text-[#d4af37]" />
          <h1 className="text-2xl font-serif font-bold text-white">Site İçeriği & Bölüm Yönetimi</h1>
        </div>
        <p className="text-xs text-gray-400">
          Public landing üzerindeki başlık, metin, CTA ve bölüm aktiflik sıralamasını yönetin.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
            activeTab === "hero"
              ? "bg-[#d4af37] text-black"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Hero İçeriği
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
            activeTab === "sections"
              ? "bg-[#d4af37] text-black"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Bölüm Aktiflik & Sıralama
        </button>
      </div>

      {activeTab === "hero" && (
        <form onSubmit={handleSaveHero} className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase text-[#d4af37] tracking-wider">Türkçe İçerik</h3>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Overline (TR)</label>
                <input
                  type="text"
                  value={heroForm.trOverline}
                  onChange={(e) => setHeroForm({ ...heroForm, trOverline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Headline (TR)</label>
                <input
                  type="text"
                  value={heroForm.trHeadline}
                  onChange={(e) => setHeroForm({ ...heroForm, trHeadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Açıklama (TR)</label>
                <textarea
                  rows={3}
                  value={heroForm.trDescription}
                  onChange={(e) => setHeroForm({ ...heroForm, trDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Ana CTA Buton Metni (TR)</label>
                <input
                  type="text"
                  value={heroForm.trPrimaryCta}
                  onChange={(e) => setHeroForm({ ...heroForm, trPrimaryCta: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase text-[#d4af37] tracking-wider">English Content</h3>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Overline (EN)</label>
                <input
                  type="text"
                  value={heroForm.enOverline}
                  onChange={(e) => setHeroForm({ ...heroForm, enOverline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Headline (EN)</label>
                <input
                  type="text"
                  value={heroForm.enHeadline}
                  onChange={(e) => setHeroForm({ ...heroForm, enHeadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description (EN)</label>
                <textarea
                  rows={3}
                  value={heroForm.enDescription}
                  onChange={(e) => setHeroForm({ ...heroForm, enDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Primary CTA Label (EN)</label>
                <input
                  type="text"
                  value={heroForm.enPrimaryCta}
                  onChange={(e) => setHeroForm({ ...heroForm, enPrimaryCta: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={status === "saving"}
              className="px-6 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158] transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{status === "saving" ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === "sections" && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <p className="text-xs text-gray-300">
            Public landing sayfasındaki bölümleri tek tıkla gizleyebilir veya aktif edebilirsiniz.
          </p>
          <div className="divide-y divide-white/10">
            {sections.map((sec) => (
              <div key={sec.key} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">{sec.titleTr} / {sec.titleEn}</h4>
                  <span className="text-[10px] font-mono text-gray-400">ID: #{sec.key}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sec.active}
                    onChange={(e) => handleToggleSection(sec.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
