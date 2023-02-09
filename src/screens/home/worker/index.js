import React, {useContext} from 'react';
import {Applications, Chat, FavouriteMatter, Matters, Notifications} from '../../index';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Colors} from 'react-native-ui-lib';
import {LocalizationContext} from '../../../translation/translations';
import {useSelector} from "react-redux";

const Tab = createBottomTabNavigator();

const Index = () => {
    const { t } = useContext(LocalizationContext);

    const { unreadMessages } = useSelector(state => state.chat);
    const { unreadNews } = useSelector(state => state.notice);

    const chatOption = {
        tabBarLabel: t['action']['chatting'],
        tabBarIcon: ({ focused, color, size }) => (
            <Fontisto name={'hipchat'} color={color} size={size-5} />
        ),
    };
    if(unreadMessages.length > 0) chatOption.tabBarBadge = unreadMessages.length;

    const newsOption = {
        tabBarLabel: t['title']['news'],
        tabBarIcon: ({ focused, color, size }) => (
            <Fontisto name={'bell'} color={color} size={size-5} />
        ),
    };
    if(unreadNews.length > 0) newsOption.tabBarBadge = unreadNews.length;

    return (
        <Tab.Navigator
            screenOptions={() => ({
                tabBarActiveTintColor: Colors.cyan10,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Matters"
                component={Matters}
                options={{
                    tabBarLabel: t['header']['matters_view'],
                    tabBarIcon: ({ focused, color, size }) => (
                        <Fontisto name={'search'} color={color} size={size-5}/>
                    ),
                }}
            />
            <Tab.Screen
                name="FavouriteMatter"
                component={FavouriteMatter}
                options={{
                    tabBarLabel: t['action']['favourite'],
                    tabBarIcon: ({ focused, color, size }) => (
                        <Fontisto name={'star'} color={color} size={size-5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Applications"
                component={Applications}
                options={{
                    tabBarLabel: t['applications']['title'],
                    tabBarIcon: ({ focused, color, size }) => (
                        <Fontisto name={'nav-icon-a'} color={color} size={size-5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Chat"
                component={Chat}
                options={chatOption}
            />
            <Tab.Screen
                name="Notifications"
                component={Notifications}
                options={newsOption}
            />
        </Tab.Navigator>
    );
}

export default Index;
