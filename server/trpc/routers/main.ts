import { trpcRouter } from '~~/server/trpc'
import { authRouter } from '~~/server/trpc/routers/auth'
import { emailVerificationRouter } from '~~/server/trpc/routers/emailVerification'
import { passwordRecoveryRouter } from '~~/server/trpc/routers/passwordRecovery'
import { roomRouter } from '~~/server/trpc/routers/room'
import { userRouter } from '~~/server/trpc/routers/user'

export const mainRouter = trpcRouter({
  auth: authRouter,
  emailVerification: emailVerificationRouter,
  passwordRecovery: passwordRecoveryRouter,
  room: roomRouter,
  user: userRouter,
})

export type MainRouter = typeof mainRouter
