# GERGA.CO — ADMIN CONTENT & OPERATIONS MANAGEMENT REPORT

Bu rapor, GERGA.CO platformunun işletme tarafından geliştiriciye ihtiyaç duyulmadan yönetilebilmesi için gerçekleştirilen admin içerik ve operasyon genişletmesini belgelemektedir.

---

## 1. Yönetilebilir Hale Getirilen Alanlar

Aşağıdaki tüm alanlar artık kod düzenlemesi gerektirmeksizin korumalı Admin Paneli üzerinden güncellenebilmektedir:

### 1. Site İçeriği & Bölümler (`/admin/site-icerigi`)
* **Hero Bölümü:** TR/EN Overline, TR/EN Headline, TR/EN Açıklama, Primary CTA TR/EN ve Secondary CTA TR/EN metinleri.
* **Bölüm Kontrolü (Section Control):** Sitedeki Hero, GERGA Tanıtımı, Ege Mirası, Ürünler, Fidanlık, Bahçe Kurulumu, Akademi, Fuar Sonrası Aksiyonlar, Galeri ve İletişim bölümlerinin tek tıkla **aktif/pasif** yapılması ve sıralamasının değiştirilmesi.

### 2. Fuar Yönetimi (`/admin/fuar-yonetimi`)
* Exhibition Mode On/Off
* Fuar adı, Şehir, Ülke, Başlangıç/Bitiş Tarihi
* Salon (Hall) ve Stant Numarası
* TR/EN Banner Metinleri ve CTA Buton Hedefi
* Fuara özel İletişim Kişisi, WhatsApp ve E-Posta bilgileri
* Post-Exhibition Dönüşüm Modu

### 3. Ürün Portföyü (`/admin/urunler`)
* **Status:** `DRAFT` (Taslak), `PUBLISHED` (Yayında), `ARCHIVED` (Arşivli)
* **Portföy Türü:** `MAIN` (Ana Ürün Odağı - Kuru İncir) ve `PLANNED` (Gelecek Portföyü - Taze İncir, İncir Ezmesi, Zeytinyağı)
* TR/EN Ürün Adları, Kısa ve Detaylı Açıklamalar, Ambalaj ve Menşe Bilgileri
* Numune talebi aktiflik seçeneği

### 4. Fidan Üretimi (`/admin/fidanlar`)
* Çeşit kodu (Sarılop, Bursa Siyahı, Göklop vb.)
* TR/EN Çeşit Adları ve Açıklamaları
* Sezonluk temin edilebilirlik (Seasonal Availability)
* Teklif alma aktif/pasif seçeneği

### 5. Bahçe Kurulumu & Hizmetler (`/admin/hizmetler`)
* Toprak analizi, fidan dikim projeleri ve saha danışmanlık hizmetleri
* TR/EN Hizmet Başlığı ve Açıklamaları
* Hizmet adımları ve CTA butonları

### 6. GERGA Akademi (`/admin/akademi`)
* Akademi ana başlığı ve teknik rehber açıklamaları (TR/EN)

### 7. Medya Kütüphanesi & Galeri (`/admin/galeri`)
* Görsel yükleme, URL tanımlama ve önizleme
* TR/EN Alt Metin (Alt Text) ve Kategori tanımları
* Temsilî görseller için `isPlaceholder` etiketi

### 8. Dijital Katalog (`/admin/katalog`)
* TR/EN Katalog Başlıkları ve Giriş Metinleri
* Yazdırma (Print) ve PDF İndirme buton görünürlükleri

### 9. Merkezi İletişim Bilgileri (`/admin/iletisim`)
* Resmî şirket unvanı ve marka adı
* Genel E-posta, B2B İhracat E-posta, Telefon ve WhatsApp hattı
* TR/EN Adres bilgisi, Şehir ve Ülke

### 10. Sosyal Medya Bağlantıları (`/admin/sosyal-medya`)
* LinkedIn, Instagram, Facebook, YouTube, TikTok hesap URL'leri ve aktiflik durumları

### 11. SEO & Metadata (`/admin/seo`)
* Site genelinde geçerli TR/EN Meta Başlık (Meta Title) ve Meta Açıklama (Meta Description)
* Arama motoru indeksleme (Indexing Enabled) seçeneği

### 12. Yasal Metinler & Consent Versiyonları (`/admin/legal`)
* KVKK ve Gizlilik Politikası aydınlatma metinleri (TR/EN)
* Aktif sürüm kodu (ör. `v1.0`)

### 13. Numune Talepleri (`/admin/numune-talepleri`)
* Ziyaretçiler tarafından gönderilen numune paket talepleri, ürün tercihleri ve adres detayları listesi

