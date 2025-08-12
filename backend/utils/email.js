import nodemailer from 'nodemailer'

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }
  // Development fallback: log emails to console
  return {
    sendMail: async (opts) => {
      // eslint-disable-next-line no-console
      console.log('[DEV EMAIL]', {
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      })
      return { messageId: 'dev-email' }
    },
  }
}

const transporter = createTransport()

export async function sendEmail({ to, subject, text, html }) {
  const from = process.env.SMTP_FROM || 'no-reply@lotoreya.local'
  return transporter.sendMail({ from, to, subject, text, html })
}

export function generateSixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}


