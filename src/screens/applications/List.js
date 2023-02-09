import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../translation/translations";
import InfiniteScroll from 'react-native-infinite-scroll';
import PTRView from 'react-native-pull-to-refresh';
import {useFocusEffect} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {getApplications, setApplication} from "../../redux/Application/actions";
import {Colors, Text, View, Card, TabController, Badge} from 'react-native-ui-lib';
import {Alert, Dimensions, Image, StyleSheet} from 'react-native';
import {applicationStatusColor, format_address, recruitmentStatusColor, serverURL} from '../../constants/config';
import {setFavourite} from '../../redux/Matter/actions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {formatDate, formatTime, formatDay} from "../../utils/core_func";
import {Appbar} from "react-native-paper";
import {errors, setRecruitment} from "../../redux/Recruitment/actions";
import Loader from "../../components/Loader";

const emptyImage = require('../../assets/images/empty.jpg');
const { width, height } = Dimensions.get('window');
const applicationType = [
    'waiting',
    'approved',
    'rejected',
    'abandoned',
    'finished',
    'canceled',
    'deleted',
]

const List = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {applications, errors, loading} = useSelector(state => state.application);
    const [ onLoadImage, setLoadImage ] = useState({});
    const [ currentIndex, setCurrentIndex ] = useState(0);

    useEffect(() => {
        dispatch(getApplications(0, 10, applicationType[currentIndex]));
    }, [])

    const loadMorePage = () => {
        dispatch(getApplications(applications.length, 10, applicationType[currentIndex]));
    };

    const handleFavouriteClick = (matterId, is_favourite) => {
        return Alert.alert(
            t['alert']['confirm'],
            is_favourite ? t['alert']['are_you_sure_to_unset_favourite_matter'] : t['alert']['are_you_sure_to_set_favourite_matter'],
            [
                {
                    text: t['action']['yes'],
                    onPress: () => {
                        dispatch(setFavourite(matterId));
                        dispatch(getApplications(0, 10, applicationType[currentIndex]));
                    },
                },
                {
                    text: t['action']['no'],
                },
            ]
        );
    }

    return (
        <View style={styles.container}>
            <Loader isLoading={loading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['applications']['title']} color={Colors.white}/>
            </Appbar.Header>
            <TabController
                items={[
                    {label: t['applicants']['status']['waiting'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: applicationStatusColor.waiting }},
                    {label: t['applicants']['status']['approved'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: applicationStatusColor.approved }},
                    {label: t['applicants']['status']['rejected'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: applicationStatusColor.rejected }},
                    {label: t['applicants']['status']['abandoned'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: applicationStatusColor.abandoned }},
                    {label: t['applicants']['status']['finished'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: applicationStatusColor.finished }},
                    {label: t['recruitment']['status']['canceled'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: recruitmentStatusColor.canceled }},
                    {label: t['recruitment']['status']['deleted'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: recruitmentStatusColor.deleted }}
                ]}
                onChangeIndex={(index) => {
                    dispatch(getApplications(0, 10, applicationType[index]));
                    setCurrentIndex(index);
                }}
            >
                <TabController.TabBar indicatorStyle={{ height: 0 }} enableShadow={false}/>
                <View flex>
                    {
                        applicationType.map((status, index) => (
                            <TabController.TabPage key={index} index={index} lazy>
                                <PTRView onRefresh={() => {
                                    dispatch(getApplications(0, 10, applicationType[currentIndex]))
                                }}>
                                    <InfiniteScroll
                                        horizontal={false}  //true - if you want in horizontal
                                        onLoadMoreAsync={loadMorePage}
                                        distanceFromEnd={10} // distance in density-independent pixels from the right end
                                    >
                                        {
                                            applications.length === 0 && (
                                                <View style={{ marginTop: height / 3 }}>
                                                    <View center marginT-s5>
                                                        <FontAwesome5 name={'box-open'} size={50} color={Colors.grey30} />
                                                    </View>
                                                    <Text center margin-s2 text70> {t['title']['no_data']} </Text>
                                                </View>
                                            )
                                        }
                                        {
                                            applications.length>0 && applications.map((application, index) => (
                                                <Card
                                                    key={index}
                                                    style={{ backgroundColor: Colors.cyan80, borderRadius: 10, marginBottom: 10, marginHorizontal: 10, padding: 10 }}
                                                    onPress={() => {
                                                        dispatch(setApplication(application.applicant_id, () => navigation.navigate('ApplicationDetail')));
                                                    }}
                                                >
                                                    <View row flex centerV>
                                                        <View flex-2 marginR-s2>
                                                            <Image
                                                                source={onLoadImage[application.id] && application.image !== '' ? {uri: serverURL + 'uploads/recruitments/sm_' + application.image} : emptyImage}
                                                                style={{width: width / 3, height: width / 4, borderRadius: 5}}
                                                                onLoad={() => setLoadImage({...onLoadImage, [application.id]: true })}
                                                            />
                                                            {/*<View center style={{ marginTop: -25 }}>*/}
                                                            {/*    <Badge backgroundColor={applicationStatusColor[application.status]} label={t['applicants']['status'][application.status]}/>*/}
                                                            {/*</View>*/}
                                                        </View>
                                                        <View flex-3>
                                                            <View row centerV marginB-s1>
                                                                <Text color={Colors.black} numberOfLines={1} style={{ width: width * 0.4 }}>
                                                                    {application.title}
                                                                </Text>
                                                                <Text text90 color={Colors.blue30}>
                                                                    ({application.family_name})
                                                                </Text>
                                                            </View>
                                                            <View marginB-s1>
                                                                <Text text90>
                                                                    {format_address(application.post_number, application.prefectures, application.city, application.workplace)}
                                                                </Text>
                                                            </View>
                                                            <View row centerV>
                                                                <MaterialCommunityIcons name={'calendar-text'} size={20} color={Colors.cyan30} />
                                                                <Text marginL-s2 text90>
                                                                    {formatDate(application.work_date_start, 'symbol')}
                                                                    ({formatDay(application.work_date_start, 'short')})
                                                                    {
                                                                        application.work_date_end !== application.work_date_start && (
                                                                            <Text text90 >
                                                                                &nbsp;~&nbsp; {formatDate(application.work_date_end, 'symbol')}
                                                                                ({formatDay(application.work_date_end, 'short')})
                                                                            </Text>
                                                                        )
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View row centerV>
                                                                <MaterialCommunityIcons name={'clock-outline'} size={20} color={Colors.cyan30} />
                                                                <Text marginL-s2 text90>
                                                                    {formatTime(application.work_time_start, 'symbol')}
                                                                    &nbsp;~&nbsp;
                                                                    {formatTime(application.work_time_end, 'symbol')}
                                                                </Text>
                                                            </View>
                                                            <View row centerV>
                                                                <MaterialCommunityIcons name={'account-group'} size={20} color={Colors.cyan30} />
                                                                <Text marginL-s2 text90>
                                                                    {application.worker_amount}名
                                                                </Text>
                                                            </View>
                                                            <View row centerV>
                                                                <MaterialCommunityIcons name={'bank'} size={20} color={Colors.cyan30} />
                                                                <Text marginL-s2 text90>
                                                                    {application.reward_type}({application.reward_cost} 円 )・{t['recruitment']['pay_mode'][application.pay_mode]}
                                                                </Text>
                                                            </View>
                                                            <View row centerV>
                                                                <MaterialCommunityIcons name={'train-car'} size={20} color={Colors.cyan30} />
                                                                <Text marginL-s2 text90>
                                                                    {t['recruitment']['traffic'][application.traffic_type]}
                                                                    {application.traffic_type === 'beside' ? '('+application.traffic_cost+' 円)' : ''}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <Ionicons
                                                        name={application.is_favourite ? 'star' : 'star-outline'}
                                                        size={24}
                                                        color={Colors.cyan30}
                                                        style={{ position: 'absolute', bottom: 10, right: 10 }}
                                                        onPress={() => handleFavouriteClick(application.recruitment_id, application.is_favourite)}
                                                    />
                                                </Card>
                                            ))
                                        }
                                    </InfiniteScroll>
                                </PTRView>
                            </TabController.TabPage>
                        ))
                    }
                </View>
            </TabController>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: Colors.white,
    },
    profile: {
        paddingVertical: 10,
        backgroundColor: Colors.cyan30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    reveiwModal: {
        backgroundColor: 'white',
        borderRadius: 20,
        margin: 10,
        padding: 0
    },
    reviewForm: {
        padding: 20,
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.cyan10,
        paddingBottom: 1
    },
    validationMessageStyle: {
        fontSize: 10,
        margin: 0,
        color: Colors.red20
    },
});

export default List;
