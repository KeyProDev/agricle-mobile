import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {MatterApply, MatterList} from '../index';

const Stack = createStackNavigator();

const Index = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name={'MatterList'} component={MatterList} />
            <Stack.Screen name={'MatterApply'} component={MatterApply} />
        </Stack.Navigator>
    );
};

export default Index;
