<template>
  <div class="room-page">
    <TransitionExpand>
      <div v-if="roomStore.room" class="room-page__container">
        <PixelContainer full-width>
          <TransitionExpand>
            <div v-if="roomStore.room.status === RoomStatus.PENDING">
              <RoomPlayerBoardEdit @ready="" />
            </div>
            <div v-else>
              <RoomPlayerBoards />
            </div>
          </TransitionExpand>
        </PixelContainer>
      </div>
    </TransitionExpand>

    <PixelContainer full-width>
      <RoomMessages
        ref="roomMessages"
        :messages="roomStore.room?.messages"
        :show-typing-indicator="chatStore.otherPlayerTyping"
        :messages-loading="loading.messages"
        :send-loading="loading.sendMessage"
        @send-message="handleSendMessage"
      />
    </PixelContainer>

    <PixelModal v-model:show="showRoomLeaveModal" :title="$t('page.room.confirmLeave')">
      <div class="leave-room-modal">
        <span>
          {{ $t('page.room.confirmLeaveMessage') }}
        </span>

        <div class="leave-room-modal__actions">
          <PixelButton
            :label="$t('page.room.cancel')"
            full-width
            :disabled="loading.roomLeave"
            @click="showRoomLeaveModal = false"
          />
          <PixelButton
            :label="$t('page.room.leave')"
            color="red"
            full-width
            :loading="loading.roomLeave"
            @click="handleLeaveRoom"
          />
        </div>
      </div>
    </PixelModal>
  </div>
</template>

<script setup lang="ts">
import RoomMessages from '~/components/pages/room/RoomMessages.vue'
import RoomPlayerBoards from '~/components/pages/room/RoomPlayerBoards.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelModal from '~/components/pixel/PixelModal.vue'
import RoomPlayerBoardEdit from '~/components/pages/room/RoomPlayerBoardEdit.vue'
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'

import useChatStore from '~/store/chat'
import useRoomStore from '~/store/room'

import { RoomStatus } from '@prisma/client'
import type { RouteLocation, RouteLocationNormalizedLoaded } from 'vue-router'

definePageMeta({
  middleware: async (to) => {
    const trpc = useTRPC()
    const { params } = to as RouteLocationNormalizedLoaded<'room-id'>

    try {
      await trpc.room.join.mutate({ id: params.id })
    } catch (error: any) {
      return navigateTo({ name: 'index', query: { error: error.message } })
    }
  },
})

const { t } = useI18n()
const toast = useToast()
const route = useRoute('room-id')
const router = useRouter()
const roomStore = useRoomStore()
const chatStore = useChatStore()

const roomMessages = ref<InstanceType<typeof RoomMessages>>()

const loading = reactive({
  messages: true,
  sendMessage: false,
  roomLeave: false,
})
const showRoomLeaveModal = ref(false)
const roomLeaveLocation = ref<RouteLocation>()

const roomId = computed(() => route.params.id as string)

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault()

  return true
}
onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnloadHandler)

  try {
    await roomStore.connectRoom(roomId.value)
  } finally {
    loading.messages = false
  }
})
onUnmounted(async () => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)

  if (roomStore.room) {
    await roomStore.disconnectRoom(roomId.value)
  }
})
onBeforeRouteLeave(async (to) => {
  if (showRoomLeaveModal.value) {
    return true
  }

  roomLeaveLocation.value = to
  showRoomLeaveModal.value = true

  return false
})

async function handleLeaveRoom() {
  loading.roomLeave = true

  try {
    await roomStore.disconnectRoom(roomId.value)
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    if (roomLeaveLocation.value) {
      await router.push({ path: roomLeaveLocation.value.path })
    } else {
      await router.push({ name: 'index' })
    }

    loading.roomLeave = false
    showRoomLeaveModal.value = false
  }
}

watch(
  () => roomMessages.value?.formContext()?.values.message,
  async (message) => {
    if (message) {
      await chatStore.startTyping(roomId.value)
    } else {
      await chatStore.stopTyping(roomId.value)
    }
  },
)

async function handleSendMessage(messageText: string) {
  loading.sendMessage = true
  try {
    await chatStore.stopTyping(roomId.value)
    await chatStore.sendMessage(messageText)
  } finally {
    roomMessages.value?.formContext()?.resetForm()
    loading.sendMessage = false
  }
}
</script>

<style lang="scss" scoped>
.room-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  max-width: 1200px;

  &__container {
    width: 100%;
  }
}

.leave-room-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 450px;

  &__actions {
    display: flex;
    gap: 8px;
  }
}
</style>
