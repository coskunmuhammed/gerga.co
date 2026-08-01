"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Archive, ShieldAlert, CheckCircle2, Mail, Phone, Globe, Calendar } from "lucide-react";
import { B2BMeetingRequestEntity } from "@/domain/b2b/b2b-meeting-request";

export default function AdminB2BDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [request, setRequest] = useState<B2BMeetingRequestEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const loadDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/b2b-requests`);
      if (res.status === 401) {
        router.push("/admin/giris");
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const found = data.data.find((item: B2BMeetingRequestEntity) => item.id === id);
        if (found) {
          setRequest(found);
          setStatus(found.status);
          setInternalNote(found.internalNote || "");
        }
      }
    } catch {
      console.error("Failed to fetch detail.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/b2b-requests`);
        if (res.status === 401) {
          router.push("/admin/giris");
          return;
        }
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.data)) {
          const found = data.data.find((item: B2BMeetingRequestEntity) => item.id === id);
          if (found) {
            setRequest(found);
            setStatus(found.status);
            setInternalNote(found.internalNote || "");
          }
        }
      } catch {
        console.error("Failed to fetch detail.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [id, router]);

  const handleSaveStatus = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/b2b-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, internalNote }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Durum ve iç not başarıyla güncellendi.");
        loadDetail();
      } else {
        setMsg(data.message || "Güncelleme başarısız.");
      }
    } catch {
      setMsg("Güncelleme hatası.");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Bu kaydı arşivlemek istediğinize emin misiniz?")) return;
    try {
      await fetch("/api/admin/b2b-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, archive: true }),
      });
      router.push("/admin/b2b-talepleri");
    } catch {
      alert("Arşivleme başarısız.");
    }
  };

  const handleMarkSpam = async () => {
    setStatus("SPAM");
    setSaving(true);
    try {
      await fetch("/api/admin/b2b-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "SPAM" }),
      });
      setMsg("Kayıt SPAM olarak işaretlendi.");
      loadDetail();
    } catch {
      alert("İşlem başarısız.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b09] text-white flex items-center justify-center p-8">
        <span className="font-mono text-sm text-gray-400">Başvuru detayı yükleniyor...</span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-[#090b09] text-white p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href="/admin/b2b-talepleri" className="text-xs font-mono text-[#d4af37] flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Listeye Dön</span>
          </Link>
          <div className="p-8 glass-card rounded-2xl text-center text-gray-400 font-mono">
            Başvuru bulunamadı.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b09] text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Nav */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <Link
            href="/admin/b2b-talepleri"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tüm Taleplere Dön</span>
          </Link>

          <span className="font-mono text-sm text-[#d4af37] font-semibold">
            {request.referenceNumber}
          </span>
        </div>

        {msg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Request Information */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header info card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h1 className="font-serif text-2xl text-white font-semibold">{request.fullName}</h1>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {request.companyName || "Bireysel Başvuru"} • {request.country || "Belirtilmedi"}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30 uppercase">
                  {request.interestArea}
                </span>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-gray-300">
                <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl">
                  <Mail className="w-4 h-4 text-[#d4af37]" />
                  <span>{request.email}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl">
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                  <span>{request.phone || "Telefon Belirtilmedi"}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl">
                  <Globe className="w-4 h-4 text-[#d4af37]" />
                  <span>Tercih Dil: {request.preferredLanguage}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>{new Date(request.createdAt).toLocaleString("tr-TR")}</span>
                </div>
              </div>

              {/* Message Box */}
              <div className="space-y-2 border-t border-white/10 pt-6">
                <h3 className="text-xs font-mono uppercase text-gray-400 tracking-wider">
                  Ziyaretçi Mesajı
                </h3>
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-sm text-gray-200 font-light leading-relaxed whitespace-pre-wrap">
                  {request.message || "Mesaj içeriği girilmedi."}
                </div>
              </div>

              {/* Consent info */}
              <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-gray-500 space-y-1">
                <p>Gizlilik Onayı: {request.privacyAccepted ? "EVET (v1.0)" : "HAYIR"} ({new Date(request.privacyAcceptedAt).toLocaleString("tr-TR")})</p>
                <p>Pazarlama İzni: {request.marketingAccepted ? "EVET" : "HAYIR"}</p>
                <p>Kaynak: {request.source || "Web Form"}</p>
              </div>
            </div>
          </div>

          {/* Right Admin Action Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-[#d4af37]/30 space-y-6">
              <h3 className="font-serif text-lg text-white font-medium border-b border-white/10 pb-3">
                Yönetim İşlemleri
              </h3>

              {/* Status Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                  Başvuru Durumu
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                >
                  <option value="NEW">YENİ (NEW)</option>
                  <option value="REVIEWING">İNCELENİYOR (REVIEWING)</option>
                  <option value="CONTACTED">İLETİŞİME GEÇİLDİ (CONTACTED)</option>
                  <option value="QUALIFIED">UYGUN BAŞVURU (QUALIFIED)</option>
                  <option value="CLOSED">KAPATILDI (CLOSED)</option>
                  <option value="SPAM">SPAM (SPAM)</option>
                </select>
              </div>

              {/* Internal Note */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                  İç Yönetim Notu
                </label>
                <textarea
                  rows={4}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Ekibin takip edebileceği dahili not ekleyin..."
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <button
                onClick={handleSaveStatus}
                disabled={saving}
                className="w-full py-3.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e5c158] transition-all flex items-center justify-center gap-2 shadow-lg min-h-[44px] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</span>
              </button>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={handleMarkSpam}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>SPAM Olarak İşaretle</span>
                </button>

                <button
                  onClick={handleArchive}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Archive className="w-4 h-4" />
                  <span>Başvuruyu Arşivle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
