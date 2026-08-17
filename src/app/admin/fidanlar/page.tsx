"use client";

import { useState, useEffect } from "react";
import { Plus, Sprout, Edit, Save } from "lucide-react";

interface SaplingItem {
  id: string;
  varietyCode: string;
  nameTr: string;
  nameEn: string;
  descTr: string;
  descEn: string;
  status: string;
  seasonalAvailabilityTr?: string;
  seasonalAvailabilityEn?: string;
  publicVisibility: boolean;
  sampleQuoteEnabled: boolean;
}

export default function AdminSaplingsPage() {
  const [saplings, setSaplings] = useState<SaplingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<SaplingItem> | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const loadSaplings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/saplings");
      const data = await res.json();
      if (data.success) {
        setSaplings(data.saplings || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/saplings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success) {
          setSaplings(data.saplings || []);
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
    if (!editingItem?.varietyCode || !editingItem?.nameTr) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/saplings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setEditingItem(null);
        loadSaplings();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Sprout className="w-6 h-6 text-[#d4af37]" />
            <h1 className="text-2xl font-serif font-bold text-[#f7f5ef]">Fidan Üretimi & Çeşit Yönetimi</h1>
          </div>
          <p className="text-xs text-gray-400">
            Fidanlık çeşidini, sezonluk temin durumunu ve teklif aktifliklerini yönetin.
          </p>
        </div>
        <button
          onClick={() =>
            setEditingItem({
              varietyCode: `VAR-${Date.now().toString().slice(-4)}`,
              nameTr: "",
              nameEn: "",
              descTr: "",
              descEn: "",
              status: "PUBLISHED",
              publicVisibility: true,
              sampleQuoteEnabled: true,
            })
          }
          className="px-4 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158]"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Çeşit Ekle</span>
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
          <h3 className="text-sm font-serif font-bold text-white mb-2">Fidan Çeşidini Düzenle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Çeşit Kodu</label>
              <input
                type="text"
                required
                value={editingItem.varietyCode || ""}
                onChange={(e) => setEditingItem({ ...editingItem, varietyCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Çeşit Adı (TR)</label>
              <input
                type="text"
                required
                value={editingItem.nameTr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameTr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Variety Name (EN)</label>
              <input
                type="text"
                required
                value={editingItem.nameEn || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Sezonluk Durum (TR)</label>
              <input
                type="text"
                placeholder="Örn: Ekim - Mart Arası Dikim"
                value={editingItem.seasonalAvailabilityTr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, seasonalAvailabilityTr: e.target.value })}
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
              disabled={status === "saving"}
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
        ) : saplings.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">Henüz fidan çeşidi eklenmemiş.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {saplings.map((sap) => (
              <div key={sap.id} className="p-4 flex items-center justify-between hover:bg-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#d4af37]">{sap.varietyCode}</span>
                    <h4 className="text-sm font-semibold text-white">{sap.nameTr}</h4>
                    <span className="text-xs text-gray-400">({sap.nameEn})</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{sap.seasonalAvailabilityTr || "Tüm Sezon"}</p>
                </div>
                <button
                  onClick={() => setEditingItem(sap)}
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
