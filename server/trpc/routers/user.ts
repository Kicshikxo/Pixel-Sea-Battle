import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '~~/prisma/client'
import { trpcRouter } from '~~/server/trpc'
import { trpcAuthProcedure } from '~~/server/trpc/middleware/auth'

export const userRouter = trpcRouter({
  changeEmail: trpcAuthProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({ where: { id: ctx.user.id } })
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'error.user.userNotFound',
        })
      }

      if (user.email) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.user.unableToChangeEmail',
        })
      }

      const existingUser = await prisma.user.findUnique({ where: { email: input.email } })
      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.user.emailAlreadyUsed',
        })
      }

      return await prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          email: input.email,
          emailVerifiedAt: null,
        },
      })
    }),

  changePassword: trpcAuthProcedure
    .input(
      z.object({
        currentPassword: z.string().max(100).optional(),
        newPassword: z.string().max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({ where: { id: ctx.user.id } })
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'error.user.userNotFound',
        })
      }

      if (
        user.password &&
        input.currentPassword &&
        !bcrypt.compareSync(input.currentPassword, user.password)
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.user.currentPasswordIncorrect',
        })
      }

      return await prisma.user.update({
        where: { id: ctx.user.id },
        data: { password: bcrypt.hashSync(input.newPassword, 8) },
      })
    }),
})

export type UserRouter = typeof userRouter
