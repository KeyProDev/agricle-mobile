import React, {useContext} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createDrawerNavigator, DrawerItem} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {logout} from "../redux/Auth/actions";
import {
    Profile,
    ProducerDetail,
    Farmers,
    Farms,
    WorkerDetail,
    Faq,
    Usage,
    Contact,
    Policy,
    WorkerHome,
    ProducerHome,
    ProducerScheduler,
    WorkerScheduler
} from '../screens';
import {Dimensions, ScrollView, StyleSheet} from "react-native";
import {Avatar, Colors, Text, View} from "react-native-ui-lib";
import {LocalizationContext} from "../translation/translations";
import { serverURL } from '../constants/config';
import Pusher from 'pusher-js/react-native';
import pusherConfig from '../constants/pusher.json';
import {addUnreadMessage} from '../redux/Chat/actions';
import {addUnreadNews} from "../redux/Notice/actions";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const { height, width } = Dimensions.get('screen');
const userIcon = require('../assets/images/user.png');

const AppStack = () => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const auth = useSelector(state => state.auth);
    const pusher = new Pusher(pusherConfig.key, pusherConfig);
    const chatChannel = pusher.subscribe('chat');

    chatChannel.bind(`receive-${auth.user.id}`, (data) => {
        dispatch(addUnreadMessage(data));
    });

    chatChannel.bind(`news-${auth.user.id}`, (data) => {
        dispatch(addUnreadNews(data));
    });

    const ProducerDrawerContent = (props) => {
        return (
            <ScrollView {...props}>
                <View>
                    <View paddingV-16 center >
                        <Avatar
                            size={80}
                            source={
                                auth.user.avatar === 'default.png' ?
                                    userIcon :
                                    { uri: serverURL+'avatars/'+auth.user.avatar}
                            }
                            label={'IMG'}
                        />
                        <Text marginT-10 text65 style={{ color: Colors.white }}>{ auth.user.family_name }</Text>
                        <Text text70 style={{ color: Colors.white }}>{ auth.user.email }</Text>
                    </View>
                    {/*<DrawerItem*/}
                    {/*    label={t['title']['home']}*/}
                    {/*    icon={({ focused, color, size }) => <Ionicons name="home" size={20} color={"#fff"} />}*/}
                    {/*    labelStyle={styles.drawerItem}*/}
                    {/*    onPress={() => props.navigation.navigate('ProducerHome')}*/}
                    {/*/>*/}
                    <DrawerItem
                        label={t['title']['calendar']}
                        icon={({ focused, color, size }) => <Ionicons name="calendar" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('ProducerScheduler')}
                    />
                    <DrawerItem
                        label={t['profile']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="person" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Profile')}
                    />
                    <DrawerItem
                        label={t['title']['my_farmers']}
                        icon={({ focused, color, size }) => <Ionicons name="man" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Farmers')}
                    />
                    <DrawerItem
                        label={t['title']['my_detail']}
                        icon={({ focused, color, size }) => <Ionicons name="star" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('ProducerDetail', { producerId: auth.user.id })}
                    />
                    <DrawerItem
                        label={t['faq']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="md-layers-outline" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Faq')}
                    />
                    <DrawerItem
                        label={t['usage']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="md-document-text-outline" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Usage')}
                    />
                    <DrawerItem
                        label={t['contact']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="md-help" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Contact')}
                    />
                    <DrawerItem
                        label={t['policy']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="ios-shield-outline" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Policy')}
                    />
                    <View style={styles.divider}/>
                    <DrawerItem
                        label={t['header']['user']['logout']}
                        icon={({ focused, color, size }) => <Ionicons name="md-log-out-outline" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => dispatch(logout())}
                    />
                </View>
            </ScrollView>
        );
    }

    const WorkerDrawerContent = (props) => {
        return (
            <ScrollView {...props}>
                <View>
                    <View paddingV-16 center >
                        <Avatar
                            size={80}
                            source={
                                auth.user.avatar === 'default.png' ?
                                    userIcon :
                                    { uri: serverURL+'avatars/'+auth.user.avatar}
                            }
                            label={'IMG'}
                        />
                        <Text marginT-10 text65 style={{ color: Colors.white }}>{ auth.user.family_name }</Text>
                        <Text text70 style={{ color: Colors.white }}>{ auth.user.email }</Text>
                    </View>
                    {/*<DrawerItem*/}
                    {/*    label={t['title']['home']}*/}
                    {/*    icon={({ focused, color, size }) => <Ionicons name="home" size={20} color={"#fff"} />}*/}
                    {/*    labelStyle={styles.drawerItem}*/}
                    {/*    onPress={() => props.navigation.navigate('WorkerHome')}*/}
                    {/*/>*/}
                    <DrawerItem
                        label={t['title']['calendar']}
                        icon={({ focused, color, size }) => <Ionicons name="calendar" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('WorkerScheduler')}
                    />
                    <DrawerItem
                        label={t['profile']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="person" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Profile')}
                    />
                    <DrawerItem
                        label={t['title']['my_farms']}
                        icon={({ focused, color, size }) => <Ionicons name="man" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Farms')}
                    />
                    <DrawerItem
                        label={t['title']['my_detail']}
                        icon={({ focused, color, size }) => <Ionicons name="star" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('WorkerDetail', { workerId: auth.user.id })}
                    />
                    <DrawerItem
                        label={t['faq']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="md-layers-outline" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Faq')}
                    />
                    <DrawerItem
                        label={t['usage']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="md-document-text-outline" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Usage')}
                    />
                    <DrawerItem
                        label={t['contact']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="md-help" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Contact')}
                    />
                    <DrawerItem
                        label={t['policy']['title']}
                        icon={({ focused, color, size }) => <Ionicons name="ios-shield-outline" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => props.navigation.navigate('Policy')}
                    />
                    <View style={styles.divider}/>
                    <DrawerItem
                        label={t['header']['user']['logout']}
                        icon={({ focused, color, size }) => <Ionicons name="md-log-out-outline" size={20} color={"#fff"} />}
                        labelStyle={styles.drawerItem}
                        onPress={() => dispatch(logout())}
                    />
                </View>
            </ScrollView>
        );
    }

    return (
        <Drawer.Navigator
            screenOptions={{
                drawerStyle: {
                    backgroundColor: Colors.cyan10,
                    width: width * 0.7,
                },
                headerShown: false
            }}
            drawerContent={(props) => auth.user.role === 'producer' ? <ProducerDrawerContent {...props} /> : <WorkerDrawerContent {...props} /> }
        >
            { auth.user.role === 'producer' ? (
                <>
                    <Stack.Screen name={'ProducerHome'} component={ProducerHome} />

                    <Stack.Screen name={'ProducerScheduler'} component={ProducerScheduler} />

                    <Stack.Screen name={'Profile'} component={Profile} />

                    <Stack.Screen name={'Farmers'} component={Farmers} />

                    <Stack.Screen name={'WorkerDetail'} component={WorkerDetail} />
                    <Stack.Screen name={'ProducerDetail'} component={ProducerDetail} />

                    <Stack.Screen name={'Faq'} component={Faq} />
                    <Stack.Screen name={'Usage'} component={Usage} />
                    <Stack.Screen name={'Contact'} component={Contact} />
                    <Stack.Screen name={'Policy'} component={Policy} />
                </>
            ) : (
                <>
                    <Stack.Screen name={'WorkerHome'} component={WorkerHome} />

                    <Stack.Screen name={'WorkerScheduler'} component={WorkerScheduler} />

                    <Stack.Screen name={'Profile'} component={Profile} />

                    <Stack.Screen name={'Farms'} component={Farms} />

                    <Stack.Screen name={'WorkerDetail'} component={WorkerDetail} />
                    <Stack.Screen name={'ProducerDetail'} component={ProducerDetail} />

                    <Stack.Screen name={'Faq'} component={Faq} />
                    <Stack.Screen name={'Usage'} component={Usage} />
                    <Stack.Screen name={'Contact'} component={Contact} />
                    <Stack.Screen name={'Policy'} component={Policy} />
                </>
            ) }
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerItem: {
        fontSize: 16,
        color: '#fff',
    },
    divider: {
        marginHorizontal: 10,
        borderBottomColor: Colors.grey50,
        borderBottomWidth: 1.5,
    }
});

export default AppStack;
