import en from './en.json';
import es from './es.json';

export default {
    locales: [{ code: 'en', iso: 'en' },
    { code: 'es', iso: 'es-AR' }],
    parsePages: false,
    defaultLocale: 'es',

    vueI18n: {
        fallbackLocale: 'en',
        messages: {
            en,
            es,
        }
    }
}