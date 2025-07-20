# 🚀 Netlify Deployment Guide voor JouwLiedjes.nl

## 📋 Pre-requisites
- GitHub repository: ✅ https://github.com/JayFUts/jouwliedjes-nl
- Netlify account (gratis)
- API keys (zie onder)

## 🔧 Stap 1: API Keys Verzamelen

### A. Suno Cookie
1. Ga naar [suno.com/create](https://suno.com/create)
2. Login/register account
3. F12 → Network tab → Refresh
4. Find request met `clerk_api_version`
5. Copy Cookie header value

### B. Mollie API Key  
1. Ga naar [mollie.com](https://mollie.com)
2. Maak business account
3. Dashboard → Developers → API keys
4. Copy TEST key (begint met `test_`)

### C. 2Captcha Key
1. Ga naar [2captcha.com](https://2captcha.com)  
2. Register + deposit $5-10
3. Dashboard → API Key

## 🚀 Stap 2: Netlify Deployment

### Optie A: Via Netlify UI (Aanbevolen)
1. Ga naar [app.netlify.com](https://app.netlify.com)
2. Login met GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub → Select "jouwliedjes-nl" repository
5. Build settings worden automatisch gedetecteerd via netlify.toml

### Optie B: Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd /home/jayson/suno-project/suno-api
netlify init
netlify deploy --prod
```

## 🔑 Stap 3: Environment Variables

In Netlify Dashboard:
1. Site settings → Environment variables
2. Add deze variabelen:

```env
# Database
DATABASE_URL=postgresql://postgres:Karzan12345!@db.auurjjmfzrktijntakqe.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=https://jouwliedjes.netlify.app
NEXTAUTH_SECRET=hu2VaqVTiufcM2xTEInAea1cqYd/uazW+/LGSQs5TfY=

# Suno API
SUNO_COOKIE=[YOUR_SUNO_COOKIE_HERE]
TWOCAPTCHA_KEY=[YOUR_2CAPTCHA_KEY_HERE]

# Mollie Payments
MOLLIE_API_KEY=test_[YOUR_MOLLIE_TEST_KEY_HERE]
MOLLIE_WEBHOOK_URL=https://jouwliedjes.netlify.app/api/webhooks/mollie

# App Settings
PRICE_PER_SONG=5.00
CURRENCY=EUR

# Browser Settings
BROWSER=chromium
BROWSER_GHOST_CURSOR=false
BROWSER_LOCALE=en
BROWSER_HEADLESS=true

# Netlify Specific
RUNTIME_ENV=netlify
```

## 🌐 Stap 4: Custom Domain Setup

### In Netlify:
1. Site settings → Domain management
2. Add custom domain: jouwliedjes.nl
3. Netlify geeft je DNS settings

### In TransIP:
1. Login TransIP control panel
2. Domeinen → jouwliedjes.nl → DNS
3. Voeg toe volgens Netlify instructies:
   - A record: 75.2.60.5
   - CNAME record: www → jouwliedjes.netlify.app

## 📦 Stap 5: Post-Deployment Setup

### Database initialisatie:
```bash
# Wacht tot site live is, dan:
curl -X POST https://jouwliedjes.nl/api/db-setup \
  -H "Authorization: Bearer setup-database-now"
```

### Test de site:
1. Ga naar https://jouwliedjes.nl
2. Registreer test account
3. Test payment flow met Mollie test card
4. Generate test song

## 🐛 Troubleshooting

### Build Errors:
- Check Build logs in Netlify dashboard
- Zorg dat alle environment variables zijn ingesteld
- Check of Prisma correct genereert

### Function Errors:
- Netlify Functions logs bekijken
- Check of DATABASE_URL correct is
- Verify API keys zijn correct

### Payment Issues:
- Webhook URL moet exact matchen in Mollie dashboard
- Use Mollie TEST mode voor development

## 📊 Monitoring

### Netlify Analytics:
- Gratis 30 dagen analytics
- Site settings → Analytics

### Function Logs:
- Functions tab → View logs
- Real-time monitoring van API calls

## 💰 Kosten

- Netlify Free tier: 100GB bandwidth, 300 build minutes
- Voor productie: Netlify Pro ($19/maand) aanbevolen
- Database: Supabase free tier (500MB)
- Mollie: €0.29 per transactie

## 🚨 Belangrijke URLs na deployment:

- Live site: https://jouwliedjes.nl
- Netlify dashboard: https://app.netlify.com/sites/jouwliedjes
- API endpoints: https://jouwliedjes.nl/api/*
- Mollie webhook: https://jouwliedjes.nl/api/webhooks/mollie

## ✅ Deployment Checklist:

- [ ] Suno Cookie verkregen
- [ ] Mollie API key (test)
- [ ] 2Captcha key + credit
- [ ] Netlify deployment succesvol
- [ ] Environment variables ingesteld
- [ ] Custom domain geconfigureerd
- [ ] Database geïnitialiseerd
- [ ] Test transactie gedaan
- [ ] Test song gegenereerd

Succes! 🎉