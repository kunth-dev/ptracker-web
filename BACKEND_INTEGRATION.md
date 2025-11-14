# Backend Integration Guide for PTracker API

This document outlines the required backend changes or configurations needed for the PTracker web application to function properly with the backend API.

## Current Backend API Status

Based on the API documentation from [kunth-dev/ptracker-api](https://github.com/kunth-dev/ptracker-api), the following endpoints are available:

### Public Endpoints (No authentication required)
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/verify-email` - Verify email with OTP code (signup)
- ✅ `POST /api/auth/resend-verification-code` - Resend verification code (signup)
- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/auth/forgot-password` - Request password reset code
- ✅ `POST /api/auth/send-reset-code` - Resend password reset code
- ✅ `POST /api/auth/reset-password` - Reset password with code

### Protected Endpoints (Bearer token authentication required)
- ✅ `GET /api/user/:userId` - Get user information
- ✅ `PATCH /api/user/:userId` - Update user information
- ✅ `DELETE /api/user/:userId` - Delete user

## Required Backend Configuration

### 1. CORS Configuration

The backend must allow requests from the frontend domain. Update the `ALLOWED_DOMAINS` environment variable in the backend `.env` file:

```bash
# For local development
ALLOWED_DOMAINS=http://localhost:5173,http://localhost:3000

# For production (update with your actual domain)
ALLOWED_DOMAINS=https://your-domain.com
```

**Development Workaround:**

If you encounter CORS errors during local development even after configuring the backend CORS settings, the frontend includes a Vite proxy configuration that routes API requests through the Vite dev server. This proxy:

- Automatically intercepts requests to `/api/*` during development
- Forwards them to the backend API (configured via `VITE_API_BASE_URL`)
- Bypasses CORS restrictions by making requests server-side
- Only works in development mode (`yarn dev`)
- Does not affect production builds

The proxy is configured in `configs/vite.config.ts` and automatically enabled when running the development server.

### 2. Bearer Token Configuration

The frontend requires a valid bearer token to access protected endpoints. Configure this in the backend `.env`:

```bash
# Example - use a secure token in production
BEARER_TOKENS=your_secret_bearer_token_here,another_token_if_needed
```

Make sure the token configured here matches the `VITE_API_BEARER_TOKEN` in the frontend `.env` file.

## Frontend Configuration

The frontend needs to be configured with the correct API URL and bearer token. Update the `.env` file:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3002/api
VITE_API_BEARER_TOKEN=your_secret_bearer_token_here

# App Configuration
VITE_APP_NAME=PTracker
```

## Known Limitations / Future Work

### 1. Email Verification for Signup

**Current Implementation:**
- The backend's `/api/auth/register` endpoint creates a user account and sends a verification code
- The frontend now properly validates the OTP code using `/api/auth/verify-email` endpoint
- Users can resend verification codes using `/api/auth/resend-verification-code` endpoint
- After successful OTP verification, the frontend automatically logs the user in

**Required Backend Endpoints:**
If the backend doesn't have these endpoints yet, they need to be implemented:

```typescript
// POST /api/auth/verify-email
// Request body:
{
  "email": "user@example.com",
  "code": "123456"
}

// Response:
{
  "success": true,
  "message": "Email verified successfully"
}
```

```typescript
// POST /api/auth/resend-verification-code
// Request body:
{
  "email": "user@example.com"
}

// Response:
{
  "success": true,
  "message": "Verification code sent successfully"
}
```

### 2. Password Reset Flow

**Current Status:**
The password reset flow is fully functional:
1. User requests reset code via `/api/auth/forgot-password`
2. Backend sends code to user's email (logged to console in dev)
3. User enters code and new password
4. Frontend calls `/api/auth/reset-password` to complete the process
5. User can resend the reset code via `/api/auth/send-reset-code` if needed

**Note:** In production, the backend should send actual emails instead of logging codes to the console.

### 3. Email Service Integration

**Current Status:**
- The backend logs verification codes to the console
- No email service is currently configured

**Required for Production:**
Integrate an email service (SendGrid, AWS SES, etc.) in the backend to send:
- Registration verification codes
- Password reset codes

## Testing the Integration

### Prerequisites
1. Backend API running at `http://localhost:3002`
2. Frontend running at `http://localhost:5173` (dev) or `http://localhost:3000` (docker)
3. PostgreSQL database configured and running

### Test Cases

#### 1. User Registration and Email Verification Flow
```bash
# Step 1: Register a new user
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Check backend console for the verification code
# Step 2: Verify email with the code
curl -X POST http://localhost:3002/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# Optional: Resend verification code if needed
curl -X POST http://localhost:3002/api/auth/resend-verification-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected: User created (201), email verified (200)

#### 2. User Login
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected: Login successful with user data (200)

#### 3. Get User Info (Protected)
```bash
curl -X GET http://localhost:3002/api/user/USER_ID_HERE \
  -H "Authorization: Bearer your_secret_bearer_token_here"
```

Expected: User information returned (200)

#### 4. Password Reset Flow
```bash
# Step 1: Request reset code
curl -X POST http://localhost:3002/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check backend console for the code
# Optional: Resend reset code if needed
curl -X POST http://localhost:3002/api/auth/send-reset-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Step 2: Reset password with code
curl -X POST http://localhost:3002/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456","newPassword":"newpassword123"}'
```

Expected: Password reset successfully (200)

## Deployment Checklist

### Backend
- [ ] Configure CORS with frontend domain
- [ ] Set secure bearer tokens
- [ ] Configure email service for production
- [ ] Enable SSL/TLS for database connections
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable HTTPS

### Frontend
- [ ] Update `.env` with production API URL
- [ ] Update `.env` with production bearer token
- [ ] Configure GitHub Secrets for CI/CD:
  - `VITE_API_BASE_URL`
  - `VITE_API_BEARER_TOKEN`
  - `SERVER_SSH_HOST`
  - `SERVER_SSH_LOGIN`
  - `SERVER_SSH_PASSWORD`
- [ ] Test end-to-end flows in staging environment
- [ ] Enable HTTPS

## Support

For backend-specific issues, refer to:
- [Backend API Documentation](https://github.com/kunth-dev/ptracker-api/blob/master/docs/API.md)
- [Backend Database Setup](https://github.com/kunth-dev/ptracker-api/blob/master/docs/DATABASE.md)
- [Backend Deployment Guide](https://github.com/kunth-dev/ptracker-api/blob/master/docs/DEPLOYMENT.md)
