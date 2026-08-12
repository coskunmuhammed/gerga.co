"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, QrCode, ToggleLeft, ToggleRight, Plus, CheckCircle2, Save, ExternalLink } from "lucide-react";

interface ExhibitionConfig {
  active: boolean;
  fairName: string;
  city: string;
  dates: string;
  hall: string;
  standNumber: string;
  ctaTextTr: string;
  ctaTextEn: string;
}

interface QRCampaign {
  id: string;
  name: string;
  sourceCode: string;
  targetLanguage: string;
  targetRoute: string;
  active: boolean;
  createdAt: string;
}

export default function FuarYonetimiPage() {
  const [config, setConfig] = useState<ExhibitionConfig>({
    active: false,
    fairName: "",
    city: "",
    dates: "",
    hall: "",
    standNumber: "",
    ctaTextTr: "",
    ctaTextEn: "",
  });

  const [campaigns, setCampaigns] = useState<QRCampaign[]>([]);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configMessage, setConfigMessage] = useState("");

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    sourceCode: "",
    targetLanguage: "tr",
    targetRoute: "/",
  });
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadExhibitionData() {
      try {
        const [resConfig, resCamp] = await Promise.all([
          fetch("/api/admin/exhibition-config"),
          fetch("/api/admin/qr-campaigns"),
        ]);

        const dataConfig = await resConfig.json();
        const dataCamp = await resCamp.json();

        if (!ignore && dataConfig.success && dataConfig.config) {
          setConfig({
            active: dataConfig.config.active || false,
            fairName: dataConfig.config.fairName || "",
            city: dataConfig.config.city || "",
            dates: dataConfig.config.dates || "",
            hall: dataConfig.config.hall || "",
            standNumber: dataConfig.config.standNumber || "",
            ctaTextTr: dataConfig.config.ctaTextTr || "",
            ctaTextEn: dataConfig.config.ctaTextEn || "",
          });
        }

        if (!ignore && dataCamp.success && dataCamp.campaigns) {
          setCampaigns(dataCamp.campaigns);
        }
      } catch (err) {
        console.error("Failed to load admin exhibition data:", err);
      }
    }

    loadExhibitionData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingConfig(true);
    setConfigMessage("");

    try {
      const res = await fetch("/api/admin/exhibition-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (data.success) {
        setConfigMessage("Fuar ayarları başarıyla kaydedildi.");
      }
    } catch {
      setConfigMessage("Ayarlar kaydedilirken hata oluştu.");
    } finally {
      setSavingConfig(false);
    }
  };

  const handleToggleActive = async () => {
    const updated = !config.active;
    setConfig((prev) => ({ ...prev, active: updated }));
    try {
      await fetch("/api/admin/exhibition-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, active: updated }),
      });
      setConfigMessage(updated ? "Exhibition Mode aktif edildi." : "Exhibition Mode kapatıldı.");
    } catch {
      setConfigMessage("Durum değiştirilemedi.");
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name || !newCampaign.sourceCode) return;

    setCreatingCampaign(true);
    try {
      const res = await fetch("/api/admin/qr-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });

      const data = await res.json();
      if (data.success) {
        setNewCampaign({ name: "", sourceCode: "", targetLanguage: "tr", targetRoute: "/" });
        const resCamp = await fetch("/api/admin/qr-campaigns");
        const dataCamp = await resCamp.json();
        if (dataCamp.success && dataCamp.campaigns) {
          setCampaigns(dataCamp.campaigns);
        }
      }
    } catch (err) {
      console.error("Failed to create campaign:", err);
    } finally {
      setCreatingCampaign(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b09] text-[#f7f5ef] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Link
              href="/admin/b2b-talepleri"
              className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#d4af37] transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>B2B Taleplerine Dön</span>
            </Link>
            <h1 className="font-serif text-3xl text-white font-medium">
              Fuar Yönetimi & QR Kampanyaları
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Exhibition Mode canlı bant ayarları ve fuar kaynaklı QR kampanya üretici altyapısı.
            </p>
          </div>

          <button
            onClick={handleToggleActive}
            className={`inline-flex items-center gap-3 px-5 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer transition-all shadow-lg min-h-[44px] ${
              config.active
                ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30"
                : "bg-white/10 border border-white/20 text-gray-400 hover:bg-white/20"
            }`}
          >
            {config.active ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6" />}
            <span>{config.active ? "Exhibition Mode: AKTİF" : "Exhibition Mode: KAPALI"}</span>
          </button>
        </div>

        {/* Exhibition Mode Config Form */}
        <div className="glass-card bg-[#0e120e] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-serif text-xl text-white font-medium">
                Fuar Bilgileri (Exhibition Mode Banner)
              </h2>
            </div>

            {configMessage && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {configMessage}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-mono text-gray-400 uppercase">Fuar Adı</label>
                <input
                  type="text"
                  value={config.fairName}
                  onChange={(e) => setConfig({ ...config, fairName: e.target.value })}
                  placeholder="e.g. Fruit Logistica"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 uppercase">Şehir / Ülke</label>
                <input
                  type="text"
                  value={config.city}
                  onChange={(e) => setConfig({ ...config, city: e.target.value })}
                  placeholder="e.g. Berlin, Germany"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 uppercase">Tarih</label>
                <input
                  type="text"
                  value={config.dates}
                  onChange={(e) => setConfig({ ...config, dates: e.target.value })}
                  placeholder="e.g. 5-7 Şubat 2026"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-gray-400 uppercase">Hall</label>
                <input
                  type="text"
                  value={config.hall}
                  onChange={(e) => setConfig({ ...config, hall: e.target.value })}
                  placeholder="Hall 4"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 uppercase">Stand Numarası</label>
                <input
                  type="text"
                  value={config.standNumber}
                  onChange={(e) => setConfig({ ...config, standNumber: e.target.value })}
                  placeholder="Stand B21"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingConfig}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e5c158] transition-all min-h-[44px] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savingConfig ? "Kaydediliyor..." : "Fuar Ayarlarını Kaydet"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* QR Campaign Manager */}
        <div className="glass-card bg-[#0e120e] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <QrCode className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h2 className="font-serif text-xl text-white font-medium">
                QR Kampanya Tanımlama Altyapısı
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Stant materyalleri, kartvizitler ve dökümanlar için tracking linkleri üretin.
              </p>
            </div>
          </div>

          {/* New Campaign Form */}
          <form onSubmit={handleCreateCampaign} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 items-end">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono text-gray-400 uppercase">Kampanya Adı</label>
              <input
                type="text"
                required
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="Berlin Stand QR / English Brochure"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-gray-400 uppercase">Source Code</label>
              <input
                type="text"
                required
                value={newCampaign.sourceCode}
                onChange={(e) => setNewCampaign({ ...newCampaign, sourceCode: e.target.value })}
                placeholder="stand-qr-berlin"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-gray-400 uppercase">Dil & Rota</label>
              <select
                value={newCampaign.targetLanguage}
                onChange={(e) => setNewCampaign({ ...newCampaign, targetLanguage: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs"
              >
                <option value="tr">TR (Türkçe)</option>
                <option value="en">EN (English)</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={creatingCampaign}
                className="w-full py-2.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e5c158] transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
              >
                <Plus className="w-4 h-4" />
                <span>Ekle</span>
              </button>
            </div>
          </form>

          {/* Campaign List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="border-b border-white/10 font-mono text-gray-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Kampanya Adı</th>
                  <th className="py-3 px-4">Source Code</th>
                  <th className="py-3 px-4">Hedef Rota</th>
                  <th className="py-3 px-4">Üretilen Gerçek URL</th>
                  <th className="py-3 px-4 text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                      Henüz tanımlı QR kampanya bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((camp) => {
                    const generatedUrl = `https://gerga.co/${camp.targetLanguage}?source=${camp.sourceCode}`;
                    return (
                      <tr key={camp.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-medium text-white">{camp.name}</td>
                        <td className="py-3 px-4 font-mono text-[#d4af37]">{camp.sourceCode}</td>
                        <td className="py-3 px-4 uppercase font-mono">{camp.targetLanguage} / {camp.targetRoute}</td>
                        <td className="py-3 px-4 font-mono text-gray-400 select-all">{generatedUrl}</td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={generatedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#d4af37] hover:underline min-h-[36px] px-2"
                          >
                            <span>Aç</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
