# Quick Fix Guide for Mixed Content Error

## The Problem
Your site at `https://khdev.ru` is trying to make API requests to `http://api.khdev.ru`, which causes this error:

```
Mixed Content: The page at 'https://khdev.ru/login' was loaded over HTTPS, 
but requested an insecure XMLHttpRequest endpoint 'http://api.khdev.ru/api/auth/login'. 
This request has been blocked; the content must be served over HTTPS.
```

## The Solution (Quick Fix)
Update your `VITE_API_BASE_URL` environment variable from HTTP to HTTPS:

**Change from:** `http://api.khdev.ru/api`  
**Change to:** `https://api.khdev.ru/api`

## How to Apply the Fix

### Option 1: Update GitHub Secrets (Recommended for CI/CD)
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions** → **Secrets**
3. Find `VITE_API_BASE_URL` and click **Update**
4. Change the value to: `https://api.khdev.ru/api`
5. Save the change
6. Go to **Actions** tab → **Deploy to Remote Server** → **Run workflow**

### Option 2: Update .env File on Server (Direct deployment)
1. SSH into your server:
   ```bash
   ssh your-username@your-server
   ```

2. Navigate to the application directory:
   ```bash
   cd /var/www/ptracker-web
   ```

3. Edit the .env file:
   ```bash
   nano .env
   ```

4. Change the line:
   ```bash
   VITE_API_BASE_URL=http://api.khdev.ru/api
   ```
   to:
   ```bash
   VITE_API_BASE_URL=https://api.khdev.ru/api
   ```

5. Save and exit (Ctrl+X, then Y, then Enter)

6. Rebuild and restart the container:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

7. Wait for the build to complete (about 1-2 minutes)

8. Verify the deployment:
   ```bash
   docker-compose ps
   docker-compose logs web
   ```

## Verify the Fix

1. Open your browser and go to `https://khdev.ru/login`
2. Press F12 to open Developer Tools
3. Go to the **Console** tab
4. Try to login
5. Check for errors:
   - ✅ **Good**: No Mixed Content errors
   - ❌ **Still broken**: See the troubleshooting section below

## Troubleshooting

### Still seeing the error?
The most common issue is that the environment variable wasn't updated correctly during the build. Make sure you:

1. Updated the correct .env file or GitHub Secret
2. Rebuilt the Docker image (don't just restart - you need `--build`)
3. Cleared your browser cache

### How to check if the warning is in your build?
1. Open your browser and go to `https://khdev.ru`
2. Press F12 to open Developer Tools
3. Go to the **Console** tab
4. Look for this warning:
   ```
   ⚠️ WARNING: Using HTTP API URL in production...
   ```
5. If you see this warning, the environment variable is still set to HTTP

### Need more help?
See the comprehensive [Troubleshooting Guide](docs/TROUBLESHOOTING.md) for detailed solutions.

## Why This Happened

Your backend API supports both HTTP and HTTPS, but your frontend was configured to use HTTP. When the frontend is served over HTTPS (which is good for security), browsers block HTTP requests to prevent Mixed Content vulnerabilities.

The fix simply ensures both frontend and backend communicate over HTTPS.

## Prevention

This repository now includes several safeguards to prevent this issue in the future:

1. **Runtime Warning**: The application will show a console warning if HTTP is detected in production
2. **CI/CD Validation**: GitHub Actions will fail the deployment if HTTP URL is detected
3. **Documentation**: Multiple documents now emphasize the HTTPS requirement
4. **Examples**: All .env examples now show HTTPS for production

## Additional Resources

- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Comprehensive solutions for common issues
- [Backend Integration Guide](BACKEND_INTEGRATION.md) - API configuration details
- [README](README.md) - General setup and deployment instructions
