<template>
  <div class="room-board-edit">
    <div class="room-board-edit__container">
      <div class="room-board-edit__ships">
        <Ship
          v-for="(ship, index) in ships"
          ref="ship"
          :key="index"
          :type="ship.type"
          :orientation="ship.orientation"
        />
      </div>
      <PlayerBoard />
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

export type BoardShip = {
  type: ShipType
  orientation: ShipOrientation
  positionX?: number
  positionY?: number
}

const emits = defineEmits<{
  ready: [BoardShip[]]
}>()

const ship = ref<{ $el: HTMLElement }[]>([])

onMounted(() => ship.value.forEach((ship) => Draggable.create(ship.$el, { inertia: false })))

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

  &__ship {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
