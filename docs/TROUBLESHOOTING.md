# Troubleshooting Guide

This guide helps you resolve common issues with the PTracker web application.

## Mixed Content Error (CORS Issue)

### Symptoms
You see an error in the browser console like:
```
Mixed Content: The page at 'https://yourdomain.com/login' was loaded over HTTPS, 
but requested an insecure XMLHttpRequest endpoint 'http://api.yourdomain.com/api/auth/login'. 
This request has been blocked; the content must be served over HTTPS.
```

### Cause
Your application is served over HTTPS but trying to make API requests over HTTP. Modern browsers block this for security reasons (Mixed Content Policy).

### Solution
Update your `VITE_API_BASE_URL` environment variable to use HTTPS:

**Incorrect:**
```bash
VITE_API_BASE_URL=http://api.yourdomain.com/api
```

**Correct:**
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### How to Fix

#### For Docker Deployments
1. Update your `.env` file on the server:
   ```bash
   cd /var/www/ptracker-web
   nano .env
   # Change VITE_API_BASE_URL to use https://
   ```

2. Rebuild and restart the container:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

#### For GitHub Actions Deployments
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions → Secrets
3. Update the `VITE_API_BASE_URL` secret to use `https://`
4. Re-run the deployment workflow

### Verification
After fixing:
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Reload your application
4. You should see a warning if HTTP is still being used:
   ```
   ⚠️ WARNING: Using HTTP API URL in production...
   ```
5. If you see this warning, the environment variable wasn't updated correctly

## CORS Errors During Development

### Symptoms
API requests fail with CORS errors when running `yarn dev` locally.

### Solution
The development server includes a proxy that should handle this automatically. Verify your setup:

1. Check your `.env` file has the correct API URL:
   ```bash
   VITE_API_BASE_URL=http://localhost:3002/api
   ```

2. Ensure the backend API is running at the configured URL

3. Restart the development server:
   ```bash
   yarn dev
   ```

If issues persist, check that the backend has CORS configured correctly. See [BACKEND_INTEGRATION.md](../BACKEND_INTEGRATION.md#cors-configuration).

## Backend API Not Responding

### Symptoms
- API requests timeout
- Network errors in console
- Can't login or register

### Solution
1. Verify the backend API is running:
   ```bash
   curl http://localhost:3002/api/health
   # or for production:
   curl https://api.yourdomain.com/api/health
   ```

2. Check the `VITE_API_BASE_URL` is correct in your `.env` file

3. Verify network connectivity between frontend and backend

4. Check backend logs for errors

## Authentication Issues

### Symptoms
- Can't login with correct credentials
- 401 Unauthorized errors
- Protected routes don't work

### Solution
1. Verify the bearer token matches between frontend and backend:
   - Frontend: Check `VITE_API_BEARER_TOKEN` in `.env`
   - Backend: Check `BEARER_TOKENS` in backend `.env`

2. Clear browser storage and try again:
   ```javascript
   // In browser console
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

3. Check if user exists in the database

## Build Errors

### Symptoms
`yarn build` fails with errors

### Solution
1. Clear cache and reinstall dependencies:
   ```bash
   rm -rf node_modules yarn.lock
   yarn install
   ```

2. Check for TypeScript errors:
   ```bash
   yarn tsc --project configs/tsconfig.json --noEmit
   ```

3. Verify Node.js version (requires 18+):
   ```bash
   node --version
   ```

## Docker Container Won't Start

### Symptoms
Container exits immediately or health check fails

### Solution
1. Check container logs:
   ```bash
   docker-compose logs -f web
   ```

2. Verify environment variables are set correctly:
   ```bash
   docker-compose config
   ```

3. Ensure port 3000 (or configured port) is not in use:
   ```bash
   sudo lsof -i :3000
   ```

4. Rebuild the image:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## Page Not Loading / Blank Screen

### Symptoms
Application loads but shows a blank page

### Solution
1. Check browser console for errors (F12 → Console)

2. Verify the build was successful:
   ```bash
   ls -la dist/
   # Should see index.html and assets/
   ```

3. Check nginx logs (if using Docker):
   ```bash
   docker-compose exec web cat /var/log/nginx/error.log
   ```

4. Try clearing browser cache and hard reload (Ctrl+Shift+R or Cmd+Shift+R)

## Need More Help?

If you're still experiencing issues:

1. Check the [Backend Integration Guide](../BACKEND_INTEGRATION.md)
2. Review the [README](../README.md) for setup instructions
3. Open an issue on GitHub with:
   - Description of the problem
   - Steps to reproduce
   - Browser console errors (if any)
   - Backend logs (if relevant)
   - Your environment (development/production, Docker/local, etc.)
