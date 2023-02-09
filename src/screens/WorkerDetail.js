import React, {useContext, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../translation/translations";
import {useFocusEffect} from "@react-navigation/native";
import {getWorkerInfo} from "../redux/User/actions";
import {Avatar, Card, Colors, Text, View} from "react-native-ui-lib";
import {Appbar, Button, List} from "react-native-paper";
import {Image, ScrollView, StyleSheet} from 'react-native';

import {pref_city, serverURL} from '../constants/config';
import {getRecruitments} from "../redux/User/actions";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {Rating} from "react-native-rating-element";
import { getAge } from '../utils/core_func';
import Ionicons from "react-native-vector-icons/Ionicons";
import {enterChatting} from "../redux/Chat/actions";

const emptyImage = require('../assets/images/empty.jpg');
const userIcon = require('../assets/images/user.png');

const WorkerDetail = ({route, navigation}) => {
    const { workerId, show_profile } = route.params;
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {worker} = useSelector(state => state.user);
    const {user} = useSelector(state => state.auth);
    const [ onLoadImage, setLoadImage ] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getWorkerInfo(workerId));
        }, [])
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={user.role === 'worker' ? t['title']['my_detail'] : t['title']['worker_info']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView>
                <View paddingV-10 backgroundColor={Colors.cyan30}>
                    <View center>
                        <Avatar
                            size={100}
                            source={{
                                uri: serverURL+'avatars/'+worker.avatar// + '?' + new Date(),
                            }}
                            label={'IMG'}
                        />
                    </View>
                    <Text text60 center color={Colors.white} marginT-s2>
                        { worker.family_name }
                    </Text>
                    <View center>
                        <Rating
                            rated={worker.review}
                            totalCount={5}
                            ratingColor="#f1c644"
                            ratingBackgroundColor="#d4d4d4"
                            size={25}
                            icon="ios-star"
                            direction="row"
                        />
                    </View>
                    {
                        user.role === 'producer' && (
                            <View row center margin-s2>
                                <Button icon={'chat'} mode={'contained'} onPress={() => dispatch(enterChatting(worker['id'], 0, () => {
                                    navigation.navigate('ProducerHome', { screen: 'Chat', params: { screen: 'Chatting' } });
                                }))} style={{ backgroundColor: Colors.purple10, color: Colors.white, marginRight: 5 }}>
                                    {t['action']['chatting']}
                                </Button>
                            </View>
                        )
                    }
                </View>
                {
                    show_profile && (
                        <View>
                            <View row margin-10>
                                <View flex row>
                                    <Text text80 color={Colors.cyan10}>
                                        {t['profile']['name']} :
                                    </Text>
                                    <Text text80 color={Colors.grey20} marginL-10>
                                        { worker.name }
                                    </Text>
                                </View>
                                <View flex row>
                                    <Text text80 color={Colors.cyan10}>
                                        {t['profile']['gender']['title']} :
                                    </Text>
                                    <Text text80 color={Colors.grey20} marginL-10>
                                        { t['profile']['gender'][worker.gender] }
                                    </Text>
                                </View>
                            </View>
                            <View row margin-10>
                                <View flex row>
                                    <Text text80 color={Colors.cyan10}>
                                        {t['profile']['nickname']} :
                                    </Text>
                                    <Text text80 color={Colors.grey20} marginL-10>
                                        { worker.nickname }
                                    </Text>
                                </View>
                                <View flex row>
                                    <Text text80 color={Colors.cyan10}>
                                        {t['profile']['age']} :
                                    </Text>
                                    <Text text80 color={Colors.grey20} marginL-10>
                                        { getAge(worker.birthday) }歳
                                    </Text>
                                </View>
                            </View>
                            {/*<View row margin-10>*/}
                            {/*    <Text text80 color={Colors.cyan10}>*/}
                            {/*        {t['profile']['address']} :*/}
                            {/*    </Text>*/}
                            {/*    <Text text80 color={Colors.grey20} marginL-10>*/}
                            {/*        { (pref_city.find(item => item.id == worker.prefectures) ? pref_city.find(item => item.id == worker.prefectures).pref : '')+' '+worker.city+' '+worker.address }*/}
                            {/*    </Text>*/}
                            {/*</View>*/}
                            <View row margin-10>
                                {/*<View flex row>*/}
                                {/*    <Text text80 color={Colors.cyan10}>*/}
                                {/*        {t['profile']['cell_phone']} :*/}
                                {/*    </Text>*/}
                                {/*    <Text text80 color={Colors.grey20} marginL-10>*/}
                                {/*        { worker.cell_phone }*/}
                                {/*    </Text>*/}
                                {/*</View>*/}
                                <View flex row>
                                    <Text text80 color={Colors.cyan10}>
                                        {t['profile']['job']} :
                                    </Text>
                                    <Text text80 color={Colors.grey20} marginL-10>
                                        { worker.job }
                                    </Text>
                                </View>
                            </View>
                            {/*<View row margin-10>*/}
                            {/*    <View flex row>*/}
                            {/*        <MaterialCommunityIcons name={'cellphone-wireless'} size={20} color={Colors.cyan30} />*/}
                            {/*        <Text text80 color={Colors.grey20} marginL-10>*/}
                            {/*            { worker.emergency_phone }*/}
                            {/*        </Text>*/}
                            {/*    </View>*/}
                            {/*    <View flex row>*/}
                            {/*        <FontAwesome name={'address-book-o'} size={20} color={Colors.cyan30} />*/}
                            {/*        <Text text80 color={Colors.grey20} marginL-10>*/}
                            {/*            { worker.emergency_relation }*/}
                            {/*        </Text>*/}
                            {/*    </View>*/}
                            {/*</View>*/}
                            {/*<View row margin-10>*/}
                            {/*    <MaterialCommunityIcons name={'bio'} size={20} color={Colors.cyan30} />*/}
                            {/*    <Text text80 color={Colors.grey20} marginL-10>*/}
                            {/*        { worker.bio }*/}
                            {/*    </Text>*/}
                            {/*</View>*/}
                            {/*<View row margin-10>*/}
                            {/*    <MaterialCommunityIcons name={'playlist-star'} size={20} color={Colors.cyan30} />*/}
                            {/*    <Text text80 color={Colors.grey20} marginL-10>*/}
                            {/*        { worker.appeal_point }*/}
                            {/*    </Text>*/}
                            {/*</View>*/}
                        </View>
                    )
                }

                {
                    !(typeof worker.recruitments !== 'undefined' && worker.recruitments.length > 0) && (
                        <View center marginT-s5>
                            <SimpleLineIcons name={'social-dropbox'} size={70} color={Colors.grey30}/>
                            <Text center margin-s1 text70> {t['title']['no_data']} </Text>
                        </View>
                    )
                }
                <List.Section title={t['profile']['matching_history']}>
                    {
                        typeof worker.recruitments !== 'undefined' && worker.recruitments.length > 0 && worker.recruitments.map((recruitment, index) => (
                            <List.Accordion
                                key={index}
                                title={(
                                    <View row>
                                        <Text>{ recruitment.title }</Text>
                                        <View row center>
                                            <Ionicons name={'star'} color={Colors.yellow20} size={20} />
                                            <Text>
                                                {
                                                    recruitment.recruitment_review > 0 ? recruitment.recruitment_review : 0
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                description={
                                    <Text>{recruitment.worker_evaluation?recruitment.worker_evaluation:t['applications']['no_worker_evaluation']}</Text>
                                }
                                left={props => <Avatar
                                    size={50}
                                    source={
                                        recruitment.image === 'default.png' ? emptyImage : {
                                            uri: serverURL + 'uploads/recruitments/sm_' + recruitment.image
                                        }
                                    }
                                    label={'IMG'}
                                />}
                                style={{ backgroundColor: Colors.white }}
                            >
                                <View>
                                    <View row centerV>
                                        <Avatar
                                            size={50}
                                            source={{
                                                uri: serverURL+'avatars/'+recruitment.producer.avatar// + '?' + new Date(),
                                            }}
                                            label={'IMG'}
                                        />
                                    </View>
                                    <View row>
                                        <Text text80 color={Colors.cyan10}>
                                            {t['profile']['producer_name']} :
                                        </Text>
                                        <Text text80 color={Colors.grey20} marginL-10>
                                            { recruitment.producer.family_name }
                                        </Text>
                                    </View>
                                    <View row>
                                        <Text text80 color={Colors.cyan10}>
                                            {t['profile']['producer_name_read']} :
                                        </Text>
                                        <Text text80 color={Colors.grey20} marginL-10>
                                            { recruitment.producer.name }
                                        </Text>
                                    </View>
                                    <View row>
                                        <Text text80 color={Colors.cyan10}>
                                            {t['profile']['management_mode']['title']} :
                                        </Text>
                                        <Text text80 color={Colors.grey20} marginL-10>
                                            { t['profile']['management_mode'][recruitment.producer.management_mode] }
                                        </Text>
                                    </View>
                                    <View row>
                                        <Text text80 color={Colors.cyan10}>
                                            {t['profile']['product_name']} :
                                        </Text>
                                        <Text text80 color={Colors.grey20} marginL-10>
                                            { recruitment.producer.product_name }
                                        </Text>
                                    </View>
                                    <View row marginT-s1>
                                        <Button mode={'contained'} onPress={() => navigation.navigate('ProducerDetail', { producerId: recruitment.producer.id, show_profile: true })}>
                                            {t['action']['detail']}
                                        </Button>
                                    </View>
                                </View>
                            </List.Accordion>
                        ))
                    }
                </List.Section>
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
    listHeader: {
        borderLeftColor: Colors.cyan30,
        borderLeftWidth: 3,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        fontSize: 20,
        color: Colors.cyan10,
    },
});

export default WorkerDetail;
