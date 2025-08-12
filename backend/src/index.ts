import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function auth(requiredAdmin = false) {
  return async (req: any, res: any, next: any) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : '';
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = await prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      if (requiredAdmin && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}

// Auth
app.post('/api/auth/register', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(2),
    country: z.string().min(2),
  });
  const data = schema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({ data: { ...data, passwordHash } });
  const token = signToken({ sub: user.id, role: user.role });
  res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } });
});

app.post('/api/auth/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string() });
  const data = schema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const bcrypt = await import('bcryptjs');
  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ sub: user.id, role: user.role });
  res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } });
});

// Wallets
app.get('/api/wallets', auth(), async (req: any, res) => {
  const wallets = await prisma.wallet.findMany({ where: { userId: req.user.id } });
  res.json(wallets);
});

// Rounds
app.get('/api/rounds', async (_req, res) => {
  const rounds = await prisma.round.findMany({ include: { prizes: true } });
  res.json(rounds);
});

app.post('/api/rounds', auth(true), async (req, res) => {
  const schema = z.object({
    entryFee: z.number().positive(),
    currency: z.enum(['UZS', 'USD', 'RUB']),
    maxPlayers: z.number().int().min(1).max(5000).default(5000),
    startsAt: z.string(),
    endsAt: z.string().optional(),
    prizes: z.array(z.object({
      type: z.enum(['CAR', 'CASH', 'RUB_CASH', 'FREE_TICKET', 'POINTS']),
      amount: z.number().optional(),
      currency: z.enum(['UZS', 'USD', 'RUB']).optional(),
      quantity: z.number().int().min(1),
    })),
  });
  const data = schema.parse(req.body);
  const round = await prisma.round.create({
    data: {
      entryFee: data.entryFee,
      currency: data.currency,
      maxPlayers: data.maxPlayers,
      startsAt: new Date(data.startsAt),
      endsAt: data.endsAt ? new Date(data.endsAt) : null,
      prizes: { create: data.prizes },
    },
    include: { prizes: true },
  });
  res.json(round);
});

// Tickets purchase (simplified, no external gateway)
app.post('/api/rounds/:roundId/tickets', auth(), async (req: any, res) => {
  const schema = z.object({ numbers: z.array(z.number().int().min(1).max(49)).length(6) });
  const { numbers } = schema.parse(req.body);
  const round = await prisma.round.findUnique({ where: { id: req.params.roundId }, include: { tickets: true } });
  if (!round) return res.status(404).json({ error: 'Round not found' });
  if (round.status !== 'ACTIVE') return res.status(400).json({ error: 'Round not active' });
  if (round.tickets.length >= round.maxPlayers) return res.status(400).json({ error: 'Round full' });
  const numbersCsv = [...numbers].sort((a, b) => a - b).join(',');
  const ticket = await prisma.ticket.create({ data: { userId: req.user.id, roundId: round.id, numbers: numbersCsv } });
  res.json(ticket);
});

// Admin: close round and draw winners (demo RNG)
app.post('/api/rounds/:roundId/close', auth(true), async (req, res) => {
  const round = await prisma.round.findUnique({ where: { id: req.params.roundId }, include: { tickets: true, prizes: true } });
  if (!round) return res.status(404).json({ error: 'Round not found' });
  if (round.status === 'COMPLETED') return res.status(400).json({ error: 'Already completed' });

  // Very simplified: randomly assign prizes to random tickets
  const shuffled = [...round.tickets].sort(() => Math.random() - 0.5);
  let idx = 0;
  for (const prize of round.prizes) {
    for (let i = 0; i < prize.quantity; i++) {
      if (idx >= shuffled.length) break;
      const ticket = shuffled[idx++];
      await prisma.reward.create({
        data: {
          ticketId: ticket.id,
          type: prize.type,
          amount: prize.amount ?? null,
          currency: prize.currency ?? null,
        },
      });
    }
  }

  const updated = await prisma.round.update({ where: { id: round.id }, data: { status: 'COMPLETED', endsAt: new Date() } });
  res.json(updated);
});

// Support tickets
app.post('/api/support/tickets', auth(), async (req: any, res) => {
  const schema = z.object({ subject: z.string().min(3) });
  const data = schema.parse(req.body);
  const ticket = await prisma.supportTicket.create({ data: { userId: req.user.id, subject: data.subject } });
  res.json(ticket);
});

app.get('/api/support/tickets', auth(true), async (_req, res) => {
  const tickets = await prisma.supportTicket.findMany({ include: { user: true } });
  res.json(tickets);
});

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`);
});

// Start telegram bot (optional)
import('./bot').then(({ startTelegramBot }) => startTelegramBot());


