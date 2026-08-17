"use client";

import { useState, useEffect } from "react";
import { Share2, Plus, Edit, Trash2, Save } from "lucide-react";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  active: boolean;
  sortOrder: number;
}

export default function AdminSocialMediaPage() {
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<SocialLinkItem> | null>(null);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social-links");
      const data = await res.json();
      if (data.success) {
        setLinks(data.socialLinks || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/social-links")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success) {
          setLinks(data.socialLinks || []);
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
    if (!editing?.platform || !editing?.url) return;
    try {
      const res = await fetch("/api/admin/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (data.success) {
        setEditing(null);
        loadLinks();
      }
    } catch {
      // Error
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sosyal medya bağlantısını silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/admin/social-links?id=${id}`, { method: "DELETE" });
      loadLinks();
    } catch {
      // Error
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Share2 className="w-6 h-6 text-[#d4af37]" />
            <h1 className="text-2xl font-serif font-bold text-white">Sosyal Medya Bağlantıları</h1>
          </div>
          <p className="text-xs text-gray-400">
            Footer ve iletişim kartında görüntülenecek aktif sosyal medya hesaplarını yönetin.
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({
              platform: "LinkedIn",
              url: "https://linkedin.com/company/gergaco",
              active: true,
              sortOrder: links.length + 1,
            })
          }
          className="px-4 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158]"
        >
          <Plus className="w-4 h-4" />
          <span>Hesap Ekle</span>
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
          <h3 className="text-sm font-serif font-bold text-white mb-2">Sosyal Medya Hesabı Düzenle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Platform</label>
              <input
                type="text"
                required
                placeholder="LinkedIn, Instagram, YouTube..."
                value={editing.platform || ""}
                onChange={(e) => setEditing({ ...editing, platform: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Profil / Sayfa URL</label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={editing.url || ""}
                onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditing(null)}
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
        ) : links.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">Henüz sosyal medya hesabı eklenmemiş.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {links.map((link) => (
              <div key={link.id} className="p-4 flex items-center justify-between hover:bg-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">{link.platform}</h4>
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-[#d4af37] hover:underline">
                    {link.url}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(link)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
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
