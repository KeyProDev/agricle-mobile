import React, {useContext, useState} from 'react';
import {Badge, Colors, Text, View} from "react-native-ui-lib";
import {Appbar, Button as PaperButton, Button} from "react-native-paper";
import {LocalizationContext} from "../../translation/translations";
import {useDispatch, useSelector} from "react-redux";
import {Alert, Dimensions, Image, ScrollView, StyleSheet} from "react-native";
import {format_address, recruitmentStatusColor, serverURL} from "../../constants/config";
import {formatDate, formatTime, formatDay} from '../../utils/core_func';
import {deleteRecruitment, setRecruitment, setRecruitmentStatus} from "../../redux/Recruitment/actions";
import Dialog from "react-native-dialog";

const emptyImage = require('../../assets/images/empty.jpg')
const { width, height } = Dimensions.get('window');

const Preview = ({navigation}) => {
    const { t } = useContext(LocalizationContext);
    const dispatch = useDispatch();
    const { recruitment } = useSelector(state => state.recruitment);
    const [loadImage, setLoadImage] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [cancelVisible, setCancelVisible] = useState(false);
    const [comment, setComment] = useState('');

    const handlePublishClick = () => {
        return Alert.alert(
            t['alert']['confirm'],
            t['alert']['would_you_publish'],
            [
                {
                    text: t['action']['yes'],
                    onPress: () => {
                        dispatch(setRecruitmentStatus(recruitment['id'], 'collecting'));
                    },
                },
                {
                    text: t['action']['no'],
                },
            ]
        );
    }

    const handleEditClick = (isEdit = false) => {
        dispatch(setRecruitment(recruitment.id));
        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentEdit', params: { isEdit } } });
    }

    const handleAddonClick = () => {
        dispatch(setRecruitment(recruitment.id));
        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentAddon' } });
    }

    const handleApplicantsClick = () => {
        dispatch(setRecruitment(recruitment.id));
        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentApplicants' } });
    }

    const handleReviewClick = () => {
        dispatch(setRecruitment(recruitment['id']));
        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentReview' } });
    }

    const handleCompleteClick = () => {
        return Alert.alert(
            t['alert']['confirm'],
            t['alert']['are_you_sure_to_complete_work'],
            [
                {
                    text: t['action']['yes'],
                    onPress: () => {
                        dispatch(setRecruitmentStatus(recruitment['id'], 'completed'));
                    },
                },
                {
                    text: t['action']['no'],
                },
            ]
        );
    }

    const handleFinishClick = () => {
        return Alert.alert(
            t['alert']['confirm'],
            t['alert']['are_you_sure_to_finish_collect'],
            [
                {
                    text: t['action']['yes'],
                    onPress: () => {
                        dispatch(setRecruitmentStatus(recruitment.id, 'working'));
                    },
                },
                {
                    text: t['action']['no'],
                },
            ]
        );
    }

    const handleDeleteDraftClick = () => {
        return Alert.alert(
            t['alert']['confirm'],
            t['alert']['delete_recruitment_message'],
            [
                {
                    text: t['action']['yes'],
                    onPress: () => {
                        dispatch(deleteRecruitment(recruitment['id']));
                    },
                },
                {
                    text: t['action']['no'],
                },
            ]
        );
    }

    const handleDeleteRecruitmentClick = () => {
        return Alert.alert(
            t['alert']['confirm'],
            t['alert']['are_you_sure_to_cancel_recruit'],
            [
                {
                    text: t['action']['yes'],
                    onPress: () => {
                        dispatch(setRecruitmentStatus(recruitment['id'], 'deleted', comment));
                    },
                },
                {
                    text: t['action']['no'],
                },
            ]
        );
    }

    const handleCancelRecruitmentClick = () => {
        return Alert.alert(
            t['alert']['confirm'],
            t['alert']['are_you_sure_to_cancel_work'],
            [
                {
                    text: t['action']['yes'],
                    onPress: () => {
                        dispatch(setRecruitmentStatus(recruitment['id'], 'canceled', comment));
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
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['title']['recruitment_preview']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView style={{ marginBottom: 70, paddingHorizontal: 10 }}>
                <Text text40 color={Colors.cyan10} center marginT-s2>
                    {recruitment.title}
                </Text>
                <View center marginV-s2>
                    <Badge backgroundColor={recruitmentStatusColor[recruitment.status]} label={t['recruitment']['status'][recruitment.status]} size={24} marginH-s1/>
                </View>
                <Image
                    source={loadImage && recruitment.image !== '' ? {uri: serverURL + 'uploads/recruitments/sm_' + recruitment.image} : emptyImage}
                    style={{ width: width - 20, height: width * 0.6, resizeMode: 'stretch', borderRadius: 10 }}
                    onLoad={() => setLoadImage(true)}
                />

                <Text marginT-s3 text70 bold color={Colors.black}>
                    {t['recruitment']['description']}
                </Text>
                <Text text70>
                    {recruitment.description}
                </Text>

                <Text marginT-s3 text70 bold color={Colors.black}>
                    {t['recruitment']['notice']}
                </Text>
                <Text text70>
                    {recruitment.notice}
                </Text>

                <Text marginT-s3 text70 bold color={Colors.black}>
                    {t['recruitment']['workplace']}
                </Text>
                <Text marginT-s1 text70>
                    {format_address(recruitment.post_number, recruitment.prefectures, recruitment.city, recruitment.workplace)}
                </Text>

                <View row marginT-s3>
                    <Text text70 bold color={Colors.black}>
                        {t['recruitment']['work_date']}:
                    </Text>
                    <Text text70 marginL-s3>
                        {formatDate(recruitment.work_date_start, 'symbol')}
                        ({formatDay(recruitment.work_date_start, 'short')})
                    </Text>
                    {
                        recruitment.work_date_end !== recruitment.work_date_start && (
                            <Text text70 >
                                ~ {formatDate(recruitment.work_date_end, 'symbol')}
                                ({formatDay(recruitment.work_date_end, 'short')})
                            </Text>
                        )
                    }
                </View>

                <View row marginT-s3>
                    <Text text70 bold color={Colors.black}>
                        {t['recruitment']['work_time']}:
                    </Text>
                    <Text text70 marginL-s3>
                        {formatTime(recruitment.work_time_start, 'symbol')}
                    </Text>
                    <Text text70 >
                        ~ {formatTime(recruitment.work_time_end, 'symbol')}
                    </Text>
                </View>

                <View row marginT-s3>
                    <Text text70 bold color={Colors.black}>
                        {t['recruitment']['break_time']}:
                    </Text>
                    <Text text70 marginL-s3>
                        {recruitment.break_time}
                    </Text>
                </View>

                <View row marginT-s3>
                    <Text text70 bold color={Colors.black}>
                        {t['recruitment']['worker_amount']}:
                    </Text>
                    <Text text70 marginL-s3>
                        {recruitment.worker_amount}名
                    </Text>
                </View>

                <View row marginT-s3>
                    <Text text70 bold color={Colors.black}>
                        {t['recruitment']['rain_mode']}:
                    </Text>
                    <Text text70 marginL-s3>
                        {recruitment.rain_mode}
                    </Text>
                </View>

                <View row marginT-s3>
                    <Text text70 bold color={Colors.black}>
                        {t['recruitment']['pay_mode']['title']}:
                    </Text>
                    <Text text70 marginL-s3>
                        {t['recruitment']['pay_mode'][recruitment.pay_mode]}
                    </Text>
                </View>

                <View row marginT-s3>
                    <Text text70 bold color={Colors.black}>
                        {t['recruitment']['reward']['title']}:
                    </Text>
                    <Text text70 marginL-s3>
                        {recruitment.reward_type}({recruitment.reward_cost} 円 )
                    </Text>
                </View>

                <View row marginT-s3>
                    <Text text70 bold color={Colors.black}>
                        {t['recruitment']['traffic']['title']}:
                    </Text>
                    <Text text70 marginL-s3>
                        {t['recruitment']['traffic'][recruitment.traffic_type]}
                        {recruitment.traffic_type === 'beside' ? '('+recruitment.traffic_cost+' 円)' : ''}
                    </Text>
                </View>

                <View row marginT-s3>
                    <Text text70 bold color={Colors.black}>
                        {t['recruitment']['clothes']['title']}:
                    </Text>
                    <Text text70 marginL-s3>
                        {recruitment.clothes}
                    </Text>
                </View>

                <View row marginV-s3>
                    {
                        <Badge backgroundColor={!!recruitment.lunch_mode ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['lunch_mode']['title']} size={24} marginH-s1/>
                    }
                    {
                        <Badge backgroundColor={!!recruitment.toilet ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['toilet']['title']} size={24} marginH-s1/>
                    }
                    {
                        <Badge backgroundColor={!!recruitment.insurance ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['insurance']['title']} size={24} marginH-s1/>
                    }
                    {
                        <Badge backgroundColor={!!recruitment.park ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['park']['title']} size={24} marginH-s1/>
                    }
                </View>

                <ScrollView horizontal>
                    {
                        recruitment.status === 'draft' && (
                            <View row marginB-s5 marginH-s2 center>
                                <Button icon={'publish'} mode={'contained'} color={'#e91e63'} onPress={handlePublishClick} style={{ marginLeft: 5 }}>
                                    {t['action']['publish']}
                                </Button>
                                <Button mode={'contained'} icon={'application-edit-outline'} color={'#1A73E8'} onPress={() => handleEditClick(true)} style={{ marginLeft: 5 }}>
                                    {t['action']['edit']}
                                </Button>
                                <Button mode={'outlined'} icon={'content-copy'} color={'#4CAF50'} onPress={() => handleEditClick()} style={{ marginLeft: 5 }}>
                                    {t['action']['copy']}
                                </Button>
                                <Button mode={'contained'} icon={'delete'} color={'#fb8c00'} onPress={handleDeleteDraftClick} style={{ marginLeft: 5 }}>
                                    {t['action']['delete']}
                                </Button>
                            </View>
                        )
                    }

                    {
                        recruitment.status === 'collecting' && (
                            <View row marginB-s5 marginH-s2 center>
                                <Button icon={'check'} mode={'contained'} color={'#4CAF50'} onPress={handleFinishClick} style={{ marginLeft: 5 }} labelStyle={{ color: Colors.white }}>
                                    {t['action']['complete_collecting']}
                                </Button>
                                <Button mode={'contained'} icon={'close'} color={'#F44335'} onPress={() => setDeleteVisible(true)} style={{ marginLeft: 5 }}>
                                    {t['action']['cancel']}
                                </Button>
                                <Button mode={'contained'} icon={'account-group'} color={'#e91e63'} onPress={handleApplicantsClick} style={{ marginLeft: 5 }}>
                                    {t['applicants']['applicant_list']}
                                </Button>
                                <Button mode={'outlined'} icon={'content-copy'} color={'#1A73E8'} onPress={() => handleEditClick()} style={{ marginLeft: 5 }}>
                                    {t['action']['copy']}
                                </Button>
                                <Button mode={'contained'} icon={'plus'} color={'#1A73E8'} onPress={handleAddonClick} style={{ marginLeft: 5 }}>
                                    {t['action']['add_on']}
                                </Button>
                            </View>
                        )
                    }

                    {
                        recruitment.status === 'working' && (
                            <View row marginB-s5 marginH-s2 center>
                                {
                                    new Date() > new Date(recruitment.work_date_start) && (
                                        <>
                                            <Button icon={'check'} mode={'contained'} color={'#4CAF50'} onPress={handleCompleteClick} style={{ marginLeft: 5 }} labelStyle={{ color: Colors.white }}>
                                                {t['action']['complete']}
                                            </Button>
                                            <Button mode={'contained'} icon={'star'} color={'#1A73E8'} onPress={handleReviewClick} style={{ marginLeft: 5 }}>
                                                {t['action']['evaluate']}
                                            </Button>
                                        </>
                                    )
                                }
                                <Button mode={'contained'} icon={'close'} color={'#F44335'} onPress={() => setCancelVisible(true)} style={{ marginLeft: 5 }}>
                                    {t['action']['stop']}
                                </Button>
                                <Button mode={'outlined'} icon={'content-copy'} color={'#1A73E8'} onPress={() => handleEditClick()} style={{ marginLeft: 5 }}>
                                    {t['action']['copy']}
                                </Button>
                            </View>
                        )
                    }
                </ScrollView>
            </ScrollView>
            <Dialog.Container visible={deleteVisible}>
                <Dialog.Title>{t['alert']['confirm']}</Dialog.Title>
                <Dialog.Description>
                    {t['alert']['are_you_sure_to_cancel_recruit']}
                </Dialog.Description>
                <Dialog.Input label={t['alert']['type_comment']} onChangeText={value => setComment(value)} />
                <Dialog.Button label={t['action']['no']} onPress={() => setDeleteVisible(false)} />
                <Dialog.Button label={t['action']['yes']} onPress={handleDeleteRecruitmentClick} />
            </Dialog.Container>
            <Dialog.Container visible={cancelVisible}>
                <Dialog.Title>{t['alert']['confirm']}</Dialog.Title>
                <Dialog.Description>
                    {t['alert']['are_you_sure_to_cancel_work']}
                </Dialog.Description>
                <Dialog.Input label={t['alert']['type_comment']} onChangeText={value => setComment(value)} />
                <Dialog.Button label={t['action']['no']} onPress={() => setCancelVisible(false)} />
                <Dialog.Button label={t['action']['yes']} onPress={handleCancelRecruitmentClick} />
            </Dialog.Container>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
});

export default Preview;
