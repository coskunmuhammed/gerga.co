"use client";

import { useState, useEffect } from "react";
import { PackageCheck, Mail, Phone, MapPin } from "lucide-react";
import { B2BMeetingRequestEntity } from "@/domain/b2b/b2b-meeting-request";

export default function AdminSampleRequestsPage() {
  const [requests, setRequests] = useState<B2BMeetingRequestEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/sample-requests")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setRequests(d.sampleRequests || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <PackageCheck className="w-6 h-6 text-[#d4af37]" />
          <h1 className="text-2xl font-serif font-bold text-white">Numune Talepleri</h1>
        </div>
        <p className="text-xs text-gray-400">
          Public siteden iletilen tüm numune taleplerini, ürün seçimlerini ve adres bilgilerini inceleyin.
        </p>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Yükleniyor...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">Henüz kayıtlı numune talebi yok.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {requests.map((req) => (
              <div key={req.id} className="p-5 hover:bg-white/5 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#d4af37] font-bold">{req.referenceNumber}</span>
                    <h4 className="text-sm font-semibold text-white">{req.fullName}</h4>
                    <span className="text-xs text-gray-400">({req.companyName || "Şahıs"})</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    {new Date(req.createdAt).toLocaleString("tr-TR")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{req.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{req.phone || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{req.country || "-"}</span>
                  </div>
                </div>

                {req.interestedProduct && (
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#d4af37] inline-block">
                    İstenen Ürün / Miktar: <strong>{req.interestedProduct}</strong> {req.estimatedVolume ? `(${req.estimatedVolume})` : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
