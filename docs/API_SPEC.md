# Casino Royal API Specification

## Authentication Endpoints

### POST /api/auth/login
Authenticate user with email or username and password.

**Request Body:**
```json
{
  "identifier": "user@example.com",  // Email or username
  "password": "securePassword123",
  "rememberMe": true                 // Optional, default: false
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "user123",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "wallet": {
    "id": "uuid",
    "balance": 1250.75,
    "currency": "USD"
  },
  "sessionExpiry": "2024-01-02T00:00:00Z"
}
```

**Headers Set:**
- `Set-Cookie: token=jwt_token; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`

**Errors:**
- 400: Invalid credentials
- 429: Too many login attempts
- 500: Server error

### POST /api/auth/register
Create new user account.

**Request Body:**
```json
{
  "username": "newuser123",
  "email": "newuser@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "newuser123",
    "email": "newuser@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "wallet": {
    "id": "uuid",
    "balance": 0.00,
    "currency": "USD"
  }
}
```

### GET /api/auth/me
Get current user information (requires authentication).

**Headers Required:**
- `Cookie: token=jwt_token`

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "username": "user123",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "wallet": {
    "id": "uuid",
    "balance": 1250.75,
    "currency": "USD"
  }
}
```

### POST /api/auth/logout
Logout current user and invalidate session.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Headers Set:**
- `Set-Cookie: token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0`

### POST /api/auth/refresh
Refresh JWT token (if using refresh tokens).

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 7200
}
```

## Wallet Endpoints

### GET /api/wallet/balance
Get current wallet balance.

**Headers Required:**
- `Cookie: token=jwt_token`

**Response (200):**
```json
{
  "balance": 1250.75,
  "pendingBalance": 0.00,
  "currency": "USD",
  "lastUpdated": "2024-01-01T12:00:00Z"
}
```

### POST /api/wallet/deposit
Initiate deposit transaction.

**Request Body:**
```json
{
  "amount": 100.00,
  "paymentMethod": "credit_card",  // credit_card, crypto, bank_transfer
  "paymentDetails": {
    "cardToken": "stripe_token_here"  // Or other payment-specific data
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "transactionId": "uuid",
  "status": "pending",
  "amount": 100.00,
  "newBalance": 1350.75,
  "redirectUrl": "https://payment-gateway.com/...", // Optional for 3DS
  "estimatedConfirmation": "2024-01-01T12:05:00Z"
}
```

**Response (202) - Requires additional action:**
```json
{
  "success": false,
  "requiresAction": true,
  "transactionId": "uuid",
  "actionType": "3ds_authentication",
  "redirectUrl": "https://3ds-provider.com/authenticate/..."
}
```

### POST /api/wallet/withdraw
Initiate withdrawal transaction.

**Request Body:**
```json
{
  "amount": 500.00,
  "withdrawalMethod": "bank_transfer",
  "withdrawalDetails": {
    "bankAccount": "****1234",
    "routingNumber": "021000021"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "transactionId": "uuid",
  "status": "pending",
  "amount": 500.00,
  "newBalance": 750.75,
  "estimatedCompletion": "2024-01-03T12:00:00Z",
  "kycRequired": false
}
```

**Response (400) - KYC Required:**
```json
{
  "success": false,
  "error": "kyc_required",
  "message": "Identity verification required for withdrawals",
  "kycUrl": "/kyc/verify"
}
```

