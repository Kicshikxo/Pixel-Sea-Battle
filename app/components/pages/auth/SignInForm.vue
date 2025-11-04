<template>
  <PixelForm
    ref="form"
    class="sign-in-form"
    :validation-schema="signInSchema"
    :title="$t('page.auth.signInTitle')"
    @submit="handleSubmit"
  >
    <PixelFormTextInput
      name="email"
      type="email"
      autocomplete="email"
      :readonly="disabled || loading"
      :label="$t('page.auth.emailLabel')"
      :placeholder="$t('page.auth.emailPlaceholder')"
    >
      <template #prepend-icon>
        <icon name="pixelarticons:mail" />
      </template>
    </PixelFormTextInput>
    <PixelFormTextInput
      name="password"
      autocomplete="current-password"
      type="password"
      :readonly="disabled || loading"
      :label="$t('page.auth.passwordLabel')"
      :placeholder="$t('page.auth.passwordPlaceholder')"
    >
      <template #prepend-icon>
        <icon name="pixelarticons:lock" />
      </template>
    </PixelFormTextInput>

    <div class="sign-in-form__options">
      <span class="sign-in-form__option" @click="handlePasswordRecovery">
        {{ $t('page.auth.forgotPassword') }}
      </span>
      <span class="sign-in-form__option" @click="handleCreateAccount">
        {{ $t('page.auth.noAccount') }}
      </span>
    </div>

    <PixelButton
      type="submit"
      :label="$t('page.auth.signIn')"
      :disabled="disabled"
      :loading="loading"
      full-width
    >
      <template #append-icon>
        <icon name="pixelarticons:login" />
      </template>
    </PixelButton>
  </PixelForm>
</template>

<script lang="ts" setup>
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'

import type { FormActions } from 'vee-validate'
import { z } from 'zod'

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
  passwordRecovery: []
  createAccount: []
  submit: [values: SignInFormValues, formActions: FormActions<SignInFormValues>]
}>()

const { t } = useI18n()

const signInSchema = computed(() =>
  z.object({
    email: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail'))
      .default(''),
    password: z
      .string()
      .min(1, t('validation.required'))
      .max(100, { message: t('validation.tooManyCharacters') })
      .default(''),
  }),
)
export type SignInFormValues = z.infer<typeof signInSchema.value>

function handlePasswordRecovery() {
  emits('passwordRecovery')
}
function handleCreateAccount() {
  emits('createAccount')
}
function handleSubmit(values: SignInFormValues, formActions: FormActions<SignInFormValues>) {
  emits('submit', values, formActions)
}
</script>

<style lang="scss" scoped>
.sign-in-form {
  &__options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 24px;
    width: 100%;
  }

  &__option {
    cursor: pointer;
    color: var(--px-color-blue);
    --px-color-text-shadow: var(--px-color-shadow-blue);

    @media (hover: hover) {
      &:hover {
        color: var(--px-color-blue-hover);
      }
    }
    &:active {
      color: var(--px-color-blue-active);
    }
  }
}
</style>
