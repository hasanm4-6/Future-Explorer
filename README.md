# Future Explorer Frontend

This is the React frontend for Future Explorer, a parent-facing learning platform for managing child profiles, lessons, progress, downloads, privacy controls, and account settings.

## What's in the app

- Marketing and public pages: landing page, pricing, privacy, and privacy summary
- Authentication flow for parents
- Protected parent experience: dashboard, child profile creation, lesson map, lesson detail, downloads, settings, and data management
- Parent account actions: profile updates, password changes, logout, and account deletion
- Teacher dashboard route

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Vitest

## Local Development

### Prerequisites

- Node.js 18+
- npm
- The backend running locally on `http://localhost:5000`

### Start the frontend

```sh
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:8080`.

During local development, requests to `/api/*` are proxied to `http://localhost:5000` through [vite.config.ts](/d:/Future%20Explorer/code/frontend/vite.config.ts).

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run build:dev` builds using development mode
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint
- `npm run test` runs Vitest once
- `npm run test:watch` runs Vitest in watch mode

## Project Structure

- [src/App.tsx](/d:/Future%20Explorer/code/frontend/src/App.tsx): app routes and top-level providers
- [src/pages](/d:/Future%20Explorer/code/frontend/src/pages): route-level screens
- [src/components](/d:/Future%20Explorer/code/frontend/src/components): shared UI and layout components
- [src/contexts](/d:/Future%20Explorer/code/frontend/src/contexts): auth context provider
- [src/hooks](/d:/Future%20Explorer/code/frontend/src/hooks): reusable hooks
- [src/lib](/d:/Future%20Explorer/code/frontend/src/lib): API client, auth/session helpers, audit, utilities
- [src/types](/d:/Future%20Explorer/code/frontend/src/types): shared TypeScript types

## Main Routes

- `/` root route that resolves to the landing page or dashboard depending on auth state
- `/login` public auth flow
- `/pricing` public pricing page
- `/dashboard` protected parent dashboard
- `/create-child` protected child profile setup
- `/lessons` protected lesson map
- `/lesson/:id` protected lesson detail
- `/downloads` protected downloads page
- `/settings` protected account settings
- `/data-management` protected data management page
- `/teacher` protected teacher dashboard
- `/privacy` public privacy page
- `/privacy-summary` public privacy summary page
- `/parental-consent` parental consent flow

## Backend Integration

- The frontend talks to the backend through relative `/api` requests
- Authentication is cookie-based
- Parent profile, password, logout, and account deletion use backend auth endpoints
- Lesson and child-profile data are served through the backend, which connects to Supabase

## Production Notes

- The app builds into `frontend/dist`
- [vercel.json](/d:/Future%20Explorer/code/frontend/vercel.json) rewrites `/api/*` to the deployed backend and sends all other routes to `index.html`

## Verification

Useful checks while working:

```sh
npm run lint
npm run test
npm run build
```
