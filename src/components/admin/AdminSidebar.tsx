"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  PackageCheck,
  Calendar,
  Layers,
  ShoppingBag,
  Sprout,
  Wrench,
  GraduationCap,
  Image as ImageIcon,
  BookOpen,
  PhoneCall,
  Share2,
  Search,
  FileText,
  QrCode,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import GergaLogo from "../GergaLogo";

const NAV_GROUPS = [
  {
    title: "Leads & Operasyon",
    items: [
      { href: "/admin/b2b-talepleri", label: "B2B Görüşmeler", icon: Users },
      { href: "/admin/numune-talepleri", label: "Numune Talepleri", icon: PackageCheck },
      { href: "/admin/qr-kampanyalari", label: "QR Kampanyaları", icon: QrCode },
      { href: "/admin/analytics", label: "Analitik Özet", icon: BarChart3 },
    ],
  },
  {
    title: "İçerik & Portföy",
    items: [
      { href: "/admin/site-icerigi", label: "Site İçeriği & Bölümler", icon: Layers },
      { href: "/admin/fuar-yonetimi", label: "Fuar Yönetimi", icon: Calendar },
      { href: "/admin/urunler", label: "Ürün Portföyü", icon: ShoppingBag },
      { href: "/admin/fidanlar", label: "Fidan Üretimi", icon: Sprout },
      { href: "/admin/hizmetler", label: "Bahçe & Danışmanlık", icon: Wrench },
      { href: "/admin/akademi", label: "GERGA Akademi", icon: GraduationCap },
      { href: "/admin/galeri", label: "Medya Kütüphanesi", icon: ImageIcon },
      { href: "/admin/katalog", label: "Dijital Katalog", icon: BookOpen },
    ],
  },
  {
    title: "İletişim & Sistem",
    items: [
      { href: "/admin/iletisim", label: "İletişim Bilgileri", icon: PhoneCall },
      { href: "/admin/sosyal-medya", label: "Sosyal Medya", icon: Share2 },
      { href: "/admin/seo", label: "SEO Yönetimi", icon: Search },
      { href: "/admin/legal", label: "Yasal & Consent", icon: FileText },
      { href: "/admin/ayarlar", label: "Sistem Ayarları", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/giris") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Ignore errors
    }
    router.push("/admin/giris");
  };

  return (
    <aside className="w-64 bg-[#0d100d] border-r border-white/10 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin/b2b-talepleri" className="flex items-center">
            <GergaLogo variant="inline" size="sm" theme="gold" showSubtitle={false} />
          </Link>
          <a
            href="/tr"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            title="Canlı Siteyi Aç"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Navigation Groups */}
        <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#d4af37] mb-2 font-semibold">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 shadow-sm"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/10 bg-[#090b09]">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Oturumu Kapat</span>
        </button>
      </div>
    </aside>
  );
}
