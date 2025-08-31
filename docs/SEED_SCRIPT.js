/**
 * Casino Royal Database Seed Script
 * 
 * This script creates initial data for development and testing.
 * Run with: node docs/SEED_SCRIPT.js
 */

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

// Environment variables
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'casinoroyalusa@gmail.com';
const SERVER_SEED = process.env.SERVER_SEED || 'dev_server_seed_change_me';

async function main() {
  console.log('🎰 Starting Casino Royal database seed...');

  try {
    // Clear existing data (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Cleaning existing data...');
      await prisma.gameSession.deleteMany();
      await prisma.gameTable.deleteMany();
      await prisma.gameStats.deleteMany();
      await prisma.transaction.deleteMany();
      await prisma.wallet.deleteMany();
      await prisma.kycVerification.deleteMany();
      await prisma.session.deleteMany();
      await prisma.auditLog.deleteMany();
      await prisma.user.deleteMany();
    }

    // Create owner account
    console.log('👑 Creating owner account...');
    const hashedPassword = await bcrypt.hash(SERVER_SEED, 12);
    
    const owner = await prisma.user.create({
      data: {
        email: OWNER_EMAIL,
        username: 'casinoroyaladmin',
        password: hashedPassword,
        role: 'OWNER',
        kycStatus: 'APPROVED',
        isActive: true,
      }
    });

    // Create owner wallet
    const ownerWallet = await prisma.wallet.create({
      data: {
        userId: owner.id,
        balance: 10000.00,
        currency: 'USD'
      }
    });

    // Create owner KYC verification
    await prisma.kycVerification.create({
      data: {
        userId: owner.id,
        status: 'APPROVED',
        firstName: 'Casino',
        lastName: 'Royal',
        verifiedAt: new Date()
      }
    });

    console.log(`✅ Owner account created: ${OWNER_EMAIL}`);

    // Create demo users
    console.log('👥 Creating demo users...');
    const demoUsers = [
      {
        email: 'demo.player1@casino.com',
        username: 'PokerPro',
        balance: 2500.00
      },
      {
        email: 'demo.player2@casino.com',
        username: 'BlackjackKing',
        balance: 1800.00
      },
      {
        email: 'demo.player3@casino.com',
        username: 'LuckyCharm',
        balance: 750.00
      },
      {
        email: 'demo.newbie@casino.com',
        username: 'CasinoNewbie',
        balance: 100.00
      }
    ];

    const demoPassword = await bcrypt.hash('demo123', 12);
    
    for (const userData of demoUsers) {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          password: demoPassword,
          role: 'USER',
          kycStatus: 'APPROVED',
          isActive: true
        }
      });

      // Create wallet for each demo user
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: userData.balance,
          currency: 'USD'
        }
      });

      // Create some transaction history
      const wallet = await prisma.wallet.findUnique({
        where: { userId: user.id }
      });

      // Initial deposit transaction
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount: userData.balance,
          balanceBefore: 0,
          balanceAfter: userData.balance,
          status: 'COMPLETED',
          description: 'Initial Demo Deposit',
          completedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      });

      // Random game transactions
      const transactionCount = Math.floor(Math.random() * 8) + 2;
      let currentBalance = userData.balance;
      
      for (let i = 0; i < transactionCount; i++) {
        const isWin = Math.random() > 0.6;
        const amount = isWin 
          ? (Math.random() * 200) + 10 
          : -(Math.random() * 100) - 5;
        
        const balanceBefore = currentBalance;
        currentBalance = Math.max(0, currentBalance + amount);
        
        await prisma.transaction.create({
          data: {
            walletId: wallet.id,
            type: isWin ? 'WIN' : 'BET',
            amount: amount,
            balanceBefore: balanceBefore,
            balanceAfter: currentBalance,
            status: 'COMPLETED',
            description: isWin ? 'Game Win - Poker' : 'Game Bet - Blackjack',
            completedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)
          }
        });
      }
    }

    console.log(`✅ Created ${demoUsers.length} demo users`);

    // Create game tables
    console.log('🎮 Creating game tables...');
    const gameTables = [
      {
        name: 'Royal High Stakes',
        game: 'POKER',
        variant: 'texas_holdem',
        minBet: 10.00,
        maxBet: 500.00,
        maxPlayers: 6,
        currentPlayers: 4,
        status: 'ACTIVE'
      },
      {
        name: 'Beginner Friendly',
        game: 'POKER',
        variant: 'texas_holdem',
        minBet: 1.00,
        maxBet: 25.00,
        maxPlayers: 6,
        currentPlayers: 2,
        status: 'WAITING'
      },
      {
        name: 'Mid Stakes Action',
        game: 'POKER',
        variant: 'texas_holdem',
        minBet: 5.00,
        maxBet: 100.00,
        maxPlayers: 6,
        currentPlayers: 5,
        status: 'ACTIVE'
      },
      {
        name: 'Classic 21',
        game: 'BLACKJACK',
        variant: 'european',
        minBet: 5.00,
        maxBet: 100.00,
        maxPlayers: 5,
        currentPlayers: 3,
        status: 'ACTIVE'
      },
      {
        name: 'VIP Blackjack',
        game: 'BLACKJACK',
        variant: 'european',
        minBet: 25.00,
        maxBet: 1000.00,
        maxPlayers: 5,
        currentPlayers: 5,
        status: 'ACTIVE'
      },
      {
        name: 'Speed Blackjack',
        game: 'BLACKJACK',
        variant: 'speed',
        minBet: 2.00,
        maxBet: 50.00,
        maxPlayers: 7,
        currentPlayers: 1,
        status: 'WAITING'
      }
    ];

    for (const tableData of gameTables) {
      await prisma.gameTable.create({
        data: tableData
      });
    }

    console.log(`✅ Created ${gameTables.length} game tables`);

    // Create game statistics for demo users
    console.log('📊 Creating game statistics...');
    const users = await prisma.user.findMany({
      where: { role: 'USER' }
    });

    for (const user of users) {
      // Poker stats
      await prisma.gameStats.create({
        data: {
          userId: user.id,
          game: 'POKER',
          handsPlayed: Math.floor(Math.random() * 500) + 50,
          totalWagered: Math.floor(Math.random() * 5000) + 500,
          totalWon: Math.floor(Math.random() * 4000) + 300,
          biggestWin: Math.floor(Math.random() * 800) + 100,
          currentStreak: Math.floor(Math.random() * 10) - 5,
          longestStreak: Math.floor(Math.random() * 15) + 3,
          lastPlayedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      });

      // Blackjack stats
      await prisma.gameStats.create({
        data: {
          userId: user.id,
          game: 'BLACKJACK',
          handsPlayed: Math.floor(Math.random() * 300) + 30,
          totalWagered: Math.floor(Math.random() * 3000) + 300,
          totalWon: Math.floor(Math.random() * 2500) + 200,
          biggestWin: Math.floor(Math.random() * 500) + 50,
          currentStreak: Math.floor(Math.random() * 8) - 4,
          longestStreak: Math.floor(Math.random() * 12) + 2,
          lastPlayedAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000)
        }
      });
    }

    console.log(`✅ Created game statistics for ${users.length} users`);

    // Create some active game sessions
    console.log('🎯 Creating active game sessions...');
    const activeTables = await prisma.gameTable.findMany({
      where: { status: 'ACTIVE' }
    });

    let sessionCount = 0;
    for (const table of activeTables) {
      const playersToAdd = Math.min(table.currentPlayers, users.length);
      
      for (let i = 0; i < playersToAdd; i++) {
        const user = users[i % users.length];
        
        await prisma.gameSession.create({
          data: {
            tableId: table.id,
            userId: user.id,
            buyIn: table.minBet * 20, // 20x minimum bet buy-in
            currentStack: table.minBet * (15 + Math.random() * 30),
            seatNumber: i + 1,
            status: 'ACTIVE',
            joinedAt: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000)
          }
        });
        
        sessionCount++;
      }
    }

    console.log(`✅ Created ${sessionCount} active game sessions`);

    // Log summary
    console.log('\n🎉 Seed completed successfully!');
    console.log('═'.repeat(50));
    console.log(`👑 Owner Email: ${OWNER_EMAIL}`);
    console.log(`🔑 Demo Password: demo123`);
    console.log(`💰 Owner Balance: $10,000.00`);
    console.log(`👥 Demo Users: ${demoUsers.length}`);
    console.log(`🎮 Game Tables: ${gameTables.length}`);
    console.log(`🎯 Active Sessions: ${sessionCount}`);
    console.log('═'.repeat(50));
    console.log('\n📝 Demo Users:');
    demoUsers.forEach(user => {
      console.log(`   • ${user.username} (${user.email}) - $${user.balance}`);
    });
    console.log('\n🔗 Next Steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Open http://localhost:3000');
    console.log('   3. Sign in with any demo user (password: demo123)');
    console.log('   4. Test the wallet and game features');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// Cleanup function
async function cleanup() {
  await prisma.$disconnect();
}

// Run the seed
main()
  .then(cleanup)
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    cleanup();
    process.exit(1);
  });

module.exports = { main, cleanup };