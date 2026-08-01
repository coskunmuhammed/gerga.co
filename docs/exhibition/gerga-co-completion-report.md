# GERGA.CO EXHIBITION LANDING — COMPLETION REPORT

**Tarih**: 1 Ağustos 2026  
**Etki Alanı**: `https://gerga.co`  
**Mimari**: Next.js App Router (SSG + API Route), Tailwind CSS, Framer Motion, TypeScript  

---

## 1. KALDIRILAN DOĞRULANMAMIŞ İDDİALAR (TRUTHFULNESS CLEANUP)

İşletme tarafından henüz belgelenmemiş, ölçülmemiş veya doğrulanmamış tüm abartılı, sayısal ve sertifikasyon iddiaları kod tabanından ve içerik sözlüklerinden tamamiyle kaldırılmıştır:

| Kaldırılan İddia / Metin | Yerine Eklenen Güvenli Kurumsal Metin (TR) | Replacement (EN) |
| :--- | :--- | :--- |
| `%100 Organik`, `Organik Sertifikalı` | *Belge bilgisi talep üzerine paylaşılacaktır* | *Supporting documents will be shared upon request* |
| `Sıfır kalıntı`, `Sıfır pestisit` | *Teknik veri doğrulama aşamasında* | *Technical information is pending verification* |
| `35+ ihracat ülkesi` | *Fuar öncesi güncellenecektir* | *Will be updated before the exhibition* |
| `250.000+ fidan kapasitesi` | *Üretim ve kapasite bilgileri işletme tarafından sağlanacaktır* | *Production and capacity details will be provided by the business* |
| `300+ gün güneş`, `3200 saat` | *Doğal iklim ve Ege rüzgâr dengesi* | *Natural climate & Aegean breeze balance* |
| `Virüs indeksli klonal fidan`, `Doku kültürü` | *Çeşide doğru ve sağlıklı incir fidanı temini* | *Supply of true-to-type, healthy fig saplings* |
| `pH 6.8 - 7.2` | *Süzek ve alüvyal toprak yapısı* | *Well-drained alluvial soil profiles* |
| `10 yıllık ROI garantisi` | *Teknik veri ve fizibilite modelleri doğrulama aşamasında* | *Feasibility models are pending verification* |
| `FSSC 22000`, `Halal`, `Kosher` | *Belge ve sertifikasyon bilgisi talep üzerine paylaşılacaktır* | *Certifications shared upon request* |
| `1978`, `2010`, `2018` kuruluş tarihleri | *GERGA kurumsal tanıtım akışı* | *GERGA corporate presentation flow* |

---

## 2. TÜRKÇE VE İNGİLİZCE İÇERİK MİMARİSİ (`i18n`)

- **URL Yapısı**: `/tr` ve `/en` static prerender edilmiş rotalar.
- **Dil Hatırlama**: Kullanıcının dil tercihi `NEXT_LOCALE` çerezinde saklanır.
- **Bağlam Koruma**: Dil değiştirildiğinde sayfa içi `#hash` konumu korunur.
- **SEO & Canonical**: `tr-TR` ve `en` için `hreflang` etiketleri ve localized metadata tanımlanmıştır.

### 11-Adımlı Sadeleştirilmiş Sayfa Akışı:
1. **Hero**: Exact overline, headline, description, CTAs & safe disclaimer notice.
2. **GERGA’nın Kısa Tanımı (`#intro`)**: 4 ana temel sütun (Seçkin Ürünler, Fidan Üretimi, Bahçe Kurulumu, Akademi).
3. **Ege ve İncir Kökeni (`#aegean`)**: Doğal rüzgâr, toprak ve iklim yapısı.
4. **Ürün Yaklaşımı (`#products`)**: Kuru incir, taze incir, ezme ve zeytinyağı seçkisi.
5. **Fidan Üretimi (`#nursery`)**: Çeşide doğru fidan temini ve adaptasyon.
6. **Bahçe Kurulumu ve Saha Hizmetleri (`#engineering`)**: Saha analizi, sulama ve dikim terbiye sistemleri.
7. **GERGA Akademi (`#academy`)**: Toprak sağlığı ve uygulamalı yetiştiricilik birikimi.
8. **Fuar Görüşmesi ve B2B İletişim (`#b2b-meeting`)**: Gerçek `/api/b2b-meeting` API endpointine bağlı B2B başvuru formu.
9. **Galeri (`#gallery`)**: Temsilî görsel arşivi ve tam ekran lightbox modalı.
10. **İletişim ve Dijital Kart (`#contact`)**: QR kodu, `.vcf` vCard indirme, WhatsApp bağlantısı ve PDF Kataloğu "Yakında" alanı.
11. **Footer**: Kurumsal bildirim, dil seçici ve telif hakları.

