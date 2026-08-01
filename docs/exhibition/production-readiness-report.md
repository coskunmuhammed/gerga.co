# GERGA.CO — PRODUCTION READINESS & B2B OPERATIONS REPORT

**Tarih**: 1 Ağustos 2026  
**Etki Alanı**: `https://gerga.co`  
**Mimari**: Next.js App Router (SSG + Dynamic API), Prisma ORM + PostgreSQL / SQLite, Zod, Framer Motion, TypeScript  

---

### 1. JSON Persistence’ın Kaldırılması
- Local filesystem tabanlı `data/b2b-submissions.json` dosya kayıt mekanizması **tamamen kaldırılmıştır**.
- Serverless / multi-instance deployment ortamlarında yaşanabilecek veri kaybı, eş zamanlı dosya çakışmaları ve JSON bozulması riskleri ortadan kaldırılmıştır.

---

### 2. Kullanılan Database ve ORM
- **ORM**: Prisma ORM (v6.19.3)
- **Database Engine**: PostgreSQL (Production) / SQLite (Local & Testing)
- DB erişimi `src/lib/database/prisma.ts` singleton mimarisi ile sunucu tarafında yalıtılmıştır; client bileşenlerinde Prisma bağımlılığı bulunmamaktadır.

---

### 3. Prisma Modelleri ve Migration Durumu
- `prisma/schema.prisma` içerisinde directive gereksinimlerine birebir uygun olarak aşağıdaki modeller ve enumlar tanımlanmıştır:
  - **Model**: `B2BMeetingRequest` (`id`, `referenceNumber`, `fullName`, `companyName`, `country`, `email`, `phone`, `interestArea`, `message`, `preferredLanguage`, `status`, `privacyAccepted`, `privacyVersion`, `privacyAcceptedAt`, `marketingAccepted`, `marketingVersion`, `marketingAcceptedAt`, `source`, `internalNote`, `createdAt`, `updatedAt`, `archivedAt`)
  - **Enumlar**: `B2BRequestStatus` (NEW, REVIEWING, CONTACTED, QUALIFIED, CLOSED, SPAM), `B2BInterestArea` (PRODUCT_SUPPLY, WHOLESALE, SAPLINGS, ORCHARD_ESTABLISHMENT, CONSULTANCY, DISTRIBUTION, OTHER), `SupportedLocale` (TR, EN)
- **Local / Staging Migration**: `npx prisma db push` ve `npx tsx prisma/seed.ts` başarıyla çalıştırılmıştır.
- **Production Migration**: Canlı veritabanı bağlantısı `DATABASE_URL` tanımlandıktan sonra `npx prisma migrate deploy` komutu ile canlıya uygulanacaktır.

---

### 4. B2B Kayıt Akışı
1. İstek Parsing & Body Size Kontrolü (Max 64KB)
2. IP bazlı Rate Limiting
3. Zod Şema Doğrulaması (Client tarafından admin/sistem alanlarının gönderilmesi engellenmiştir)
4. Honeypot & Minimum Form Doldurma Süresi (Min 1500ms)
5. Son 5 Dakikada Aynı E-posta + Mesaj İle Mükerrer Başvuru (Duplicate) Kontrolü
6. Güvenli Sunucu Zaman Damgası ile Consent Snapshot Oluşturma
7. Veritabanı Persistence İşlemi
8. Asenkron Bildirim Adapter Çağrısı
9. Güvenli HTTP 201 Created Response

---

### 5. Referans Numarası Stratejisi
- Format: `GERGA-B2B-2026-XXXXXX` (Çakışmasız Rastgele Hex/Sayı Üretimi)
- Referans numarası yalnızca veritabanına kayıt **başarıyla yazıldıktan sonra** kullanıcıya dönülmektedir. Kayıt başarısızsa referans numarası üretilmez ve gösterilmez.

---

### 6. Consent ve Privacy Yapısı
- **Zorunlu**: Privacy Notice Acknowledgement (KVKK Aydınlatma Onayı)
- **Opsiyonel**: Marketing Communication Consent (Ticari İleti İzni)
- Tüm consent zaman damgaları (`privacyAcceptedAt`, `marketingAcceptedAt`) istemci saati yerine **sunucu saati** esas alınarak kaydedilmektedir.
- Metinler taslak niteliğinde olup canlı yayına geçilmeden önce hukuki incelemeden geçirilmelidir.

---

### 7. Spam ve Rate-Limit Koruması
- **Honeypot**: Gizli input alanı (dolu gelmesi durumunda 400 hatası)
- **Hızlı Form Doldurma Koruması**: `formStartTime` kontrolü ile 1.5 saniyenin altındaki otomatik bot gönderimleri engellenir.
- **Rate Limiter**: IP bazlı `MemoryRateLimiter` (5 istek / 60 sn).
- **Log Anonimleştirme**: PII (ad, e-posta, telefon, mesaj) ve açık IP adresleri production loglarına yazılmaz. Loglar yalnızca `event`, `requestId`, `route`, `status`, `duration`, `errorCode`, `referenceNumber` bilgilerini içerir.

