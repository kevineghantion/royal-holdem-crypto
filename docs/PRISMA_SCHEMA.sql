-- Casino Royal Database Schema
-- This file contains the Prisma schema and SQL for the casino platform

-- ============================================================================
-- PRISMA SCHEMA (prisma/schema.prisma)
-- ============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

-- User Management
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  password    String   -- Hashed with bcrypt
  role        Role     @default(USER)
  isActive    Boolean  @default(true)
  kycStatus   KycStatus @default(PENDING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastLoginAt DateTime?

  -- Relations
  wallet      Wallet?
  sessions    Session[]
  gameStats   GameStats[]
  kyc         KycVerification?
  
  @@map("users")
}

-- Session Management
model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  refreshToken String?  @unique
  expiresAt    DateTime
  rememberMe   Boolean  @default(false)
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}

-- Wallet System
model Wallet {
  id            String      @id @default(cuid())
  userId        String      @unique
  balance       Decimal     @default(0) @db.Decimal(15,2)
  pendingBalance Decimal    @default(0) @db.Decimal(15,2)
  currency      String      @default("USD")
  isLocked      Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  
  @@map("wallets")
}

-- Transaction History
model Transaction {
  id              String            @id @default(cuid())
  walletId        String
  type            TransactionType
  amount          Decimal           @db.Decimal(15,2)
  balanceBefore   Decimal           @db.Decimal(15,2)
  balanceAfter    Decimal           @db.Decimal(15,2)
  status          TransactionStatus @default(PENDING)
  description     String
  externalRef     String?           -- Payment gateway reference
  metadata        Json?             -- Additional transaction data
  createdAt       DateTime          @default(now())
  completedAt     DateTime?
  
  wallet Wallet @relation(fields: [walletId], references: [id], onDelete: Cascade)
  
  @@map("transactions")
}

-- KYC Verification
model KycVerification {
  id            String    @id @default(cuid())
  userId        String    @unique
  status        KycStatus @default(PENDING)
  firstName     String?
  lastName      String?
  dateOfBirth   DateTime?
  address       String?
  documentType  String?   -- passport, drivers_license, id_card
  documentNumber String?
  documentUrl   String?   -- File storage URL
  verifiedAt    DateTime?
  rejectedAt    DateTime?
  rejectionReason String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("kyc_verifications")
}

-- Game Management
model GameTable {
  id            String        @id @default(cuid())
  name          String
  game          GameType
  variant       String?       -- texas_holdem, european_blackjack, etc.
  minBet        Decimal       @db.Decimal(10,2)
  maxBet        Decimal       @db.Decimal(10,2)
  maxPlayers    Int
  currentPlayers Int          @default(0)
  status        TableStatus   @default(WAITING)
  isActive      Boolean       @default(true)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  sessions GameSession[]
  
  @@map("game_tables")
}

-- Game Sessions
model GameSession {
  id        String          @id @default(cuid())
  tableId   String
  userId    String
  buyIn     Decimal         @db.Decimal(10,2)
  currentStack Decimal      @db.Decimal(10,2)
  seatNumber Int?
  status    SessionStatus   @default(ACTIVE)
  joinedAt  DateTime        @default(now())
  leftAt    DateTime?
  
  table GameTable @relation(fields: [tableId], references: [id], onDelete: Cascade)
  
  @@map("game_sessions")
}

-- Game Statistics
model GameStats {
  id              String   @id @default(cuid())
  userId          String
  game            GameType
  handsPlayed     Int      @default(0)
  totalWagered    Decimal  @default(0) @db.Decimal(15,2)
  totalWon        Decimal  @default(0) @db.Decimal(15,2)
  biggestWin      Decimal  @default(0) @db.Decimal(10,2)
  currentStreak   Int      @default(0)
  longestStreak   Int      @default(0)
  lastPlayedAt    DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, game])
  @@map("game_stats")
}

-- Audit Logging
model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  action      String   -- login, deposit, withdraw, bet, etc.
  entity      String?  -- table name or entity type
  entityId    String?  -- record ID
  oldValues   Json?
  newValues   Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
  
  @@map("audit_logs")
}

-- Enums
enum Role {
  USER
  ADMIN
  OWNER
}

enum KycStatus {
  PENDING
  APPROVED
  REJECTED
  EXPIRED
}

enum TransactionType {
  DEPOSIT
  WITHDRAW
  BET
  WIN
  REFUND
  BONUS
  FEE
}

enum TransactionStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}

enum GameType {
  POKER
  BLACKJACK
  ROULETTE
  SLOTS
}

