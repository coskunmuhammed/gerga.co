"use client";

import { useState, useEffect } from "react";
import { Wrench, Edit, Plus, Save } from "lucide-react";

interface ServiceItem {
  id: string;
  serviceType: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  status: string;
  ctaLabelTr?: string;
  ctaLabelEn?: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<ServiceItem> | null>(null);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success) {
          setServices(data.services || []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titleTr || !editingItem?.titleEn) return;
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      const data = await res.json();
      if (data.success) {
        setEditingItem(null);
        loadServices();
      }
    } catch {
      // Error
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Wrench className="w-6 h-6 text-[#d4af37]" />
            <h1 className="text-2xl font-serif font-bold text-white">Bahçe Kurulumu & Hizmet Yönetimi</h1>
          </div>
          <p className="text-xs text-gray-400">
            Toprak analizi, fidan dikim projeleri ve saha danışmanlığı hizmetlerini yönetin.
          </p>
        </div>
        <button
          onClick={() =>
            setEditingItem({
              serviceType: "ORCHARD_SETUP",
              titleTr: "",
              titleEn: "",
              descTr: "",
              descEn: "",
              status: "PUBLISHED",
            })
          }
          className="px-4 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158]"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Hizmet Ekle</span>
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
          <h3 className="text-sm font-serif font-bold text-white mb-2">Hizmet Düzenle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Hizmet Adı (TR)</label>
              <input
                type="text"
                required
                value={editingItem.titleTr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, titleTr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Service Title (EN)</label>
              <input
                type="text"
                required
                value={editingItem.titleEn || ""}
                onChange={(e) => setEditingItem({ ...editingItem, titleEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-full border border-white/20 text-gray-300 text-xs font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158]"
            >
              <Save className="w-4 h-4" />
              <span>Kaydet</span>
            </button>
          </div>
        </form>
      )}

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Yükleniyor...</div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">Henüz hizmet tanımlanmamış.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {services.map((svc) => (
              <div key={svc.id} className="p-4 flex items-center justify-between hover:bg-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">{svc.titleTr}</h4>
                  <span className="text-xs text-gray-400">({svc.titleEn})</span>
                </div>
                <button
                  onClick={() => setEditingItem(svc)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
