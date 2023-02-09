import React, {useContext} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../translation/translations";
import {useFocusEffect} from "@react-navigation/native";
import {getFarms} from "../redux/User/actions";
import {Avatar, Colors, Text, View} from "react-native-ui-lib";
import {Appbar, List} from "react-native-paper";
import {ScrollView, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {serverURL} from "../constants/config";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const Farms = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {farms, errors} = useSelector(state => state.user);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getFarms());
        }, [])
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['title']['my_farms']} color={Colors.white}/>
            </Appbar.Header>
            {
                !(typeof farms !== 'undefined' && farms.length > 0) && (
                    <View center style={{ height: '90%' }}>
                        <SimpleLineIcons name={'user'} size={100} color={Colors.grey30}/>
                        <Text center margin-s1 text70> {t['farms']['no_farm']} </Text>
                    </View>
                )
            }
            <ScrollView>
                {
                    farms.map((farm, index) => (
                        <List.Item
                            key={index}
                            title={farm.family_name}
                            description={farm.name}
                            onPress={() => navigation.navigate('ProducerDetail', { producerId: farm.id, show_profile: true })}
                            left={props => <Avatar
                                size={50}
                                source={{
                                    uri: serverURL+'avatars/'+farm.avatar// + '?' + new Date(),
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

export default Farms;
