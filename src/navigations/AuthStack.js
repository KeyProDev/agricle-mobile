import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {Login, Register, Splash} from "../screens";

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Splash"
                component={Splash}
            />
            <Stack.Screen
                name="Login"
                component={Login}
            />
            <Stack.Screen
                name="Register"
                component={Register}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
