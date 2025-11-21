# Form Submission App (Next.js 15 + Prisma + Tailwind)

A simple and clean form application built using **Next.js 15**, **App Router**, **Prisma**, and **Tailwind CSS**.  
Users can submit form data, which gets stored in a database, and can be viewed in the dashboard.

---

## 🚀 Tech Stack

- **Next.js 15 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL / MySQL / SQLite**
- **API Routes (Route Handlers)**

---

## 📂 Project Structure

/app
├── api/
│ └── form/route.ts → API to submit form data
├── page.tsx → Frontend form UI
/lib
└── prisma.ts → Prisma client config
/prisma
└── schema.prisma → Database models

.env.example
# Database (SQLite for local)
DATABASE_URL="file:./dev.db"

# SMTP (Gmail example - use app password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your@gmail.com

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repo
```bash
git clone https://https://github.com/khushboodaryani/form.git
cd <form>
