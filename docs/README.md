# Casino Royal - UI/UX Update & Authentication System

## Overview

This project implements a comprehensive casino platform with modern UI/UX, authentication, wallet management, and game interfaces. The system is built with React, TypeScript, Tailwind CSS, and Framer Motion for animations.

## Features Implemented

### ✅ Completed Features

1. **Header Navigation Cleanup**
   - Removed "Play Now" button from header
   - Replaced with Games dropdown menu (Poker & Blackjack)
   - Removed Tournaments and Leaderboard from navigation
   - Added animated wallet balance chip
   - Implemented responsive mobile menu

2. **Enhanced Authentication**
   - Sign-in accepts email OR username + password
   - "Remember me" checkbox with session management
   - Password visibility toggle
   - Forgot password flow (demo mode)
   - Mock JWT session handling

3. **Wallet System (Stake-like)**
   - Real-time balance display in header
   - Comprehensive wallet modal with:
     - Balance overview (Available + Pending)
     - Deposit flow with payment methods (Credit, Crypto, Bank)
     - Withdraw flow with KYC placeholder
     - Transaction history with status indicators
     - Mock transaction processing

4. **Games Menu**
   - Animated card previews for Poker and Blackjack
   - Live table listings with player counts
   - Bet limits and table status
   - Demo mode indicators
   - Smooth animations with Framer Motion

5. **UX Polish & Animations**
   - Framer Motion micro-interactions
   - Animated card suits and table previews
   - Smooth state transitions
   - Responsive design (mobile-first)
   - Accessibility improvements

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd casino-royal
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   # Development Environment (DO NOT use in production)
   NODE_ENV=development
   PORT=3000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET=dev_change_me_in_production
   SERVER_SEED=dev_server_seed_change_me
   OWNER_EMAIL=casinoroyalusa@gmail.com
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Architecture

### Component Structure
```
src/
├── components/ui/
│   ├── auth-modal.tsx         # Enhanced sign-in/up modal
│   ├── wallet-modal.tsx       # Wallet management interface
│   ├── games-menu.tsx         # Animated games selection
│   ├── navigation.tsx         # Updated header navigation
│   └── ...                    # Other UI components
├── contexts/
│   └── AuthContext.tsx        # Authentication & wallet state
├── pages/
│   └── Index.tsx              # Main landing page
└── ...
```

### State Management
- **AuthContext**: Handles user authentication, wallet balance, and session management
- **Local State**: Component-specific UI state (modals, forms, animations)
- **Mock Data**: Realistic mock data for development and demos

## Mock Implementation Details

### Authentication Flow
```typescript
// Mock login with email OR username
await login(identifier, password, rememberMe);

// Session handling
if (rememberMe) {
  // Extended session (30 days) - stored in localStorage for demo
  localStorage.setItem('remember_user', 'true');
} else {
  // Short session (2 hours)
  localStorage.removeItem('remember_user');
}
```

### Wallet Operations
```typescript
// Mock deposit
const deposit = async (amount: number, paymentMethod: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  updateWalletBalance(currentBalance + amount);
};

// Mock withdrawal with KYC check
const withdraw = async (amount: number) => {
  // Simulate KYC verification
  if (!user.kycVerified) {
    throw new Error('KYC verification required');
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
  updateWalletBalance(currentBalance - amount);
};
```

### Game Tables
```typescript
// Mock table data structure
interface GameTable {
  id: string;
  name: string;
  game: 'poker' | 'blackjack';
  minBet: number;
  maxBet: number;
  players: number;
  maxPlayers: number;
  status: 'active' | 'waiting' | 'full';
}
```

## API Replacement Guide

### 1. Authentication Endpoints

**Replace mock login in `AuthContext.tsx`:**
```typescript
// Current mock implementation
const login = async (identifier: string, password: string, rememberMe: boolean) => {
  // Mock logic...
};

// Replace with real API call
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
  
  // Handle JWT cookie (httpOnly)
  // Cookie is set automatically by server
};
```

### 2. Wallet Endpoints

**Replace mock wallet operations in `WalletModal.tsx`:**
```typescript
// Current mock deposit
const handleDeposit = async (amount: number) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  updateWalletBalance(walletBalance + amount);
};

// Replace with real API
const handleDeposit = async (amount: number, paymentMethod: string) => {
  const response = await fetch('/api/wallet/deposit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include httpOnly cookies
    body: JSON.stringify({ amount, paymentMethod })
  });
  
  const data = await response.json();
  updateWalletBalance(data.newBalance);
  
  // Handle payment gateway redirect if needed
  if (data.redirectUrl) {
    window.location.href = data.redirectUrl;
  }
};
```

### 3. Game Endpoints

**Replace mock game joining in `GamesMenu.tsx`:**
```typescript
// Current mock
const handleJoinTable = (table: GameTable) => {
  toast({ title: "Joining table...", description: "Demo mode" });
};

// Replace with real API
const handleJoinTable = async (table: GameTable) => {
  const response = await fetch(`/api/games/${table.game}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ tableId: table.id })
  });
  
  if (!response.ok) throw new Error('Failed to join table');
  
  const data = await response.json();
  
  // Redirect to game interface
  window.location.href = `/games/${table.game}/${data.sessionId}`;
};
```

## Production Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/casino_db"
JWT_SECRET="your-super-secure-jwt-secret-here"
SERVER_SEED="cryptographically-secure-random-seed"
OWNER_EMAIL="your-admin-email@domain.com"

# Payment Gateway
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Crypto Payments
BITCOIN_RPC_URL="..."
ETHEREUM_RPC_URL="..."

# Email Service
SENDGRID_API_KEY="SG...."
```

### Security Checklist

1. **JWT Configuration:**
   - Use cryptographically secure JWT_SECRET (32+ chars)
   - Set httpOnly cookies for JWT tokens
   - Implement refresh token rotation
   - Add CSRF protection

2. **Database Security:**
   - Use connection pooling
   - Implement prepared statements
   - Enable SSL/TLS connections
   - Regular security updates

3. **Payment Security:**
   - PCI DSS compliance for card payments
   - Webhook signature verification
   - Rate limiting on financial endpoints
   - Audit logging for all transactions

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

### Test Coverage
- Authentication flows
- Wallet operations
- Game table interactions
- Responsive design
- Accessibility compliance

## Performance Optimization

### Implemented Optimizations
- Lazy loading for game animations
- Debounced input handlers
- Memoized expensive calculations
- Optimized re-renders with proper dependencies

### Production Recommendations
- Image optimization and CDN
- Bundle splitting for game modules
- Service worker for offline functionality
- Real-time updates via WebSockets

## Troubleshooting

### Common Issues

1. **Build Errors:**
   - Ensure all dependencies are installed
   - Check TypeScript configuration
   - Verify import paths

2. **Authentication Issues:**
   - Check cookie settings (httpOnly, secure)
   - Verify JWT secret configuration
   - Ensure proper CORS setup

3. **Animation Performance:**
   - Reduce motion for users with preferences
   - Optimize Framer Motion variants
   - Use CSS transforms for simple animations

## Contributing

1. Follow the established component patterns
2. Add TypeScript interfaces for all data structures
3. Include accessibility attributes (aria-labels, roles)
4. Test responsive design on multiple devices
5. Add proper error handling and loading states

## License

This project is proprietary software for Casino Royal.