import mongoose, { Schema, model, Types } from 'mongoose'

export const enums = {
  Role: ['USER', 'ADMIN'],
  Currency: ['UZS', 'USD', 'RUB'],
  RoundStatus: ['PLANNED', 'ACTIVE', 'COMPLETED'],
  RewardType: ['CAR', 'CASH', 'RUB_CASH', 'FREE_TICKET', 'POINTS'],
  WithdrawalStatus: ['PENDING', 'APPROVED', 'REJECTED'],
  SubscriptionType: ['STANDARD', 'VIP'],
  TicketStatus: ['OPEN', 'CLOSED'],
  TransactionType: ['DEPOSIT', 'PURCHASE', 'WITHDRAWAL', 'WIN', 'SUBSCRIPTION'],
  TransactionStatus: ['PENDING', 'COMPLETED', 'FAILED'],
  VideoKind: ['LIVESTREAM', 'HANDOVER', 'INTERVIEW'],
  NewsCategory: ['NEWS', 'ANNOUNCEMENT', 'RULES', 'FAQ'],
  KYCStatus: ['PENDING', 'VERIFIED', 'REJECTED'],
  KYCDocumentType: ['PASSPORT', 'ID_CARD', 'DRIVERS_LICENSE'],
  AuditLogAction: ['LOGIN', 'LOGOUT', 'DEPOSIT', 'WITHDRAWAL', 'TICKET_PURCHASE', 'ADMIN_ACTION'],
  VerificationPurpose: ['REGISTER', 'RESET_PASSWORD'],
}

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  country: { type: String, required: true },
  role: { type: String, enum: enums.Role, default: 'USER' },
  isVip: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  phone: String,
  dateOfBirth: Date,
  kycStatus: { type: String, enum: enums.KYCStatus, default: 'PENDING' },
  isBlocked: { type: Boolean, default: false },
  lastLoginAt: Date,
  loginAttempts: { type: Number, default: 0 },
  blockedUntil: Date,
}, { timestamps: true })

// Auth and verification
const VerificationCodeSchema = new Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  purpose: { type: String, enum: enums.VerificationPurpose, required: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
  used: { type: Boolean, default: false, index: true },
  payload: Schema.Types.Mixed, // stores temp data for registration
}, { timestamps: true })

const WalletSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  currency: { type: String, enum: enums.Currency, required: true },
  balance: { type: Number, default: 0 },
}, { timestamps: true })

const PrizeSchema = new Schema({
  type: { type: String, enum: enums.RewardType, required: true },
  amount: Number,
  currency: { type: String, enum: enums.Currency },
  quantity: { type: Number, required: true },
})

const RoundSchema = new Schema({
  status: { type: String, enum: enums.RoundStatus, default: 'PLANNED' },
  maxPlayers: { type: Number, default: 5000 },
  entryFee: { type: Number, required: true },
  currency: { type: String, enum: enums.Currency, required: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date },
  prizes: { type: [PrizeSchema], default: [] },
  videoUrl: String,
  winningNumbers: String,
  totalTickets: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
}, { timestamps: true })

const TicketSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  roundId: { type: Types.ObjectId, ref: 'Round', index: true, required: true },
  numbers: { type: String, required: true },
  purchasedAt: { type: Date, default: () => new Date() },
  status: { type: String, enum: enums.TicketStatus, default: 'OPEN' },
  price: { type: Number, required: true },
  currency: { type: String, enum: enums.Currency, required: true },
})

const RewardSchema = new Schema({
  ticketId: { type: Types.ObjectId, ref: 'Ticket', unique: true, required: true },
  type: { type: String, enum: enums.RewardType, required: true },
  amount: Number,
  currency: { type: String, enum: enums.Currency },
  createdAt: { type: Date, default: () => new Date() },
})

const WithdrawalSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: enums.Currency, required: true },
  status: { type: String, enum: enums.WithdrawalStatus, default: 'PENDING' },
  bankDetails: String,
  adminNote: String,
  processedAt: Date,
  processedBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const SubscriptionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  type: { type: String, enum: enums.SubscriptionType, required: true },
  price: { type: Number, required: true },
  currency: { type: String, enum: enums.Currency, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: { createdAt: true, updatedAt: false } })

const SupportTicketSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, enum: ['TECHNICAL', 'PAYMENT', 'GENERAL'], default: 'GENERAL' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'CLOSED'], default: 'OPEN' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  assignedTo: { type: Types.ObjectId, ref: 'User' },
  adminNotes: String,
  closedAt: Date,
  closedBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const TransactionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  type: { type: String, enum: enums.TransactionType, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: enums.Currency, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: enums.TransactionStatus, default: 'PENDING' },
  reference: String,
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: () => new Date() },
})

const VideoSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  kind: { type: String, enum: enums.VideoKind, required: true },
  roundId: { type: Types.ObjectId, ref: 'Round' },
  publishedAt: { type: Date, default: () => new Date() },
  thumbnail: String,
  duration: Number,
  views: { type: Number, default: 0 },
})

const NewsSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, enum: enums.NewsCategory, default: 'NEWS' },
  publishedAt: { type: Date, default: () => new Date() },
  author: { type: Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: true },
  tags: [String],
  imageUrl: String,
})

const MiniGameSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  subscriptionRequired: { type: Boolean, default: true },
  maxPlayers: Number,
  entryFee: { type: Number, default: 0 },
  currency: { type: String, enum: enums.Currency, default: 'UZS' },
  prizePool: Number,
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM' },
  imageUrl: String,
})

const MiniGameSessionSchema = new Schema({
  miniGameId: { type: Types.ObjectId, ref: 'MiniGame', required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  pointsEarned: { type: Number, required: true },
  score: Number,
  timeSpent: Number,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
})

// KYC Models
const KYCDocumentSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: enums.KYCDocumentType, required: true },
  documentNumber: { type: String, required: true },
  documentUrl: { type: String, required: true },
  status: { type: String, enum: enums.KYCStatus, default: 'PENDING' },
  verifiedAt: Date,
  verifiedBy: { type: Types.ObjectId, ref: 'User' },
  rejectionReason: String,
}, { timestamps: true })

const KYCVerificationSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
  faceVerified: { type: Boolean, default: false },
  addressVerified: { type: Boolean, default: false },
  documentsVerified: { type: Boolean, default: false },
  pepCheck: { type: Boolean, default: false },
  sanctionsCheck: { type: Boolean, default: false },
  overallStatus: { type: String, enum: enums.KYCStatus, default: 'PENDING' },
  verifiedAt: Date,
  verifiedBy: { type: Types.ObjectId, ref: 'User' },
  notes: String,
}, { timestamps: true })

// Audit and Security Models
const AuditLogSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', index: true },
  action: { type: String, enum: enums.AuditLogAction, required: true },
  ipAddress: String,
  userAgent: String,
  details: Schema.Types.Mixed,
  timestamp: { type: Date, default: () => new Date() },
})

const RateLimitSchema = new Schema({
  ipAddress: { type: String, required: true, index: true },
  endpoint: { type: String, required: true },
  count: { type: Number, default: 1 },
  resetAt: { type: Date, required: true },
}, { timestamps: true })

// RNG Models
const RNGSeedSchema = new Schema({
  roundId: { type: Types.ObjectId, ref: 'Round', required: true, unique: true },
  seed: { type: String, required: true },
  hash: { type: String, required: true },
  committedAt: { type: Date, required: true },
  revealedAt: Date,
  numbers: String,
  verificationHash: String,
}, { timestamps: true })

const RNGLogSchema = new Schema({
  roundId: { type: Types.ObjectId, ref: 'Round', required: true },
  seed: String,
  hash: String,
  numbers: String,
  timestamp: { type: Date, default: () => new Date() },
})

const DepositRequestSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: enums.Currency, required: true },
  method: { type: String, required: true }, // e.g. card number or bank name
  receiptUrl: { type: String, required: true },
  status: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING', index: true },
  adminNote: { type: String },
}, { timestamps: true })

export const User = mongoose.models.User || model('User', UserSchema)
export const Wallet = mongoose.models.Wallet || model('Wallet', WalletSchema)
export const Round = mongoose.models.Round || model('Round', RoundSchema)
export const Ticket = mongoose.models.Ticket || model('Ticket', TicketSchema)
export const Reward = mongoose.models.Reward || model('Reward', RewardSchema)
export const Withdrawal = mongoose.models.Withdrawal || model('Withdrawal', WithdrawalSchema)
export const Subscription = mongoose.models.Subscription || model('Subscription', SubscriptionSchema)
export const SupportTicket = mongoose.models.SupportTicket || model('SupportTicket', SupportTicketSchema)
export const Transaction = mongoose.models.Transaction || model('Transaction', TransactionSchema)
export const VideoDoc = mongoose.models.Video || model('Video', VideoSchema)
export const NewsDoc = mongoose.models.News || model('News', NewsSchema)
export const MiniGame = mongoose.models.MiniGame || model('MiniGame', MiniGameSchema)
export const MiniGameSession = mongoose.models.MiniGameSession || model('MiniGameSession', MiniGameSessionSchema)
export const KYCDocument = mongoose.models.KYCDocument || model('KYCDocument', KYCDocumentSchema)
export const KYCVerification = mongoose.models.KYCVerification || model('KYCVerification', KYCVerificationSchema)
export const AuditLog = mongoose.models.AuditLog || model('AuditLog', AuditLogSchema)
export const RateLimit = mongoose.models.RateLimit || model('RateLimit', RateLimitSchema)
export const RNGSeed = mongoose.models.RNGSeed || model('RNGSeed', RNGSeedSchema)
export const RNGLog = mongoose.models.RNGLog || model('RNGLog', RNGLogSchema)
export const DepositRequest = mongoose.models.DepositRequest || model('DepositRequest', DepositRequestSchema)
export const VerificationCode = mongoose.models.VerificationCode || model('VerificationCode', VerificationCodeSchema)


