import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigations/AppNavigation';
import {LocalizationProvider} from './src/translation/translations';
import FlashMessage from "react-native-flash-message"
import {LogBox, StatusBar} from "react-native";

import store from './src/redux/store';
import { Provider } from 'react-redux';
import { loadUser } from "./src/redux/Auth/actions";

LogBox.ignoreLogs([
    "ViewPropTypes will be removed",
    "ColorPropType will be removed",
    "componentWillMount has been renamed",
    `RNUILib's ChipsInput component will be deprecated soon, please use the "Incubator.ChipsInput" component instead`,
    'Warning: Each child in a list should have a unique "key" prop.'
])

export default App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <LocalizationProvider>
                <PaperProvider>
                    <SafeAreaProvider >
                        <StatusBar
                            translucent
                            backgroundColor="transparent"
                            barStyle={'dark-content'}
                        />
                        <AppNavigator />
                        <FlashMessage position="center" />
                    </SafeAreaProvider>
                </PaperProvider>
            </LocalizationProvider>
        </Provider>
    );
}
