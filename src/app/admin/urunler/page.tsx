"use client";

import { useState, useEffect } from "react";
import { Plus, ShoppingBag, Edit, Trash2, Check, AlertCircle, Save } from "lucide-react";

interface ProductItem {
  id: string;
  status: string;
  portfolioType: string;
  sortOrder: number;
  nameTr: string;
  nameEn: string;
  shortDescTr: string;
  shortDescEn: string;
  category: string;
  packagingTr?: string;
  packagingEn?: string;
  sampleRequestEnabled: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<ProductItem> | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success) {
          setProducts(data.products || []);
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
    if (!editingItem?.nameTr || !editingItem?.nameEn) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMsg("Ürün başarıyla kaydedildi.");
        setEditingItem(null);
        loadProducts();
      } else {
        setStatus("error");
        setMsg(data.message || "Hata oluştu.");
      }
    } catch {
      setStatus("error");
      setMsg("Sunucu hatası.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      loadProducts();
    } catch {
      // Error
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ShoppingBag className="w-6 h-6 text-[#d4af37]" />
            <h1 className="text-2xl font-serif font-bold text-white">Ürün Portföy Yönetimi</h1>
          </div>
          <p className="text-xs text-gray-400">
            Public sitedeki Ana Ürünler (MAIN) ve Gelecek Portföy (PLANNED) ürünlerini yönetin.
          </p>
        </div>
        <button
          onClick={() =>
            setEditingItem({
              status: "PUBLISHED",
              portfolioType: "MAIN",
              sortOrder: products.length + 1,
              nameTr: "",
              nameEn: "",
              shortDescTr: "",
              shortDescEn: "",
              category: "Dried Figs",
              sampleRequestEnabled: true,
            })
          }
          className="px-4 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün Ekle</span>
        </button>
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

      {/* Edit Form Modal/Drawer */}
      {editingItem && (
        <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
          <h3 className="text-sm font-serif font-bold text-white mb-2">
            {editingItem.id ? "Ürünü Düzenle" : "Yeni Ürün Oluştur"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Ürün Adı (TR)</label>
              <input
                type="text"
                required
                value={editingItem.nameTr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameTr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Product Name (EN)</label>
              <input
                type="text"
                required
                value={editingItem.nameEn || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Portföy Statüsü</label>
              <select
                value={editingItem.portfolioType || "MAIN"}
                onChange={(e) => setEditingItem({ ...editingItem, portfolioType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              >
                <option value="MAIN">MAIN (Ana Ürün Odağı)</option>
                <option value="PLANNED">PLANNED (Planlanan Portföy)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Yayın Statüsü</label>
              <select
                value={editingItem.status || "PUBLISHED"}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              >
                <option value="PUBLISHED">PUBLISHED (Yayında)</option>
                <option value="DRAFT">DRAFT (Taslak)</option>
                <option value="ARCHIVED">ARCHIVED (Arşivli)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-1">Kısa Açıklama (TR)</label>
              <textarea
                rows={2}
                value={editingItem.shortDescTr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, shortDescTr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-1">Short Description (EN)</label>
              <textarea
                rows={2}
                value={editingItem.shortDescEn || ""}
                onChange={(e) => setEditingItem({ ...editingItem, shortDescEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-full border border-white/20 text-gray-300 text-xs font-medium hover:bg-white/5"
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

      {/* Product List */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Yükleniyor...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">Henüz ürün eklenmemiş.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {products.map((prod) => (
              <div key={prod.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">{prod.nameTr}</h4>
                    <span className="text-xs text-gray-400">({prod.nameEn})</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        prod.portfolioType === "PLANNED"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      }`}
                    >
                      {prod.portfolioType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-mono">
                      {prod.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{prod.shortDescTr}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingItem(prod)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
