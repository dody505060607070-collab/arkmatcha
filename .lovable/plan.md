# خطة تطوير الـ Admin Dashboard لتحكم كامل بالموقع

الهدف: تحويل الـ Admin لـ **Visual CMS** كامل — تقدر تغير أي حاجة في الموقع (لون، خط، نص، صورة، لوجو) من غير ما تلمس الكود، مع **Live Preview** جوة الأدمن يعرض شكل الموقع بنفس الـ UI ويحدّث لحظيًا قبل الحفظ.

---

## 1. Database — توسيع `site_settings`

نضيف أعمدة CMS شاملة (JSONB علشان مرن ومنظم):

- `logo_url` (نص) — صورة اللوجو
- `theme` (jsonb) — ألوان الموقع:
  ```
  { background, matcha, forest, olive, petal, text, accent }
  ```
- `typography` (jsonb) — الخط والمقاس لكل section:
  ```
  {
    global: { fontFamily, baseSize },
    headings: { fontFamily, weight, tracking },
    hero: { headlineSize, headlineWeight, taglineSize, labelSize },
    product: { titleSize, priceSize, labelSize },
    footer: { size }
  }
  ```
- `content` (jsonb) — كل النصوص القابلة للتعديل مقسّمة حسب الصفحة:
  ```
  {
    home: { announcement, heroLabel, heroHeadline, heroTagline, ctaText, featuredLabel },
    shop: { title, subtitle },
    product: { ingredientsTitle, storageTitle, shippingTitle, relatedTitle, addToCart, soldOut },
    blog: { title, intro, story },
    cart: { title, empty, checkout },
    checkout: { title, cod, submit },
    footer: { brandLine, tagline }
  }
  ```
- `fonts` (jsonb) — قائمة الخطوط المتاحة (Google Fonts) اللي الأدمن يقدر يختار منها

نحافظ على الأعمدة القديمة (hero_headline, hero_tagline ...) للتوافق، ونبني نظام fallback.

---

## 2. Runtime Theming — تطبيق الإعدادات على الموقع الحي

### `ThemeApplier` component (يتحمّل في `__root.tsx`)
- يقرأ `settingsQuery`
- يحقن CSS variables في `<html>`:
  - `--background`, `--matcha`, `--forest`, `--olive`, `--petal-strong` من `theme`
  - `--font-serif`, `--font-sans` من `typography.global`
- يحقن `<link>` لخطوط Google Fonts المختارة (dynamic)
- يحدّث `<style>` بمقاسات كل section عن طريق CSS custom properties (مثل `--hero-headline-size`)

### تعديلات على الـ CSS
- استبدال المقاسات الثابتة في `hero`, `product cards`, `footer` بـ `var(--hero-headline-size, 1.125rem)` مع fallback
- اللوجو في `Header.tsx` يقرأ من `settings.logo_url`

### `useContent()` hook
- يرجّع نصوص من `settings.content` مع fallback للنص الافتراضي
- كل صفحة تستخدمه بدل الـ hardcoded strings

---

## 3. Admin Dashboard — الـ UI الجديد

### هيكل الـ Admin (تبويبات)

```text
┌─────────────────────────────────────────────────┐
│  Ark Matcha Admin              [Save] [Reset]   │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│  Sidebar     │        Live Preview              │
│              │   (iframe للموقع مع hot-reload)  │
│  · Overview  │                                  │
│  · Theme     │   ┌────────────────────────┐     │
│  · Typography│   │                        │     │
│  · Content   │   │  Rendered mini-site    │     │
│  · Logo      │   │  (يعكس التغييرات فورًا)│     │
│  · Products  │   │                        │     │
│  · Orders    │   └────────────────────────┘     │
│  · SEO       │                                  │
│  · Announce  │                                  │
│  · General   │                                  │
└──────────────┴──────────────────────────────────┘
```

### تبويب **Theme** (الألوان)
- Color pickers + input hex لكل لون:
  - Background · Matcha (primary) · Forest · Olive · Petal · Text
- شرح بالعربي جنب كل لون: "ده لون الخلفية العام"، "ده لون الأزرار والاكسنت"...
- زرار **Reset to defaults**

### تبويب **Typography** (الخطوط)
- Dropdown لاختيار الخط الأساسي (Fraunces, Inter, Playfair, DM Serif, Cormorant, EB Garamond)
- لكل section:
  - Hero: مقاس العنوان، مقاس الوصف، الـ tracking
  - Product cards: مقاس العنوان، مقاس السعر
  - Footer: المقاس العام
- Preview مباشر جنب كل input
- شرح بالعربي: "دي مقاسات الخط بتاع كل جزء في الموقع"

### تبويب **Content** (النصوص)
- Accordion لكل صفحة (Home / Shop / Product / Blog / Cart / Checkout / Footer)
- كل حقل ليه label بالعربي + input/textarea
- مثال: "عنوان الـ Hero" → input فيه "The ritual starts here."

### تبويب **Logo**
- عرض اللوجو الحالي
- Upload جديد (Supabase Storage) أو URL

### تبويب **Live Preview**
- `<iframe src="/?preview=1">` بيعرض الموقع
- لما الأدمن يعدل أي حاجة، بنبعت `postMessage` للـ iframe يطبق التغييرات محليًا قبل الحفظ
- زرار **Save** يحفظ في الـ DB → الموقع الحقيقي يتحدّث لكل الزوار

---

## 4. الحفظ والتحديث

- زرار **Save** واحد يحفظ كل التغييرات في `site_settings` (id=1)
- بعد الحفظ: `queryClient.invalidateQueries(["site_settings"])` → كل الموقع يتحدث فورًا
- **Reset** يرجّع الافتراضيات

---

## 5. التنفيذ خطوة بخطوة

1. **Migration** — إضافة الأعمدة الجديدة (`logo_url`, `theme`, `typography`, `content`, `fonts`) مع defaults
2. **`ThemeApplier`** component + تعديل `styles.css` لاستخدام CSS variables ديناميكية
3. **`useContent()` hook** + تعديل الصفحات (Home, Shop, Product, Blog, Cart, Checkout, Footer, Header) لاستخدامه
4. **Admin UI الجديد**:
   - Layout بتبويبات + Live Preview iframe
   - Theme editor (color pickers)
   - Typography editor
   - Content editor (accordion per page)
   - Logo uploader
5. **postMessage bridge** بين الأدمن والـ iframe للـ live preview قبل الحفظ
6. **اختبار كامل**: تغيير لون → حفظ → التأكد إن الموقع اتغير; تغيير نص → حفظ → التأكد

---

## ملاحظات

- الحفاظ على الـ structure الحالي — مفيش تغيير في التصميم الافتراضي، بس بقى قابل للتعديل
- كل شرح في الأدمن **بالعربي** بشكل premium (زي ما اتفقنا)
- الأمان: كل الحقول لسه محمية بـ RLS (admin only)
- الخطوط بتتحمل من Google Fonts CDN عن طريق `<link>` في `__root.tsx` (متوافق مع Tailwind v4)

هوافقني وأبدأ التنفيذ؟