import React, {useContext, useState} from 'react';
import {StyleSheet, ScrollView, ImageBackground, Dimensions} from 'react-native';
import {Appbar, Button, Dialog, List, Modal, Paragraph} from 'react-native-paper';
import {View, Text, Avatar, Colors, Incubator} from 'react-native-ui-lib';
import {LocalizationContext} from "../../translation/translations";
import {useDispatch, useSelector} from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {getApplicant, setApplicant, setRecruitmentStatus} from "../../redux/Recruitment/actions";
import {format_address, serverURL} from "../../constants/config";
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from "react-native-vector-icons/Fontisto";
import {useFocusEffect} from "@react-navigation/native";
import {getProfile} from "../../redux/User/actions";
import {formatDate, formatTime, formatDay} from "../../utils/core_func";

const userIcon = require('../../assets/images/user.png');
const emptyImage = require('../../assets/images/empty.jpg');
const { width } = Dimensions.get('window');
const { TextField } = Incubator;

const Applicants = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const { recruitment } = useSelector(state => state.recruitment);
    const [ openFinishDialog, setOpenFinishDialog ] = useState(false);
    const [ openDeleteDialog, setOpenDeleteDialog ] = useState(false);
    const [ comment, setComment ] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            if(Object.keys(recruitment).length === 0) {
                alert(t['recruitment']['not_exist_recruitment']);
                navigation.goBack();
            }
        }, [])
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentList' } })} color={Colors.white} />
                <Appbar.Content title={t['title']['recruitment_applicants']} color={Colors.white}/>
                <Appbar.Action icon={'account-multiple-remove'} onPress={() => setOpenDeleteDialog(true)} color={Colors.white} />
                <Appbar.Action icon={'account-multiple-check'} onPress={() => setOpenFinishDialog(true)} color={Colors.white} />
            </Appbar.Header>
            <ScrollView>
                <ImageBackground source={recruitment.image === '' ? emptyImage : { uri: serverURL+'uploads/recruitments/sm_'+recruitment.image }}  style={styles.imageView} />
                <View padding-s3>
                    <Text text50 color={Colors.cyan10} marginB-s2 center>
                        { recruitment.title }
                    </Text>
                    <Text text80 color={Colors.grey20}>
                        { recruitment.description }
                    </Text>
                    <View row marginT-10>
                        <Fontisto name={'map-marker-alt'} size={20} color={Colors.cyan30} />
                        <Text text80 color={Colors.grey20} marginL-10>
                            { format_address(recruitment.post_number, recruitment.prefectures, recruitment.city, recruitment.workplace) }
                        </Text>
                    </View>
                    <View row marginT-10>
                        <Ionicons name={'calendar'} size={20} color={Colors.cyan30} />
                        <Text text80 color={Colors.grey20} marginL-10>
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
                    <View row marginT-10>
                        <Ionicons name={'ios-time'} size={20} color={Colors.cyan30} />
                        <Text text80 color={Colors.grey20} marginL-10>
                            {formatTime(recruitment.work_time_start, 'symbol')}
                            ~
                            {formatTime(recruitment.work_time_end, 'symbol')}
                        </Text>
                    </View>
                    {/*<View row padding-s1>*/}
                    {/*    <Text text60 marginR-s1>*/}
                    {/*        {*/}
                    {/*            recruitment['producer']['family_name']*/}
                    {/*        }*/}
                    {/*    </Text>*/}
                    {/*    <Ionicons name={'star'} color={Colors.yellow20} size={20} />*/}
                    {/*    <Text text60 color={Colors.yellow20} marginR-s1>*/}
                    {/*        {*/}
                    {/*            recruitment['producer']['review']*/}
                    {/*        }*/}
                    {/*    </Text>*/}
                    {/*</View>*/}
                </View>
                {
                    Object.keys(recruitment.applicants).length === 0 && (
                        <View center>
                            <SimpleLineIcons name={'user'} size={100} color={Colors.grey30}/>
                            <Text center margin-s1 text70> {t['title']['no_data']} </Text>
                        </View>
                    )
                }
                {
                    recruitment.applicants.map((applicant, index) => (
                        <List.Item
                            key={index}
                            title={applicant.nickname}
                            description={applicant.bio}
                            left={props => <Avatar
                                size={50}
                                source={
                                    applicant.avatar === 'default.png' ?
                                        userIcon :
                                        {
                                            uri: serverURL+'avatars/'+applicant.avatar// + '?' + new Date(),
                                        }
                                }
                                label={'IMG'}
                                style={{width: 400, height: 400}}
                            />}
                            onPress={() => {
                                dispatch(getApplicant(recruitment.id, applicant.worker_id, () => navigation.navigate('RecruitmentApplicant')));
                            }}
                            right={props => (
                                <View center>
                                    {
                                        applicant.status === 'approved' && (
                                            <View row center>
                                                <MaterialCommunityIcons
                                                    name={'account-check'}
                                                    size={30}
                                                    color={Colors.cyan30}
                                                />
                                                <Text text70 color={Colors.cyan30}>{t['applicants']['status']['approved']}</Text>
                                            </View>
                                        )
                                    }
                                </View>
                                // <View center>
                                //     {
                                //         applicant.status === 'waiting' &&
                                //         <MaterialCommunityIcons
                                //             name={'account-clock'}
                                //             size={30}
                                //             color={Colors.purple30}
                                //         />
                                //     }
                                //     {
                                //         applicant.status === 'approved' &&
                                //         <MaterialCommunityIcons
                                //             name={'account-check'}
                                //             size={30}
                                //             color={Colors.cyan30}
                                //         />
                                //     }
                                //     {
                                //         applicant.status === 'rejected' &&
                                //         <MaterialCommunityIcons
                                //             name={'account-cancel'}
                                //             size={30}
                                //             color={Colors.red30}
                                //         />
                                //     }
                                // </View>
                            )}
                        />
                    ))
                }
            </ScrollView>
            <Dialog visible={openFinishDialog} onDismiss={() => setOpenFinishDialog(false)}>
                <Dialog.Content>
                    <Paragraph>{t['alert']['are_you_sure_to_finish_collect']}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setOpenFinishDialog(false)}>{t['action']['no']}</Button>
                    <Button onPress={() => {
                        dispatch(setRecruitmentStatus(recruitment.id, 'working'));
                        navigation.navigate('RecruitmentList');
                        setOpenFinishDialog(false);
                    }}>{t['action']['yes']}</Button>
                </Dialog.Actions>
            </Dialog>
            <Modal
                visible={openDeleteDialog}
                onDismiss={() => {
                    setOpenDeleteDialog(false);
                }}
                contentContainerStyle={styles.deleteModal}
            >
                <Text center text60 marginT-s7 color={Colors.cyan30}> { t['alert']['are_you_sure_to_cancel_recruit'] } </Text>
                <View padding-s5>
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
                        value={comment}
                        onChangeText={value => setComment(value)}
                    />
                </View>
                <View row center paddingB-s5>
                    <Button mode={'contained'} onPress={() => {
                        setOpenDeleteDialog(false);
                    }} style={{ backgroundColor: Colors.grey10, color: Colors.white, width: 100, marginRight: 10 }}>
                        {t['action']['no']}
                    </Button>
                    <Button mode={'contained'} onPress={() => {
                        dispatch(setRecruitmentStatus(recruitment.id, 'deleted', comment));
                        navigation.navigate('RecruitmentList');
                        setOpenDeleteDialog(false);
                    }} style={{ backgroundColor: Colors.cyan30, color: Colors.white, width: 100 }}>
                        {t['action']['yes']}
                    </Button>
                </View>
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
        resizeMode: 'contain'
    },
    deleteModal: {
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
    validationMessageStyle: {
        fontSize: 10,
        margin: 0,
        color: Colors.red20
    },
});

export default Applicants;
