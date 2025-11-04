<template>
  <PixelForm
    class="change-password-form"
    :title="$t('page.profile.changePassword')"
    :validation-schema="changePasswordSchema"
    full-width
    @submit="handleSubmit"
  >
    <input name="username" autocomplete="username" style="display: none" />
    <PixelFormTextInput
      name="currentPassword"
      type="password"
      autocomplete="current-password"
      :readonly="disabled || loading"
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
      :readonly="disabled || loading"
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
      :readonly="disabled || loading"
      :placeholder="$t('page.profile.repeatNewPassword')"
    >
      <template #prepend-icon>
        <icon name="pixelarticons:lock" />
      </template>
    </PixelFormTextInput>

    <div class="change-password-form__buttons">
      <PixelButton type="submit" :loading="loading" :label="$t('page.profile.changePassword')">
        <template #append-icon>
          <icon name="pixelarticons:lock" />
        </template>
      </PixelButton>
    </div>
  </PixelForm>
</template>

<script lang="ts" setup>
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'

import { type FormActions } from 'vee-validate'
import { z } from 'zod'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    disabled: false,
    loading: false,
  },
)
const emits = defineEmits<{
  submit: [values: ChangePasswordFormValues, formActions: FormActions<ChangePasswordFormValues>]
}>()

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
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema.value>

function handleSubmit(
  values: ChangePasswordFormValues,
  formActions: FormActions<ChangePasswordFormValues>,
) {
  emits('submit', values, formActions)
}
</script>

<style lang="scss" scoped>
.change-password-form {
  &__buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: 8px;
    width: 100%;
  }
}
</style>
