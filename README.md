<div align="center">

<img src="public/logo/zkr.jpg" alt="ZKR Estate Logo" width="110" style="border-radius:16px" />

# 🏡 ZKR Estate

### Find Your Dream Home — Browse, Save & Book Viewings in One Place

A modern, full-stack real estate platform built with **Next.js 14**, **Prisma**, **PostgreSQL** and **NextAuth** — designed for buyers, renters, agents and admins.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![NextAuth](https://img.shields.io/badge/Auth.js-Authentication-7C3AED?style=for-the-badge)](https://authjs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Live Demo](#) · [Report a Bug](#) · [Request a Feature](#)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Screenshots](#-screenshots)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Database Schema](#-database-schema)
- [Roles & Permissions](#-roles--permissions)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Connect](#-connect-with-me)

---

## ✨ About the Project

**ZKR Estate** is a production-grade real estate web application that connects property seekers with agents. It supports browsing and searching listings, saving favorites, booking appointments, messaging between users and agents, and a full analytics dashboard for agents and admins.

Built with attention to performance, accessibility, and a clean, Airbnb/Bayut-inspired UI — fully responsive across mobile, tablet, and desktop.

---

## 🖼️ Screenshots

<div align="center">

| Home Page | Property Listings |
|:---:|:---:|
| ![Home](public/screenshots/screen1.png) | ![Listings](public/screenshots/screen2.png) |

| Property Details | Search & Filters |
|:---:|:---:|
| ![Details](public/screenshots/screen3.png) | ![Search](public/screenshots/screen4.png) |

| Dashboard Overview | Manage Properties |
|:---:|:---:|
| ![Dashboard](public/screenshots/screen5.png) | ![Manage Properties](public/screenshots/screen6.png) |

| Messages | Mobile View |
|:---:|:---:|
| ![Messages](public/screenshots/screen7.png) | ![Mobile](public/screenshots/screen8.png) |

</div>

> 📌 Place your screenshots inside `public/screenshots/` using the names above (`screen1.png` → `screen8.png`, or however many you have). Add/remove rows in this table to match.

---

## 🚀 Key Features

- 🔐 **Secure Authentication** — Credentials-based auth with NextAuth, protected routes via middleware
- 🏘️ **Property Listings** — Create, edit, delete and browse properties with rich filters
- 🔎 **Smart Search** — Global navbar search with keyboard shortcut (⌘K / Ctrl+K), plus advanced filters (city, status, bedrooms, bathrooms, price range)
- ❤️ **Favorites** — Save properties to revisit later
- 📅 **Appointments** — Book and manage property viewings
- 💬 **Messaging** — Direct messaging between users and agents
- 📊 **Analytics Dashboard** — Real-time stats, growth charts, and activity feed for agents/admins
- 🛡️ **Role-Based Access** — Visitor, User, Agent, and Admin roles with scoped permissions
- 🌗 **Dark Mode** — Full light/dark theming
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop devices
- ⚡ **Server-Rendered Performance** — Built on the Next.js App Router with React Server Components

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth (Auth.js) v5 |
| Forms & Validation | React Hook Form + Zod |
| State Management | Zustand |
| Icons | Lucide React |

---

## 📁 Project Structure

```
ZKR-Estate/
├── prisma/                 # Prisma schema & seed script
├── public/
│   ├── logo/                # App logo (zkr.jpg)
│   └── screenshots/          # README screenshots
├── src/
│   ├── actions/             # Server actions (e.g. logout)
│   ├── app/
│   │   ├── (auth)/            # Login / Register routes
│   │   ├── (main)/            # Public site (home, properties)
│   │   ├── admin/             # Admin-only routes
│   │   ├── api/               # API route handlers
│   │   └── dashboard/         # User/Agent dashboard
│   ├── components/
│   │   ├── dashboard/         # Dashboard widgets (stats, charts, sidebar)
│   │   ├── layout/             # Navbar, Footer
│   │   ├── property/           # Property cards & detail views
│   │   ├── search/              # Search section
│   │   └── ui/                   # Reusable UI primitives
│   ├── lib/                   # Auth, Prisma client, utils, validations
│   ├── store/                  # Zustand stores
│   ├── types/                   # Shared TypeScript types
│   └── middleware.ts            # Route protection
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- A running PostgreSQL instance

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/zkr-estate.git
cd zkr-estate

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then fill in your own values (see below)

# 4. Push the Prisma schema to your database
npm run db:push

# 5. (Optional) Seed the database with demo data
npm run db:seed

# 6. Run the development server
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🔑 Environment Variables

Create a `.env` file at the project root based on `.env.example`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zkr_estate?schema=public"

# Auth.js
AUTH_SECRET="replace-with-openssl-rand-base64-32-output"
AUTH_TRUST_HOST=true

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secure `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed the database with demo data |

---

## 🗃️ Database Schema

Core models managed by Prisma:

- **User** — accounts, roles, and relations to properties, favorites, messages, appointments
- **Property** — listings with price, location, type, status, and images
- **Favorite** — saved properties per user
- **Message** — direct messages between users and agents
- **Appointment** — scheduled property viewings

See [`prisma/schema.prisma`](prisma/schema.prisma) for the full schema.

---

## 👥 Roles & Permissions

| Role | Capabilities |
|---|---|
| **Visitor** | Browse public listings |
| **User** | Save favorites, message agents, book appointments |
| **Agent** | All User permissions + create/manage own listings |
| **Admin** | Full platform management (users & properties) |

---

## 🗺️ Roadmap

- [ ] Email notifications for appointments & messages
- [ ] Map-based property search
- [ ] Payment/booking deposit integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🌐 Connect with Me

<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://your-portfolio.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/your-handle)
[![X](https://img.shields.io/badge/X-black?style=for-the-badge&logo=x&logoColor=white)](https://x.com/your-handle)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your-email@example.com)

</div>

<div align="center">
<sub>Built with ❤️ by the ZKR Estate team — if you like this project, consider giving it a ⭐!</sub>
</div>
```

