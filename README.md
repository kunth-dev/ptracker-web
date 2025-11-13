# PTracker Web

A modern web application built with React, TypeScript, and React Router featuring authentication with OTP verification, backend API integration, and ShadCN UI components.

## Features

- 🔐 **Authentication System**
  - Backend API integration with [ptracker-api](https://github.com/kunth-dev/ptracker-api)
  - Login with email and password
  - Signup with email verification
  - Password reset via OTP
  - Session persistence with Redux
  - Protected routes
  
- 🌐 **Internationalization**
  - Multi-language support (English and Russian)
  - i18next integration
  - Language switcher in UI

- 📋 **Form Management**
  - React Hook Form for all forms
  - Client-side validation
  - Error handling with translations

- 🎨 **Modern UI**
  - ShadCN UI components
  - Tailwind CSS styling
  - Dark mode support
  - Responsive design

- 🔧 **Developer Experience**
  - TypeScript for type safety
  - Redux Toolkit for state management
  - Axios for API calls
  - ESLint for code quality
  - Prettier for code formatting
  - Vitest for unit testing
  - Hot module replacement with Vite

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **State Management**: Redux Toolkit
- **Form Management**: React Hook Form
- **API Client**: Axios
- **Internationalization**: i18next + react-i18next
- **Styling**: Tailwind CSS v3
- **UI Components**: ShadCN UI (Radix UI)
- **Testing**: Vitest
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ and yarn
- Backend API running (see [Backend Setup](#backend-setup))
- Docker and Docker Compose (for containerized deployment)

### Installation

```bash
# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env

# Update .env with your backend API URL and bearer token
# VITE_API_BASE_URL=http://localhost:3002/api
# VITE_API_BEARER_TOKEN=your_secret_bearer_token_here
```

### Backend Setup

This frontend requires the PTracker API backend to be running. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed setup instructions.

Quick start:
1. Clone the backend: `git clone https://github.com/kunth-dev/ptracker-api`
2. Follow backend setup instructions
3. Ensure backend is running at `http://localhost:3002`
4. Configure CORS and bearer tokens

### Development

```bash
# Start development server
yarn dev
```

The application will be available at `http://localhost:5173/`

**Note:** The development server includes a proxy configuration that forwards API requests to the backend. This helps bypass CORS issues during local development. The proxy automatically routes requests from `/api/*` to your configured `VITE_API_BASE_URL`.

### Running Tests

```bash
# Run tests
yarn test

# Run tests with UI
yarn test:ui
```

### Docker Deployment

#### Local Development

Run the application using Docker Compose:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:3000/`

#### Production Deployment

The project includes automated deployment via GitHub Actions.

**Prerequisites:**
1. Configure the following secrets in GitHub repository settings:
   - `SERVER_SSH_HOST` - Your server hostname or IP
   - `SERVER_SSH_LOGIN` - SSH username
   - `SERVER_SSH_PASSWORD` - SSH password
   - `VITE_API_BASE_URL` - Backend API URL (e.g., `https://api.your-domain.com/api`)
   - `VITE_API_BEARER_TOKEN` - Backend API bearer token

**Deploy:**
1. Go to the "Actions" tab in your GitHub repository
2. Select "Deploy to Remote Server" workflow
3. Click "Run workflow"

The workflow will:
- Validate required secrets
- Copy files to `/var/www/ptracker-web` on the remote server
- Create `.env` file with environment variables
- Build and deploy using Docker Compose
- Verify the deployment

## Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3002/api` |
| `VITE_API_BEARER_TOKEN` | Bearer token for protected API endpoints | `your_secret_bearer_token_here` |
| `VITE_APP_NAME` | Application name | `PTracker` |

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

## Building for Production

```bash
# Build for production
yarn build
```

### Preview Production Build

```bash
# Preview the production build locally
yarn preview
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn test` - Run unit tests
- `yarn test:ui` - Run tests with UI

## Project Structure

```
ptracker-web/
├── src/
│   ├── components/
│   │   ├── ui/                    # ShadCN UI components
│   │   ├── ProtectedRootLayout.tsx
│   │   └── RootLayout.tsx
│   ├── constants/
│   │   ├── config.ts              # App configuration constants
│   │   └── errors.ts              # Error codes and translations
│   ├── helpers/
│   │   ├── __tests__/             # Helper unit tests
│   │   ├── validation.ts          # Validation helper functions
│   │   └── error.ts               # Error helper functions
│   ├── hooks/
│   │   └── useRedux.ts            # Redux typed hooks
│   ├── locales/
│   │   ├── en.json                # English translations
│   │   └── ru.json                # Russian translations
│   ├── pages/
│   │   ├── Login.tsx              # Login page with forgot password
│   │   ├── Signup.tsx             # Signup page with OTP verification
│   │   └── Home.tsx               # Protected home page
│   ├── services/
│   │   ├── api.ts                 # Axios API client
│   │   └── index.ts               # Auth and user services
│   ├── store/
│   │   ├── authSlice.ts           # Redux auth slice
│   │   └── index.ts               # Redux store configuration
│   ├── types/
│   │   ├── api.ts                 # API types
│   │   ├── user.ts                # User types
│   │   └── index.ts               # Type exports
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── i18n.ts                    # i18next configuration
│   ├── router.tsx                 # React Router configuration
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── configs/
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.js
│   └── tailwind.config.js
├── .env.example                   # Environment variables example
├── BACKEND_INTEGRATION.md         # Backend integration guide
├── vitest.config.ts               # Vitest configuration
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Authentication Flow

### Login
1. User enters email and password
2. Credentials are sent to backend API `/api/auth/login`
3. On success, user data is stored in Redux and localStorage
4. User is redirected to home page

### Signup
1. User enters email, password, and confirms password
2. Registration request is sent to backend API `/api/auth/register`
3. User is shown OTP verification screen
4. After entering OTP (currently auto-login), user is authenticated
5. User is redirected to home page

### Password Reset
1. User clicks "Forgot password?" on login page
2. User enters email address
3. Reset code request is sent to backend API `/api/auth/forgot-password`
4. Backend sends OTP to email (logged to console in development)
5. User enters 6-digit OTP and new password
6. Password reset request is sent to backend API `/api/auth/reset-password`
7. On success, user is prompted to login with new password

## API Integration

The application integrates with the PTracker backend API:

- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Authentication**: Bearer token for protected endpoints
- **Error Handling**: Centralized error handling with i18n translations
- **State Management**: Redux Toolkit for auth state

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for complete integration details.

## UI Components

The project uses ShadCN UI components including:
- Button
- Input
- Label
- Card
- InputOTP (for verification codes)

## License

ISC