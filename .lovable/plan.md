## هعمل إعادة هيكلة كاملة للموقع على نفس structure الصور، بس بمحتوى Ark Matcha

### 1) Header + Announcement bar
- شريط علوي رفيع فيه tagline: **"Your Favorite Ceremonial Matcha"** (بدل "Your Fav' Matcha Store") — قابل للتعديل من الـ Dashboard.
- Header: **هامبرجر (شمال) · لوجو Ark Matcha (نص) · بحث + كارت (يمين)** — نفس الحالي تقريبًا لكن هنظّفه.
- **Side drawer menu** لما تدوس على الهامبرجر: Home · Catalog · Contact · Log in (تحت) + أيقونة انستجرام.

### 2) Hero section
- كارت أخضر كبير مربع بالشكل نفسه: خلفية matcha green، فيه صورة الـ tins بتاعتنا (نفس صور المنتج الحالية).
- تحته كارت أفتح بحواف مدورة فيه:
  - Headline: **"Explore Your Preferred Size"**
  - زرار **Shop now** (matcha green) → `/shop`
- كل النصوص والزرار قابلين للتعديل من Design Studio.

### 3) Featured products
- عنوان: **"Featured products"**
- Carousel أفقي (swipeable) بيعرض كل المنتجات، مع pagination `1/2` وأسهم.
- كل كارت: صورة مربعة + اسم المنتج + السعر + badge (Sold out / Discount) بنفس النمط الحالي.

### 4) Contact page (جديدة `/contact`)
- Header: **"Contact"**
- فورم: Name · Email* · Phone number · Comment · زرار **Send** (matcha green بدل البنفسجي).
- الرسايل بتتحفظ في جدول جديد `contact_messages` وتبان في الـ Admin Dashboard.

### 5) Newsletter section
- **"Subscribe to our emails"** + وصف + input إيميل بسهم دائري (نفس التصميم) + أيقونة انستجرام تحت.
- مربوطة بجدول `newsletter_subscribers` الموجود.

### 6) Footer
- سطر واحد بسيط: **© 2026, Ark Matcha · Privacy policy** — كما في الصورة.
- هنشيل footer الـ pill الحالي ونستبدله بده.
- صفحة `/privacy` بسيطة.

### 7) Admin Dashboard (Arabic)
- إضافة قسم **الرسايل (Contact Messages)**: عرض/حذف/تحديد كمقروء.
- إضافة تحكم في نص الـ Announcement bar، Hero headline، Subscribe headline/description.
- كل النصوص الجديدة في `site_settings.content`.

### 8) Database migration
- `contact_messages`: id, name, email, phone, message, is_read, created_at + RLS (insert للـ anon، select/delete للأدمن) + GRANTs.
- إضافة حقول جديدة في `content` JSONB (بدون migration جديد — JSONB).

### ملفات هتتعدل/تتنشئ
- `src/components/site/Header.tsx` — side drawer
- `src/components/site/Footer.tsx` — سطر بسيط
- `src/components/site/AnnouncementBar.tsx` — جديد
- `src/routes/index.tsx` — hero + featured carousel
- `src/routes/contact.tsx` — جديد
- `src/routes/privacy.tsx` — جديد
- `src/routes/_authenticated/admin.tsx` — قسم الرسايل + حقول نصية جديدة
- migration للـ `contact_messages`

### ملاحظات
- كل الألوان هتفضل matcha green (مش بنفسجي زي المرجع).
- الخط هيفضل Fraunces الحالي.
- الـ carousel هيبقى swipeable على الموبايل.
- كل التغييرات مربوطة بالـ Dashboard.

هل أبدأ التنفيذ؟ أو عايز تعدّل حاجة (مثلًا الـ tagline، أو تحب زرار "Send" يفضل بنفسجي زي المرجع)؟
