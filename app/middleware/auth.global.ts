import useAuth from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { session, getSession } = useAuth()

  if (session.status.value === 'unauthenticated') await getSession()
  if (session.status.value === 'authenticated') return

  if (to.meta.auth === false) return

  return navigateTo({
    name: 'auth',
    query: {
      redirectTo: to.fullPath,
    },
  })
})
