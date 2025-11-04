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
  emailIsSame: {
    en: 'The new email address must be different from your current one',
    ru: 'Новый адрес электронной почты должен отличаться от текущего',
  },
  tooManyCharacters: {
    en: 'Too many characters',
    ru: 'Слишком много символов',
  },
} satisfies Locales
