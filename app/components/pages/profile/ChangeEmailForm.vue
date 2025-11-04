<template>
  <PixelForm
    class="change-email-form"
    :validation-schema="changeEmailSchema"
    full-width
    @submit="handleSubmit"
  >
    <template #title>
      <span>{{ $t('page.profile.email') }}</span>
      <span class="change-email-form__status">
        <PixelBorder v-if="userData.emailVerifiedAt" color="green">
          <span class="change-email-form__status-text">
            {{ $t('page.profile.emailVerified') }}
          </span>
        </PixelBorder>
        <PixelBorder v-else color="red">
          <span class="change-email-form__status-text">
            {{ $t('page.profile.emailNotVerified') }}
          </span>
        </PixelBorder>
      </span>
    </template>

    <PixelFormTextInput
      name="newEmail"
      type="email"
      autocomplete="email"
      :readonly="disabled || loading"
      :placeholder="$t('page.profile.email')"
      :value="userData?.email"
    >
      <template #prepend-icon>
        <icon name="pixelarticons:mail" />
      </template>
    </PixelFormTextInput>

    <div class="change-email-form__buttons">
      <PixelButton
        v-if="!userData.emailVerifiedAt"
        :label="$t('page.profile.resendVerificationEmail')"
        :loading="resendLoading"
        @click="handleResendVerificationEmail"
      >
        <template #append-icon>
          <icon name="pixelarticons:mail-arrow-right" />
        </template>
      </PixelButton>

      <PixelButton type="submit" :label="$t('page.profile.changeEmail')" :loading="loading">
        <template #append-icon>
          <icon name="pixelarticons:mail" />
        </template>
      </PixelButton>
    </div>
  </PixelForm>
</template>

<script lang="ts" setup>
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'

import type { User } from '@prisma/client'
import { type FormActions } from 'vee-validate'
import { z } from 'zod'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    userData: User
    disabled?: boolean
    loading?: boolean
    resendLoading?: boolean
  }>(),
  {
    disabled: false,
    loading: false,
    resendLoading: false,
  },
)
const emits = defineEmits<{
  resendVerificationEmail: []
  submit: [values: ChangeEmailFormValues, formActions: FormActions<ChangeEmailFormValues>]
}>()

const changeEmailSchema = computed(() =>
  z
    .object({
      newEmail: z
        .string()
        .min(1, t('validation.required'))
        .email(t('validation.invalidEmail'))
        .default(''),
    })
    .refine((data) => data.newEmail !== props.userData.email, {
      message: t('validation.emailIsSame'),
      path: ['newEmail'],
    }),
)
export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema.value>

function handleResendVerificationEmail() {
  emits('resendVerificationEmail')
}
function handleSubmit(
  values: ChangeEmailFormValues,
  formActions: FormActions<ChangeEmailFormValues>,
) {
  emits('submit', values, formActions)
}
</script>

<style lang="scss" scoped>
.change-email-form {
  &__status {
    font-size: 14px;
    margin-left: 8px;

    &-text {
      color: var(--px-color-white);
      padding: 0 8px;
    }
  }

  &__buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: 8px;
    width: 100%;
  }
}
</style>