enum TableStatus {
  WAITING
  ACTIVE
  PAUSED
  CLOSED
}

enum SessionStatus {
  ACTIVE
  SITTING_OUT
  LEFT
  KICKED
}

-- ============================================================================
-- MIGRATION SQL
-- ============================================================================

-- Initial database setup
-- Run: npx prisma migrate dev --name init

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_game_sessions_table_id ON game_sessions(table_id);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Triggers for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (action, entity, entity_id, new_values, created_at)
    VALUES (TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW), NOW());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (action, entity, entity_id, old_values, new_values, created_at)
    VALUES (TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW), NOW());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (action, entity, entity_id, old_values, created_at)
    VALUES (TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD), NOW());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_transactions AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_wallets AFTER UPDATE ON wallets
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Constraints and validations
ALTER TABLE users ADD CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE users ADD CONSTRAINT users_username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20);
ALTER TABLE wallets ADD CONSTRAINT wallets_balance_positive CHECK (balance >= 0);
ALTER TABLE transactions ADD CONSTRAINT transactions_amount_not_zero CHECK (amount != 0);
ALTER TABLE game_tables ADD CONSTRAINT game_tables_bet_range CHECK (min_bet > 0 AND max_bet >= min_bet);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Create owner account
INSERT INTO users (id, email, username, password, role, kyc_status, created_at)
VALUES (
  'owner-' || uuid_generate_v4(),
  'casinoroyalusa@gmail.com',
  'casinoroyaladmin',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LPVznpjpws4x5S6vq', -- hashed 'dev_server_seed_change_me'
  'OWNER',
  'APPROVED',
  NOW()
);

-- Create owner wallet
INSERT INTO wallets (id, user_id, balance, currency)
SELECT 
  'wallet-' || uuid_generate_v4(),
  id,
  10000.00,
  'USD'
FROM users WHERE email = 'casinoroyalusa@gmail.com';

-- Create demo game tables
INSERT INTO game_tables (id, name, game, variant, min_bet, max_bet, max_players, status)
VALUES 
  ('table-poker-1', 'Royal High Stakes', 'POKER', 'texas_holdem', 10.00, 500.00, 6, 'ACTIVE'),
  ('table-poker-2', 'Beginner Friendly', 'POKER', 'texas_holdem', 1.00, 25.00, 6, 'WAITING'),
  ('table-blackjack-1', 'Classic 21', 'BLACKJACK', 'european', 5.00, 100.00, 5, 'ACTIVE'),
  ('table-blackjack-2', 'VIP Blackjack', 'BLACKJACK', 'european', 25.00, 1000.00, 5, 'ACTIVE');

-- Update current players for demo
UPDATE game_tables SET current_players = 4 WHERE id = 'table-poker-1';
UPDATE game_tables SET current_players = 2 WHERE id = 'table-poker-2';
UPDATE game_tables SET current_players = 3 WHERE id = 'table-blackjack-1';
UPDATE game_tables SET current_players = 5 WHERE id = 'table-blackjack-2';

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Get user with wallet information
SELECT 
  u.id, u.username, u.email, u.role, u.kyc_status,
  w.balance, w.pending_balance, w.currency
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id
WHERE u.email = 'user@example.com';

-- Get transaction history for a user
SELECT 
  t.id, t.type, t.amount, t.status, t.description, t.created_at, t.completed_at
FROM transactions t
JOIN wallets w ON t.wallet_id = w.id
JOIN users u ON w.user_id = u.id
WHERE u.id = 'user-id-here'
ORDER BY t.created_at DESC
LIMIT 20;

-- Get active game tables with player counts
SELECT 
  gt.id, gt.name, gt.game, gt.variant, 
  gt.min_bet, gt.max_bet, gt.current_players, gt.max_players,
  gt.status
FROM game_tables gt
WHERE gt.is_active = true
ORDER BY gt.game, gt.min_bet;

-- Get user game statistics
SELECT 
  gs.game, gs.hands_played, gs.total_wagered, gs.total_won,
  (gs.total_won - gs.total_wagered) as net_result,
  gs.biggest_win, gs.current_streak, gs.longest_streak,
  gs.last_played_at
FROM game_stats gs
WHERE gs.user_id = 'user-id-here';

-- Audit trail for sensitive operations
SELECT 
  al.action, al.entity, al.entity_id, al.old_values, al.new_values,
  al.ip_address, al.created_at,
  u.username
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.action IN ('INSERT', 'UPDATE', 'DELETE')
  AND al.entity IN ('transactions', 'wallets')
ORDER BY al.created_at DESC
LIMIT 100;