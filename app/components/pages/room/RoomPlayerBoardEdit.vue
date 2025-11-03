<template>
  <div class="room-board-edit">
    <div ref="boardEditContainer" class="room-board-edit__container">
      <div class="room-board-edit__ships">
        <span
          v-for="(ship, index) in ships"
          ref="shipElements"
          :key="index"
          class="room-board-edit__ship"
        >
          <Ship :type="ship.type" :orientation="ship.orientation" />
        </span>
      </div>
      <PlayerBoard ref="playerBoard" />
    </div>
    <PixelButton :label="$t('page.room.boardReady')" @click="handleReady" />
  </div>
</template>

<script lang="ts" setup>
import PlayerBoard from '~/components/pages/room/PlayerBoard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'

import Ship from '~/components/game/Ship.vue'

import { ShipOrientation, ShipType } from '@prisma/client'

import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

const boardEditContainer = ref<HTMLElement | null>(null)
const playerBoard = ref<InstanceType<typeof PlayerBoard>>()

export type BoardShip = {
  type: ShipType
  orientation: ShipOrientation
  positionX?: number
  positionY?: number
}

const emits = defineEmits<{
  ready: [BoardShip[]]
}>()

const shipElements = ref<HTMLElement[]>([])

onMounted(() => {
  if (!playerBoard.value?.boardTable) return

  const boardTable = playerBoard.value.boardTable
  const cellSize = playerBoard.value.cellSize
  const gridOffset = playerBoard.value.gridOffset

  shipElements.value.forEach((element, index) => {
    const ship = ships.value[index]!

    Draggable.create(element, {
      type: 'x,y',
      bounds: boardEditContainer.value,
      onDragEnd() {
        const elementRect = element.getBoundingClientRect()
        const playerBoardRect = boardTable?.getBoundingClientRect()

        if (
          elementRect.left > playerBoardRect.left + gridOffset.x &&
          elementRect.left < playerBoardRect.right &&
          elementRect.top > playerBoardRect.top + gridOffset.y &&
          elementRect.top < playerBoardRect.bottom
        ) {
          const position = {
            x: Math.round((elementRect.left - playerBoardRect.left - gridOffset.x) / cellSize),
            y: Math.round((elementRect.top - playerBoardRect.top - gridOffset.y) / cellSize),
          }

          const snap = {
            x: position.x * cellSize,
            y: position.y * cellSize,
          }

          const offset = {
            x: playerBoardRect.left + gridOffset.x + snap.x - elementRect.left,
            y: playerBoardRect.top + gridOffset.y + snap.y - elementRect.top,
          }

          gsap.to(element, {
            x: `+=${offset.x}`,
            y: `+=${offset.y}`,
            duration: 0.25,
            ease: 'back',
          })

          ship.positionX = position.x
          ship.positionY = position.y
        } else {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.25,
            ease: 'back',
          })
          ship.positionX = undefined
          ship.positionY = undefined
        }
      },
    })
  })
})

const ships = ref<BoardShip[]>([
  { type: ShipType.Single, orientation: ShipOrientation.Horizontal },
  { type: ShipType.Single, orientation: ShipOrientation.Horizontal },
  { type: ShipType.Single, orientation: ShipOrientation.Horizontal },
  { type: ShipType.Single, orientation: ShipOrientation.Horizontal },
  { type: ShipType.Double, orientation: ShipOrientation.Horizontal },
  { type: ShipType.Double, orientation: ShipOrientation.Horizontal },
  { type: ShipType.Double, orientation: ShipOrientation.Horizontal },
  { type: ShipType.Triple, orientation: ShipOrientation.Horizontal },
  { type: ShipType.Triple, orientation: ShipOrientation.Horizontal },
  { type: ShipType.Quadruple, orientation: ShipOrientation.Horizontal },
])

function handleReady() {
  emits('ready', ships.value)
}
</script>

<style lang="scss" scoped>
.room-board-edit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  &__ships {
    display: flex;
    flex-direction: column;
  }
  &__ship {
    width: min-content;
    height: min-content;
  }
}
</style>