### GET /api/wallet/transactions
Get transaction history with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)
- `type`: Filter by transaction type (optional)
- `status`: Filter by status (optional)

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "deposit",
      "amount": 100.00,
      "status": "completed",
      "description": "Credit Card Deposit",
      "createdAt": "2024-01-01T12:00:00Z",
      "completedAt": "2024-01-01T12:02:00Z",
      "metadata": {
        "paymentMethod": "credit_card",
        "last4": "1234"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Game Endpoints

### GET /api/games/tables
Get list of available game tables.

**Query Parameters:**
- `game`: Filter by game type (poker, blackjack)
- `status`: Filter by table status (active, waiting, full)

**Response (200):**
```json
{
  "tables": [
    {
      "id": "uuid",
      "name": "Royal High Stakes",
      "game": "poker",
      "variant": "texas_holdem",
      "minBet": 10.00,
      "maxBet": 500.00,
      "currentPlayers": 4,
      "maxPlayers": 6,
      "status": "active",
      "avgPotSize": 150.00,
      "handsPerHour": 80
    }
  ]
}
```

### POST /api/games/poker/join
Join a poker table.

**Request Body:**
```json
{
  "tableId": "uuid",
  "buyIn": 200.00,  // Amount to bring to table
  "seatPreference": 3  // Optional preferred seat number
}
```

**Response (200):**
```json
{
  "success": true,
  "sessionId": "uuid",
  "tableId": "uuid",
  "seatNumber": 3,
  "stackSize": 200.00,
  "gameState": {
    "currentHand": 156,
    "dealerPosition": 2,
    "currentPlayer": 1,
    "pot": 45.00,
    "communityCards": ["AS", "KH"],
    "playerCards": ["QD", "JC"]
  },
  "websocketUrl": "wss://game-server.com/poker/uuid"
}
```

### POST /api/games/blackjack/join
Join a blackjack table.

**Request Body:**
```json
{
  "tableId": "uuid",
  "betAmount": 25.00
}
```

**Response (200):**
```json
{
  "success": true,
  "sessionId": "uuid",
  "tableId": "uuid",
  "handId": "uuid",
  "gameState": {
    "dealerCards": ["Hidden", "7H"],
    "playerCards": ["AS", "10D"],
    "playerTotal": 21,
    "canHit": false,
    "canStand": false,
    "canDouble": false,
    "canSplit": false,
    "result": "blackjack",
    "payout": 37.50
  }
}
```

### POST /api/games/poker/action
Make a poker action (bet, call, fold, etc.).

**Request Body:**
```json
{
  "sessionId": "uuid",
  "action": "bet",
  "amount": 50.00  // Required for bet/raise actions
}
```

**Response (200):**
```json
{
  "success": true,
  "actionAccepted": true,
  "newGameState": {
    "currentHand": 156,
    "dealerPosition": 2,
    "currentPlayer": 2,
    "pot": 95.00,
    "yourStack": 150.00
  }
}
```

### POST /api/games/blackjack/action
Make a blackjack action (hit, stand, double, split).

**Request Body:**
```json
{
  "sessionId": "uuid",
  "handId": "uuid",
  "action": "hit"
}
```

**Response (200):**
```json
{
  "success": true,
  "newCard": "5S",
  "gameState": {
    "dealerCards": ["Hidden", "7H"],
    "playerCards": ["AS", "10D", "5S"],
    "playerTotal": 16,
    "canHit": true,
    "canStand": true,
    "canDouble": false,
    "canSplit": false
  }
}
```

## WebSocket Events

### Poker Game Events
```javascript
// Connect to game WebSocket
const ws = new WebSocket('wss://game-server.com/poker/uuid');

// Listen for game events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'player_joined':
      // Another player joined the table
      break;
    case 'player_left':
      // Player left the table
      break;
    case 'hand_started':
      // New hand dealt
      break;
    case 'action_required':
      // It's your turn to act
      break;
    case 'action_taken':
      // Another player took an action
      break;
    case 'hand_completed':
      // Hand finished, show results
      break;
  }
};

// Send actions
ws.send(JSON.stringify({
  type: 'action',
  action: 'bet',
  amount: 50.00
}));
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Insufficient balance for this operation",
    "details": {
      "required": 100.00,
      "available": 75.50
    }
  }
}
```

### Common Error Codes
- `INVALID_CREDENTIALS`: Authentication failed
- `INSUFFICIENT_FUNDS`: Not enough balance
- `KYC_REQUIRED`: Identity verification needed
- `TABLE_FULL`: Cannot join table
- `INVALID_ACTION`: Game action not allowed
- `RATE_LIMITED`: Too many requests
- `MAINTENANCE_MODE`: System under maintenance

## Rate Limiting

### Limits by Endpoint Type
- Authentication: 5 requests per minute
- Wallet operations: 10 requests per minute
- Game actions: 100 requests per minute
- General API: 60 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

## Security

### Authentication
- JWT tokens in httpOnly cookies
- CSRF protection via double-submit cookies
- Refresh token rotation

### Input Validation
- All amounts validated with 2 decimal precision
- String inputs sanitized and length-limited
- SQL injection prevention via prepared statements

### Audit Logging
All financial operations logged with:
- User ID and session ID
- Timestamp and IP address
- Action type and amount
- Result and error details

## Development vs Production

### Development Endpoints
- Mock payment processing
- Simplified KYC (auto-approved)
- Debug information in responses
- Relaxed rate limiting

### Production Considerations
- Real payment gateway integration
- Proper KYC verification flow
- Enhanced security logging
- Strict rate limiting and monitoring