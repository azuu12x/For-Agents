# ביטוח נסיעות לחו״ל - ביטוח ישיר

> תהליך רכישת ביטוח נסיעות מודרני לסוכנים

## 🚀 התקנה מהירה

```bash
# Clone the repo
git clone <your-repo-url>
cd travel-insurance-site

# Install dependencies
npm install

# Start dev server
npm run dev
```

## 📦 Build לפרודקשן

```bash
npm run build
```

הקבצים המוכנים נוצרים בתיקיית `dist/`.

## 🌐 Deploy

### GitHub Pages
1. Install gh-pages: `npm install -D gh-pages`
2. Add to `package.json` scripts: `"deploy": "gh-pages -d dist"`
3. Run: `npm run build && npm run deploy`

### Vercel / Netlify
פשוט חברו את ה-repo ותגדירו:
- Build command: `npm run build`
- Output directory: `dist`

## 📁 מבנה הפרויקט

```
src/
├── App.jsx          # קומפוננטת האפליקציה הראשית
├── App.css          # עיצוב האפליקציה
├── index.css        # סגנונות גלובליים
├── main.jsx         # נקודת כניסה
├── data/
│   ├── covers.js    # נתוני כיסויים ומצבים רפואיים
│   └── mockApi.js   # סימולציית נתוני API
public/
└── logo.png         # לוגו ביטוח ישיר
```

## 🎨 צבעי מותג

| צבע | HEX | שימוש |
|-----|-----|-------|
| כחול כהה | `#1B2D5B` | צבע ראשי, טקסט |
| קורל | `#EF4E6E` | כפתורים, הדגשות |
| ירוק | `#00875A` | אישור, תשובה שלילית |
| אדום | `#DE350B` | אזהרה, תשובה חיובית |

## ⚙️ טכנולוגיות

- React 19
- Vite
- CSS Modules (vanilla)
- Google Fonts (Heebo)
