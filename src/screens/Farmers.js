import React, {useContext} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../translation/translations";
import {useFocusEffect} from "@react-navigation/native";
import {getFarmers} from "../redux/User/actions";
import {Avatar, Colors, Text, View} from "react-native-ui-lib";
import {Appbar, List} from "react-native-paper";
import {ScrollView, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {serverURL} from "../constants/config";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Loader from '../components/Loader';

const Farmers = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const state = useSelector(state => state);
    const {farmers, errors, loading} = useSelector(state => state.user);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getFarmers());
        }, [])
    );

    return (
        <View style={styles.container}>
            <Loader isLoading={loading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['title']['my_farmers']} color={Colors.white}/>
            </Appbar.Header>
            {
                !(typeof farmers !== 'undefined' && farmers.length > 0) && (
                    <View center style={{ height: '90%' }}>
                        <SimpleLineIcons name={'user'} size={100} color={Colors.grey30}/>
                        <Text center margin-s1 text70> {t['farmers']['no_farmer']} </Text>
                    </View>
                )
            }
            <ScrollView>
                {
                    farmers.map((farmer, index) => (
                        <List.Item
                            key={index}
                            onPress={() => navigation.navigate('WorkerDetail', { workerId: farmer.id, show_profile: true })}
                            title={farmer.family_name}
                            description={farmer.nickname}
                            left={props => <Avatar
                                size={50}
                                source={{
                                    uri: serverURL+'avatars/'+farmer.avatar// + '?' + new Date(),
                                }}
                                label={'IMG'}
                                style={{width: 400, height: 400}}
                            />}
                            right={props => (
                                <View row center>
                                    <Ionicons name={'star'} color={Colors.yellow20} size={20} />
                                </View>
                            )}
                        />
                    ))
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
});

export default Farmers;
