import React, {useContext, useState} from 'react';
import {Card} from "react-native-paper";
import {Colors, Text, View} from "react-native-ui-lib";
import {format_address, serverURL} from "../constants/config";
import {Dimensions, Image} from "react-native";
import {LocalizationContext} from "../translation/translations";
import {setRecruitment} from "../redux/Recruitment/actions";
import {useDispatch} from "react-redux";
import {formatDate, formatTime} from "../utils/core_func";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";

const emptyImage = require('../assets/images/empty.jpg')
const { width, height } = Dimensions.get('window');

const DraftItem = ({recruitment, navigation}) => {
    const { t } = useContext(LocalizationContext);
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);

    const handlePreviewClick = () => {
        dispatch(setRecruitment(recruitment.id));
        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentPreview' } });
    }

    return (
        <View
            marginV-s2
        >
            <Card
                style={{ backgroundColor: Colors.cyan80, borderRadius: 10, padding: 10 }}
                onPress={handlePreviewClick}
            >
                <View row flex centerV>
                    <View flex-2 marginR-s2>
                        <Image
                            source={load && recruitment.image !== '' ? {uri: serverURL + 'uploads/recruitments/sm_' + recruitment.image} : emptyImage}
                            style={{width: width / 3, height: width / 4, borderRadius: 5}}
                            onLoad={() => setLoad(true)}
                        />
                    </View>
                    <View flex-3>
                        <View row centerV marginB-s1>
                            <Text color={Colors.black}>
                                {recruitment.title}
                            </Text>
                            <Text text90 color={Colors.blue30}>
                                ({recruitment.producer.family_name})
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
                                {formatDate(recruitment.work_date_start, 'text')}
                                {
                                    recruitment.work_date_end !== recruitment.work_date_start && (
                                        <Text text90 >
                                            &nbsp;~&nbsp; {formatDate(recruitment.work_date_end, 'text')}
                                        </Text>
                                    )
                                }
                            </Text>
                        </View>
                        <View row centerV>
                            <MaterialCommunityIcons name={'clock-outline'} size={20} color={Colors.cyan30} />
                            <Text marginL-s2 text90>
                                {formatTime(recruitment.work_time_start, 'text')}
                                &nbsp;~&nbsp;
                                {formatTime(recruitment.work_time_end, 'text')}
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
        </View>
    );
};

export default DraftItem;
