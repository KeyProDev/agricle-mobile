import React, {useContext, useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet} from 'react-native';
import {DayComponentType, SingleDateSelectionCalendar} from "react-native-easy-calendar";
import {Text, View, Colors, Card, Badge} from 'react-native-ui-lib';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import dayjs from "dayjs";
import japanLocale from "dayjs/locale/ja";
import {useDispatch, useSelector} from 'react-redux';
import {LocalizationContext} from "../../../translation/translations";
import {applicationStatusColor, format_address, serverURL} from '../../../constants/config';
import Loader from '../../../components/Loader';
import {Appbar} from "react-native-paper";
import {useFocusEffect} from "@react-navigation/native";
import {getAll, setApplication} from "../../../redux/Application/actions";
import Ionicons from "react-native-vector-icons/Ionicons";
import {setFavourite} from "../../../redux/Matter/actions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {formatDate, formatDay, formatTime} from "../../../utils/core_func";

const emptyImage = require('../../../assets/images/empty.jpg');
const { width, height } = Dimensions.get('screen');

const ScheduleList = ({applications, selectedDate, navigation}) => {
    const dispatch = useDispatch();
    const [ onLoadImage, setLoadImage ] = useState({});
    const { t } = useContext(LocalizationContext);

    const todayEvents = applications.filter(event => new Date(event['work_date_start']).getTime() <= new Date(selectedDate).getTime() && new Date(event['work_date_end']).getTime() >= new Date(selectedDate).getTime());
    if(todayEvents.length === 0) return (
        <View>
            <Text style={styles.listHeader}>{t['title']['recruitment_list']}({dayjs(selectedDate).format('YYYY年MM月DD日')})</Text>
            <View center marginT-s5>
                <FontAwesome5 name={'box-open'} size={50} color={Colors.grey30} />
            </View>
            <Text center margin-s2 text70> {t['title']['no_data']} </Text>
        </View>
    )

    return (
        <View>
            <Text style={styles.listHeader}>{t['title']['recruitment_list']}({dayjs(selectedDate).format('YYYY年MM月DD日')})</Text>
            {
                todayEvents.map((event, index) => (
                    <View key={index}>
                        <Card
                            borderRadius={10}
                            padding-s2
                            margin-s2
                            onPress={() => dispatch(setApplication(event.applicant_id, () => navigation.navigate('WorkerHome', { screen: 'Applications', params: { screen: 'ApplicationDetail' } })))}
                            containerStyle={{ backgroundColor: Colors.cyan80 }}
                        >
                            <View row flex centerV>
                                <View flex-2 marginR-s2>
                                    <Image
                                        source={onLoadImage[event.id] && event.image !== '' ? {uri: serverURL + 'uploads/recruitments/sm_' + event.image} : emptyImage}
                                        style={{width: width / 3, height: width / 4, borderRadius: 5}}
                                        onLoad={() => setLoadImage({...onLoadImage, [event.id]: true })}
                                    />
                                    {/*<View center style={{ marginTop: -25 }}>*/}
                                    {/*    <Badge backgroundColor={applicationStatusColor[event.status]} label={t['applicants']['status'][event.status]}/>*/}
                                    {/*</View>*/}
                                </View>
                                <View flex-3>
                                    <View row centerV marginB-s1>
                                        <Text color={Colors.black} numberOfLines={1} style={{ width: width * 0.4 }}>
                                            {event.title}
                                        </Text>
                                        <Text text90 color={Colors.blue30}>
                                            ({event.family_name})
                                        </Text>
                                    </View>
                                    <View marginB-s1>
                                        <Text text90>
                                            {format_address(event.post_number, event.prefectures, event.city, event.workplace)}
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'calendar-text'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {formatDate(event.work_date_start, 'symbol')}
                                            ({formatDay(event.work_date_start, 'short')})
                                            {
                                                event.work_date_end !== event.work_date_start && (
                                                    <Text text90 >
                                                        &nbsp;~&nbsp; {formatDate(event.work_date_end, 'symbol')}
                                                        ({formatDay(event.work_date_end, 'short')})
                                                    </Text>
                                                )
                                            }
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'clock-outline'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {formatTime(event.work_time_start, 'symbol')}
                                            &nbsp;~&nbsp;
                                            {formatTime(event.work_time_end, 'symbol')}
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'account-group'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {event.worker_amount}名
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'bank'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {event.reward_type}({event.reward_cost} 円 )・{t['recruitment']['pay_mode'][event.pay_mode]}
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'train-car'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {t['recruitment']['traffic'][event.traffic_type]}
                                            {event.traffic_type === 'beside' ? '('+event.traffic_cost+' 円)' : ''}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Ionicons
                                name={event.is_favourite ? 'star' : 'star-outline'}
                                size={24}
                                color={Colors.cyan30}
                                style={{ position: 'absolute', bottom: 10, right: 10 }}
                                onPress={() => dispatch(setFavourite(event.recruitment_id))}
                            />
                        </Card>
                    </View>
                ))
            }
        </View>
    )
}

