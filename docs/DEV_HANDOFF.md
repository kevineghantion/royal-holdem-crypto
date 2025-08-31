# Casino Royal - Developer Handoff Guide

## 🎯 Project Overview

This project transforms the Casino Royal platform into a modern, fully-functional casino website with:
- Enhanced authentication (email OR username + "Remember me")
- Wallet system (Stake-like) with deposits, withdrawals, and transaction history
- Animated games menu (Poker & Blackjack)
- Clean UI without tournaments/leaderboards
- Comprehensive mock APIs ready for real backend integration

## 🏗️ Architecture Changes

### 1. Removed Features
- ❌ "Play Now" button from header navigation
- ❌ Tournaments section and navigation
- ❌ Leaderboard section and navigation  
- ❌ "Tables" top-level menu

### 2. Added Features
- ✅ Games dropdown with Poker & Blackjack
- ✅ Wallet balance chip in header
- ✅ Enhanced authentication modal
- ✅ Comprehensive wallet management
- ✅ Animated card previews
- ✅ Transaction history
- ✅ Mock API framework

### 3. Enhanced Features
- 🔄 Authentication: Now supports email OR username login
- 🔄 Session management: "Remember me" functionality
- 🔄 Responsive design: Mobile-first approach
- 🔄 Animations: Framer Motion integration

## 🗂️ File Structure

```
src/
├── components/ui/
│   ├── auth-modal.tsx         # Enhanced auth with email/username + remember me
│   ├── wallet-modal.tsx       # Full wallet interface (NEW)
│   ├── games-menu.tsx         # Animated games dropdown (NEW)
│   ├── navigation.tsx         # Updated header navigation
│   └── ...
├── contexts/
│   └── AuthContext.tsx        # Enhanced with wallet state
├── pages/
│   └── Index.tsx              # Main landing page
└── ...

docs/
├── README.md                  # Setup and overview
├── API_SPEC.md               # Complete API documentation
├── PRISMA_SCHEMA.sql         # Database schema and migrations
├── SEED_SCRIPT.js            # Database seeding script
└── DEV_HANDOFF.md            # This file
```

## 🔌 Mock API Integration Points

### Authentication System

**File:** `src/contexts/AuthContext.tsx`

**Mock Implementation:**
```typescript
const login = async (identifier: string, password: string, rememberMe: boolean) => {
  // Current: Mock delay and local storage
  await new Promise(resolve => setTimeout(resolve, 1000));
  // TODO: Replace with real API call
};
```

**Real Implementation:**
```typescript
const login = async (identifier: string, password: string, rememberMe: boolean) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password, rememberMe })
  });
  
  if (!response.ok) throw new Error('Login failed');
  
  const data = await response.json();
  setUser(data.user);
  setWalletBalance(data.wallet.balance);
  // JWT cookie set automatically by server
};
```

### Wallet System

**File:** `src/components/ui/wallet-modal.tsx`

**Mock Implementation:**
```typescript
const handleDeposit = async (amount: number) => {
  // Current: Mock delay and balance update
  await new Promise(resolve => setTimeout(resolve, 2000));
  updateWalletBalance(walletBalance + amount);
};
```

**Real Implementation:**
```typescript
const handleDeposit = async (amount: number, paymentMethod: string) => {
  const response = await fetch('/api/wallet/deposit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ amount, paymentMethod })
  });
  
  const data = await response.json();
  updateWalletBalance(data.newBalance);
  
  // Handle 3DS redirect if needed
  if (data.redirectUrl) {
    window.location.href = data.redirectUrl;
  }
};
```

### Game Integration

**File:** `src/components/ui/games-menu.tsx`

**Mock Implementation:**
```typescript
const handleJoinTable = (table: GameTable) => {
  // Current: Toast notification only
  toast({ title: "Joining table...", description: "Demo mode" });
};
```

**Real Implementation:**
```typescript
const handleJoinTable = async (table: GameTable) => {
  const response = await fetch(`/api/games/${table.game}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ 
      tableId: table.id,
      buyIn: table.minBet * 20 
    })
  });
  
  const data = await response.json();
  
  // Redirect to game interface
  window.location.href = `/games/${table.game}/${data.sessionId}`;
};
```

## 🛠️ Backend Implementation

### Required Dependencies

```bash
npm install express prisma @prisma/client bcrypt jsonwebtoken
npm install stripe coinbase-commerce-node nodemailer
npm install helmet cors rate-limiter-flexible
npm install ws socket.io express-rate-limit
npm install @types/bcrypt @types/jsonwebtoken --save-dev
```

### Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/casino_royal"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-256-bits-minimum"
JWT_REFRESH_SECRET="your-refresh-token-secret"
BCRYPT_ROUNDS=12

# Server
PORT=3000
NODE_ENV=production
CORS_ORIGIN="https://your-frontend-domain.com"

# Payment Gateways
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
COINBASE_API_KEY="..."
COINBASE_WEBHOOK_SECRET="..."

# Email Service
SENDGRID_API_KEY="SG...."
FROM_EMAIL="noreply@casinoroyal.com"

# Game Server
WEBSOCKET_PORT=3001
REDIS_URL="redis://localhost:6379"

# Security
OWNER_EMAIL="casinoroyalusa@gmail.com"
SERVER_SEED="cryptographically-secure-random-seed"
```

