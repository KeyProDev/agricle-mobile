import React, {useContext, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../translation/translations";
import {Dimensions, ImageBackground, ScrollView, StyleSheet} from "react-native";
import {Avatar, Colors, Text, View, TabController, Badge, Spacings, Hint, Incubator} from "react-native-ui-lib";
import Loader from "../../components/Loader";
import {Appbar, Button, Modal} from "react-native-paper";
import {format_address, serverURL} from "../../constants/config";
import {formatDate, formatTime, formatDay} from "../../utils/core_func";
import {finish} from "../../redux/Application/actions";
import {Rating} from "react-native-rating-element";
import AntDesign from 'react-native-vector-icons/AntDesign';

const emptyImage = require('../../assets/images/empty.jpg');
const userIcon = require('../../assets/images/user.png');
const farm = require('../../assets/images/farm.png');
const farmer = require('../../assets/images/farmer.png');
const { width } = Dimensions.get('window');
const { TextField } = Incubator;

const Detail = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const { application, loading } = useSelector(state => state.application);
    const { user } = useSelector(state => state.auth);

    const [ cancelView, setCancelView ] = useState(false);
    const [ cancelMemo, setCancelMemo ] = useState('');

    const [ reviewView, setReviewView ] = useState(false);
    const [ recruitmentEvaluation, setRecruitmentEvaluation ] = useState('');
    const [ recruitmentReview, setRecruitmentReview ] = useState(0);

    const TabItems = [
        {label: t['matters']['matter_info']},
        {label: t['applications']['detail']},
    ];
    if(application.recruitment_status === 'completed') TabItems.push({label: t['applications']['result']});

    const handleCancelClick = () => {
        dispatch(
            finish(
                application.recruitment_id,
                { recruitment_evaluation: cancelMemo, status: 'abandoned' },
                () => {
                    setCancelView(false);
                    navigation.navigate('ApplicationMain');
                }
            )
        )
    }

    const handleReviewClick = () => {
        dispatch(
            finish(
                application.recruitment_id,
                { recruitment_evaluation: recruitmentEvaluation, recruitment_review: recruitmentReview, status: 'finished' },
                () => {
                    setReviewView(false);
                    navigation.navigate('ApplicationMain');
                }
            )
        )
    }

    return (
        <>
            <View style={styles.container}>
                <Loader isLoading={loading} />
                <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                    <Appbar.BackAction onPress={() => navigation.navigate('ApplicationMain')} color={Colors.white} />
                    <Appbar.Content title={t['applications']['title']} color={Colors.white}/>
                    {
                        ((application.recruitment_status === 'collecting' && (application.applicant_status === 'waiting' || application.applicant_status === 'approved')) || (application.recruitment_status === 'working' && application.applicant_status === 'approved')) && (
                            <Appbar.Action icon={'cancel'} onPress={() => setCancelView(true)} color={Colors.white} />
                        )
                    }
                    {
                        ((application.recruitment_status === 'completed' && application.applicant_status === 'approved') || ((application.applicant_status === 'fired' || application.applicant_status === 'finished') && !application.recruitment_evaluation && !application.recruitment_review )) && (
                            <Appbar.Action icon={'star'} onPress={() => setReviewView(true)} color={Colors.white} />
                        )
                    }
                </Appbar.Header>
                <ImageBackground source={application.image === 'default.png' ? emptyImage : { uri: serverURL+'uploads/recruitments/sm_'+application.image }} style={styles.imageView} >
                    <Avatar
                        size={120}
                        source={
                            application.avatar === 'default.png' ? userIcon :
                                { uri: serverURL+'avatars/'+application.avatar }
                        }
                        label={'IMG'}
                    />
                    <View row center margin-s2>
                        <Button icon={'account'} mode={'contained'} onPress={() => navigation.navigate('ProducerDetail', { producerId: application.id, show_profile: true })} style={{ backgroundColor: Colors.purple10, color: Colors.white, marginRight: 5 }}>
                            {application.family_name}
                        </Button>
                    </View>
                </ImageBackground>
                <TabController
                    items={TabItems}
                >
                    <TabController.TabBar/>
                    <View flex>
                        <TabController.TabPage index={0} lazy>
                            <ScrollView style={{ margin: 10 }}>
                                <Hint
                                    visible={application.comment}
                                    message={
                                        <>
                                            <Text center> [{t['recruitment']['status'][application.recruitment_status]}] </Text>
                                            <Text> {application.comment} </Text>
                                        </>
                                    }
                                    color={Colors.yellow10}
                                >
                                    <Text text40 color={Colors.purple10} center>
                                        {application.title}
                                    </Text>
                                </Hint>

                                <Text marginT-s1 text70 bold color={Colors.black}>
                                    {t['recruitment']['description']}
                                </Text>
                                <Text text70>
                                    {application.description}
                                </Text>

                                <Text marginT-s3 text70 bold color={Colors.black}>
                                    {t['recruitment']['notice']}
                                </Text>
                                <Text text70>
                                    {application.notice}
                                </Text>

                                <Text marginT-s3 text70 bold color={Colors.black}>
                                    {t['recruitment']['workplace']}
                                </Text>
                                <Text marginT-s1 text70>
                                    {format_address(application.post_number, application.prefectures, application.city, application.workplace)}
                                </Text>

                                <View row marginT-s3>
                                    <Text text70 bold color={Colors.black}>
                                        {t['recruitment']['work_date']}:
                                    </Text>
                                    <Text text70 marginL-s3>
                                        {formatDate(application.work_date_start, 'text')}
                                        ({formatDay(application.work_date_start, 'short')})
                                    </Text>
                                    {
                                        application.work_date_end !== application.work_date_start && (
                                            <Text text70 >
                                                ~ {formatDate(application.work_date_end, 'text')}
                                                ({formatDay(application.work_date_end, 'short')})
                                            </Text>
                                        )
                                    }
                                </View>

                                <View row marginT-s3>
                                    <Text text70 bold color={Colors.black}>
                                        {t['recruitment']['work_time']}:
                                    </Text>
                                    <Text text70 marginL-s3>
                                        {formatTime(application.work_time_start, 'text')}
                                    </Text>
                                    <Text text70 >
                                        ~ {formatTime(application.work_time_end, 'text')}
                                    </Text>
                                </View>

                                <View row marginT-s3>
                                    <Text text70 bold color={Colors.black}>
                                        {t['recruitment']['break_time']}:
                                    </Text>
                                    <Text text70 marginL-s3>
                                        {application.break_time}
                                    </Text>
                                </View>

                                <View row marginT-s3>
                                    <Text text70 bold color={Colors.black}>
                                        {t['recruitment']['worker_amount']}:
                                    </Text>
                                    <Text text70 marginL-s3>
                                        {application.worker_amount}名
                                    </Text>
                                </View>

                                <View row marginT-s3>
                                    <Text text70 bold color={Colors.black}>
                                        {t['recruitment']['rain_mode']}:
                                    </Text>
                                    <Text text70 marginL-s3>
                                        {application.rain_mode}
                                    </Text>
                                </View>

                                <View row marginT-s3>
                                    <Text text70 bold color={Colors.black}>
                                        {t['recruitment']['pay_mode']['title']}:
                                    </Text>
                                    <Text text70 marginL-s3>
                                        {t['recruitment']['pay_mode'][application.pay_mode]}
                                    </Text>
                                </View>

                                <View row marginT-s3>
                                    <Text text70 bold color={Colors.black}>
                                        {t['recruitment']['reward']['title']}:
                                    </Text>
                                    <Text text70 marginL-s3>
                                        {application.reward_type}({application.reward_cost} 円 )
                                    </Text>
                                </View>

                                <View row marginT-s3>
                                    <Text text70 bold color={Colors.black}>
                                        {t['recruitment']['traffic']['title']}:
                                    </Text>
                                    <Text text70 marginL-s3>
                                        {t['recruitment']['traffic'][application.traffic_type]}
                                        {application.traffic_type === 'beside' ? '('+application.traffic_cost+' 円)' : ''}
                                    </Text>
                                </View>

                                <View row marginT-s3>
                                    <Text text70 bold color={Colors.black}>
                                        {t['recruitment']['clothes']['title']}:
                                    </Text>
                                    <Text text70 marginL-s3>
                                        {application.clothes.split(',').join(', ')}
                                    </Text>
                                </View>

                                <View row marginT-s3>
                                    {
                                        <Badge backgroundColor={!!application.lunch_mode ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['lunch_mode']['title']} size={24} marginH-s1/>
                                    }
                                    {
                                        <Badge backgroundColor={!!application.toilet ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['toilet']['title']} size={24} marginH-s1/>
                                    }
                                    {
                                        <Badge backgroundColor={!!application.insurance ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['insurance']['title']} size={24} marginH-s1/>
                                    }
                                    {
                                        <Badge backgroundColor={!!application.park ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['park']['title']} size={24} marginH-s1/>
                                    }
                                </View>
                            </ScrollView>
                        </TabController.TabPage>
                        <TabController.TabPage index={1} lazy>
                            <ScrollView style={{ margin: 10 }}>
                                <Hint
                                    visible={application.applicant_status === 'abandoned'}
                                    message={
                                        <>
                                            <Text center> [{t['applicants']['status']['abandoned']}] </Text>
                                            <Text> {application.recruitment_evaluation} </Text>
                                        </>
                                    }
                                    color={Colors.yellow10}
                                >
                                    <Text text40 color={Colors.purple10} center>
                                        {t['applicants']['status'][application.applicant_status]}
                                    </Text>
                                </Hint>

                                <Text marginT-s1 text70 bold color={Colors.black}>
                                    {t['applicants']['apply_memo']}
                                </Text>
                                <View style={styles.apply_memo}>
                                    <View row centerV marginB-s2>
                                        <Avatar
                                            size={24}
                                            source={
                                                user.avatar === 'default.png' ? userIcon :
                                                    { uri: serverURL+'avatars/'+user.avatar }
                                            }
                                            label={'IMG'}
                                        />
                                        <Text color={Colors.white} marginL-s1>{user.family_name}</Text>
                                    </View>
                                    <Text text80 color={Colors.white}>
                                        {application.apply_memo ? application.apply_memo : t['applicants']['no_apply_memo']}
                                    </Text>
                                </View>

                                <View flex right>
                                    <Text marginT-s1 text70 bold color={Colors.black}>
                                        {t['applicants']['employ_memo']}
                                    </Text>
                                    <View style={styles.employ_memo}>
                                        <View row centerV marginB-s2>
                                            <Avatar
                                                size={24}
                                                source={
                                                    application.avatar === 'default.png' ? userIcon :
                                                        { uri: serverURL+'avatars/'+application.avatar }
                                                }
                                                label={'IMG'}
                                            />
                                            <Text color={Colors.white} marginL-s1>{application.family_name}</Text>
                                        </View>
                                        <Text text80 color={Colors.white}>
                                            {application.employ_memo ? application.employ_memo : t['applicants']['no_employ_memo']}
                                        </Text>
                                    </View>
                                </View>

                            </ScrollView>
                        </TabController.TabPage>
                        {
                            application.recruitment_status === 'completed' && (
                                <TabController.TabPage index={2} lazy>
                                    <ScrollView style={{ margin: 10 }}>
                                        <View row flex margin-10 center>
                                            <View flex-1>
                                                <Avatar
                                                    size={50}
                                                    source={farm}
                                                    label={'IMG'}
                                                    style={{width: width/4, height: width/4}}
                                                />
                                            </View>
                                            <View center flex-6 padding-s1>
                                                <Text text60 marginT-s1 color={Colors.purple30} center>
                                                    <AntDesign name={'doubleright'} size={20} color={Colors.purple30} />
                                                    <AntDesign name={'doubleright'} size={20} color={Colors.purple30} />
                                                    <AntDesign name={'doubleright'} size={20} color={Colors.purple30} />
                                                    &nbsp;{t['applications']['producer_evaluation']}&nbsp;
                                                    <AntDesign name={'doubleright'} size={20} color={Colors.purple30} />
                                                    <AntDesign name={'doubleright'} size={20} color={Colors.purple30} />
                                                    <AntDesign name={'doubleright'} size={20} color={Colors.purple30} />
                                                </Text>
                                                <Text text80 marginT-s1 > {application['worker_evaluation'] ? application['worker_evaluation'] : t['applications']['no_worker_evaluation']} </Text>
                                                <Rating
                                                    rated={application.worker_review}
                                                    totalCount={5}
                                                    ratingColor="#f1c644"
                                                    ratingBackgroundColor="#d4d4d4"
                                                    size={24}
                                                    icon="ios-star"
                                                    direction="row"
                                                />
                                            </View>
                                            <View flex-1 right>
                                                <Avatar
                                                    size={50}
                                                    source={farmer}
                                                    label={'IMG'}
                                                    style={{width: width/4, height: width/4}}
                                                />
                                            </View>
                                        </View>
                                        <View row flex margin-10 center style={{ borderBottomWidth: 2 }}>
                                        </View>
                                        <View row flex margin-10 center>
                                            <View flex-1>
                                                <Avatar
                                                    size={50}
                                                    source={farm}
                                                    label={'IMG'}
                                                    style={{width: width/4, height: width/4}}
                                                />
                                            </View>
                                            <View center flex-6 padding-s1>
                                                <Text text60 marginT-s1 color={Colors.purple30} center>
                                                    <AntDesign name={'doubleleft'} size={20} color={Colors.purple30} />
                                                    <AntDesign name={'doubleleft'} size={20} color={Colors.purple30} />
                                                    <AntDesign name={'doubleleft'} size={20} color={Colors.purple30} />
                                                    &nbsp;{t['applications']['worker_evaluation']}&nbsp;
                                                    <AntDesign name={'doubleleft'} size={20} color={Colors.purple30} />
                                                    <AntDesign name={'doubleleft'} size={20} color={Colors.purple30} />
                                                    <AntDesign name={'doubleleft'} size={20} color={Colors.purple30} />
                                                </Text>
                                                <Text text80 marginT-s1 > {application['recruitment_evaluation']?application['recruitment_evaluation']:t['applications']['no_recruitment_evaluation']} </Text>
                                                <Rating
                                                    rated={application.recruitment_review}
                                                    totalCount={5}
                                                    ratingColor="#f1c644"
                                                    ratingBackgroundColor="#d4d4d4"
                                                    size={24}
                                                    icon="ios-star"
                                                    direction="row"
                                                />
                                            </View>
                                            <View flex-1 right>
                                                <Avatar
                                                    size={50}
                                                    source={farmer}
                                                    label={'IMG'}
                                                    style={{width: width/4, height: width/4}}
                                                />
                                            </View>
                                        </View>
                                    </ScrollView>
                                </TabController.TabPage>
                            )
                        }
                    </View>
                </TabController>
            </View>

            <Modal visible={cancelView} dismissable onDismiss={() => setCancelView(false)} contentContainerStyle={{backgroundColor: 'white', margin: 20, borderRadius: 20}}>
                <ScrollView>
                    <Text center text60 margin-s3 color={Colors.cyan30}>
                        {t['alert']['are_you_sure_to_abandon_work']}
                    </Text>
                    <View padding-s4>
                        <TextField
                            placeholderTextColor={Colors.cyan10}
                            floatingPlaceholderColor={Colors.cyan10}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            multiline
                            marginT-10
                            maxLength={100}
                            showCharCounter
                            rows={4}
                            placeholder={t['alert']['type_comment']}
                            value={cancelMemo}
                            onChangeText={value => setCancelMemo(value)}
                        />
                    </View>
                    <View center marginB-s5>
                        <Button icon={'cancel'} mode={'contained'} onPress={handleCancelClick} style={{ backgroundColor: Colors.cyan10, color: Colors.white }}>
                            {t['action']['abandon']}
                        </Button>
                    </View>
                </ScrollView>
            </Modal>

            <Modal
                visible={reviewView}
                onDismiss={() => {
                    setReviewView(false);
                }}
                contentContainerStyle={styles.reveiwModal}
            >
                <View style={styles.profile}>
                    <View center>
                        <Avatar
                            size={80}
                            source={
                                application.avatar === 'default.png' ? userIcon : { uri: serverURL+'avatars/' + application.avatar}
                            }
                            label={'IMG'}
                        />
                    </View>
                    <View center>
                        <Text text60 color={Colors.white} marginT-s2>
                            { application.family_name }
                        </Text>
                    </View>
                </View>
                <View padding-s4>
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        multiline
                        marginT-10
                        maxLength={100}
                        showCharCounter
                        rows={4}
                        placeholder={t['applicants']['evaluation']}
                        value={recruitmentEvaluation}
                        onChangeText={value => setRecruitmentEvaluation(value)}
                    />
                    <View center>
                        <Rating
                            rated={recruitmentReview}
                            totalCount={5}
                            ratingColor="#f1c644"
                            ratingBackgroundColor="#d4d4d4"
                            size={24}
                            onIconTap={(position) => setRecruitmentReview(position)}
                            icon="ios-star"
                            direction="row"
                        />
                    </View>
                </View>
                <View center paddingV-s1>
                    <Button mode={'contained'} onPress={handleReviewClick} style={{ backgroundColor: Colors.cyan30, color: Colors.white, width: 50 }}>
                        {t['action']['evaluate']}
                    </Button>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
    imageView: {
        width: '100%',
        height: width * 0.6,
        resizeMode: 'contain',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    employ_memo: {
        margin: Spacings.s2,
        padding: Spacings.s5,
        paddingVertical: Spacings.s2,
        width: width * 0.6,
        backgroundColor: Colors.purple20,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 50,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 0,
    },
    apply_memo: {
        margin: Spacings.s2,
        paddingLeft: 30,
        paddingVertical: Spacings.s2,
        width: width * 0.6,
        backgroundColor: Colors.cyan20,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 35,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 35,
    },
    profile: {
        paddingVertical: 10,
        backgroundColor: Colors.cyan30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    reveiwModal: {
        backgroundColor: 'white',
        borderRadius: 20,
        margin: 10,
        padding: 0
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.cyan10,
        paddingBottom: 1
    },
});

export default Detail;
