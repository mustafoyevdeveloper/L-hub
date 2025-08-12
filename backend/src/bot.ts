import { Telegraf } from 'telegraf';
import { PrismaClient } from '@prisma/client';

const token = process.env.TELEGRAM_BOT_TOKEN;
const prisma = new PrismaClient();

export function startTelegramBot() {
  if (!token) {
    // eslint-disable-next-line no-console
    console.log('TELEGRAM_BOT_TOKEN not provided; bot disabled');
    return;
  }
  const bot = new Telegraf(token);

  bot.start((ctx) => ctx.reply('Assalomu alaykum! Savolingizni yozib qoldiring. /ticket <mavzu> bilan support ariza ochishingiz mumkin.'));

  bot.command('ticket', async (ctx) => {
    const text = ctx.message?.text || '';
    const subject = text.replace(/^\/ticket\s*/i, '').trim();
    if (!subject) {
      return ctx.reply('Iltimos, mavzu kiriting: /ticket To\'lov haqida savol');
    }
    // Anonymous ticket (no user linkage here, could be extended via email binding)
    await prisma.supportTicket.create({ data: { userId: 'anonymous', subject } as any });
    return ctx.reply('Arizangiz qabul qilindi. Adminlar tez orada javob berishadi.');
  });

  bot.catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Telegram bot error', err);
  });

  bot.launch();
  // eslint-disable-next-line no-console
  console.log('Telegram bot launched');
}


