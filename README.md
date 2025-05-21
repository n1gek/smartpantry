# 🛒 Smart Pantry Manager
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

*A seamless grocery management experience with AI-powered recipe suggestions*

## 🌟 Features

### 🏷️ Pantry Management
- **Add/Remove Items** - Intuitive interface for managing pantry inventory
- **Expiration Tracking** - Never waste food again with smart expiry alerts
- **Category Organization** - Automatically categorize groceries (produce, dairy, etc.)

### 🧠 AI Integration
- **Recipe Generation** - GPT-powered personalized recipes using available ingredients
- **Smart Substitutions** - Suggests ingredient alternatives when items are missing
- **Dietary Adaptation** - Automatically adjusts recipes for dietary restrictions

### 📱 User Experience
- **Responsive Design** - Works flawlessly on desktop, tablet & mobile
- **Visual Inventory** - Photo-based item tracking (Material UI image upload)
- **Shopping List** - One-click transfer of missing ingredients to shopping list

## 🛠️ Tech Stack

| Category       | Technologies Used |
|----------------|-------------------|
| Frontend       | Next.js, Material UI, React Hook Form |
| Backend        | Node.js, Next.js API Routes |
| AI Integration | OpenAI API (GPT-4) |
| Database       | PostgreSQL/MySQL |
| Deployment     | Vercel/Netlify |
| Testing        | Jest, React Testing Library |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Firebase database
- OpenAI API key

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/smart-pantry.git
cd smart-pantry

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