---

### 8. E-posta Bildirim Durumu
- `B2BNotificationService` ve `EmailNotificationServiceAdapter` arayüzleri oluşturulmuştur.
- **Mevcut Durum**: E-posta SMTP kimlik bilgileri ortam değişkenlerinde henüz yapılandırılmadığı için e-posta gönderimi pasiftir; başvurular doğrudan veritabanına kaydedilmekte, bildirim adımı güvenli şekilde atlanmaktadır (DB kaydı e-posta yokluğu sebebiyle geri alınmaz).

---

### 9. Admin Paneli ve Yetkilendirme
- **Korumalı Rotalar**: `/admin/giris`, `/admin/b2b-talepleri`, `/admin/b2b-talepleri/[id]`
- **Güvenlik**: `ADMIN_SESSION_SECRET` ve `ADMIN_PASSWORD` ile imzalanan HttpOnly, SameSite=Lax session çerezleri kullanılmıştır.
- **İşlevler**: Başvuru listeleme, arama, durum filtresi (YENİ, İNCELENİYOR, İLETİŞİME GEÇİLDİ, UYGUN, KAPATILDI, SPAM), durum değiştirme, dahili not ekleme, arşivleme ve SPAM olarak işaretleme.

---

### 10. CSV Export Güvenliği
- **Endpoint**: `/api/admin/export-csv` (Yalnızca oturum açmış admin tarafından erişilebilir)
- **Formula Injection Koruması**: `=`, `+`, `-`, `@` karakterleri ile başlayan tüm hücre içeriklerinin başına kesme işareti (`'`) eklenerek Excel/Calc üzerinde komut çalıştırma riskleri engellenmiştir.

---

### 11. QR ve vCard Yapılandırması
- vCard ve QR URL üretimi `src/config/site.ts` içerisindeki merkezi ortam değişkenlerinden beslenir.
- Yerinde olmayan iletişim bilgisi UI ve vCard çıktısında gizlenir; placeholder tel/adres yayınlanmaz.
- PDF Katalog bulunmadığı durumlarda UI'da şeffaf biçimde *"PDF katalog yakında yayınlanacaktır."* / *"The PDF catalogue will be available soon."* uyarısı gösterilir.

---

### 12. Screenshot Regression Sonuçları
Puppeteer ile 14 farklı ekran resmi üretilmiş ve doğrulanmıştır:
- Public TR/EN Ekranları: `desktop_tr_full.png`, `desktop_en_full.png`, `mobile_tr_full.png`, `mobile_en_full.png`, vb.
- Admin Paneli Ekranları: `admin_b2b_list.png`, `admin_b2b_detail.png`

---

### 13. Test ve Build Sonuçları
- **Prisma Schema & Generate**: PASS (`v6.19.3`)
- **TypeScript (`npx tsc --noEmit`)**: 0 Error PASS
- **ESLint (`npm run lint`)**: 0 Error, 0 Warning PASS
- **Test Suite (`npm run test`)**: 9/9 Test Passed (DTO validation, honeypot, privacy, ref format, CSV escaping, admin token verification)
- **Next.js Production Build (`npm run build`)**: 15 Statik ve Dinamik rota başarıyla prerender edilmiş ve derlenmiştir.

---

### 14. Deployment Environment Listesi
Production ortamında tanımlanması gereken değişkenler (`.env.example` referans alınmalıdır):
- `DATABASE_URL` (PostgreSQL bağlantı dizesi)
- `ADMIN_PASSWORD` (Admin giriş şifresi)
- `ADMIN_SESSION_SECRET` (Session imzalama gizli anahtarı)
- `GERGA_SITE_URL` (Canlı domain: `https://gerga.co`)
- Opsiyonel: `GERGA_PUBLIC_EMAIL`, `GERGA_PUBLIC_PHONE`, `GERGA_WHATSAPP_NUMBER`, `GERGA_ADDRESS`, `MAIL_PROVIDER`, `MAIL_FROM`, `MAIL_TO`

---

### 15. İşletmeden Alınması Gereken Gerçek Bilgiler
1. Stant numarası ve katılım sağlanacak fuar detayları
2. Gerçek kurumsal e-posta ve santral telefon numaraları
3. Yasal temsilci ve şirket adresi resmi unvan bilgileri
4. Dijital Ürün Kataloğu (PDF)

---

### 16. Henüz Tamamlanmayan Entegrasyonlar
1. Canlı SMTP / SendGrid E-posta sağlayıcısı (Değişkenler eklendiğinde adapter otomatik aktifleşecektir).
2. Canlı PostgreSQL veritabanına ilk migration çalıştırılması (`npx prisma migrate deploy`).
