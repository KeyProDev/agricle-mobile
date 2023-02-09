import React, {useContext} from 'react';
import {Recruitments, RecruitmentCreate, Chat, Notifications} from '../../index';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Colors} from 'react-native-ui-lib';
import {LocalizationContext} from '../../../translation/translations';
import Top from "./Top";
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
                name="Top"
                component={Top}
                options={{
                    tabBarLabel: t['top']['title'],
                    tabBarIcon: ({ focused, color, size }) => (
                        <Fontisto name={'home'} color={color} size={size-5} />
                    ),
                }}
            />
            <Tab.Screen
                name="RecruitmentCreate"
                component={RecruitmentCreate}
                options={{
                    tabBarLabel: t['header']['recruitment_create'],
                    tabBarIcon: ({ focused, color, size }) => (
                        <Fontisto name={'plus-a'} color={color} size={size-5} />
                    ),
                }}
            />
            <Tab.Screen
                name="RecruitmentMain"
                component={Recruitments}
                options={{
                    tabBarLabel: t['recruitment']['status']['title'],
                    tabBarIcon: ({ focused, color, size }) => (
                        <Fontisto name={'nav-icon-list-a'} color={color} size={size-5} />
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
