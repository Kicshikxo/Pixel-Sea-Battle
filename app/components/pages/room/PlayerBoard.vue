<template>
  <div class="player-board">
    <PixelShadow color="adaptive">
      <table ref="boardTable" class="player-board__table">
        <tbody>
          <tr v-for="row in 11" :key="row" class="player-board__table__row">
            <td
              v-for="column in 11"
              :key="column"
              :class="[
                'player-board__table__cell',
                { 'player-board__table__cell--label': row === 1 || column === 1 },
              ]"
              @click="handleClickCell(row, column)"
            >
              <span>{{ getCellLabel(row, column) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </PixelShadow>
  </div>
</template>

<script lang="ts" setup>
import PixelShadow from '~/components/pixel/PixelShadow.vue'

const { t } = useI18n()

const CELL_SIZE = 32
const GRID_OFFSET = { x: 32, y: 32 }

const boardTable = ref<HTMLElement | null>(null)

defineExpose({
  cellSize: CELL_SIZE,
  gridOffset: GRID_OFFSET,
  boardTable,
})

function getCellLabel(row: number, column: number): string {
  if (row === 1 && column > 1) {
    return (
      [
        t('page.room.board.A'),
        t('page.room.board.B'),
        t('page.room.board.C'),
        t('page.room.board.D'),
        t('page.room.board.E'),
        t('page.room.board.F'),
        t('page.room.board.G'),
        t('page.room.board.H'),
        t('page.room.board.I'),
        t('page.room.board.J'),
      ][column - 2] ?? ''
    )
  }

  if (column === 1 && row > 1) {
    return String(row - 1)
  }

  return ''
}

function handleClickCell(row: number, column: number) {
  console.log(row, column)
}
</script>

<style lang="scss" scoped>
.player-board {
  &__table {
    border-collapse: collapse;

    &__cell {
      position: relative;
      min-width: 32px;
      width: 32px;
      min-height: 32px;
      height: 32px;
      border: 2px solid var(--px-color-black-on-light-white-on-dark);
      text-align: center;
      font-size: 12px;

      // &:not(&--label) {
      //   &::before,
      //   &::after,
      //   span::before,
      //   span::after {
      //     content: '';
      //     position: absolute;
      //     width: 4px;
      //     height: 4px;
      //     background: var(--px-color-black-on-light-white-on-dark);
      //   }

      //   &::before {
      //     top: 0;
      //     left: 0;
      //   }

      //   &::after {
      //     top: 0;
      //     right: 0;
      //   }

      //   span::before {
      //     bottom: 0;
      //     left: 0;
      //   }

      //   span::after {
      //     bottom: 0;
      //     right: 0;
      //   }
      // }

      &--label {
        border: none;
      }
    }
  }
}
</style>
