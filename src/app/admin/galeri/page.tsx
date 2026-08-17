"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Plus, Trash2, Save } from "lucide-react";

interface MediaAssetItem {
  id: string;
  filename: string;
  url: string;
  altTextTr?: string;
  altTextEn?: string;
  category: string;
  isPlaceholder: boolean;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    filename: "",
    url: "",
    altTextTr: "",
    altTextEn: "",
    category: "Gallery",
    isPlaceholder: true,
  });

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.success) {
        setAssets(data.media || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success) {
          setAssets(data.media || []);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.filename || !form.url) return;
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdding(false);
        setForm({ filename: "", url: "", altTextTr: "", altTextEn: "", category: "Gallery", isPlaceholder: true });
        loadAssets();
      }
    } catch {
      // Error
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Görseli silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      loadAssets();
    } catch {
      // Error
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ImageIcon className="w-6 h-6 text-[#d4af37]" />
            <h1 className="text-2xl font-serif font-bold text-white">Medya Kütüphanesi & Galeri</h1>
          </div>
          <p className="text-xs text-gray-400">
            Sitede kullanılan tüm görseller, kategori etiketleri ve alt metin yönetim paneli.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158]"
        >
          <Plus className="w-4 h-4" />
          <span>Görsel Tanımla</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
          <h3 className="text-sm font-serif font-bold text-white mb-2">Yeni Görsel Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Dosya Adı</label>
              <input
                type="text"
                required
                placeholder="gerga-orchard-01.jpg"
                value={form.filename}
                onChange={(e) => setForm({ ...form, filename: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Görsel URL / Path</label>
              <input
                type="text"
                required
                placeholder="/images/gallery/orchard.jpg"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Alt Metin (TR)</label>
              <input
                type="text"
                placeholder="Aydın incir bahçesi"
                value={form.altTextTr}
                onChange={(e) => setForm({ ...form, altTextTr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Alt Text (EN)</label>
              <input
                type="text"
                placeholder="Aydın fig orchard"
                value={form.altTextEn}
                onChange={(e) => setForm({ ...form, altTextEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-gray-400">Yükleniyor...</div>
        ) : assets.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-gray-400">Medya kütüphanesinde henüz dosya yok.</div>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="glass-card p-3 rounded-2xl border border-white/10 space-y-2 group relative">
              <div className="aspect-video bg-black/40 rounded-xl overflow-hidden flex items-center justify-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-300 truncate max-w-[120px]">{asset.filename}</span>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
