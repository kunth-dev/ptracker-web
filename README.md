# PTracker Web

A modern web application built with React, TypeScript, and React Router featuring authentication with OTP verification and ShadCN UI components.

## Features

- 🔐 **Authentication System**
  - Login with email and password
  - Signup with OTP verification
  - Password reset via OTP
  - Session persistence
  - Protected routes

- 🎨 **Modern UI**
  - ShadCN UI components
  - Tailwind CSS styling
  - Dark mode support
  - Responsive design

- 🔧 **Developer Experience**
  - TypeScript for type safety
  - ESLint for code quality
  - Prettier for code formatting
  - Hot module replacement with Vite

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v3
- **UI Components**: ShadCN UI (Radix UI)
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

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

**Deploy:**
1. Go to the "Actions" tab in your GitHub repository
2. Select "Deploy to Remote Server" workflow
3. Click "Run workflow"

The workflow will:
- Validate required secrets
- Copy files to `/var/www/ptracker-web` on the remote server
- Build and deploy using Docker Compose
- Verify the deployment

## Building for Production

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
ptracker-web/
├── src/
│   ├── components/
│   │   ├── ui/              # ShadCN UI components
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/
│   │   ├── Login.tsx        # Login page with forgot password
│   │   ├── Signup.tsx       # Signup page with OTP
│   │   └── Home.tsx         # Protected home page
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Authentication Flow

### Login
1. User enters email and password
2. Credentials are validated
3. User is redirected to home page on success

### Signup
1. User enters email and password
2. OTP is sent to email (simulated)
3. User enters 6-digit OTP code
4. Account is created and user is logged in

### Password Reset
1. User clicks "Forgot password?" on login page
2. User enters email address
3. OTP is sent to email (simulated)
4. User enters OTP and new password
5. Password is reset successfully

## UI Components

The project uses ShadCN UI components including:
- Button
- Input
- Label
- Card
- InputOTP (for verification codes)

## License

ISC