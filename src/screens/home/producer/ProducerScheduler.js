import React, {useContext, useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet} from 'react-native';
import {DayComponentType, SingleDateSelectionCalendar} from "react-native-easy-calendar";
import {Text, View, Colors, Card, Badge} from "react-native-ui-lib";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import dayjs from "dayjs";
import japanLocale from "dayjs/locale/ja";
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../../translation/translations";
import {recruitmentStatusColor} from "../../../constants/config";
import {getAll} from '../../../redux/Recruitment/actions';
import Loader from '../../../components/Loader';
import {Appbar} from "react-native-paper";
import {useFocusEffect} from "@react-navigation/native";
import DraftItem from "../../../components/DraftItem";
import CollectingItem from "../../../components/CollectingItem";
import WorkingItem from "../../../components/WorkingItem";
import CompleteItem from "../../../components/CompleteItem";

const { width, height } = Dimensions.get('screen');

const ScheduleList = ({navigation, recruitments, selectedDate}) => {
    const { t } = useContext(LocalizationContext);

    const todayEvents = recruitments.filter(event => event.status !== 'deleted' && new Date(event['work_date_start']).getTime() <= new Date(selectedDate).getTime() && new Date(event['work_date_end']).getTime() >= new Date(selectedDate).getTime());
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
        <View padding-s2>
            <Text style={styles.listHeader}>{t['title']['recruitment_list']}({dayjs(selectedDate).format('YYYY年MM月DD日')})</Text>
            {
                todayEvents.map((event, index) => {
                    if(event.status === 'draft') return <DraftItem key={index} recruitment={event} navigation={navigation} />
                    else if(event.status === 'collecting') return <CollectingItem key={index} recruitment={event} navigation={navigation} />
                    else if(event.status === 'working') return <WorkingItem key={index} recruitment={event} navigation={navigation} />
                    else return <CompleteItem key={index} recruitment={event} navigation={navigation} />
                })
            }
        </View>
    )
}

const ProducerScheduler = ({ navigation }) => {
    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getAll());
        }, [])
    );

    const { t } = useContext(LocalizationContext);
    const { recruitments, loading } = useSelector(state => state.recruitment);

    const [ selectedDate, setSelectedDate ] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

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
                        recruitments.map((event, index)=> {
                            let color = recruitmentStatusColor[event.status];
                            if(
                                event.status !== 'deleted' &&
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
                <Badge marginH-s1 backgroundColor={recruitmentStatusColor.draft} label={t['recruitment']['status']['draft']}/>
                <Badge marginH-s1 backgroundColor={recruitmentStatusColor.collecting} label={t['recruitment']['status']['collecting']}/>
                <Badge marginH-s1 backgroundColor={recruitmentStatusColor.deleted} label={t['recruitment']['status']['deleted']}/>
                <Badge marginH-s1 backgroundColor={recruitmentStatusColor.working} label={t['recruitment']['status']['working']}/>
                <Badge marginH-s1 backgroundColor={recruitmentStatusColor.completed} label={t['recruitment']['status']['completed']}/>
                <Badge marginH-s1 backgroundColor={recruitmentStatusColor.canceled} label={t['recruitment']['status']['canceled']}/>
            </View>
            <ScrollView>
                <SingleDateSelectionCalendar
                    onSelectDate={setSelectedDate}
                    selectedDate={selectedDate}
                    DayComponent={CustomDay}
                    locale={japanLocale}
                />
                <ScheduleList recruitments={recruitments} selectedDate={selectedDate} navigation={navigation} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: height
    },
    listHeader: {
        textAlign: 'center',
        fontSize: 20,
        color: Colors.cyan10,
        marginTop: -20
    },
});

export default ProducerScheduler;
