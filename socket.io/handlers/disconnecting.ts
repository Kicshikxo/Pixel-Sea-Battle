import { prisma } from '~~/prisma/client'
import type { SocketHandler } from '~~/types/socket.io'

function isUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export default {
  event: 'disconnecting',
  handler: async (socket) => {
    if (!socket.user) return

    await Promise.all(
      [...socket.rooms].filter(isUUID).map(async (room) => {
        const player = await prisma.roomPlayer.findUnique({
          where: {
            userId_roomId: {
              userId: socket.user!.id,
              roomId: room,
            },
          },
          include: {
            user: true,
          },
        })

        if (player) {
          socket.to(room).emit('room:playerDisconnect', player)
        }
      }),
    )
  },
} as SocketHandler<'disconnecting'>
