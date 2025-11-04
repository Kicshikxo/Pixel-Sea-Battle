<template>
  <TransitionFade>
    <div v-if="userData" class="profile-page">
      <PixelContainer full-width>
        <div class="profile-page__profile">
          <PixelAvatar :seed="userData.id" :title="userData.username" large />
          <div class="profile-page__profile-info">
            <span>{{ $t('page.profile.username') }}: {{ userData?.username }}</span>
            <span>
              {{ $t('page.profile.registerDate') }}:
              {{ new Date(userData.createdAt).toLocaleDateString() }}
            </span>
            <span>
              {{ $t('page.profile.userType.label') }}:
              {{ $t(`page.profile.userType.${userData.type}`) }}
            </span>
          </div>
          <div class="profile-page__profile-actions">
            <PixelButton
              :label="$t('page.profile.signOut')"
              :loading="loading.signOut"
              @click="handleSignout(false)"
            >
              <template #append-icon>
                <icon name="pixelarticons:logout" />
              </template>
            </PixelButton>
          </div>
        </div>
      </PixelContainer>

      <div class="profile-page__forms">
        <PixelContainer full-width>
          <TransitionExpand>
            <div v-if="userData.email">
              <ChangeEmailForm
                :user-data="userData"
                :loading="loading.changeEmail"
                :resend-loading="loading.resendVerificationEmail"
                @resend-verification-email="handleResendVerificationEmail"
                @submit="handleChangeEmail"
              />
            </div>

            <div v-else>
              <SetEmailForm :loading="loading.setEmail" @submit="handleSetEmail" />
            </div>
          </TransitionExpand>
        </PixelContainer>

        <PixelContainer full-width>
          <TransitionExpand>
            <div v-if="userData.password">
              <ChangePasswordForm
                :loading="loading.changePassword"
                @submit="handleChangePassword"
              />
            </div>

            <div v-else>
              <SetPasswordForm :loading="loading.setPassword" @submit="handleSetPassword" />
            </div>
          </TransitionExpand>
        </PixelContainer>
      </div>

      <PixelModal
        v-model:show="showConfirmGuestSignOutModal"
        :title="$t('page.profile.confirmLeave')"
      >
        <div class="confirm-guest-sign-out-modal">
          <span>
            {{ $t('page.profile.confirmGuestSignOut') }}
          </span>

          <div class="confirm-guest-sign-out-modal__actions">
            <PixelButton
              :label="$t('page.profile.cancel')"
              full-width
              :disabled="loading.signOut"
              @click="showConfirmGuestSignOutModal = false"
            />
            <PixelButton
              :label="$t('page.profile.leave')"
              color="red"
              full-width
              :loading="loading.signOut"
              @click="handleSignout(true)"
            />
          </div>
        </div>
      </PixelModal>
    </div>
  </TransitionFade>
</template>

<script lang="ts" setup>
import ChangeEmailForm, {
  type ChangeEmailFormValues,
} from '~/components/pages/profile/ChangeEmailForm.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelModal from '~/components/pixel/PixelModal.vue'
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'
import TransitionFade from '~/components/transitions/TransitionFade.vue'

import { UserType } from '@prisma/client'
import { type FormActions } from 'vee-validate'
import ChangePasswordForm, {
  type ChangePasswordFormValues,
} from '~/components/pages/profile/ChangePasswordForm.vue'
import SetEmailForm, { type SetEmailFormValues } from '~/components/pages/profile/SetEmailForm.vue'
import SetPasswordForm, {
  type SetPasswordFormValues,
} from '~/components/pages/profile/SetPasswordForm.vue'

const { t } = useI18n()
const trpc = useTRPC()
const toast = useToast()
const { signOut } = useAuth()

const { data: userData, refresh: refreshUserData } = trpc.auth.info.useQuery()

const loading = reactive({
  resendVerificationEmail: false,
  changeEmail: false,
  setEmail: false,
  changePassword: false,
  setPassword: false,
  signOut: false,
})

const showConfirmGuestSignOutModal = ref(false)

async function handleResendVerificationEmail() {
  loading.resendVerificationEmail = true

  try {
    await trpc.user.resendEmailConfirmation.mutate()
    toast.success(t('page.profile.verificationEmailResent'))
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    loading.resendVerificationEmail = false
  }
}

async function handleChangeEmail(
  values: ChangeEmailFormValues,
  formActions: FormActions<ChangeEmailFormValues>,
) {
  console.log('handleChangeEmail', values)
}

async function handleSetEmail(
  values: SetEmailFormValues,
  formActions: FormActions<SetEmailFormValues>,
) {
  loading.setEmail = true

  try {
    await trpc.user.changeEmail.mutate({ email: values.newEmail })
    await refreshUserData()
    toast.success(t('page.profile.emailChanged'))
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    loading.setEmail = false
  }
}

async function handleChangePassword(
  values: ChangePasswordFormValues,
  formActions: FormActions<ChangePasswordFormValues>,
) {
  loading.changePassword = true

  try {
    await trpc.user.changePassword.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })
    await refreshUserData()
    toast.success(t('page.profile.passwordChanged'))
    formActions.resetForm()
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    loading.changePassword = false
  }
}

async function handleSetPassword(
  values: SetPasswordFormValues,
  formActions: FormActions<SetPasswordFormValues>,
) {
  loading.setPassword = true

  try {
    await trpc.user.changePassword.mutate({ newPassword: values.newPassword })
    await refreshUserData()
    toast.success(t('page.profile.passwordChanged'))
    formActions.resetForm()
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    loading.setPassword = false
  }
}

async function handleSignout(force = false) {
  if (userData.value?.type === UserType.GUEST && !force) {
    showConfirmGuestSignOutModal.value = true
    return
  }

  loading.signOut = true
  const { error } = await signOut({ redirectTo: '/auth' })
  if (error) toast.error(error)
  loading.signOut = false
}
</script>

<style lang="scss" scoped>
.profile-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  max-width: 1200px;

  &__profile {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    @include on-breakpoint(sm) {
      flex-direction: column;
    }

    &-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
    }

    &-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  &__forms {
    display: flex;
    gap: 16px;
    width: 100%;

    @include on-breakpoint(sm) {
      flex-direction: column;
    }
  }
}

.confirm-guest-sign-out-modal {
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
