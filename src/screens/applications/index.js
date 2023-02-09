import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import List from './List';
import Detail from "./Detail";

const Stack = createStackNavigator();

const Index = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name={'ApplicationMain'} component={List} />
            <Stack.Screen name={'ApplicationDetail'} component={Detail} />
        </Stack.Navigator>
    );
};

export default Index;