---

## 3. FUAR KULLANICI AKIŞLARI VEYA YETENEKLERİ

1. **Mobil QR Tarama**: Ziyaretçi stantta veya broşürdeki QR kodu taratarak `https://gerga.co/tr` veya `https://gerga.co/en` adresine yönlendirilir.
2. **1-Tık vCard İndirme**: Ziyaretçiler telefon rehberine GERGA iletişim bilgilerini `.vcf` dosyası olarak anında kaydedebilir.
3. **Canlı B2B Form Submission**: Form doldurulduğunda sunucu tarafında doğrulanır ve `/api/b2b-meeting` endpointi üzerinden işlenir.
4. **Anlık Dil Değişimi**: Mobil menüden veya header'dan TR <-> EN geçişleri kesintisiz olarak sağlanır.

---

## 4. MEDYA VE PLACEHOLDER MODELİ (`isPlaceholder: true`)

Tüm görseller `src/config/media.ts` dosyası üzerinden merkezi olarak yönetilmektedir:
- `isPlaceholder: true` bayrağı ile işaretlenmiştir.
- Alt metinler ve altyazılar "Ege incir bahçelerini temsil eden temsili görsel" / "Representative visual of Aegean fig orchards" biçimindedir.
- Gerçek GERGA üretim fotoğrafları temin edildiğinde `/public/images/` klasörüne eklenerek saniyeler içinde güncellenebilir.

---

## 5. GERÇEK İŞLETMEDEN ALINMASI GEREKEN BİLGİLER (PRE-PRODUCTION CHECKLIST)

Canlı fuar öncesinde işletme yönetiminden doğrulanıp sisteme girilmesi gereken veriler:

- [ ] Gerçek GERGA bahçeleri ve fidanlık üretim sahaları fotoğrafları
- [ ] İşletmenin resmi kuruluş yılı ve kurumsal tarihçe detayları
- [ ] Varsa resmi sertifika belgeleri (PDF / Tarama kopyaları)
- [ ] İşletmenin yıllık ortalama fidan üretim adedi ve stok listesi
- [ ] Gerçek ürün spesifikasyon föyleri (Nem %, Brix %, Ambalaj tipleri)
- [ ] Resmi ürün ve hizmet PDF kataloğu (Sitedeki "Yakında" alanına bağlanacaktır)
- [ ] Stant ve fuar katılım takvimi (Tarihler ve stant numaraları)

---

## 6. MOBİL VE PERFORMANS TEST SONUÇLARI

- **Mobil Ekran Uyumu (360px - 430px)**: Tek kolonlu form düzeni, minimum 44px dokunmatik butonlar (`min-h-[44px]`), tam ekran duyarlı mobil çekmece menüsü.
- **Hero Görsel Optimize Yükleme**: `priority` ve optimized WebP/PNG formatı.
- **Klavye & Erişilebilirlik**: Form alanları semantik `<input>` ve `<select>` elemanları ile oluşturulmuş, `focus:border-[#d4af37]` stilleri tanımlanmıştır.

---

## 7. BUILD SONUÇLARI

```bash
Route (app)
┌ ○ /
├ ○ /_not-found
├ ● /[lang]
│ ├ /tr
│ └ /en
└ ƒ /api/b2b-meeting

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```
- **TypeScript**: Hata yok (Zero TS errors).
- **Static Page Generation**: `/tr` ve `/en` yolları başarıyla static HTML olarak derlendi.
- **API Endpoint**: `/api/b2b-meeting` dynamic server route olarak hazırlandı.

---

**Sonuç**: Site, abartılı veya asılsız iddialardan tamamen arındırılmış, %100 dürüst, profesyonel, şık ve fuarlarda güvenle sunulabilir bir B2B marka tecrübesine dönüştürülmüştür.
