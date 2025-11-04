<template>
  <div class="auth-page">
    <PixelContainer>
      <TransitionExpand>
        <div v-if="action === 'sign-in'">
          <SignInForm
            :disabled="googleLoading"
            :loading="loading"
            @password-recovery="handlePasswordRecovery"
            @create-account="action = 'sign-up'"
            @submit="handleSignIn"
          />
        </div>
        <div v-else-if="action === 'sign-up'">
          <SignUpForm
            :disabled="googleLoading"
            :loading="loading"
            @guest-sign-in="handleGuestSignIn"
            @account-exists="action = 'sign-in'"
            @submit="handleSignUp"
          />
        </div>
      </TransitionExpand>

      <PixelDivider :text="$t('page.auth.googleSignIn')" width="32" />

      <PixelBorder class="auth-page__google-signin">
        <GoogleSignInButton
          class="auth-page__google-signin-button--desktop"
          text="continue_with"
          :width="400"
          :locale="locale"
          :theme="$colorMode.value === 'dark' ? 'filled_black' : 'outline'"
          @success="handleGoogleSignIn"
        />
        <GoogleSignInButton
          class="auth-page__google-signin-button--mobile"
          text="continue_with"
          :width="300"
          :locale="locale"
          :theme="$colorMode.value === 'dark' ? 'filled_black' : 'outline'"
          @success="handleGoogleSignIn"
        />
      </PixelBorder>
    </PixelContainer>
  </div>
</template>

<script lang="ts" setup>
import SignInForm, { type SignInFormValues } from '~/components/pages/auth/SignInForm.vue'
import SignUpForm, { type SignUpFormValues } from '~/components/pages/auth/SignUpForm.vue'
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelDivider from '~/components/pixel/PixelDivider.vue'
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'

import type { CredentialResponse } from 'vue3-google-signin'

definePageMeta({
  auth: false,
  middleware: () => {
    const { session } = useAuth()

    if (session.status.value === 'authenticated') {
      return navigateTo({ name: 'index' })
    }
  },
})

const toast = useToast()
const route = useRoute('auth')
const router = useRouter()
const { t, locale } = useI18n()
const { signIn, signUp, googleSignIn, guestSignIn } = useAuth()

const action = ref<'sign-in' | 'sign-up'>(
  route.query['sign-in'] !== undefined
    ? 'sign-in'
    : route.query['sign-up'] !== undefined
    ? 'sign-up'
    : 'sign-in',
)

const loading = ref(false)
const googleLoading = ref(false)

watch(
  action,
  (value) => {
    router.push({ query: { [value]: null, redirectTo: route.query.redirectTo } })
  },
  { immediate: true },
)

async function handleGoogleSignIn(response: CredentialResponse) {
  googleLoading.value = true
  const { error } = await googleSignIn({
    idToken: response.credential!,
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  googleLoading.value = false
}
async function handleGuestSignIn() {
  loading.value = true
  const { error } = await guestSignIn({
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  loading.value = false
}
async function handleSignIn(values: SignInFormValues) {
  loading.value = true
  const { error } = await signIn({
    email: values.email,
    password: values.password,
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  loading.value = false
}
async function handleSignUp(values: SignUpFormValues) {
  loading.value = true
  const { error } = await signUp({
    email: values.email,
    username: values.username,
    password: values.password,
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  loading.value = false
}
function handlePasswordRecovery() {
  router.push({ name: 'password-recovery' })
}
</script>

<style lang="scss" scoped>
.auth-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__google-signin {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px !important;
    margin: 0 auto;

    &-button--desktop {
      width: 400px;
    }
    &-button--mobile {
      width: 300px;
    }

    &-button--desktop,
    &-button--mobile {
      height: 40px;
      background-color: var(--px-color-white-on-light-black-on-dark);
      color-scheme: auto;
    }

    &-button--desktop {
      @include on-breakpoint(sm) {
        display: none !important;
      }
    }
    &-button--mobile {
      display: none !important;
      @include on-breakpoint(sm) {
        display: inline-flex !important;
      }
    }
  }
}
</style>
