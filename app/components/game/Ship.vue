<template>
  <div
    :class="[
      'ship',
      {
        'ship--single': type === ShipType.Single,
        'ship--double': type === ShipType.Double,
        'ship--triple': type === ShipType.Triple,
        'ship--quadruple': type === ShipType.Quadruple,
        'ship--horizontal': orientation === ShipOrientation.Horizontal,
        'ship--vertical': orientation === ShipOrientation.Vertical,
      },
    ]"
  ></div>
</template>

<script setup lang="ts">
import { ShipOrientation, ShipType } from '@prisma/client'

const props = defineProps<{
  type: ShipType
  orientation: ShipOrientation
}>()
</script>

<style lang="scss" scoped>
.ship {
  height: 32px;
  background-color: var(--px-color-black-on-light-white-on-dark);
  transition: transform var(--transition-time-normal);
  margin: 4px;

  &--single {
    width: 32px;
  }

  &--double {
    width: 64px;
  }

  &--triple {
    width: 96px;
  }

  &--quadruple {
    width: 128px;
  }

  &--horizontal {
    transform: rotate(0deg);
  }

  &--vertical {
    transform: rotate(90deg);
  }
}
</style>