### Database Setup

1. **Install Prisma:**
```bash
npm install prisma @prisma/client
npx prisma init
```

2. **Copy schema from docs/PRISMA_SCHEMA.sql to prisma/schema.prisma**

3. **Run migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Seed database:**
```bash
node docs/SEED_SCRIPT.js
```

### Basic Express Server

```typescript
// server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/games', gameRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## 🔐 Security Implementation

### JWT Authentication

```typescript
// middleware/auth.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { wallet: true }
    });
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

### Password Hashing

```typescript
// utils/auth.js
import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateTokens = (userId, rememberMe = false) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: rememberMe ? '30d' : '2h' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};
```

## 💳 Payment Integration

### Stripe Integration

```typescript
// services/stripe.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency = 'usd') => {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

export const handleWebhook = async (body, signature) => {
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      await processDeposit(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      await handleFailedPayment(event.data.object);
      break;
  }
};
```

## 🎮 Game Server Architecture

### WebSocket Game Server

```typescript
// gameServer.js
import { WebSocketServer } from 'ws';
import { GameEngine } from './gameEngine.js';

const wss = new WebSocketServer({ port: 3001 });
const gameEngine = new GameEngine();

wss.on('connection', (ws, request) => {
  const sessionId = getSessionFromUrl(request.url);
  
  ws.on('message', async (data) => {
    const message = JSON.parse(data);
    
    switch (message.type) {
      case 'join_table':
        await gameEngine.joinTable(sessionId, message.tableId);
        break;
      case 'player_action':
        await gameEngine.processAction(sessionId, message.action);
        break;
      case 'leave_table':
        await gameEngine.leaveTable(sessionId);
        break;
    }
  });
});
```

## 📱 Frontend-Backend Communication

### API Client Setup

```typescript
// utils/api.js
class ApiClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth methods
  login(identifier, password, rememberMe) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password, rememberMe }),
    });
  }

  // Wallet methods
  deposit(amount, paymentMethod) {
    return this.request('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod }),
    });
  }

  // Game methods
  joinTable(game, tableId, buyIn) {
    return this.request(`/games/${game}/join`, {
      method: 'POST',
      body: JSON.stringify({ tableId, buyIn }),
    });
  }
}

export default new ApiClient();
```

## 🧪 Testing Setup

### Unit Tests (Jest)

```typescript
// tests/auth.test.js
import { login } from '../src/contexts/AuthContext';

describe('Authentication', () => {
  test('should login with email', async () => {
    const result = await login('user@example.com', 'password', false);
    expect(result.user.email).toBe('user@example.com');
  });

  test('should login with username', async () => {
    const result = await login('username', 'password', false);
    expect(result.user.username).toBe('username');
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/auth.spec.js
import { test, expect } from '@playwright/test';

test('complete authentication flow', async ({ page }) => {
  await page.goto('/');
  
  // Click sign in
  await page.click('[data-testid="sign-in-button"]');
  
  // Fill login form
  await page.fill('[data-testid="identifier-input"]', 'demo.player1@casino.com');
  await page.fill('[data-testid="password-input"]', 'demo123');
  await page.check('[data-testid="remember-me-checkbox"]');
  
  // Submit form
  await page.click('[data-testid="submit-button"]');
  
  // Verify login success
  await expect(page.locator('[data-testid="user-welcome"]')).toBeVisible();
  await expect(page.locator('[data-testid="wallet-balance"]')).toBeVisible();
});
```

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Update all environment variables for production
- [ ] Rotate JWT secrets and API keys
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and logging
- [ ] Run security audit: `npm audit`
- [ ] Run performance tests
- [ ] Test all payment flows in sandbox

### Production Environment
- [ ] PostgreSQL database with connection pooling
- [ ] Redis for session storage and caching
- [ ] Load balancer for API servers
- [ ] WebSocket servers for game real-time features
- [ ] Payment gateway webhooks configured
- [ ] Email service configured
- [ ] Backup strategy implemented
- [ ] Monitoring dashboards set up

### Security Hardening
- [ ] Rate limiting on all endpoints
- [ ] CORS properly configured
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection headers
- [ ] CSRF protection
- [ ] Input validation on all endpoints
- [ ] Audit logging for financial operations
- [ ] PCI DSS compliance for card payments

## 📞 Support & Maintenance

### Monitoring Points
- API response times
- Database query performance
- Payment success rates
- WebSocket connection stability
- Error rates by endpoint
- User session lengths

### Common Issues & Solutions

1. **Authentication Problems:**
   - Check JWT token expiration
   - Verify cookie settings (httpOnly, secure, sameSite)
   - Ensure CORS configuration allows credentials

2. **Payment Issues:**
   - Verify webhook signatures
   - Check payment gateway test vs. live keys
   - Monitor failed payment rates

3. **Game Performance:**
   - Monitor WebSocket connection drops
   - Check Redis memory usage
   - Optimize database queries for game state

### Emergency Contacts
- Database Administrator: [contact info]
- Payment Gateway Support: [contact info]
- CDN Support: [contact info]
- Security Team: [contact info]

---

**🎰 Casino Royal Development Team**  
*Last Updated: [Current Date]*  
*Version: 1.0.0*