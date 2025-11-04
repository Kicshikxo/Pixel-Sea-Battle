<template>
  <PixelForm
    ref="form"
    class="sign-up-form"
    :validation-schema="signUpSchema"
    :title="$t('page.auth.signUpTitle')"
    @submit="handleSubmit"
  >
    <PixelFormTextInput
      name="username"
      autocomplete="username"
      :readonly="disabled || loading"
      :label="$t('page.auth.usernameLabel')"
      :placeholder="$t('page.auth.usernamePlaceholder')"
    >
      <template #prepend-icon>
        <icon name="pixelarticons:user" />
      </template>
    </PixelFormTextInput>
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
      type="password"
      autocomplete="new-password"
      :readonly="disabled || loading"
      :label="$t('page.auth.passwordLabel')"
      :placeholder="$t('page.auth.passwordPlaceholder')"
    >
      <template #prepend-icon>
        <icon name="pixelarticons:lock" />
      </template>
    </PixelFormTextInput>

    <div class="sign-up-form__options">
      <span class="sign-up-form__option" @click="handleGuestSignIn">
        {{ $t('page.auth.guestSignIn') }}
      </span>
      <span class="sign-up-form__option" @click="handleAccountExists">
        {{ $t('page.auth.haveAnAccount') }}
      </span>
    </div>

    <PixelButton
      type="submit"
      :label="$t('page.auth.signUp')"
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
  gurstSignIn: []
  accountExists: []
  submit: [values: SignUpFormValues, formActions: FormActions<SignUpFormValues>]
}>()

const { t } = useI18n()

const signUpSchema = computed(() =>
  z.object({
    email: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail'))
      .default(''),
    username: z
      .string()
      .min(1, t('validation.required'))
      .max(32, { message: t('validation.tooManyCharacters') })
      .default(''),
    password: z
      .string()
      .min(1, t('validation.required'))
      .max(100, { message: t('validation.tooManyCharacters') })
      .default(''),
  }),
)
export type SignUpFormValues = z.infer<typeof signUpSchema.value>

function handleGuestSignIn() {
  emits('gurstSignIn')
}
function handleAccountExists() {
  emits('accountExists')
}
function handleSubmit(values: SignUpFormValues, formActions: FormActions<SignUpFormValues>) {
  emits('submit', values, formActions)
}
</script>

<style lang="scss" scoped>
.sign-up-form {
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
