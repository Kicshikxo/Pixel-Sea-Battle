<template>
  <PixelForm
    class="set-password-form"
    :title="$t('page.profile.setPassword')"
    :validation-schema="setPasswordSchema"
    full-width
    @submit="handleSubmit"
  >
    <input name="username" autocomplete="username" style="display: none" />
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

    <div class="set-password-form__buttons">
      <PixelButton type="submit" :label="$t('page.profile.setPassword')" :loading="loading">
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
  submit: [values: SetPasswordFormValues, formActions: FormActions<SetPasswordFormValues>]
}>()

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
export type SetPasswordFormValues = z.infer<typeof setPasswordSchema.value>

function handleSubmit(
  values: SetPasswordFormValues,
  formActions: FormActions<SetPasswordFormValues>,
) {
  emits('submit', values, formActions)
}
</script>

<style lang="scss" scoped>
.set-password-form {
  &__buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: 8px;
    width: 100%;
  }
}
</style>
