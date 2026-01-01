# خطوات النشر على Vercel

## المتطلبات
- حساب على [Vercel](https://vercel.com)
- تثبيت Vercel CLI (اختياري)

## الطريقة الأولى: النشر عبر Dashboard (الأسهل)

### 1. رفع المشروع إلى GitHub

```bash
cd web_server
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. النشر على Vercel

1. افتح [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط "New Project"
3. اختر المستودع من GitHub
4. اختر مجلد `web_server` كـ Root Directory
5. اضغط "Deploy"

### 3. الحصول على URL

بعد اكتمال النشر، ستحصل على رابط مثل:
```
https://your-project-name.vercel.app
```

---

## الطريقة الثانية: النشر عبر CLI

### 1. تثبيت Vercel CLI

```bash
npm i -g vercel
```

### 2. تسجيل الدخول

```bash
vercel login
```

### 3. النشر

```bash
cd web_server
vercel --prod
```

---

## بعد النشر

### تحديث ESP32 بالرابط الجديد

1. افتح ملف `esp32_code/environment_monitor.ino`
2. عدّل السطر 14 و 17:

```cpp
// للاختبار المحلي (علّق هذا السطر بعد النشر):
// const char* serverUrl = "http://192.168.1.237:3000/api/sensor-data";

// للاستخدام على Vercel (ألغِ التعليق وضع رابطك):
const char* serverUrl = "https://your-project-name.vercel.app/api/sensor-data";
```

3. أعد رفع الكود إلى ESP32

---

## اختبار الـ API

### اختبار POST (من Terminal)

```bash
curl -X POST https://your-project-name.vercel.app/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature":25.5,"humidity":60.2,"light":450,"gas":250}'
```

### اختبار GET

```bash
curl https://your-project-name.vercel.app/api/sensor-data
```

### فتح الواجهة

افتح المتصفح على:
```
https://your-project-name.vercel.app
```

---

## حل المشاكل الشائعة

### 1. خطأ 404 على `/api/sensor-data`

**السبب**: مسار الـ API غير صحيح

**الحل**: تأكد من وجود ملف `api/sensor-data.js` في المجلد الصحيح

### 2. CORS Error

**السبب**: إعدادات CORS غير صحيحة

**الحل**: تأكد من أن `api/sensor-data.js` يحتوي على:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

### 3. البيانات لا تتحدث

**السبب**: ESP32 يستخدم الرابط المحلي

**الحل**: تأكد من تحديث رابط الـ `serverUrl` في كود ESP32

### 4. خطأ في ESP32: `-1` أو `-11`

**السبب**: مشكلة في الـ HTTPS/SSL

**الحل**:
- تأكد من استخدام `https://` في الرابط
- قد تحتاج إلى إضافة شهادة SSL للـ ESP32:

```cpp
#include <WiFiClientSecure.h>

WiFiClientSecure client;
client.setInsecure(); // للتجاوز (غير آمن في الإنتاج)
```

---

## ملاحظات مهمة

⚠️ **تخزين البيانات**:
- البيانات حالياً تُخزن في الذاكرة (In-Memory)
- عند إعادة تشغيل Serverless Function، تُفقد البيانات
- للاستخدام الإنتاجي، يُنصح باستخدام قاعدة بيانات

**قواعد بيانات موصى بها**:
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv) (Redis)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Supabase](https://supabase.com)
- [Firebase Realtime Database](https://firebase.google.com)

---

## تحديثات مستقبلية

```bash
# في مجلد web_server
git add .
git commit -m "Update"
git push

# Vercel سينشر تلقائياً بعد Push
```

---

**تم! 🎉**
