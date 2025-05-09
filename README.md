# Eco Sphere Client

A modern web application built with **Next.js**, **React**, **TypeScript**, and
**Tailwind CSS** for browsing, submitting, and purchasing eco-friendly ideas.

---

## 🧰 Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **State Management:** Redux Toolkit
- **Form Handling:** React Hook Form + Zod
- **UI Components:** Radix UI + Shadcn/UI
- **Authentication:** JWT

---

## 🔧 Setup Guide

### Prerequisites

- Node.js (v18+ recommended)
- Package Manager (npm, yarn, or bun)

### 1. Clone the Repository

```bash
git clone https://github.com/theMorshed/assignment-eco-sphere-client.git
cd assignment-eco-sphere-client
```

### 2. Install Dependencies

To install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

## Environment Variables

Create a `.env.local` file and configure the following:

```
BASE_API="your backend api url"
```

## 📋 Features

- **Authentication:** Register, login, and profile management
- **Idea Management:** Browse, submit, and purchase eco-friendly ideas
- **Dashboard:** Separate dashboards for members and admins
- **Payment Integration:** Secure payment processing for idea purchases
- **Responsive Design:** Works on all devices from mobile to desktop
- **Dark/Light Mode:** Theme support for user preference

## 🛠️ Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run create:module` - Generate new module boilerplate

## 📁 Project Structure

```
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── modules/     # Feature-specific components
│   │   ├── shared/      # Reusable components
│   │   └── ui/          # UI components (shadcn/ui)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── scripts/         # Build and utility scripts
│   ├── services/        # API service functions
│   └── types/           # TypeScript type definitions
├── .env.local           # Environment variables
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🔒 Authentication

The application uses JWT-based authentication with token refresh capabilities.
Protected routes are handled through middleware that verifies the user's
authentication status and role.

## 🎨 UI Components

This project uses a combination of Radix UI primitives and Shadcn/UI components
for a consistent and accessible user interface. The design system supports both
light and dark modes through the next-themes package.

## 👥 Contributors

- [Pallab Kumar Sarker](https://github.com/PallabKumarS)
- [Manjur Morshed](https://github.com/theMorshed)

---

---

## Live Site

[Frontend Live Link](https://pks-eco-sphere-client.vercel.app)

[GitHub Repository](https://github.com/theMorshed/assignment-eco-sphere-client)
