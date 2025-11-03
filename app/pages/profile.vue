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
          </div>
          <div class="profile-page__profile-actions">
            <PixelButton
              :label="$t('page.profile.signOut')"
              :loading="signOutLoading"
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
          <PixelForm
            v-if="userData.email"
            class="profile-page__email-form"
            :validation-schema="changeEmailSchema"
            full-width
            @submit="handleChangeEmail"
          >
            <template #title>
              <span>{{ $t('page.profile.email') }}</span>
              <span class="profile-page__email-form__status">
                <PixelBorder v-if="userData.emailVerifiedAt" color="green">
                  <span class="profile-page__email-form__status-text">
                    {{ $t('page.profile.emailVerified') }}
                  </span>
                </PixelBorder>
                <PixelBorder v-else color="red">
                  <span class="profile-page__email-form__status-text">
                    {{ $t('page.profile.emailNotVerified') }}
                  </span>
                </PixelBorder>
              </span>
            </template>

            <PixelFormTextInput
              name="newEmail"
              type="email"
              autocomplete="email"
              :placeholder="$t('page.profile.email')"
              :value="userData?.email"
            >
              <template #prepend-icon>
                <icon name="pixelarticons:mail" />
              </template>
            </PixelFormTextInput>

            <PixelButton
              type="submit"
              :label="$t('page.profile.changeEmail')"
              :loading="changeEmailLoading"
              class="profile-page__email-form__button"
            >
              <template #append-icon>
                <icon name="pixelarticons:mail" />
              </template>
            </PixelButton>
          </PixelForm>

          <PixelForm
            v-else
            class="profile-page__email-form"
            :title="$t('page.profile.setEmail')"
            :validation-schema="setEmailSchema"
            full-width
            @submit="handleSetEmail"
          >
            <PixelFormTextInput
              name="newEmail"
              type="email"
              autocomplete="email"
              :placeholder="$t('page.profile.newEmail')"
            >
              <template #prepend-icon>
                <icon name="pixelarticons:mail" />
              </template>
            </PixelFormTextInput>

            <PixelButton
              type="submit"
              :label="$t('page.profile.setEmail')"
              :loading="setEmailLoading"
              class="profile-page__email-form__button"
            >
              <template #append-icon>
                <icon name="pixelarticons:mail" />
              </template>
            </PixelButton>
          </PixelForm>
        </PixelContainer>

        <PixelContainer full-width>
          <TransitionExpand>
            <PixelForm
              v-if="userData.password"
              class="profile-page__password-form"
              :title="$t('page.profile.changePassword')"
              :validation-schema="changePasswordSchema"
              full-width
              @submit="handleChangePassword"
            >
              <input name="username" autocomplete="username" style="display: none" />
              <PixelFormTextInput
                name="currentPassword"
                type="password"
                autocomplete="current-password"
                :label="$t('page.profile.currentPassword')"
                :placeholder="$t('page.profile.currentPassword')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </PixelFormTextInput>

              <PixelFormTextInput
                name="newPassword"
                type="password"
                autocomplete="new-password"
                :label="$t('page.profile.newPassword')"
                :placeholder="$t('page.profile.newPassword')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </PixelFormTextInput>

              <PixelFormTextInput
                name="repeatNewPassword"
                type="password"
                autocomplete="new-password"
                :placeholder="$t('page.profile.repeatNewPassword')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </PixelFormTextInput>

              <PixelButton
                type="submit"
                :loading="changePasswordLoading"
                :label="$t('page.profile.changePassword')"
                class="profile-page__password-form__button"
              >
                <template #append-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </PixelButton>
            </PixelForm>

            <PixelForm
              v-else
              class="profile-page__password-form"
              :title="$t('page.profile.setPassword')"
              :validation-schema="setPasswordSchema"
              full-width
              @submit="handleSetPassword"
            >
              <input name="username" autocomplete="username" style="display: none" />
              <PixelFormTextInput
                name="newPassword"
                type="password"
                autocomplete="new-password"
                :label="$t('page.profile.newPassword')"
                :placeholder="$t('page.profile.newPassword')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </PixelFormTextInput>

              <PixelFormTextInput
                name="repeatNewPassword"
                type="password"
                autocomplete="new-password"
                :placeholder="$t('page.profile.repeatNewPassword')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </PixelFormTextInput>

              <PixelButton
                type="submit"
                :label="$t('page.profile.setPassword')"
                :loading="setPasswordLoading"
                class="profile-page__password-form__button"
              >
                <template #append-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </PixelButton>
            </PixelForm>
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
              :disabled="signOutLoading"
              @click="showConfirmGuestSignOutModal = false"
            />
            <PixelButton
              :label="$t('page.profile.leave')"
              color="red"
              full-width
              :loading="signOutLoading"
              @click="handleSignout(true)"
            />
          </div>
        </div>
      </PixelModal>
    </div>
  </TransitionFade>
