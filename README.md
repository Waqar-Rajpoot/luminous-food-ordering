# 🍔 Luminous Food Ordering

A full-stack online food ordering web application built with **Next.js 16**, **TypeScript**, and **MongoDB**. Users can browse food items, place orders, make payments via Stripe, and receive email confirmations — all in a modern, responsive UI.

🔗 **Live Demo:** [luminous-food-ordering.vercel.app](https://luminous-food-ordering.vercel.app)

---

## Features

- 🔐 **Authentication** — Secure login/signup with NextAuth.js and bcrypt password hashing
- 🛒 **Food Ordering** — Browse menu, add to cart, and place orders
- 💳 **Stripe Payments** — Full payment integration with Stripe
- 📧 **Email Notifications** — Order confirmation emails via Nodemailer and Resend
- 🤖 **AI Integration** — Powered by Groq SDK and OpenAI for smart features
- 📷 **Image Uploads** — Media management with ImageKit
- 📊 **Dashboard** — Analytics and order management with Recharts
- 📄 **PDF Export** — Generate order receipts with jsPDF
- 📱 **QR Code Support** — QR generation and scanning via qrcode.react and html5-qrcode
- 🌗 **Dark / Light Mode** — Theme toggle with next-themes
- 🎞️ **Animations** — Smooth UI transitions with Framer Motion
- ✅ **Form Validation** — React Hook Form + Zod schema validation
- 📅 **Date Handling** — Order scheduling powered by date-fns

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | NextAuth.js v4 |
| Payments | Stripe |
| Email | Nodemailer, Resend, React Email |
| AI | Groq SDK, OpenAI, Tavily |
| Storage | ImageKit |
| Styling | Tailwind CSS v4, Framer Motion |
| Forms | React Hook Form, Zod |
| Charts | Recharts |
| PDF | jsPDF, jsPDF-autotable |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB URI
- Stripe API keys
- ImageKit credentials
- Resend or SMTP credentials for email

### Installation

```bash
git clone https://github.com/Waqar-Rajpoot/luminous-food-ordering.git
cd luminous-food-ordering
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# Database
MONGODB_URI=your_mongodb_uri

# Auth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email
RESEND_API_KEY=your_resend_api_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# AI
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── src/
│   ├── app/          # Next.js App Router pages & API routes
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utility functions, DB connection, helpers
│   └── models/       # Mongoose data models
├── emailTemplates/   # React Email templates
├── public/           # Static assets
└── ...
```

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` triggers automatic redeployment.

---

## Author

**Waqar Rajpoot** — [GitHub](https://github.com/Waqar-Rajpoot) · [Portfolio](https://waqar-softwaredev-portfolio.vercel.app)