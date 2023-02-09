import React, {useContext, useState} from 'react';
import {Card, Colors, Text, View} from "react-native-ui-lib";
import {Alert, Dimensions, Image, ScrollView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../translation/translations";
import {useFocusEffect} from "@react-navigation/native";
import {getRecruitments, setRecruitment, getApplicants, enterChatting} from "../../redux/Chat/actions";
import {format_address, serverURL} from "../../constants/config";
import {Appbar} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Loader from "../../components/Loader";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {formatDate, formatDay, formatTime} from "../../utils/core_func";
import Ionicons from "react-native-vector-icons/Ionicons";
import {removeFavourite, setFavourite} from "../../redux/Matter/actions";

const emptyImage = require('../../assets/images/empty.jpg');
const { width, height } = Dimensions.get('window');

const ChatRecruitments = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {recruitments, loading} = useSelector(state => state.chat);
    const {user} = useSelector(state => state.auth);
    const [ onLoadImage, setLoadImage ] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getRecruitments());
        }, [])
    );

    const handleRecruitmentClick = (recruitmentId) => {
        const recruitment = recruitments.find(recruitment => recruitment.id == recruitmentId);
        dispatch(setRecruitment(recruitment));

        if(user.role === 'producer') {
            dispatch(getApplicants(recruitmentId, () => {
                navigation.navigate('ProducerHome', { screen: 'Chat', params: { screen: 'ChatApplicants' } });
            }))
        }
        else {
            dispatch(enterChatting(recruitment['producer_id'], recruitmentId, () => {
                navigation.navigate('WorkerHome', { screen: 'Chat', params: { screen: 'Chatting' } })
            }));
        }
    }

    return (
        <View style={styles.container}>
            <Loader isLoading={loading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.navigate('ChatMain')} color={Colors.white} />
                <Appbar.Content title={t['header']['chatting']['favourites']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView>
                {
                    recruitments.length === 0 && (
                        <View style={{ marginTop: height / 3 }}>
                            <View center marginT-s5>
                                <FontAwesome5 name={'box-open'} size={50} color={Colors.grey30} />
                            </View>
                            <Text center margin-s2 text70> {t['title']['no_data']} </Text>
                        </View>
                    )
                }
                {
                    recruitments.map((recruitment, index) => (
                        <Card
                            key={index}
                            borderRadius={10}
                            padding-s2
                            margin-s2
                            onPress={() => handleRecruitmentClick(recruitment['id'])}
                            containerStyle={{ backgroundColor: Colors.cyan80 }}
                        >
                            <View row flex centerV>
                                <View flex-2 marginR-s2>
                                    <Image
                                        source={onLoadImage[recruitment.id] && recruitment.image !== '' ? {uri: serverURL + 'uploads/recruitments/sm_' + recruitment.image} : emptyImage}
                                        style={{width: width / 3, height: width / 4, borderRadius: 5}}
                                        onLoad={() => setLoadImage({...onLoadImage, [recruitment.id]: true })}
                                    />
                                    {/*<View center style={{ marginTop: -25 }}>*/}
                                    {/*    <Badge backgroundColor={applicationStatusColor[recruitment.status]} label={t['applicants']['status'][recruitment.status]}/>*/}
                                    {/*</View>*/}
                                </View>
                                <View flex-3>
                                    <View row centerV marginB-s1>
                                        <Text color={Colors.black} numberOfLines={1} style={{ width: width * 0.5 }}>
                                            {recruitment.title}
                                        </Text>
                                    </View>
                                    <View marginB-s1>
                                        <Text text90>
                                            {format_address(recruitment.post_number, recruitment.prefectures, recruitment.city, recruitment.workplace)}
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'calendar-text'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {formatDate(recruitment.work_date_start, 'symbol')}
                                            ({formatDay(recruitment.work_date_start, 'short')})
                                            {
                                                recruitment.work_date_end !== recruitment.work_date_start && (
                                                    <Text text90 >
                                                        &nbsp;~&nbsp; {formatDate(recruitment.work_date_end, 'symbol')}
                                                        ({formatDay(recruitment.work_date_end, 'short')})
                                                    </Text>
                                                )
                                            }
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'clock-outline'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {formatTime(recruitment.work_time_start, 'symbol')}
                                            &nbsp;~&nbsp;
                                            {formatTime(recruitment.work_time_end, 'symbol')}
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'account-group'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {recruitment.worker_amount}名
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'bank'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {recruitment.reward_type}({recruitment.reward_cost} 円 )・{t['recruitment']['pay_mode'][recruitment.pay_mode]}
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'train-car'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {t['recruitment']['traffic'][recruitment.traffic_type]}
                                            {recruitment.traffic_type === 'beside' ? '('+recruitment.traffic_cost+' 円)' : ''}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
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

export default ChatRecruitments;