const WorkerScheduler = ({ navigation }) => {
    const dispatch = useDispatch();
    useFocusEffect(
        React.useCallback(() => {
            dispatch(getAll());
        }, [])
    );

    const { t } = useContext(LocalizationContext);
    const { applications, loading } = useSelector(state => state.application);

    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

    const CustomDay: DayComponentType = React.memo(({ date, onPress, isDisabled, isSelected }) => {
        const _onPress = React.useCallback(() => {
            onPress(date);
        }, [date, onPress]);
        const isToday = new Date(date).toDateString() === new Date().toDateString();
        isSelected = isSelected || new Date(date).toDateString() === new Date(selectedDate).toDateString()

        return (
            <View>
                <View style={{ width: width / 7, paddingVertical: 5, paddingHorizontal: 10 }}>
                    <Text
                        onPress={_onPress} center text70
                        color={ isSelected ? Colors.white : isToday ? Colors.red30 : Colors.black }
                        style={{ backgroundColor: isSelected ? Colors.cyan10 : Colors.white, borderRadius: 5 }}
                    >
                        {dayjs(date).date()}
                    </Text>
                </View>
                <View row center>
                    {
                        applications.map((event, index)=> {
                            let color = applicationStatusColor[event.status];
                            if(
                                new Date(event['work_date_start']).getTime() <= new Date(date).getTime() &&
                                new Date(event['work_date_end']).getTime() >= new Date(date).getTime()
                            )
                                return <View key={index} style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: color, marginHorizontal: 1 }}/>
                        })
                    }
                </View>
            </View>
        );
    });

    return (
        <View style={styles.container}>
            <Loader isLoading={loading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['title']['calendar']} color={Colors.white}/>
            </Appbar.Header>
            <View row centerH marginV-s2>
                <Badge marginH-s1 backgroundColor={applicationStatusColor.waiting} label={t['applicants']['status']['waiting']}/>
                <Badge marginH-s1 backgroundColor={applicationStatusColor.approved} label={t['applicants']['status']['approved']}/>
                <Badge marginH-s1 backgroundColor={applicationStatusColor.rejected} label={t['applicants']['status']['rejected']}/>
                <Badge marginH-s1 backgroundColor={applicationStatusColor.abandoned} label={t['applicants']['status']['abandoned']}/>
                <Badge marginH-s1 backgroundColor={applicationStatusColor.finished} label={t['applicants']['status']['finished']}/>
            </View>
            <ScrollView>
                <SingleDateSelectionCalendar
                    onSelectDate={setSelectedDate}
                    selectedDate={selectedDate}
                    DayComponent={CustomDay}
                    locale={japanLocale}
                />
                <ScheduleList applications={applications} selectedDate={selectedDate} navigation={navigation}/>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: height-50
    },
    listHeader: {
        textAlign: 'center',
        fontSize: 20,
        color: Colors.cyan10,
    },
});

export default WorkerScheduler;
