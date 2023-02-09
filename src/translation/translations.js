import {AsyncStorage} from "react-native";
import React, {createContext, useState} from 'react';
import LocalizedStrings from 'react-native-localization'; // 2
import * as RNLocalize from 'react-native-localize'; // 3
import languages from './index';

const DEFAULT_LANGUAGE = 'ja';
const APP_LANGUAGE = 'appLanguage';

const t = new LocalizedStrings(languages); // 4

export const LocalizationContext = createContext({ // 5
    t,
    setAppLanguage: () => {}, // 6
    appLanguage: DEFAULT_LANGUAGE, // 7
    initializeAppLanguage: () => {}, // 8
});

export const LocalizationProvider = ({children}) => { // 9
    const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);

    // 11
    const setLanguage = async language => {
        t.setLanguage(language);
        setAppLanguage(language);
        await AsyncStorage.setItem(APP_LANGUAGE, language);
    };

    // 12
    const initializeAppLanguage = async () => {
        const currentLanguage = await AsyncStorage.getItem(APP_LANGUAGE);

        if (currentLanguage) {
            await setLanguage(currentLanguage);
        } else {
            let localeCode = DEFAULT_LANGUAGE;
            const supportedLocaleCodes = t.getAvailableLanguages();
            const phoneLocaleCodes = RNLocalize.getLocales().map(
                locale => locale.languageCode,
            );
            phoneLocaleCodes.some(code => {
                if (supportedLocaleCodes.includes(code)) {
                    localeCode = code;
                    return true;
                }
            });
            await setLanguage(localeCode);
        }
    };

    return (
        <LocalizationContext.Provider
            value={{
                t,
                setAppLanguage: setLanguage, // 10
                appLanguage,
                initializeAppLanguage,
            }}>
            {children}
        </LocalizationContext.Provider>
    );
};
