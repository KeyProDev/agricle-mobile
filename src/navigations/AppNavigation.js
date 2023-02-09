import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Stack = createStackNavigator();

export default function App() {
    const auth = useSelector(state => state.auth);

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    presentation: "card"
                }}>
                {
                    auth.user.role ?
                        (
                            <Stack.Screen name="App" component={AppStack}/>
                        ) : (
                            <Stack.Screen name="Auth" component={AuthStack} option={{
                                headerTransparent: true,
                                headerShown: false
                            }} />
                        )
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}
