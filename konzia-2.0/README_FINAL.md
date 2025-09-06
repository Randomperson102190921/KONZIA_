# KONZIA 2.0 - Smart Grocery Tracker

A modern, full-stack grocery tracking application with budget management, analytics, and recipe integration. Built with React 18, TypeScript, Node.js, Express, and PostgreSQL.

![KONZIA 2.0](https://img.shields.io/badge/version-2.0.0-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

## 🚀 Features

### Core Features
- **Smart Shopping Lists** - Add, edit, delete, and organize grocery items
- **Budget Management** - Track spending across categories with visual progress indicators
- **Analytics Dashboard** - Comprehensive spending insights and trends
- **Recipe Integration** - Discover recipes and add ingredients to shopping lists
- **Real-time Notifications** - Budget alerts, price drops, and expiry reminders

### Technical Features
- **Progressive Web App (PWA)** - Installable with offline support
- **Responsive Design** - Mobile-first design with tablet and desktop layouts
- **Dark Mode** - System preference detection with manual toggle
- **Accessibility** - WCAG 2.1 AA compliant with keyboard navigation
- **Performance Optimized** - Code splitting, lazy loading, and optimized bundles

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Zustand** for state management
- **React Query** for data fetching
- **Framer Motion** for animations
- **Chart.js** for data visualization
- **Workbox** for PWA functionality

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with Prisma ORM
- **JWT** for authentication
- **Redis** for caching (optional)
- **Zod** for validation
- **Helmet** for security

### DevOps
- **Docker** & Docker Compose
- **GitHub Actions** for CI/CD
- **Nginx** for reverse proxy
- **ESLint** & **Prettier** for code quality

## 📋 Prerequisites

Before running the application, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **PostgreSQL** 15 or higher
- **Docker** and **Docker Compose** (optional)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/konzia-2.0.git
   cd konzia-2.0
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Option 2: Local Development

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/your-username/konzia-2.0.git
   cd konzia-2.0
   npm install
   ```

2. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb konzia_db
   
   # Copy environment file
   cp backend/env.example backend/.env
   
   # Update database URL in backend/.env
   DATABASE_URL="postgresql://username:password@localhost:5432/konzia_db?schema=public"
   ```

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

4. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/konzia_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRE="30d"

# Server
PORT=5000
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Redis (optional)
REDIS_URL="redis://localhost:6379"
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📱 Usage

### Getting Started

1. **Sign Up** - Create a new account or use the demo account
   - Email: `demo@konzia.com`
   - Password: `demo123`

2. **Create Shopping Lists** - Add items with categories, quantities, and prices

3. **Set Budget Limits** - Configure monthly spending limits by category

4. **Track Analytics** - Monitor spending patterns and trends

5. **Discover Recipes** - Find recipes and add ingredients to your lists

### Key Features

#### Shopping Lists
- Add items with categories, quantities, and prices
- Mark items as completed
- Filter and search items
- Swipe gestures for quick actions
- Bulk operations

#### Budget Management
- Set monthly spending limits
- Track spending by category
- Visual progress indicators
- Budget alerts and notifications

#### Analytics
- Spending trends and patterns
- Category breakdowns
- Monthly comparisons
- Top purchased items

#### Recipes
- Browse recipe collection
- Add ingredients to shopping lists
- Filter by category and difficulty
- Rate and save favorites

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:coverage
```

### Backend Tests
```bash
cd backend
npm run test
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
```

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production servers**
   ```bash
   npm run start
   ```

### Docker Deployment

1. **Build Docker images**
   ```bash
   docker-compose build
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Cloud Deployment

#### Vercel (Frontend)
```bash
npm install -g vercel
cd frontend
vercel --prod
```

#### Railway (Backend)
```bash
npm install -g @railway/cli
railway login
railway up
```

#### Heroku
```bash
# Frontend
cd frontend
heroku create konzia-frontend
git push heroku main

# Backend
cd backend
heroku create konzia-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

## 📊 Performance

### Core Web Vitals
- **LCP** < 2.5s
- **FID** < 100ms
- **CLS** < 0.1

### Bundle Sizes
- **Frontend** < 200KB (gzipped)
- **Backend** < 50MB (Docker image)

### Lighthouse Scores
- **Performance** 95+
- **Accessibility** 100
- **Best Practices** 95+
- **SEO** 90+

## 🔒 Security

### Implemented Security Measures
- **HTTPS** enforcement
- **JWT** authentication with httpOnly cookies
- **Rate limiting** on API endpoints
- **Input validation** with Zod
- **SQL injection** protection with Prisma
- **XSS** protection with Helmet
- **CORS** configuration
- **Environment variable** protection

### Security Headers
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Content-Security-Policy`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure accessibility compliance
- Test on multiple devices

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Shopping List Endpoints
- `GET /api/shopping-list` - Get all lists
- `POST /api/shopping-list` - Create new list
- `GET /api/shopping-list/:id` - Get specific list
- `PUT /api/shopping-list/:id` - Update list
- `DELETE /api/shopping-list/:id` - Delete list

### Budget Endpoints
- `GET /api/budget` - Get budget items
- `POST /api/budget` - Create budget item
- `PUT /api/budget/:id` - Update budget item
- `DELETE /api/budget/:id` - Delete budget item

### Analytics Endpoints
- `GET /api/analytics/spending` - Get spending data
- `GET /api/analytics/categories` - Get category breakdown
- `GET /api/analytics/trends` - Get monthly trends

### Recipe Endpoints
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/featured` - Get featured recipes
- `POST /api/recipes` - Create recipe (authenticated)
- `GET /api/recipes/:id` - Get specific recipe

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :3000
lsof -i :5000

# Kill process using port
kill -9 <PID>
```

#### Docker Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Debug Mode

#### Frontend
```bash
cd frontend
DEBUG=true npm run dev
```

#### Backend
```bash
cd backend
DEBUG=* npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Prisma** for the excellent ORM
- **Vite** for the fast build tool
- **Framer Motion** for smooth animations
- **Chart.js** for data visualization

## 📞 Support

- **Documentation**: [docs.konzia.com](https://docs.konzia.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/konzia-2.0/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/konzia-2.0/discussions)
- **Email**: support@konzia.com

## 🗺️ Roadmap

### Version 2.1
- [ ] OCR receipt scanning
- [ ] Barcode scanning
- [ ] Price comparison
- [ ] Store locator

### Version 2.2
- [ ] Family sharing
- [ ] Meal planning calendar
- [ ] Nutrition tracking
- [ ] Grocery delivery integration

### Version 3.0
- [ ] AI-powered recommendations
- [ ] Voice commands
- [ ] Smart home integration
- [ ] Advanced analytics

---

**Made with ❤️ by the KONZIA team**
