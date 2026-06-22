# GH Planner — Railway Edition 🚀

برنامه‌ریز هوشمند روزانه با هوش مصنوعی Groq (LLaMA 3.3)

## تکنولوژی‌ها

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS + Glass-morphism
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **AI**: Groq API — `llama-3.3-70b-versatile`
- **Hosting**: Railway

## نصب محلی

```bash
npm install
cp .env.example .env.local
# مقادیر را در .env.local پر کنید
npm run dev
```

## دیپلوی روی Railway

1. کد را به GitHub push کنید
2. در Railway: **New Project → Deploy from GitHub**
3. متغیرهای محیطی را از `.env.example` در Railway اضافه کنید
4. Railway خودکار build و deploy می‌کند

## متغیرهای محیطی

| متغیر | توضیح |
|-------|--------|
| `GROQ_API_KEY` | کلید API از [console.groq.com](https://console.groq.com) |
| `NEXT_PUBLIC_FIREBASE_*` | تنظیمات Firebase از Console |

## امکانات

- ✅ مدیریت وظایف با سیستم ستاره‌ای (نیم ستاره)
- 📊 نمودار پیشرفت روزانه و هفتگی
- 🤖 دستیار هوشمند با Groq AI
- 📝 یادداشت‌برداری ابری
- ⏰ ساعت تهران + یادآورها
- 🔥 سیستم streak روزانه
- 🌙 تم تاریک/روشن
- 🌐 دو زبانه (فارسی/انگلیسی)
