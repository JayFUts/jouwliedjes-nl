# 🚀 QUICK START - Morgen Direct Live Gaan

## 📍 WAAR JE BENT:
- ✅ Complete JouwLiedjes.nl platform gebouwd
- ✅ GitHub repo: https://github.com/JayFUts/jouwliedjes-nl  
- ✅ Database klaar: Supabase PostgreSQL
- 🔄 Wacht op: GitHub push + API keys + Vercel deployment

## ⚡ SNELLE START (30 minuten):

### STAP 1: GitHub Push (5 min)
```bash
cd /home/jayson/suno-project/suno-api

# Optie A: Personal Access Token
# 1. Ga naar: https://github.com/settings/tokens
# 2. Generate new token → select "repo" 
# 3. Run:
git remote set-url origin https://YOUR_TOKEN@github.com/JayFUts/jouwliedjes-nl.git
git push -u origin main
```

### STAP 2: API Keys (15 min)

**A. Suno Cookie (3 min):**
1. suno.com/create → F12 → Network → Refresh
2. Find `clerk_api_version` request → Copy Cookie

**B. Mollie Key (5 min):**  
1. mollie.com → Register → Dashboard → API Keys → Copy TEST key

**C. 2Captcha Key (5 min):**
1. 2captcha.com → Register → Deposit $5 → Copy API key

### STAP 3: Vercel Deploy (5 min)
1. vercel.com → Import GitHub repo
2. Add environment variables uit `deployment-env.txt`
3. Deploy

### STAP 4: DNS + Domain (5 min)
1. TransIP → jouwliedjes.nl → DNS → CNAME records
2. Vercel → Add domain: jouwliedjes.nl

## 🎯 RESULT: 
**jouwliedjes.nl LIVE!** 🎉

---

## 📋 ENVIRONMENT VARIABLES CHECKLIST:

Kopieer deze naar Vercel:

```
✅ DATABASE_URL=postgresql://postgres:Karzan12345!@db.auurjjmfzrktijntakqe.supabase.co:5432/postgres
✅ NEXTAUTH_URL=https://jouwliedjes.nl  
✅ NEXTAUTH_SECRET=hu2VaqVTiufcM2xTEInAea1cqYd/uazW+/LGSQs5TfY=
🔄 SUNO_COOKIE=[GET FROM SUNO.COM]
🔄 TWOCAPTCHA_KEY=[GET FROM 2CAPTCHA.COM]  
🔄 MOLLIE_API_KEY=[GET FROM MOLLIE.COM]
✅ MOLLIE_WEBHOOK_URL=https://jouwliedjes.nl/api/webhooks/mollie
✅ PRICE_PER_SONG=5.00
✅ CURRENCY=EUR
✅ BROWSER=chromium
✅ BROWSER_GHOST_CURSOR=false
✅ BROWSER_LOCALE=en
✅ BROWSER_HEADLESS=true
```

## 🚨 EMERGENCY BACKUP:

Als iets niet werkt, het project staat in:
- **Code**: `/home/jayson/suno-project/suno-api/`
- **Status**: `DEPLOYMENT_STATUS.md`
- **Env vars**: `deployment-env.txt`

Gewoon dit bestand openen en de stappen volgen! 💪