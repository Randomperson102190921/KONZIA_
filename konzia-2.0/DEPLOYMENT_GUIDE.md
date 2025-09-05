# 🚀 KONZIA 2.0 Deployment Guide

## GitHub + Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account
- PostgreSQL database (Neon, Supabase, or Railway)

## 📋 Step-by-Step Deployment

### 1. **Upload to GitHub**

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: KONZIA 2.0 - Smart Grocery Tracker"

# Create repository on GitHub (via web interface)
# Then connect your local repo
git remote add origin https://github.com/your-username/konzia-2.0.git
git branch -M main
git push -u origin main
```

### 2. **Set up Database**

#### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in Vercel environment variables

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

#### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string

### 3. **Deploy Backend to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the backend:**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Set Environment Variables:**
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. **Deploy**

### 4. **Deploy Frontend to Vercel**

1. **Create another Vercel project**
2. **Configure the frontend:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

4. **Deploy**

### 5. **Update Backend CORS**

Update the backend CORS configuration to allow your frontend domain:

```typescript
// In backend/src/server.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))
```

### 6. **Set up Database Schema**

After deploying the backend, run the Prisma migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run database migrations
vercel env pull .env.local
npx prisma db push
```

## 🔧 **Alternative: Single Repository Deployment**

If you want to deploy both frontend and backend from the same repository:

### 1. **Update Root vercel.json**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### 2. **Deploy as Single Project**

1. **Go to Vercel**
2. **Import your repository**
3. **Configure:**
   - **Framework Preset**: Other
   - **Root Directory**: `.` (root)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`

## 🌐 **Custom Domain Setup**

### 1. **Add Custom Domain in Vercel**
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 2. **Update Environment Variables**
```
FRONTEND_URL=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com
```

## 🔒 **Security Considerations**

### 1. **Environment Variables**
- Never commit `.env` files
- Use Vercel's environment variable system
- Rotate JWT secrets regularly

### 2. **Database Security**
- Use connection pooling
- Enable SSL connections
- Set up proper user permissions

### 3. **CORS Configuration**
- Only allow your frontend domains
- Remove localhost in production

## 📊 **Monitoring & Analytics**

### 1. **Vercel Analytics**
- Enable Vercel Analytics in project settings
- Monitor performance and errors

### 2. **Database Monitoring**
- Set up database monitoring
- Monitor query performance

## 🚀 **CI/CD with GitHub Actions**

The project includes GitHub Actions for:
- Automated testing
- Security scanning
- Docker builds
- Deployment to staging/production

## 📱 **PWA Deployment**

The app is configured as a PWA and will be installable on:
- Mobile devices
- Desktop browsers
- Chrome Web Store (optional)

## 🔧 **Troubleshooting**

### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify connection string format
   - Check database accessibility
   - Ensure SSL is properly configured

3. **CORS Errors**
   - Update CORS configuration
   - Check frontend URL in environment variables

4. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values

## 📞 **Support**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Actions**: [docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)

---

**Your KONZIA 2.0 app will be live at:**
- Frontend: `https://your-frontend-url.vercel.app`
- Backend: `https://your-backend-url.vercel.app`
