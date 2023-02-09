import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './Main';
import ChatRecruitments from './ChatRecruitments';
import ChatFavourites from './ChatFavourites';
import Chatting from './Chatting';
import ChatApplicants from "./ChatApplicants";

const Stack = createStackNavigator();

const Index = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name={'ChatMain'} component={Main} />
            <Stack.Screen name={'ChatApplicants'} component={ChatApplicants} />
            <Stack.Screen name={'ChatRecruitments'} component={ChatRecruitments} />
            <Stack.Screen name={'ChatFavourites'} component={ChatFavourites} />
            <Stack.Screen name={'Chatting'} component={Chatting} />
        </Stack.Navigator>
    );
};

export default Index;
