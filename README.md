# Blog Admin Panel

A comprehensive admin panel application for blog management built with React.js, Tailwind CSS, and Vite.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (currently using Node.js 20.\*)
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**

```bash
cd blog-admin-panel
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

3. **Start development server:**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
blog-admin-panel/
├── public/                     # Static assets
├── src/                       # Source code
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Basic UI components
│   │   ├── layout/           # Layout components
│   │   └── forms/            # Form components
│   ├── pages/                # Page components
│   │   ├── auth/             # Authentication pages
│   │   ├── admin/            # Admin pages
│   │   └── blog/             # Blog management pages
│   ├── hooks/                # Custom React hooks
│   ├── context/              # React Context providers
│   ├── services/             # API services
│   ├── utils/                # Utility functions
│   ├── styles/               # Global styles
│   ├── App.jsx               # Main App component
│   ├── main.jsx              # Entry point
│   └── routes.jsx            # Route definitions
├── .env.example              # Environment variables template
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite build configuration
└── package.json              # Dependencies and scripts
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🎯 Current Status

### ✅ Completed (Phase 1)

- [x] Vite + React project setup
- [x] Tailwind CSS configuration
- [x] Basic folder structure
- [x] ESLint and Prettier setup
- [x] React Router configuration
- [x] Basic page components
- [x] Environment configuration

### 🚧 In Progress

- Phase 2: Authentication System (Next)

### 📋 Upcoming Features

- User authentication and authorization
- Blog post management (CRUD)
- User management (Admin)
- Dashboard with analytics
- Rich text editor
- File upload system
- Role-based access control

## 🔧 Technology Stack

### Core

- **React.js 19+** - Frontend framework
- **Vite 4+** - Build tool and development server
- **Tailwind CSS 4+** - Utility-first CSS framework
- **React Router 7+** - Client-side routing

### Additional Libraries

- **Axios** - HTTP client for API requests
- **React Hook Form** - Form handling and validation
- **Headless UI** - Unstyled, accessible UI components
- **Heroicons** - Beautiful SVG icons
- **clsx** - Conditional CSS classes

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

---

**Current Phase**: Phase 1 ✅ Completed  
**Next Phase**: Phase 2 - Authentication System  
**Project Start**: August 10, 2025  
**Last Updated**: August 10, 2025+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
