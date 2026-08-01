"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/b2b-talepleri");
      } else {
        setError(data.message || "Giriş başarısız.");
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b09] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111511] border border-[#d4af37]/30 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-[#d4af37] flex items-center justify-center bg-black mb-4">
            <span className="text-[#d4af37] font-serif font-bold text-xl">G</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold">GERGA Admin Panel</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">B2B Fuar Görüşme Yönetimi</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Admin Giriş Şifresi</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors min-h-[44px]"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#e5c158] transition-all flex items-center justify-center gap-2 shadow-lg min-h-[48px] disabled:opacity-50"
          >
            <span>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] font-mono text-gray-500">
          <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
          <span>HttpOnly Korumalı Güvenli Oturum</span>
        </div>
      </div>
    </div>
  );
}
