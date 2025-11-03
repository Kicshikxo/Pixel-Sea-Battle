import { getRequestURL, H3Event } from 'h3'
import { createTransport } from 'nodemailer'
import { prisma } from '~~/prisma/client'
import emailVerificationTemplate from './templates/emailVerification'
import passwordRecoveryTemplate from './templates/passwordRecovery'

const transporter = createTransport(
  {
    host: useRuntimeConfig().email.host,
    port: useRuntimeConfig().email.port,
    secure: useRuntimeConfig().email.port === 465,
    auth: {
      user: useRuntimeConfig().email.auth.user,
      pass: useRuntimeConfig().email.auth.password,
    },
  },
  {
    from: useRuntimeConfig().email.from,
  },
)

function renderTemplate(html: string, values: { callback: string }) {
  return Object.entries(values).reduce(
    (html, [key, value]) => html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value),
    html,
  )
}

export async function sendEmailVerification(event: H3Event, email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: { emailVerification: true },
  })

  if (!user || !user.email) return

  try {
    if (user.emailVerification) {
      await prisma.userEmailVerification.delete({ where: { userId: user.id } })
    }
    const emailVerification = await prisma.userEmailVerification.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    await transporter.sendMail({
      to: user.email,
      subject: 'Подтвердите адрес электронной почты',
      html: renderTemplate(emailVerificationTemplate, {
        callback: `${getRequestURL(event).origin}/email-verification/${emailVerification.id}`,
      }),
    })
  } catch (error) {
    console.error(error)
  }
}

export async function sendPasswordRecovery(event: H3Event, email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: { passwordRecovery: true },
  })

  if (!user || !user.email) return

  try {
    if (user.passwordRecovery) {
      await prisma.userPasswordRecovery.delete({ where: { userId: user.id } })
    }
    const passwordRecovery = await prisma.userPasswordRecovery.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    await transporter.sendMail({
      to: user.email,
      subject: 'Восстановление пароля',
      html: renderTemplate(passwordRecoveryTemplate, {
        callback: `${getRequestURL(event).origin}/password-recovery/${passwordRecovery.id}`,
      }),
    })
  } catch (error) {
    console.error(error)
  }
}
