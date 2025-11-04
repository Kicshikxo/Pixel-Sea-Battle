<template>
  <div class="email-verification-page">
    <PixelContainer>
      <div class="email-verification-page__container">
        <TransitionExpand>
          <PixelForm
            v-if="verified === false"
            :title="$t('page.emailVerification.emailVerification')"
            @submit="handleVerifyEmail"
          >
            <div v-if="Boolean(userError) === false" class="email-verification-page__column">
              <span style="width: 100%">
                {{ $t('page.emailVerification.emailForVerification') }}:
                <PixelBorder full-width>
                  <span class="email-verification-page__email">{{ userInfo?.email }}</span>
                </PixelBorder>
              </span>

              <PixelButton
                type="submit"
                :label="$t('page.emailVerification.verifyEmail')"
                :loading="loading"
                :disabled="Boolean(userError)"
                full-width
              />
            </div>

            <div v-else class="email-verification-page__column">
              <span v-if="userError">
                {{ $t(userError?.message) }}
              </span>
              <span v-else>
                {{ $t('page.emailVerification.unableToVerifyEmail') }}
              </span>

              <PixelButton
                :label="$t('page.emailVerification.openIndexPage')"
                :loading="loading"
                @click="handleOpenIndexPage"
                full-width
              />
            </div>
          </PixelForm>
          <div v-else class="email-verification-page__column">
            <span> {{ $t('page.emailVerification.emailVerified') }} </span>

            <PixelButton
              :label="$t('page.emailVerification.openIndexPage')"
              :loading="loading"
              full-width
              @click="handleOpenIndexPage"
            />
          </div>
        </TransitionExpand>
      </div>
    </PixelContainer>
  </div>
</template>

<script lang="ts" setup>
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'

definePageMeta({
  auth: false,
})

const { t } = useI18n()
const toast = useToast()
const route = useRoute('email-verification-id')
const router = useRouter()
const trpc = useTRPC()

const loading = ref(false)
const verified = ref(false)

const { data: userInfo, error: userError } = await trpc.emailVerification.info.useQuery({
  emailVerificationId: route.params.id,
})

onMounted(() => {
  if (userError.value) toast.error(t(userError.value.message))
})

async function handleVerifyEmail() {
  loading.value = true
  try {
    await trpc.emailVerification.verify.mutate({
      emailVerificationId: route.params.id,
    })

    verified.value = true
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    loading.value = false
  }
}

async function handleOpenIndexPage() {
  loading.value = true
  await router.push({ name: 'index' })
  loading.value = false
}
</script>

<style lang="scss" scoped>
.email-verification-page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  &__container {
    width: 400px;

    @include on-breakpoint(sm) {
      width: auto;
      max-width: 100%;
    }
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  &__email {
    width: 100%;
    padding: 8px;
    background-color: var(--px-color-white);
    color: var(--px-color-black);
  }
}
</style>
