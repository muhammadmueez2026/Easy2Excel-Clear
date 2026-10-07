# Deployment Guide

This document covers deploying Easy to Excel Clear to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Backend and frontend tested locally
- [ ] Security review completed
- [ ] API keys stored securely (never in git)
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Backup strategy in place

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Setup:**
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your repository
5. Configure build settings:
   - **Framework:** Vite
   - **Root Directory:** `./frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

**Environment Variables in Vercel:**
```
VITE_API_URL=https://your-backend-domain.com
```

**Deploy:**
- Vercel auto-deploys on git push
- Production URL: `https://your-project.vercel.app`

### Option 2: Netlify

1. Connect GitHub repository
2. Build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

3. Add environment variables in Netlify dashboard

### Option 3: Self-hosted

```bash
cd frontend
npm run build
# Serve dist/ folder with nginx or Apache
```

## Backend Deployment

### Option 1: Railway (Recommended)

1. Push code to GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub"
4. Select repository
5. Configure service:
   - **Root Directory:** `backend`
   - **Start Command:** `npm run build && npm start`

6. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   CLAUDE_API_KEY=sk-ant-...
   AI_MODEL=claude-sonnet-5-20250929
   ```

7. Deploy and get your production URL

### Option 2: Render

1. Connect GitHub repository
2. New Web Service
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. Add environment variables in dashboard

### Option 3: Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set CLAUDE_API_KEY=sk-ant-...
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Option 4: Docker

**Create `backend/Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

EXPOSE 5000
CMD ["node", "dist/app.js"]
```

**Build and run:**

```bash
cd backend
npm run build
docker build -t easy-to-excel-clear .
docker run -p 5000:5000 -e CLAUDE_API_KEY=sk-ant-... easy-to-excel-clear
```

## Database Setup (Optional)

For PostgreSQL production deployment:

### AWS RDS

1. Create RDS instance
2. Get connection string
3. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```

### Railway PostgreSQL

1. Add PostgreSQL plugin in Railway
2. Copy connection string
3. Update backend environment variables

## Security Configuration

### HTTPS

- Vercel/Railway automatically provide HTTPS
- For self-hosted: Use Let's Encrypt with nginx

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://backend:5000;
    }
}
```

### CORS Configuration

Update `backend/src/app.ts`:

```typescript
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
}));
```

### Rate Limiting

Add to backend:

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

## Environment Variables (Production)

### Backend
```
NODE_ENV=production
PORT=5000 (or auto-assigned)
CLAUDE_API_KEY=sk-ant-... (from Anthropic console)
AI_MODEL=claude-sonnet-5-20250929
```

### Frontend
```
VITE_API_URL=https://your-backend-url.com
```

## Monitoring

### Backend Logging

```typescript
// In app.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Check

Monitor health endpoint regularly:

```bash
curl https://your-api.com/api/health
```

### Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/node
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Performance Optimization

### Frontend

1. Enable compression:
```bash
npm install compression
```

2. Set cache headers in `.vercelconfig.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### Backend

1. Add gzip compression:
```typescript
import compression from 'compression';
app.use(compression());
```

2. Set appropriate timeouts:
```typescript
server.setTimeout(30000); // 30 seconds
```

## Database Backup (If using PostgreSQL)

```bash
# Automated daily backup
0 2 * * * pg_dump $DATABASE_URL > backup_$(date +\%Y\%m\%d).sql
```

## Scaling

### Horizontal Scaling

- Use load balancer (Railway/Render handle this)
- Ensure stateless backend design
- Use Redis for sessions (if needed)

### CDN

- Vercel: Built-in CDN
- Railway: Add Cloudflare for additional caching

## Troubleshooting

### 502 Bad Gateway

- Check backend is running
- Verify environment variables
- Check logs: `heroku logs --tail`

### CORS Errors

- Update CORS whitelist to include frontend URL
- Restart backend

### API Key Issues

- Verify API key is valid
- Check it's set in environment variables
- Restart services after changes

## Rollback Plan

### Git-based

```bash
# Revert to previous commit
git revert HEAD
git push
```

Vercel/Railway auto-deploy the previous version.

### Manual Rollback

Keep previous build archives:
```bash
# Railway/Render: Restart previous deployment
# Vercel: Use deployment history in dashboard
# Self-hosted: Have backup of previous docker image
```

## Maintenance

### Regular Updates

```bash
# Check for security updates
npm audit

# Update packages
npm update
```

### Monitor Costs

- Claude API: Watch token usage
- Database: Monitor query performance
- Storage: Monitor file cleanup

## Documentation

- API docs: Document all endpoints
- Deployment guide: Keep this updated
- Change log: Track all deployments

---

**Always test in staging before deploying to production.**
