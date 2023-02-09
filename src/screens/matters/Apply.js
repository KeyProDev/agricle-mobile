import React, {useContext, useState} from 'react';
import {StyleSheet, ScrollView, ImageBackground, Dimensions} from "react-native";
import {Appbar, Button, Modal} from "react-native-paper";
import {View, Text, Avatar, Colors, Incubator, Badge} from "react-native-ui-lib";
import {LocalizationContext} from "../../translation/translations";
import {useDispatch, useSelector} from "react-redux";
import { showMessage, hideMessage } from "react-native-flash-message";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {format_address, serverURL} from "../../constants/config";
import {apply} from "../../redux/Matter/actions";
import {useFocusEffect} from "@react-navigation/native";
import {formatDate, formatDay, formatTime} from "../../utils/core_func";
import Loader from "../../components/Loader";

const emptyImage = require('../../assets/images/empty.jpg');
const userIcon = require('../../assets/images/user.png');
const { TextField } = Incubator;
const { width } = Dimensions.get('window');

const Apply = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const { matter, loading } = useSelector(state => state.matter);
    const [ openApplyModal, setOpenApplyModal ] = useState(false);
    const [ applyMemo, setApplyMemo ] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            setApplyMemo('');
        }, [])
    );

    const handleApplyClick = () => {
        dispatch(
            apply(
                matter.id,
                applyMemo,
                () => {
                    setOpenApplyModal(false);
                    showMessage({
                        message: t['alert']['success'],
                        description: t['alert']['done_success'],
                    });
                    navigation.navigate('Applications');
                },
                () => {
                    showMessage({
                        message: t['alert']['error'],
                        description: t['alert']['done_error'],
                    });
                }
            )
        );
    }

    return (
        <View style={styles.container}>
            <Loader isLoading={loading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['title']['matters_detail']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView>
                <ImageBackground source={matter.image === 'default.png' ? emptyImage : { uri: serverURL+'uploads/recruitments/sm_'+matter.image }} style={styles.imageView} >
                    <Avatar
                        size={120}
                        source={
                            matter.avatar === 'default.png' ? userIcon :
                            { uri: serverURL+'avatars/'+matter.avatar }
                        }
                        label={'IMG'}
                    />
                    <Text center text60 color={Colors.cyan30} marginT-s2>
                        {matter.producer_name}
                    </Text>
                    <View row center marginH-s2>
                        <Button icon={'account'} mode={'contained'} onPress={() => navigation.navigate('ProducerDetail', { producerId: matter.producer_id, show_profile: true })} style={{ backgroundColor: Colors.purple10, color: Colors.white, marginRight: 5 }}>
                            {t['role']['producer']}
                        </Button>
                        <Button icon={'square-edit-outline'} mode={'contained'} onPress={() => setOpenApplyModal(true)} style={{ backgroundColor: Colors.cyan10, color: Colors.white }}>
                            {t['action']['apply']}
                        </Button>
                    </View>
                </ImageBackground>
                <View style={styles.content}>
                    <Text text40 color={Colors.cyan10} center>
                        {matter.title}
                    </Text>

                    <Text marginT-s3 text70 bold color={Colors.black}>
                        {t['recruitment']['description']}
                    </Text>
                    <Text text70>
                        {matter.description}
                    </Text>

                    <Text marginT-s3 text70 bold color={Colors.black}>
                        {t['recruitment']['notice']}
                    </Text>
                    <Text text70>
                        {matter.notice}
                    </Text>

                    <Text marginT-s3 text70 bold color={Colors.black}>
                        {t['recruitment']['workplace']}
                    </Text>
                    <Text marginT-s1 text70>
                        {format_address(matter.post_number, matter.prefectures, matter.city, matter.workplace)}
                    </Text>

                    <View row marginT-s3>
                        <Text text70 bold color={Colors.black}>
                            {t['recruitment']['work_date']}:
                        </Text>
                        <Text text70 marginL-s3>
                            {formatDate(matter.work_date_start, 'text')}
                            ({formatDay(matter.work_date_start, 'short')})
                        </Text>
                        {
                            matter.work_date_end !== matter.work_date_start && (
                                <Text text70 >
                                    ~ {formatDate(matter.work_date_end, 'text')}
                                    ({formatDay(matter.work_date_end, 'short')})
                                </Text>
                            )
                        }
                    </View>

                    <View row marginT-s3>
                        <Text text70 bold color={Colors.black}>
                            {t['recruitment']['work_time']}:
                        </Text>
                        <Text text70 marginL-s3>
                            {formatTime(matter.work_time_start, 'text')}
                        </Text>
                        <Text text70 >
                            ~ {formatTime(matter.work_time_end, 'text')}
                        </Text>
                    </View>

                    <View row marginT-s3>
                        <Text text70 bold color={Colors.black}>
                            {t['recruitment']['break_time']}:
                        </Text>
                        <Text text70 marginL-s3>
                            {matter.break_time}
                        </Text>
                    </View>

                    <View row marginT-s3>
                        <Text text70 bold color={Colors.black}>
                            {t['recruitment']['worker_amount']}:
                        </Text>
                        <Text text70 marginL-s3>
                            {matter.worker_amount}名
                        </Text>
                    </View>

                    <View row marginT-s3>
                        <Text text70 bold color={Colors.black}>
                            {t['recruitment']['rain_mode']}:
                        </Text>
                        <Text text70 marginL-s3>
                            {matter.rain_mode}
                        </Text>
                    </View>

                    <View row marginT-s3>
                        <Text text70 bold color={Colors.black}>
                            {t['recruitment']['pay_mode']['title']}:
                        </Text>
                        <Text text70 marginL-s3>
                            {t['recruitment']['pay_mode'][matter.pay_mode]}
                        </Text>
                    </View>

                    <View row marginT-s3>
                        <Text text70 bold color={Colors.black}>
                            {t['recruitment']['reward']['title']}:
                        </Text>
                        <Text text70 marginL-s3>
                            {matter.reward_type}({matter.reward_cost} 円 )
                        </Text>
                    </View>

                    <View row marginT-s3>
                        <Text text70 bold color={Colors.black}>
                            {t['recruitment']['traffic']['title']}:
                        </Text>
                        <Text text70 marginL-s3>
                            {t['recruitment']['traffic'][matter.traffic_type]}
                            {matter.traffic_type === 'beside' ? '('+matter.traffic_cost+' 円)' : ''}
                        </Text>
                    </View>

                    <View row marginT-s3>
                        <Text text70 bold color={Colors.black}>
                            {t['recruitment']['clothes']['title']}:
                        </Text>
                        <Text text70 marginL-s3>
                            {matter.clothes.split(',').join(', ')}
                        </Text>
                    </View>

                    <View row marginT-s3>
                        {
                            <Badge backgroundColor={!!matter.lunch_mode ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['lunch_mode']['title']} size={24} marginH-s1/>
                        }
                        {
                            <Badge backgroundColor={!!matter.toilet ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['toilet']['title']} size={24} marginH-s1/>
                        }
                        {
                            <Badge backgroundColor={!!matter.insurance ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['insurance']['title']} size={24} marginH-s1/>
                        }
                        {
                            <Badge backgroundColor={!!matter.park ? Colors.cyan10 : Colors.grey50} label={t['recruitment']['park']['title']} size={24} marginH-s1/>
                        }
                    </View>
                </View>
            </ScrollView>
            <Modal visible={openApplyModal} dismissable onDismiss={() => setOpenApplyModal(false)} contentContainerStyle={{backgroundColor: 'white', margin: 20, borderRadius: 20}}>
                <View style={styles.profile}>
                    <View center>
                        <Avatar
                            size={80}
                            source={{
                                uri: matter.avatar === 'default.png' ? 'https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg' : serverURL+'avatars/'+matter.avatar// + '?' + new Date(),
                            }}
                            label={'IMG'}
                        />
                    </View>
                    <View center>
                        <Text text70 color={Colors.white} marginT-s2>
                            { matter.producer_name }
                        </Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={styles.reviewForm}>
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
                            placeholder={t['applicants']['apply_memo']}
                            value={applyMemo}
                            onChangeText={value => setApplyMemo(value)}
                        />
                    </View>
                    <View center marginB-s5>
                        <Button icon={'square-edit-outline'} mode={'contained'} onPress={handleApplyClick} style={{ backgroundColor: Colors.cyan10, color: Colors.white }}>
                            {t['action']['apply']}
                        </Button>
                    </View>
                </ScrollView>
            </Modal>
        </View>
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
    content: {
        marginTop: -15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 15,
        backgroundColor: Colors.white
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

export default Apply;