</template>

<script setup lang="ts">
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelModal from '~/components/pixel/PixelModal.vue'
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'
import TransitionFade from '~/components/transitions/TransitionFade.vue'

import { type FormActions } from 'vee-validate'
import { z } from 'zod'

const { t } = useI18n()
const trpc = useTRPC()
const toast = useToast()
const { session, signOut } = useAuth()

const { data: userData, refresh: refreshUserData } = trpc.auth.info.useQuery()

const changeEmailLoading = ref(false)
const setEmailLoading = ref(false)
const changePasswordLoading = ref(false)
const setPasswordLoading = ref(false)
const signOutLoading = ref(false)
const showConfirmGuestSignOutModal = ref(false)

const changeEmailSchema = computed(() =>
  z.object({
    newEmail: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail'))
      .default(''),
  }),
)
type ChangeEmailFormValues = z.infer<typeof changeEmailSchema.value>

const setEmailSchema = computed(() =>
  z.object({
    newEmail: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail'))
      .default(''),
  }),
)
type SetEmailFormValues = z.infer<typeof setEmailSchema.value>

const changePasswordSchema = computed(() =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, t('validation.required'))
        .max(100, { message: t('validation.tooManyCharacters') })
        .default(''),
      newPassword: z
        .string()
        .min(1, t('validation.required'))
        .max(100, { message: t('validation.tooManyCharacters') })
        .default(''),
      repeatNewPassword: z
        .string()
        .min(1, t('validation.required'))
        .max(100, { message: t('validation.tooManyCharacters') })
        .default(''),
    })
    .refine((data) => data.newPassword === data.repeatNewPassword, {
      message: t('validation.passwordsDoNotMatch'),
      path: ['repeatNewPassword'],
    }),
)
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema.value>

const setPasswordSchema = computed(() =>
  z
    .object({
      newPassword: z
        .string()
        .min(1, t('validation.required'))
        .max(100, { message: t('validation.tooManyCharacters') })
        .default(''),
      repeatNewPassword: z
        .string()
        .min(1, t('validation.required'))
        .max(100, { message: t('validation.tooManyCharacters') })
        .default(''),
    })
    .refine((data) => data.newPassword === data.repeatNewPassword, {
      message: t('validation.passwordsDoNotMatch'),
      path: ['repeatNewPassword'],
    }),
)
type SetPasswordFormValues = z.infer<typeof setPasswordSchema.value>

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
  setEmailLoading.value = true

  try {
    await trpc.user.changeEmail.mutate({ email: values.newEmail })
    await refreshUserData()
    toast.success(t('page.profile.emailChanged'))
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    setEmailLoading.value = false
  }
}

async function handleChangePassword(
  values: ChangePasswordFormValues,
  formActions: FormActions<ChangePasswordFormValues>,
) {
  changePasswordLoading.value = true

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
    changePasswordLoading.value = false
  }
}

async function handleSetPassword(
  values: SetPasswordFormValues,
  formActions: FormActions<SetPasswordFormValues>,
) {
  setPasswordLoading.value = true

  try {
    await trpc.user.changePassword.mutate({ newPassword: values.newPassword })
    await refreshUserData()
    toast.success(t('page.profile.passwordChanged'))
    formActions.resetForm()
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    setPasswordLoading.value = false
  }
}

async function handleSignout(force = false) {
  if (!session.data.value?.email && !force) {
    showConfirmGuestSignOutModal.value = true
    return
  }

  signOutLoading.value = true
  const { error } = await signOut({ redirectTo: '/auth' })
  if (error) toast.error(error)
  signOutLoading.value = false
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

  &__email-form {
    &__status {
      font-size: 14px;
      margin-left: 8px;

      &-text {
        padding: 0 8px;
      }
    }

    &__button {
      margin-left: auto;
    }
  }

  &__password-form {
    &__button {
      margin-left: auto;
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
