# Lotoreya Backend API

Fullstack lottery website backend built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **User Management**: Registration, login, profiles, wallets
- **Lottery System**: Rounds, tickets, prizes, rewards
- **Payment System**: Manual deposit requests with receipt uploads
- **Content Management**: News, videos, support tickets
- **Mini Games**: Game sessions, points system
- **Admin Panel**: User management, content moderation, deposit approval

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create .env file:**
   ```bash
   # Database
   MONGO_URL=mongodb://127.0.0.1:27017/lotoreya_dev
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Server
   PORT=4000
   NODE_ENV=development
   
   # CORS
   CORS_ORIGIN=http://localhost:8080
   
   # Telegram Bot (optional)
   TELEGRAM_BOT_TOKEN=
   
   # File Upload
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

3. **Start MongoDB:**
   ```bash
   mongod
   ```

4. **Run the server:**
   ```bash
   # Development (with auto-restart)
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User
- `GET /api/me` - Get current user
- `GET /api/wallets` - Get user wallets
- `POST /api/deposit` - Manual deposit
- `POST /api/withdraw` - Withdraw funds

### Lottery Rounds
- `GET /api/rounds` - List rounds
- `POST /api/rounds` - Create round (admin)
- `POST /api/rounds/:id/activate` - Activate round (admin)
- `POST /api/rounds/:id/close` - Close round (admin)
- `POST /api/rounds/buy-ticket` - Buy ticket

### Content
- `GET /api/news` - List news
- `POST /api/news` - Create news (admin)
- `GET /api/videos` - List videos
- `POST /api/videos` - Create video (admin)

### Support
- `POST /api/support/tickets` - Create support ticket
- `GET /api/support/tickets` - List tickets
- `PUT /api/admin/support/tickets/:id` - Update ticket status (admin)

### Mini Games
- `GET /api/minigames` - List mini games
- `GET /api/minigames/stats` - Game statistics
- `POST /api/minigames/sessions` - Create game session
- `POST /api/minigames/earn-points` - Earn points

### Deposits (Manual Payment System)
- `POST /api/deposits` - Submit deposit request with receipt
- `GET /api/deposits` - View user's deposit requests
- `GET /api/admin/deposits` - List all deposits (admin)
- `POST /api/admin/deposits/:id/approve` - Approve deposit (admin)
- `POST /api/admin/deposits/:id/reject` - Reject deposit (admin)

## File Upload

The system supports receipt uploads for manual deposits:
- Supported formats: JPG, PNG, PDF
- Max file size: 5MB
- Files stored in `./uploads/` directory
- Accessible via `/uploads/filename` endpoint

## Database Models

- **User**: Authentication, profiles, roles
- **Wallet**: Multi-currency balances
- **Round**: Lottery rounds with prizes
- **Ticket**: User lottery tickets
- **Reward**: Prize distribution
- **DepositRequest**: Manual payment requests
- **Transaction**: Financial transaction history
- **SupportTicket**: User support requests
- **News/Video**: Content management
- **MiniGame**: Game sessions and points

## Security Features

- JWT authentication with bcrypt password hashing
- Role-based access control (USER/ADMIN)
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Rate limiting (can be added)

## Development

- **Node.js**: >=18.0.0
- **MongoDB**: >=5.0
- **ES Modules**: Native support
- **Auto-restart**: Built-in with `--watch` flag

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure MongoDB connection string
4. Set up reverse proxy (nginx)
5. Use PM2 or similar process manager
6. Enable HTTPS
7. Set up monitoring and logging
