import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '~~/prisma/client'
import { trpcPublicProcedure, trpcRouter } from '~~/server/trpc'

export const emailVerificationRouter = trpcRouter({
  info: trpcPublicProcedure
    .input(
      z.object({
        emailVerificationId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const emailVerification = await prisma.userEmailVerification.findUnique({
        where: {
          id: input.emailVerificationId,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      })

      if (!emailVerification) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.emailVerification.notFound',
        })
      }

      if (emailVerification.user.emailVerifiedAt) {
        await prisma.userEmailVerification.delete({ where: { id: emailVerification.id } })
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.emailVerification.alreadyVerified',
        })
      }

      return emailVerification.user
    }),

  verify: trpcPublicProcedure
    .input(
      z.object({
        emailVerificationId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const emailVerification = await prisma.userEmailVerification.findUnique({
        where: {
          id: input.emailVerificationId,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      })

      if (!emailVerification) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.emailVerification.notFound',
        })
      }

      if (emailVerification.user.emailVerifiedAt) {
        await prisma.userEmailVerification.delete({ where: { id: emailVerification.id } })
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.emailVerification.alreadyVerified',
        })
      }

      await prisma.user.update({
        where: { id: emailVerification.userId },
        data: { emailVerifiedAt: new Date() },
      })
      await prisma.userEmailVerification.delete({ where: { id: emailVerification.id } })
    }),
})

export type EmailVerificationRouter = typeof emailVerificationRouter
