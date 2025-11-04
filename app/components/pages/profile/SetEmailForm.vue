<template>
  <PixelForm
    class="set-email-form"
    :title="$t('page.profile.setEmail')"
    :validation-schema="setEmailSchema"
    full-width
    @submit="handleSubmit"
  >
    <PixelFormTextInput
      name="newEmail"
      type="email"
      autocomplete="email"
      :readonly="disabled || loading"
      :placeholder="$t('page.profile.newEmail')"
    >
      <template #prepend-icon>
        <icon name="pixelarticons:mail" />
      </template>
    </PixelFormTextInput>

    <div class="set-email-form__buttons">
      <PixelButton type="submit" :label="$t('page.profile.setEmail')" :loading="loading">
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
  submit: [values: SetEmailFormValues, formActions: FormActions<SetEmailFormValues>]
}>()

const setEmailSchema = computed(() =>
  z.object({
    newEmail: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail'))
      .default(''),
  }),
)
export type SetEmailFormValues = z.infer<typeof setEmailSchema.value>

function handleSubmit(values: SetEmailFormValues, formActions: FormActions<SetEmailFormValues>) {
  emits('submit', values, formActions)
}
</script>

<style lang="scss" scoped>
.set-email-form {
  &__buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: 8px;
    width: 100%;
  }
}
</style>
