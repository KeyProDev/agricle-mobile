import React, {useContext, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../translation/translations";
import {useFocusEffect} from "@react-navigation/native";
import {getProducerInfo} from "../redux/User/actions";
import {Avatar, Card, Colors, Text, View} from "react-native-ui-lib";
import {Appbar, Button, List} from "react-native-paper";
import {Image, ImageBackground, ScrollView, StyleSheet} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {Rating} from "react-native-rating-element";

import {format_address, serverURL} from '../constants/config';
import {enterChatting} from "../redux/Chat/actions";

const userIcon = require('../assets/images/user.png');
const emptyImage = require('../assets/images/empty.jpg');

const ProducerDetail = ({route, navigation}) => {
    const { producerId, show_profile } = route.params;
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {user} = useSelector(state => state.auth);
    const { producer } = useSelector(state => state.user);
    const [ onLoadImage, setLoadImage ] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getProducerInfo(producerId));
        }, [])
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={user.role === 'producer' ? t['title']['my_detail'] : t['title']['producer_info']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView>
                <View paddingV-10 backgroundColor={Colors.cyan30}>
                    <View center>
                        <Avatar
                            size={80}
                            source={{uri: serverURL+'avatars/'+producer.avatar}}
                            label={'IMG'}
                        />
                    </View>
                    <View center>
                        <Rating
                            rated={producer.review}
                            totalCount={5}
                            ratingColor="#f1c644"
                            ratingBackgroundColor="#d4d4d4"
                            size={25}
                            icon="ios-star"
                            direction="row"
                        />
                    </View>
                    <Text text60 center color={Colors.white} marginT-s2>
                        { producer.family_name }
                    </Text>
                    {
                        user.role === 'worker' && (
                            <View row center margin-s2>
                                <Button icon={'chat'} mode={'contained'} onPress={() => dispatch(enterChatting(producer['id'], 0, () => {
                                    navigation.navigate('WorkerHome', { screen: 'Chat', params: { screen: 'Chatting' } });
                                }))} style={{ backgroundColor: Colors.purple10, color: Colors.white, marginRight: 5 }}>
                                    {t['action']['chatting']}
                                </Button>
                            </View>
                        )
                    }
                </View>

                {
                    show_profile && (
                        <View marginH-s2>
                            <View row margin-5>
                                <Text text80 color={Colors.cyan10}>
                                    {t['profile']['name']} :
                                </Text>
                                <Text text80 color={Colors.grey20} marginL-10>
                                    { producer.name }
                                </Text>
                            </View>
                            <View row margin-5>
                                <Text text80 color={Colors.cyan10}>
                                    {t['profile']['address']} :
                                </Text>
                                <Text text80 color={Colors.grey20} marginL-10>
                                    { format_address(producer.post_number, producer.prefectures, producer.city, producer.address) }
                                </Text>
                            </View>
                            <View row margin-5>
                                {/*<View flex row>*/}
                                {/*    <Text text80 color={Colors.cyan10}>*/}
                                {/*        {t['profile']['contact_address']} :*/}
                                {/*    </Text>*/}
                                {/*    <Text text80 color={Colors.grey20} marginL-10>*/}
                                {/*        { producer.contact_address }*/}
                                {/*    </Text>*/}
                                {/*</View>*/}
                                <View flex row>
                                    <Text text80 color={Colors.cyan10}>
                                        {t['profile']['management_mode']['title']} :
                                    </Text>
                                    <Text text80 color={Colors.grey20} marginL-10>
                                        { t['profile']['management_mode'][producer.management_mode] }
                                    </Text>
                                </View>
                            </View>
                            {/*<View row margin-5>*/}
                            {/*    <Text text80 color={Colors.cyan10}>*/}
                            {/*        {t['profile']['agency_name']} :*/}
                            {/*    </Text>*/}
                            {/*    <Text text80 color={Colors.grey20} marginL-10>*/}
                            {/*        { producer.agency_name }*/}
                            {/*    </Text>*/}
                            {/*</View>*/}
                            {/*<View row margin-5>*/}
                            {/*    <Text text80 color={Colors.cyan10}>*/}
                            {/*        {t['profile']['agency_phone']} :*/}
                            {/*    </Text>*/}
                            {/*    <Text text80 color={Colors.grey20} marginL-10>*/}
                            {/*        { producer.agency_phone }*/}
                            {/*    </Text>*/}
                            {/*</View>*/}
                            <View margin-5>
                                <Text text80 color={Colors.cyan10}>
                                    {t['profile']['appeal_point']} :
                                </Text>
                                <Text text80 color={Colors.grey20}>
                                    { producer.appeal_point }
                                </Text>
                            </View>
                        </View>
                    )
                }

                {
                    !(typeof producer.recruitments !== 'undefined' && producer.recruitments.length > 0) && (
                        <View center marginT-s5>
                            <SimpleLineIcons name={'social-dropbox'} size={70} color={Colors.grey30}/>
                            <Text center margin-s1 text70> {t['title']['no_data']} </Text>
                        </View>
                    )
                }
                <List.Section title={t['profile']['matching_history']}>
                    {
                        typeof producer.recruitments !== 'undefined' && producer.recruitments.length > 0 && producer.recruitments.map((recruitment, index) => (
                            <List.Accordion
                                key={index}
                                title={recruitment.title}
                                description={
                                    <Rating
                                        rated={recruitment.review}
                                        totalCount={5}
                                        ratingColor="#f1c644"
                                        ratingBackgroundColor="#d4d4d4"
                                        size={18}
                                        icon="ios-star"
                                        direction="row"
                                    />
                                }
                                left={props => <Avatar
                                    size={50}
                                    source={{
                                        uri: serverURL + 'uploads/recruitments/sm_' + recruitment.image
                                    }}
                                    label={'IMG'}
                                />}
                                style={{ backgroundColor: Colors.white }}
                            >
                                {
                                    recruitment.applicants.map((applicant, index1) => (
                                        <List.Item
                                            key={index1}
                                            title={applicant.nickname}
                                            description={applicant.recruitment_evaluation}
                                            left={props => <Avatar
                                                size={50}
                                                source={
                                                    applicant.avatar === 'default.png' ? userIcon : {
                                                        uri: serverURL + 'avatars/' + applicant.avatar
                                                    }
                                                }
                                                label={'IMG'}
                                            />}
                                            right={props => <View center><Rating
                                                rated={applicant.recruitment_review}
                                                totalCount={5}
                                                ratingColor="#f1c644"
                                                ratingBackgroundColor="#d4d4d4"
                                                size={12}
                                                icon="ios-star"
                                                direction="row"
                                            /></View>}
                                            style={{ paddingLeft: 20 }}
                                        />
                                    ))
                                }
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
    divider: {
        margin: 10,
        borderBottomColor: Colors.grey70,
        borderBottomWidth: 2,
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

export default ProducerDetail;
