# Deployment Guide

This guide covers deploying VeriTrust+ to various platforms.

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Prerequisites

- GitHub account
- Vercel account (free)
- Project pushed to GitHub

### Steps

1. **Push to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect Next.js

3. **Configure Environment Variables**

In Vercel dashboard, add all environment variables from `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_CONTRACT_ADDRESS=...
NEXT_PUBLIC_CHAIN_ID=...
```

4. **Deploy**

- Click "Deploy"
- Wait for build to complete
- Your app is now live!

5. **Configure Custom Domain (Optional)**

- In Vercel project settings
- Go to "Domains"
- Add your custom domain
- Update DNS records as instructed

6. **Update Clerk URLs**

- In Clerk dashboard
- Update redirect URLs to your Vercel domain
- Example: `https://your-app.vercel.app/dashboard`

### Automatic Deployments

Vercel automatically deploys:

- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

---

## 🔷 Deploy to Netlify

### Steps

1. **Build Command**

```
npm run build
```

2. **Publish Directory**

```
.next
```

3. **Environment Variables**
   Add all variables from `.env.local` in Netlify dashboard

4. **Deploy**

- Connect your GitHub repository
- Configure build settings
- Click deploy

---

## 🐳 Deploy with Docker

### Create Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Create docker-compose.yml

```yaml
version: "3.8"

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    restart: unless-stopped
```

### Deploy

```bash
docker-compose up -d
```

---

## ☁️ Deploy to AWS

### Using AWS Amplify

1. **Install Amplify CLI**

```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. **Initialize Amplify**

```bash
amplify init
```

3. **Add Hosting**

```bash
amplify add hosting
```

4. **Deploy**

```bash
amplify publish
```

### Using AWS EC2

1. **Launch EC2 Instance**

- Choose Ubuntu 22.04 LTS
- t2.micro (free tier eligible)
- Configure security group (allow ports 80, 443, 22)

2. **Connect to Instance**

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Dependencies**

```bash
sudo apt update
sudo apt install -y nodejs npm nginx
```

4. **Clone and Build**

```bash
git clone your-repo-url
cd veritrust/frontend
npm install
npm run build
```

5. **Configure Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Start Application**

```bash
npm start
```

7. **Set Up PM2 (Process Manager)**

```bash
npm install -g pm2
pm2 start npm --name "veritrust" -- start
pm2 startup
pm2 save
```

---

## 🌐 Deploy to Google Cloud Platform

### Using Google Cloud Run

1. **Install gcloud CLI**

```bash
curl https://sdk.cloud.google.com | bash
gcloud init
```

2. **Build Container**

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/veritrust
```

3. **Deploy**

```bash
gcloud run deploy veritrust \
  --image gcr.io/PROJECT_ID/veritrust \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 📱 Deploy to Mobile (Coming Soon)

Build React Native apps from the same codebase:

```bash
# iOS
npm run build:ios

# Android
npm run build:android
```

---

## 🔒 Post-Deployment Checklist

### Security

- [ ] Enable HTTPS/SSL
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Secure environment variables
- [ ] Set up firewall rules
- [ ] Enable DDoS protection

### Performance

- [ ] Enable CDN
- [ ] Configure caching
- [ ] Optimize images
- [ ] Enable compression
- [ ] Set up monitoring

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts

### Maintenance

- [ ] Set up automated backups
- [ ] Configure auto-scaling
- [ ] Set up CI/CD pipeline
- [ ] Document deployment process
- [ ] Create rollback plan

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
          # ... other env vars

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🐛 Troubleshooting Deployment Issues

### Build Fails

**Issue**: Build fails with module errors
**Solution**:

```bash
rm -rf node_modules .next
npm install
npm run build
```

### Environment Variables Not Loading

**Issue**: App can't access environment variables
**Solution**: Ensure all variables are prefixed with `NEXT_PUBLIC_` for client-side access

### Database Connection Fails

**Issue**: Can't connect to Supabase
**Solution**: Check IP allowlist in Supabase settings

### Memory Issues

**Issue**: Build runs out of memory
**Solution**: Increase Node memory:

```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

---

## 📊 Performance Optimization

### After Deployment

1. **Enable Compression**

```javascript
// next.config.js
module.exports = {
  compress: true,
};
```

2. **Optimize Images**

- Use Next.js Image component
- Enable image optimization in Vercel

3. **Configure Caching**

```javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};
```

4. **Enable Analytics**

- Vercel Analytics
- Google Analytics
- Custom analytics

---

## 🎉 You're Live!

Your VeriTrust+ application is now deployed and accessible to users worldwide.

### Next Steps:

1. Monitor application health
2. Gather user feedback
3. Iterate and improve
4. Scale as needed

Need help? Join our [Discord community](https://discord.gg/veritrust)
