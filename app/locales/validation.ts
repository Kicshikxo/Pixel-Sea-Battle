import type { Locales } from '~~/types/i18n'

export default {
  required: {
    en: 'Required',
    ru: 'Необходимое поле',
  },
  invalidEmail: {
    en: 'Invalid email',
    ru: 'Невалидная почта',
  },
  passwordsDoNotMatch: {
    en: 'Passwords do not match',
    ru: 'Пароли не совпадают',
  },
  tooManyCharacters: {
    en: 'Too many characters',
    ru: 'Слишком много символов',
  },
} satisfies Locales
