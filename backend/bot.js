import { Telegraf } from 'telegraf'
import { User, Round, Ticket, Transaction, SupportTicket, AuditLog } from './models.js'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '')

// Middleware to check if user exists
bot.use(async (ctx, next) => {
  if (ctx.message?.from) {
    const user = await User.findOne({ telegramId: ctx.message.from.id })
    if (user) {
      ctx.user = user
    }
  }
  next()
})

// Start command
bot.start(async (ctx) => {
  const welcomeMessage = `
🎰 *Lotoreya Bot* ga xush kelibsiz!

Bu bot orqali:
• Yangi o'yinlar haqida ma'lumot olish
• Biletlaringizni ko'rish
• Balansingizni tekshirish
• Qo'llab-quvvatlash so'rovlarini yuborish

mumkin.

Foydalanish uchun avval saytda ro'yxatdan o'ting va Telegram ID raqamingizni profilga qo'shing.
  `
  
  await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' })
})

// Help command
bot.help(async (ctx) => {
  const helpMessage = `
📋 *Mavjud buyruqlar:*

/start - Botni ishga tushirish
/help - Yordam
/balance - Balansingizni ko'rish
/tickets - Biletlaringizni ko'rish
/rounds - Faol o'yinlarni ko'rish
/support - Qo'llab-quvvatlash so'rovini yuborish
  `
  
  await ctx.reply(helpMessage, { parse_mode: 'Markdown' })
})

// Check balance
bot.command('balance', async (ctx) => {
  if (!ctx.user) {
    return ctx.reply('❌ Avval saytda ro\'yxatdan o\'ting va Telegram ID raqamingizni profilga qo\'shing.')
  }
  
  try {
    const wallets = await ctx.user.populate('wallets')
    let balanceMessage = `💰 *Balansingiz:*\n\n`
    
    if (wallets.wallets && wallets.wallets.length > 0) {
      wallets.wallets.forEach(wallet => {
        balanceMessage += `${wallet.currency}: ${wallet.balance.toLocaleString()}\n`
      })
    } else {
      balanceMessage += 'Hali hech qanday balans yo\'q'
    }
    
    await ctx.reply(balanceMessage, { parse_mode: 'Markdown' })
  } catch (error) {
    await ctx.reply('❌ Balansni olishda xatolik yuz berdi.')
  }
})

// Check tickets
bot.command('tickets', async (ctx) => {
  if (!ctx.user) {
    return ctx.reply('❌ Avval saytda ro\'yxatdan o\'ting va Telegram ID raqamingizni profilga qo\'shing.')
  }
  
  try {
    const tickets = await Ticket.find({ userId: ctx.user._id })
      .populate('roundId')
      .sort({ purchasedAt: -1 })
      .limit(5)
    
    if (tickets.length === 0) {
      return ctx.reply('🎫 Hali hech qanday bilet sotib olmagan ekansiz.')
    }
    
    let ticketsMessage = `🎫 *So'nggi biletlaringiz:*\n\n`
    
    tickets.forEach(ticket => {
      const round = ticket.roundId
      ticketsMessage += `🔸 *O'yin #${round._id.slice(-6)}*\n`
      ticketsMessage += `📅 ${new Date(round.startsAt).toLocaleDateString()}\n`
      ticketsMessage += `🎲 Raqamlar: ${ticket.numbers}\n`
      ticketsMessage += `💰 Narxi: ${ticket.price} ${ticket.currency}\n\n`
    })
    
    await ctx.reply(ticketsMessage, { parse_mode: 'Markdown' })
  } catch (error) {
    await ctx.reply('❌ Biletlarni olishda xatolik yuz berdi.')
  }
})

// Check active rounds
bot.command('rounds', async (ctx) => {
  try {
    const activeRounds = await Round.find({ status: 'ACTIVE' })
      .sort({ startsAt: 1 })
      .limit(3)
    
    if (activeRounds.length === 0) {
      return ctx.reply('🎯 Hozirda faol o\'yinlar yo\'q.')
    }
    
    let roundsMessage = `🎯 *Faol o'yinlar:*\n\n`
    
    activeRounds.forEach(round => {
      roundsMessage += `🔸 *O'yin #${round._id.slice(-6)}*\n`
      roundsMessage += `📅 ${new Date(round.startsAt).toLocaleDateString()}\n`
      roundsMessage += `👥 Maksimal: ${round.maxPlayers} o'yinchi\n`
      roundsMessage += `💰 Kirish: ${round.entryFee} ${round.currency}\n\n`
    })
    
    await ctx.reply(roundsMessage, { parse_mode: 'Markdown' })
  } catch (error) {
    await ctx.reply('❌ O\'yinlarni olishda xatolik yuz berdi.')
  }
})

// Support command
bot.command('support', async (ctx) => {
  if (!ctx.user) {
    return ctx.reply('❌ Avval saytda ro\'yxatdan o\'ting va Telegram ID raqamingizni profilga qo\'shing.')
  }
  
  ctx.session = { waitingForSupport: true }
  await ctx.reply('📝 Qo\'llab-quvvatlash so\'rovini yuborish uchun xabaringizni yozing:')
})

// Handle support message
bot.on('text', async (ctx) => {
  if (ctx.session?.waitingForSupport && ctx.user) {
    try {
      const supportTicket = await SupportTicket.create({
        userId: ctx.user._id,
        subject: 'Telegram so\'rovi',
        message: ctx.message.text,
        category: 'GENERAL'
      })
      
      await AuditLog.create({
        userId: ctx.user._id,
        action: 'SUPPORT_TICKET_CREATE',
        details: { ticketId: supportTicket._id, source: 'telegram' }
      })
      
      ctx.session.waitingForSupport = false
      await ctx.reply('✅ Qo\'llab-quvvatlash so\'rovingiz qabul qilindi. Tez orada javob beramiz.')
    } catch (error) {
      await ctx.reply('❌ So\'rovni yuborishda xatolik yuz berdi.')
    }
  }
})

// Error handling
bot.catch((err, ctx) => {
  console.error(`Bot error for ${ctx.updateType}:`, err)
  ctx.reply('❌ Botda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.')
})

// Start bot
if (process.env.TELEGRAM_BOT_TOKEN) {
  bot.launch()
  console.log('Telegram bot started')
} else {
  console.log('Telegram bot token not provided, skipping bot startup')
}

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot
