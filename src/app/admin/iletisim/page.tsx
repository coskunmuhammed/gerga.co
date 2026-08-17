"use client";

import { useState, useEffect } from "react";
import { PhoneCall, Save, Check } from "lucide-react";

export default function AdminContactPage() {
  const [form, setForm] = useState({
    companyLegalName: "GERGA Tarım San. ve Tic. A.Ş.",
    displayBrandName: "GERGA Aegean Agriculture",
    contactPerson: "Mehmet Çoşkun",
    publicEmail: "info@gerga.co",
    b2bEmail: "b2b@gerga.co",
    phone: "+90 850 885 43 74",
    whatsapp: "+90 850 885 43 74",
    addressTr: "Büyük Menderes Havzası, Aydın, Türkiye",
    addressEn: "Büyük Menderes Basin, Aydın, Turkey",
    city: "Aydın",
    country: "Türkiye",
    websiteUrl: "https://gerga.co",
  });

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.contact) {
          setForm((prev) => ({ ...prev, ...d.contact }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMsg("Merkezi iletişim bilgileri güncellendi.");
      } else {
        setStatus("error");
        setMsg(data.message || "Kaydetme hatası.");
      }
    } catch {
      setStatus("error");
      setMsg("Sunucu hatası.");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <PhoneCall className="w-6 h-6 text-[#d4af37]" />
          <h1 className="text-2xl font-serif font-bold text-white">İletişim & İşletme Bilgileri</h1>
        </div>
        <p className="text-xs text-gray-400">
          Public site, vCard, QR yönlendirmeleri ve katalogda kullanılacak merkezi bilgileri yönetin.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0d100d]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Resmî Şirket Adı</label>
            <input
              type="text"
              value={form.companyLegalName}
              onChange={(e) => setForm({ ...form, companyLegalName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Marka / Display Name</label>
            <input
              type="text"
              value={form.displayBrandName}
              onChange={(e) => setForm({ ...form, displayBrandName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Telefon</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">WhatsApp Hattı</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Genel E-Posta</label>
            <input
              type="text"
              value={form.publicEmail}
              onChange={(e) => setForm({ ...form, publicEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">B2B İhracat E-Posta</label>
            <input
              type="text"
              value={form.b2bEmail}
              onChange={(e) => setForm({ ...form, b2bEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Adres (TR)</label>
            <input
              type="text"
              value={form.addressTr}
              onChange={(e) => setForm({ ...form, addressTr: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Address (EN)</label>
            <input
              type="text"
              value={form.addressEn}
              onChange={(e) => setForm({ ...form, addressEn: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={status === "saving"}
            className="px-6 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158]"
          >
            <Save className="w-4 h-4" />
            <span>Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
