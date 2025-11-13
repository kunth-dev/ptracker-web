# Backend Integration Guide for PTracker API

This document outlines the required backend changes or configurations needed for the PTracker web application to function properly with the backend API.

## Current Backend API Status

Based on the API documentation from [kunth-dev/ptracker-api](https://github.com/kunth-dev/ptracker-api), the following endpoints are available:

### Public Endpoints (No authentication required)
- ✅ `POST /api/auth/register` - User registration
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

### 1. OTP Verification for Signup

**Current Implementation:**
- The backend's `/api/auth/register` endpoint creates a user account
- The frontend shows an OTP verification step after registration
- However, the backend doesn't have a dedicated OTP verification endpoint for signup

**Options:**
1. **Keep current flow (Recommended for MVP)**: After the user enters the OTP (which is currently not validated), the frontend automatically logs them in using `/api/auth/login`
2. **Implement backend OTP verification**: Add a new endpoint to the backend API

**If Option 2 is chosen, add this endpoint to the backend:**

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

### 2. Password Reset Flow

**Current Status:**
The password reset flow is fully functional:
1. User requests reset code via `/api/auth/forgot-password`
2. Backend sends code to user's email (logged to console in dev)
3. User enters code and new password
4. Frontend calls `/api/auth/reset-password` to complete the process

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

#### 1. User Registration
```bash
# Test with the backend API directly
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected: User created successfully (201)

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
