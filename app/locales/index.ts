import type { Locale, Locales } from '~~/types/i18n'
import { locales } from '~~/types/i18n'

import authErrors from './errors/auth'
import emailVerificationErrors from './errors/emailVerification'
import passwordRecoveryErrors from './errors/passwordRecovery'
import roomErrors from './errors/room'
import userErrors from './errors/user'

import authPage from './pages/auth'
import emailVerificationPage from './pages/emailVerification'
import errorPage from './pages/error'
import indexPage from './pages/index'
import passwordRecoveryPage from './pages/passwordRecovery'
import profilePage from './pages/profile'
import roomPage from './pages/room'

import validation from './validation'

export const translationFiles: Record<string, Locales> = {
  error: {
    auth: authErrors,
    emailVerification: emailVerificationErrors,
    passwordRecovery: passwordRecoveryErrors,
    room: roomErrors,
    user: userErrors,
  },

  page: {
    auth: authPage,
    emailVerification: emailVerificationPage,
    error: errorPage,
    index: indexPage,
    passwordRecovery: passwordRecoveryPage,
    profile: profilePage,
    room: roomPage,
  },

  validation,
}

export function transformTranslationFiles(files: Record<string, Locales>): Record<Locale, any> {
  const transformed: Record<string, any> = {}

  for (const locale of locales) {
    transformed[locale] = {}
  }

  const processingStack: [Locales, string[], string][] = Object.entries(files).map(
    ([fileName, translations]) => [translations, [], fileName],
  )

  while (processingStack.length) {
    const [currentObject, currentPath, currentFileName] = processingStack.pop()!

    for (const key in currentObject) {
      const value = currentObject[key]

      if (value && locales.every((locale) => locale in value)) {
        for (const locale of locales) {
          let pointer = transformed[locale]
          const fullPath = [currentFileName, ...currentPath]
          for (const pathPart of fullPath) {
            if (!pointer[pathPart]) pointer[pathPart] = {}
            pointer = pointer[pathPart]
          }
          pointer[key] = value[locale]
        }
      } else {
        processingStack.push([value as Locales, [...currentPath, key], currentFileName])
      }
    }
  }

  return transformed as Record<Locale, any>
}

export const messages = transformTranslationFiles(translationFiles)
