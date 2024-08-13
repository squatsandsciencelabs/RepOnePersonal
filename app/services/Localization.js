// TODO: Add memoization if needed
// See https://www.instamobile.io/mobile-development/react-native-localization/

import { locale } from 'expo-localization';
import i18n from 'i18n-js';

// TODO: take only the part of the translation you need
export const setLocalizations = translations => {
    // NOTE: Generators are not used because then the fallback mechanism will not work
    // It is better for translations to be of the language without the region so it call fallback properly
    const storedTranslations = {};
    if (translations[locale]) {
        // check the locale itself, with region
        storedTranslations[locale] = translations[locale]();
    } else {
        const languageCode = locale.substring(0, 2);
        if (translations[languageCode]) {
            // if not, check the language code instead
            storedTranslations[languageCode] = translations[languageCode]();
        } else if (translations.en) {
            // fallback, english
            storedTranslations.en = translations.en();
        } else {
            // error
            console.tron.log(
                `Translations ${translations} are missing for language code ${locale} and for default language code en`,
            );
            return;
        }
    }
    i18n.translations = storedTranslations;

    // Set the locale once at the beginning of your app.
    i18n.locale = locale;

    // When a value is missing from a language it'll fallback to another language with the key present.
    i18n.fallbacks = true;
};

const Localized = (value, options) => i18n.t(value, options);
export default Localized;
