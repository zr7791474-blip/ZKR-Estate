
# ZKR Estate

A modern full-stack real estate platform for browsing, managing, and booking property listings. Built with a scalable architecture using Next.js 14 App Router, Prisma, PostgreSQL, and Auth.js (NextAuth).

---

## Banner

![ZKR Estate Banner](public/logo/zkr.jpg)

---

## Demo

**Live Website:**  
<LINK>

**Admin Panel:**  
<LINK>

**API:**  
<LINK>

### Demo Accounts

| Role  | Email | Password |
|------|------|----------|
| Admin | admin@zkrestate.com | password123 |
| Agent | agent@zkrestate.com | password123 |
| User  | user@zkrestate.com | password123 |

---

## Screenshots

| Screen 1 | Screen 2 |
|----------|----------|
| ![Screen 1](public/screenshots/screen1.png) | ![Screen 2](public/screenshots/screen2.png) |

| Screen 3 | Screen 4 |
|----------|----------|
| ![Screen 3](public/screenshots/screen3.png) | ![Screen 4](public/screenshots/screen4.png) |

---

## Table of Contents

- About the Project
- Features
- Tech Stack
- Architecture Overview
- Folder Structure
- Installation
- Environment Variables
- Running Locally
- Production Build
- Database Setup
- Authentication
- Main Pages
- User Roles & Permissions
- API Overview
- Performance Optimizations
- Security Features
- Responsive Design
- Accessibility
- Future Improvements
- Deployment
- Contributing
- License
- Contact

---

## About the Project

ZKR Estate is a real estate web application that connects property seekers with agents and administrators. Users can browse listings, filter properties, save favorites, book appointments, and communicate with agents through a messaging system.

The platform includes role-based access control, an admin dashboard, and an agent management interface.

---

## Features

- Secure authentication using Auth.js (NextAuth)
- Role-based access control (User, Agent, Admin)
- Property CRUD (Create, Read, Update, Delete)
- Advanced search and filtering system
- Favorites system
- Appointment booking system
- Messaging between users and agents
- Analytics dashboard for agents/admins
- Dark mode support
- Fully responsive UI
- Server-side rendering with Next.js App Router

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- TypeScript

### Backend
- Next.js API Routes
- Server Actions

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- Auth.js (NextAuth)

### Styling
- Tailwind CSS

### State Management
- Zustand

### Forms & Validation
- React Hook Form
- Zod

### UI Icons
- Lucide React

---

## Architecture Overview

The system follows a modular full-stack architecture:

- Presentation Layer: Next.js App Router UI
- Business Layer: Server Actions & API Routes
- Data Layer: Prisma + PostgreSQL
- Auth Layer: Auth.js (NextAuth)
- State Layer: Zustand

---

## Folder Structure

```bash
ZKR-Estate/
├── prisma/
├── public/
│   ├── logo/
│   └── screenshots/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── store/
│   ├── types/
│   ├── actions/
│   └── middleware.ts
└── package.json
````

---

## Installation

```bash
git clone <YOUR_REPOSITORY_URL>
cd zkr-estate
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

---

## Environment Variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

AUTH_SECRET="your-auth-secret"

AUTH_TRUST_HOST=true

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate secret:

```bash
openssl rand -base64 32
```

---

## Running Locally

```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
npm run start
```

---

## Database Setup

```bash
npm run db:push
npm run db:studio
npm run db:seed
```

Models:

* User
* Property
* Favorite
* Message
* Appointment

---

## Authentication

* Credentials-based login
* Session-based auth
* Role-based access control
* Protected routes via middleware

---

## Main Pages

* Home
* Properties
* Property Details
* Search & Filters
* Dashboard (User / Agent / Admin)
* Messages
* Favorites
* Appointments

---

## User Roles & Permissions

| Role  | Permissions                              |
| ----- | ---------------------------------------- |
| User  | Browse, save, message, book appointments |
| Agent | Manage properties, view analytics        |
| Admin | Full system control                      |

---

## API Overview

* `/api/auth/*`
* `/api/properties`
* `/api/messages`
* `/api/appointments`
* `/api/favorites`

---

## Performance Optimizations

* Next.js Server Components
* Image optimization
* Lazy loading
* Efficient Prisma queries
* SSR rendering

---

## Security Features

* Auth.js secure sessions
* Middleware protection
* Password hashing
* Input validation (Zod)
* Role-based authorization

---

## Responsive Design

* Mobile-first UI
* Tablet & desktop optimized
* Adaptive dashboards

---

## Accessibility

* Semantic HTML
* Keyboard navigation support
* ARIA-ready components

---

## Future Improvements

* Email notifications system
* Map-based search
* Payment integration
* Multi-language support
* Mobile app (React Native)

---

## Deployment

Recommended platforms:

* Vercel
* Railway
* Supabase

```bash
npm run build
```

---

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open pull request

---

## License

MIT License

---

## Contact

GitHub: [https://github.com/zr7791474-blip](https://github.com/zr7791474-blip)
X (Twitter): [https://x.com/zkr_ad](https://x.com/zkr_ad)
WhatsApp: [https://wa.me/212657516301](https://wa.me/212657516301)
Email: mailto:zr7791474@gmail.com?subject=Project%20Inquiry&body=Hello%20Zakaria,%0A%0AI%20would%20like%20to%20contact%20you%20regarding...

```
```
