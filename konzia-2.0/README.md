# KONZIA 2.0 - Smart Grocery Tracker

A modern, full-stack application for tracking groceries, managing budgets, and analyzing shopping patterns.

## 🚀 Features

- 📱 Responsive web interface
- 🔐 Secure authentication system
- 📊 Shopping analytics and insights
- 💰 Budget management
- 📝 Shopping list management
- 🧾 Receipt tracking and analysis

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Query for data fetching
- Chart.js for visualizations

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- JWT authentication
- API rate limiting

## 🏗️ Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/konzia-2.0.git
cd konzia-2.0
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
# Backend
cp backend/.env.example backend/.env
# Frontend
cp frontend/.env.example frontend/.env
\`\`\`

4. Set up the database:
\`\`\`bash
cd backend
npx prisma generate
npx prisma db push
\`\`\`

5. Start the development servers:
\`\`\`bash
# From root directory
npm run dev
\`\`\`

## 📝 Environment Variables

### Backend (.env)
- \`DATABASE_URL\`: PostgreSQL connection string
- \`JWT_SECRET\`: Secret key for JWT tokens
- \`JWT_EXPIRE\`: Token expiration time
- \`NODE_ENV\`: Environment (development/production)

### Frontend (.env)
- \`VITE_API_URL\`: Backend API URL
- \`VITE_NODE_ENV\`: Environment setting

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🧪 Testing

Run tests with:
\`\`\`bash
npm test
\`\`\`

## 📜 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 👥 Authors

- Your Name - Initial work
