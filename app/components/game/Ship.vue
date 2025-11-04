<template>
  <PixelBorder>
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
  </PixelBorder>
</template>

<script lang="ts" setup>
import { ShipOrientation, ShipType } from '@prisma/client'
import PixelBorder from '~/components/pixel/PixelBorder.vue'

const props = defineProps<{
  type: ShipType
  orientation: ShipOrientation
}>()
</script>

<style lang="scss" scoped>
.ship {
  height: 28px;
  background-color: var(--px-color-white);

  &--single {
    width: 28px;
  }

  &--double {
    width: calc(28px * 2 + 4px * 1);
  }

  &--triple {
    width: calc(28px * 3 + 4px * 2);
  }

  &--quadruple {
    width: calc(28px * 4 + 4px * 3);
  }

  &--horizontal {
    transform: rotate(0deg);
  }

  &--vertical {
    transform: rotate(90deg);
  }
}
</style>
