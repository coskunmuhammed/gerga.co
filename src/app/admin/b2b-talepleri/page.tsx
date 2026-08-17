"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, Search, LogOut, ExternalLink, RefreshCw } from "lucide-react";
import { B2BMeetingRequestEntity } from "@/domain/b2b/b2b-meeting-request";

interface FunnelStep {
  name: string;
  count: number;
  display: string;
}

export default function AdminB2BListPage() {
  const [requests, setRequests] = useState<B2BMeetingRequestEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();
  const loadData = async (searchTerm: string, status: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (status) params.append("status", status);

      const res = await fetch(`/api/admin/b2b-requests?${params.toString()}`);
      if (res.status === 401) {
        router.push("/admin/giris");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
      }
    } catch {
      console.error("Failed to load B2B requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (statusFilter) params.append("status", statusFilter);

        const res = await fetch(`/api/admin/b2b-requests?${params.toString()}`);
        if (res.status === 401) {
          router.push("/admin/giris");
          return;
        }
        const data = await res.json();
        if (!ignore && data.success) {
          setRequests(data.data || []);
        }
      } catch {
        console.error("Failed to load B2B requests.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchData();
    return () => {
      ignore = true;
    };
  }, [search, statusFilter, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(search, statusFilter);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/giris");
  };

  const [funnelStats, setFunnelStats] = useState<FunnelStep[]>([]);

  useEffect(() => {
    let ignore = false;
    async function loadFunnel() {
      try {
        const res = await fetch("/api/admin/funnel-stats");
        const data = await res.json();
        if (!ignore && data.success && data.funnel) {
          setFunnelStats(data.funnel);
        }
      } catch {
        // Ignore fetch errors
      }
    }
    loadFunnel();
    return () => {
      ignore = true;
    };
  }, []);

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "High Priority":
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-semibold">HIGH PRIORITY</span>;
      case "Medium Priority":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-semibold">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-mono">STANDARD</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-mono uppercase">YENİ</span>;
      case "REVIEWING":
        return <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] font-mono uppercase">İNCELENİYOR</span>;
      case "CONTACTED":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono uppercase">İLETİŞİME GEÇİLDİ</span>;
      case "FOLLOW_UP":
        return <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[10px] font-mono uppercase">TAKİPTE</span>;
      case "QUALIFIED":
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 text-[10px] font-mono uppercase">UYGUN BAŞVURU</span>;
      case "NOT_INTERESTED":
        return <span className="px-2.5 py-1 rounded-full bg-gray-600/30 border border-gray-500/40 text-gray-400 text-[10px] font-mono uppercase">İLGİLENMİYOR</span>;
      case "SPAM":
        return <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-mono uppercase">SPAM</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-gray-500/20 border border-gray-500/40 text-gray-400 text-[10px] font-mono uppercase">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#090b09] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#d4af37] flex items-center justify-center bg-black">
              <span className="text-[#d4af37] font-serif font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold">GERGA B2B Exhibition Intelligence</h1>
              <p className="text-xs text-gray-400 font-mono">Görüşme Talepleri & Lead Intelligence Paneli</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/fuar-yonetimi"
              className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white/20 transition-all min-h-[44px]"
            >
              <span>Fuar & QR Yönetimi</span>
            </Link>

            <a
              href="/api/admin/export-csv"
              download
              className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#e5c158] transition-all min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>CSV İndir</span>
            </a>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all min-h-[44px]"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>

        {/* Conversion Funnel Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {funnelStats.length > 0 ? (
            funnelStats.map((step, idx) => (
              <div key={idx} className="glass-card p-4 rounded-2xl border border-white/10 bg-black/40">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider truncate">
                  {step.name}
                </div>
                <div className="text-xl font-mono text-[#d4af37] font-semibold mt-1">
                  {step.display}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-xs font-mono text-gray-400">Funnel istatistikleri yükleniyor...</div>
          )}
        </div>

        {/* Filters & Search */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <form onSubmit={handleSearchSubmit} className="sm:col-span-8 flex gap-2">
            <input
              type="text"
              placeholder="Referans no, isim, e-posta veya şirket ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none min-h-[44px]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 min-h-[44px]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none min-h-[44px]"
            >
              <option value="">Tüm Durumlar</option>
              <option value="NEW">YENİ</option>
              <option value="REVIEWING">İNCELENİYOR</option>
              <option value="CONTACTED">İLETİŞİME GEÇİLDİ</option>
              <option value="QUALIFIED">UYGUN</option>
              <option value="CLOSED">KAPATILDI</option>
              <option value="SPAM">SPAM</option>
            </select>
          </div>

          <div className="sm:col-span-1 flex justify-end">
            <button
              onClick={() => loadData(search, statusFilter)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-gray-300 flex items-center justify-center min-h-[44px] min-w-[44px]"
              title="Yenile"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-[#d4af37] font-mono uppercase tracking-wider text-[11px]">
                  <th className="p-4">Referans No</th>
                  <th className="p-4">Tarih</th>
                  <th className="p-4">Ad Soyad</th>
                  <th className="p-4">Şirket / Ülke</th>
                  <th className="p-4">Priority / Skor</th>
                  <th className="p-4">Kaynak</th>
                  <th className="p-4">İlgi Alanı</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400 font-mono">
                      Yükleniyor...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400 font-mono">
                      Kayıtlı B2B başvuru bulunamadı.
                    </td>
                  </tr>
                ) : (
                  requests.map((req: B2BMeetingRequestEntity & { priority?: string; score?: number }) => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-mono font-semibold text-[#d4af37]">
                        {req.referenceNumber}
                      </td>
                      <td className="p-4 text-gray-400 font-mono">
                        {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="p-4 font-medium text-white">{req.fullName}</td>
                      <td className="p-4 text-gray-300">
                        {req.companyName || "-"} / {req.country || "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {getPriorityBadge(req.priority)}
                          <span className="text-[10px] font-mono text-gray-400">Puan: {req.score ?? 0}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-emerald-400">
                        {req.source || "Doğrudan Web"}
                      </td>
                      <td className="p-4 text-gray-300 font-mono text-[11px]">
                        {req.interestArea}
                      </td>
                      <td className="p-4">{getStatusBadge(req.status)}</td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/b2b-talepleri/${req.id}`}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#d4af37] hover:text-black font-semibold transition-all inline-flex items-center gap-1 min-h-[36px]"
                        >
                          <span>Detay</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
