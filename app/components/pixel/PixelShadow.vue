<template>
  <div
    :class="[
      'px-shadow',
      `px-shadow--${computedColor}`,
      { 'px-shadow--full-width': fullWidth, 'px-shadow--full-height': fullHeight },
    ]"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    color?: 'adaptive' | 'dark' | 'light' | 'red' | 'yellow' | 'green' | 'blue'
    fullWidth?: boolean
    fullHeight?: boolean
  }>(),
  {
    color: 'dark',
    fullWidth: false,
    fullHeight: false,
  },
)

const colorMode = useColorMode()

const computedColor = computed(() =>
  props.color === 'adaptive' ? (colorMode.value === 'light' ? 'dark' : 'light') : props.color,
)
</script>

<style lang="scss" scoped>
.px-shadow {
  display: inline-flex;
  height: min-content;
  filter: drop-shadow(0.125em 0.125em 0 var(--px-color-shadow));
  transition: filter 0.125s;

  &--full-width {
    width: 100%;
  }
  &--full-height {
    height: 100%;
  }

  &--dark {
    --px-color-shadow: var(--px-color-shadow-black);
  }
  &--light {
    --px-color-shadow: var(--px-color-shadow-white);
  }
  &--red {
    --px-color-shadow: var(--px-color-shadow-red);
  }
  &--yellow {
    --px-color-shadow: var(--px-color-shadow-yellow);
  }
  &--green {
    --px-color-shadow: var(--px-color-shadow-green);
  }
  &--blue {
    --px-color-shadow: var(--px-color-shadow-blue);
  }
}
</style>
