# Report2Resolve Frontend

## Overview

This repository contains the frontend application for the Report2Resolve system. It is a React + Vite app providing dashboard and reporting workflows for administrators, department users, and issue reporters.

The frontend is built to work with a backend service for authentication, report submission, and dashboard data. The app includes page routing, animated UI states, and a clean component structure.

## Architecture

- Frontend: `my-react-app`
- React 18 + Vite
- Client-side routing with `react-router-dom`
- Smooth UI animations using `framer-motion`
- Icon support via `react-icons` and `lucide-react`
- Backend API proxy configured in `package.json`
- API utilities centralized in `src/api.js`

## Features

### User Experience

- Onboarding flow with guidance for new users
- Authentication screens for login and protected access
- Issue reporting screen for submitting new service requests
- Home screen with task actions and quick navigation

### Dashboards

- Admin dashboard for monitoring overall report activity
- Department dashboard for team-specific report management
- Shared dashboard view for role-based access control

### UI & Integrations

- Responsive design for desktop and mobile layouts
- Animated route transitions and component motion
- Reusable UI components and style patterns
- Proxy-powered API integration with the backend

## Project Structure

```
my-react-app/
  public/
  src/
    api.js
    App.jsx
    main.jsx
    App.css
    index.css
    components/
      Button.jsx
    screens/
      AdminDashboard.jsx
      Auth.jsx
      dashboard.jsx
      DeptDashboard.jsx
      HomeScreen.jsx
      Onboarding.jsx
      ReportIssue.jsx
    styles/
      global.css
  package.json
  vite.config.js
  README.md
```

## Setup

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd d:\report2resolve\reactapp\my-react-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the application in your browser at the local URL shown in the terminal (usually `http://localhost:5173`).

## Build

Create a production-ready build:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

## API Integration

- Development API requests are proxied through Vite to the backend.
- Default backend URL: `http://127.0.0.1:8000`
- Frontend requests use `/api` in development and map to the backend API.

## Screens and Routes

- `HomeScreen.jsx` — entry point and quick actions
- `Onboarding.jsx` — onboarding experience
- `Auth.jsx` — authentication and login
- `ReportIssue.jsx` — submit issue reports
- `AdminDashboard.jsx` — admin metrics and controls
- `DeptDashboard.jsx` — department dashboard
- `dashboard.jsx` — shared dashboard layout

## Dependencies

- `react`
- `react-dom`
- `react-router-dom`
- `framer-motion`
- `react-icons`
- `lucide-react`

## Notes

- Keep the backend running at `http://127.0.0.1:8000` during frontend development so API requests work through the proxy.
- Update the proxy configuration in `package.json` if your backend host or port changes.