### 14. First-Party Analitik (`/admin/analytics`)
* Sayfa ziyaretleri, B2B form tıklamaları, numune talepleri, vCard indirmeleri ve WhatsApp tıklamaları özeti

### 15. Sistem Ayarları (`/admin/ayarlar`)
* WhatsApp canlı destek widget'ı, katalog ve galeri modül aktiflikleri

---

## 2. Bilinçli Olarak Kodda Bırakılan Alanlar

Aşağıdaki teknik kurallar ve altyapı elemanları güvenlik ve kararlılık amacıyla kod seviyesinde korunmuştur:

* Server-side Zod DTO validasyon sınırları ve e-posta format doğrulamaları
* CSRF, Honeypot spam koruması ve Rate Limiter (5 istek / 60 sn) sınırları
* Oturum çerezi güvenlik mimarisi (`HttpOnly`, `SameSite=Lax`)
* CSV Formula Injection kaçış algoritmaları
* Canonical URL ve `hreflang="tr-TR"` / `hreflang="en"` rota yapısı

---

## 3. Yeni Prisma Modelleri

`prisma/schema.prisma` veritabanı şemasına eklenen yeni modeller:

* `SectionConfig` — Bölüm aktiflik ve sıralama modeli
* `SiteContent` — Esnek alan metin içerikleri modeli
* `Product` — Ürün şeması (`ContentStatus` ve `PortfolioType` enumlarlı)
* `Sapling` — Fidan üretim çeşitleri modeli
* `Service` — Hizmetler ve danışmanlık modeli
* `MediaAsset` — Medya kütüphanesi görsel modeli
* `SocialLink` — Sosyal medya bağlantıları modeli
* `LegalDocument` — Yasal metin ve sürüm modeli
* `AuditLog` — Admin işlem izleme ve audit kayıtları modeli
* `GlobalSettings` — Sistem genel ayarlar modeli
* `ContactConfig` — Merkezi iletişim bilgileri modeli
* `SeoConfig` — SEO metadata modeli

---

## 4. Admin Rota Listesi

* `/admin` — Otomatik yönlendirme
* `/admin/giris` — Güvenli Oturum Başlatma
* `/admin/b2b-talepleri` — B2B Lead Yönetimi
* `/admin/numune-talepleri` — Numune Paket Talepleri
* `/admin/site-icerigi` — Metin & Bölüm Yönetimi
* `/admin/fuar-yonetimi` — Fuar Mode & Stant Yönetimi
* `/admin/urunler` — Ürün Portföy Yönetimi
* `/admin/fidanlar` — Fidan Üretimi & Çeşitler
* `/admin/hizmetler` — Bahçe Kurulumu & Danışmanlık
* `/admin/akademi` — GERGA Akademi Metinleri
* `/admin/galeri` — Medya Kütüphanesi & Galeri
* `/admin/katalog` — Dijital Katalog Ayarları
* `/admin/iletisim` — Merkezi İletişim Bilgileri
* `/admin/sosyal-medya` — Sosyal Medya Bağlantıları
* `/admin/seo` — SEO & Metadata Yönetimi
* `/admin/legal` — Yasal Metinler & Consent
* `/admin/qr-kampanyalari` — QR Kampanya Yönetimi
* `/admin/analytics` — Analitik & Dönüşüm Tablosu
* `/admin/ayarlar` — Sistem Ayarları

---

## 5. Public Revalidation Yapısı

Admin paneli üzerinden yapılan her içerik ve ayar güncellemesinde `ContentService.triggerRevalidation()` fonksiyonu tetiklenir:

```typescript
revalidatePath("/[lang]", "layout");
revalidatePath("/tr");
revalidatePath("/en");
revalidatePath("/tr/katalog");
revalidatePath("/en/catalogue");
```

Bu sayede public sitede gereksiz ağır database sorguları yapılmaz, Next.js önbelleği anında yenilenir ve güncel veriler kullanıcıya sunulur.

---

## 6. Test ve Build Sonucu

Tüm sistem doğrulama komutları sırasıyla çalıştırılmış ve **%100 PASS** elde edilmiştir:

```bash
✔ npx prisma format        -> Formatted prisma\schema.prisma in 37ms 🚀
✔ npx prisma validate      -> The schema at prisma\schema.prisma is valid 🚀
✔ npx prisma generate      -> Generated Prisma Client (v6.19.3) 🚀
✔ npx tsc --noEmit         -> Code 0 (Sıfır TypeScript Hatası) 🚀
✔ npm run lint             -> Code 0 (Sıfır ESLint Uyarısı / Hatası) 🚀
✔ npm run test             -> 13 Passed, 0 Failed 🚀
✔ npm run build            -> 52 Pages & API Routes Compiled Successfully (Code 0) 🚀
```
