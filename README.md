# JouwLiedjes.nl - AI Music Generation Platform

Een commerciële platform voor het genereren van muziek met AI, gebouwd op de Suno API.

## 🚀 Features

- **€5 per liedje** - Eenvoudige, transparante prijzen
- **Mollie betalingen** - Veilige betalingsverwerking voor Nederlandse markt
- **Credit systeem** - Gebruikers kopen credits om liedjes te maken
- **AI muziekgeneratie** - Powered by Suno.ai API
- **Nederlandse interface** - Volledig in het Nederlands
- **User management** - Registratie, login, dashboard
- **Song library** - Overzicht en download van gemaakte liedjes
- **Mobile responsive** - Werkt op alle apparaten

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Mollie API
- **Music Generation**: Suno.ai API
- **Deployment**: Vercel

## 📦 Installation

1. **Clone repository**
```bash
git clone https://github.com/gcui-art/suno-api.git
cd suno-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Vul de volgende variabelen in:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jouwliedjes"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Suno API
SUNO_COOKIE=your-suno-cookie
TWOCAPTCHA_KEY=your-2captcha-key

# Mollie Payments
MOLLIE_API_KEY=test_your-mollie-key
MOLLIE_WEBHOOK_URL=https://jouwliedjes.nl/api/webhooks/mollie

# App Settings
PRICE_PER_SONG=5.00
CURRENCY=EUR
```

4. **Set up database**
```bash
npm run db:push
npm run db:generate
```

5. **Start development server**
```bash
npm run dev
```

## 🔧 Configuration

### Suno Cookie ophalen
1. Ga naar [suno.com/create](https://suno.com/create)
2. Open Developer Tools (F12)
3. Ga naar Network tab
4. Refresh de pagina
5. Zoek naar request met `?__clerk_api_version`
6. Kopieer de Cookie header waarde

### Mollie instellen
1. Maak account op [mollie.com](https://mollie.com)
2. Verkrijg API key uit dashboard
3. Stel webhook URL in: `https://jouwliedjes.nl/api/webhooks/mollie`

### 2Captcha instellen
1. Maak account op [2captcha.com](https://2captcha.com)
2. Verkrijg API key
3. Zorg voor voldoende saldo voor CAPTCHA solving

## 📝 API Endpoints

### Authentication
- `POST /api/register` - Gebruiker registratie
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### User Management
- `GET /api/user/profile` - Gebruikersprofiel

### Payments
- `POST /api/payments/create` - Nieuwe betaling
- `GET /api/payments/[id]` - Betalingsstatus
- `POST /api/webhooks/mollie` - Mollie webhook

### Songs
- `GET /api/songs` - Gebruiker liedjes
- `POST /api/songs/create` - Nieuw liedje maken
- `POST /api/songs/update-status` - Status updates

## 🚀 Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Database Setup
Voor productie gebruik een hosted PostgreSQL database zoals:
- Supabase
- PlanetScale
- Railway
- Neon

### Environment Variables voor Productie
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL=https://jouwliedjes.nl
MOLLIE_WEBHOOK_URL=https://jouwliedjes.nl/api/webhooks/mollie
MOLLIE_API_KEY=live_your-live-key
```

## 📋 To-Do voor Launch

- [ ] Database migratie naar productie
- [ ] SSL certificaat instellen
- [ ] Monitoring en logging
- [ ] Email notificaties
- [ ] Terms of Service / Privacy Policy
- [ ] Admin dashboard
- [ ] Analytics integratie

## 🔄 Cron Jobs

Voor optimale werking stel de volgende cron jobs in:

```bash
# Update song statuses elke 5 minuten
*/5 * * * * curl -X POST https://jouwliedjes.nl/api/songs/update-status

# Cleanup oude sessions daily
0 2 * * * curl -X POST https://jouwliedjes.nl/api/cleanup
```

## 📧 Support

Voor ondersteuning en vragen, neem contact op via:
- Email: support@jouwliedjes.nl
- Website: [jouwliedjes.nl](https://jouwliedjes.nl)

## 📄 License

Dit project is gelicenseerd onder LGPL-3.0-or-later license.