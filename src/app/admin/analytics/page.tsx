"use client";

import { useState, useEffect } from "react";
import { BarChart3, Users, MousePointer, Download, FileText, QrCode } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    visits: 0,
    b2bStarts: 0,
    b2bSubmissions: 0,
    sampleSubmissions: 0,
    vcardDownloads: 0,
    whatsappClicks: 0,
  });

  useEffect(() => {
    fetch("/api/admin/funnel-stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.stats) {
          setStats((prev) => ({ ...prev, ...d.stats }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 className="w-6 h-6 text-[#d4af37]" />
          <h1 className="text-2xl font-serif font-bold text-white">First-Party Analitik & Dönüşüm Tablosu</h1>
        </div>
        <p className="text-xs text-gray-400">
          Public siteden toplanan anonim (PII-free) etkileşim ve dönüşüm verileri.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Toplam Ziyaret</span>
            <Users className="w-4 h-4 text-[#d4af37]" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.visits}</p>
          <p className="text-[10px] text-gray-400">Sayfa yüklenme sayısı</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">B2B Form Başlatma</span>
            <MousePointer className="w-4 h-4 text-[#d4af37]" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.b2bStarts}</p>
          <p className="text-[10px] text-gray-400">Forma tıklayan potansiyel alıcılar</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">B2B Başvuruları</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{stats.b2bSubmissions}</p>
          <p className="text-[10px] text-gray-400">Başarıyla gönderilen talepler</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Numune Talepleri</span>
            <Download className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono">{stats.sampleSubmissions}</p>
          <p className="text-[10px] text-gray-400">İstenen numune paketleri</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">vCard İndirmeleri</span>
            <QrCode className="w-4 h-4 text-[#d4af37]" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.vcardDownloads}</p>
          <p className="text-[10px] text-gray-400">Rehbere kaydedilen rehber kartları</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">WhatsApp Tıklamaları</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{stats.whatsappClicks}</p>
          <p className="text-[10px] text-gray-400">Hızlı WhatsApp sohbet başlatma</p>
        </div>
      </div>
    </div>
  );
}
