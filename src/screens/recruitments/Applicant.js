import React, {useContext, useState} from 'react';
import {StyleSheet, ScrollView, Dimensions, Pressable} from "react-native";
import {Appbar, Button, Dialog, List, Menu, Modal, Paragraph} from "react-native-paper";
import {View, Text, Avatar, Colors, Incubator, Badge} from "react-native-ui-lib";
import {LocalizationContext} from "../../translation/translations";
import {useDispatch, useSelector} from "react-redux";
import {setApplicantStatus} from "../../redux/Recruitment/actions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {setFavouriteUser} from "../../redux/Recruitment/actions";
import {applicationStatusColor, format_address, get_prefectures_name, serverURL} from "../../constants/config";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {getAge} from '../../utils/core_func';
import {Rating} from "react-native-rating-element";

const userIcon = require('../../assets/images/user.png');
const { TextField } = Incubator;

const Applicant = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const { applicant } = useSelector(state => state.recruitment);
    const [ employMemo, setEmployMemo ] = useState('');
    const [ openApproveDialog, setOpenApproveDialog ] = useState(false);
    const [ openRejectDialog, setOpenRejectDialog ] = useState(false);

    const setFavourite = (applicantId) => {
        dispatch(setFavouriteUser(applicantId))
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['title']['recruitment_applicant']} color={Colors.white}/>
                {/*{*/}
                {/*    applicant.status === 'waiting' && (*/}
                {/*        <>*/}
                {/*            <Appbar.Action icon={'account-cancel'} onPress={() => setOpenRejectDialog(true)} color={Colors.white} />*/}
                {/*            <Appbar.Action icon={'account-check'} onPress={() => setOpenApproveDialog(true)} color={Colors.white} />*/}
                {/*        </>*/}
                {/*    )*/}
                {/*}*/}
            </Appbar.Header>
            <ScrollView>
                <View padding-s2 backgroundColor={Colors.cyan30}>
                    <View center>
                        <Avatar
                            size={100}
                            source={
                                applicant.avatar === 'default.png' ?
                                    userIcon :
                                    {
                                        uri: serverURL+'avatars/'+applicant.avatar// + '?' + new Date(),
                                    }
                            }
                            label={'IMG'}
                        />
                        <Rating
                            rated={applicant.review}
                            totalCount={5}
                            ratingColor="#f1c644"
                            ratingBackgroundColor="#d4d4d4"
                            size={18}
                            icon="ios-star"
                            direction="row"
                        />
                    </View>
                    <View center>
                        <Text text60 color={Colors.white} style={{ fontWeight: 'bold' }}>
                            { applicant.family_name }
                        </Text>
                    </View>
                    <View row center marginT-s1>
                        {
                            applicant.status === 'waiting' && (
                                <>
                                    <Button mode={'contained'} onPress={() => setOpenRejectDialog(true)} style={{ backgroundColor: Colors.red30, color: Colors.white, marginRight: 10 }}>{t['applicants']['status']['rejected']}</Button>
                                    <Button mode={'contained'} onPress={() => setOpenApproveDialog(true)} style={{ backgroundColor: Colors.green30, color: Colors.white, marginRight: 10}}>{t['applicants']['status']['approved']}</Button>
                                </>
                            )
                        }
                        <Button mode={applicant.is_favourite ? 'contained' : 'outlined'} onPress={() => setFavourite(applicant.worker_id)} color={applicant.is_favourite ? Colors.yellow30 : Colors.white}>
                            {t['action']['favourite']}
                        </Button>
                    </View>
                </View>

                <View padding-s2>
                    <View row margin-5>
                        <View flex row>
                            <Text text80 color={Colors.cyan10}>
                                {t['profile']['name']} :
                            </Text>
                            <Text text80 color={Colors.grey20} marginL-5>
                                { applicant.name }
                            </Text>
                        </View>
                        <View flex row>
                            <Text text80 color={Colors.cyan10}>
                                {t['profile']['gender']['title']} :
                            </Text>
                            <Text text80 color={Colors.grey20} marginL-5>
                                { t['profile']['gender'][applicant.gender] }
                            </Text>
                        </View>
                    </View>
                    <View row margin-5>
                        <View flex row>
                            <Text text80 color={Colors.cyan10}>
                                {t['profile']['nickname']} :
                            </Text>
                            <Text text80 color={Colors.grey20} marginL-5>
                                { applicant.nickname }
                            </Text>
                        </View>
                        <View flex row>
                            <Text text80 color={Colors.cyan10}>
                                {t['profile']['age']} :
                            </Text>
                            <Text text80 color={Colors.grey20} marginL-5>
                                {getAge(applicant.birthday)}歳
                            </Text>
                        </View>
                    </View>
                    <View row margin-5>
                        <Text text80 color={Colors.cyan10}>
                            {t['profile']['residence']} :
                        </Text>
                        <Text text80 color={Colors.grey20} marginL-5>
                            { get_prefectures_name(applicant.prefectures) }
                        </Text>
                        <Text text80 color={Colors.grey20} marginL-5>
                            { applicant.city }
                        </Text>
                    </View>
                    <View row margin-5>
                        <Text text80 color={Colors.cyan10}>
                            {t['profile']['job']} :
                        </Text>
                        <Text text80 color={Colors.grey20} marginL-5>
                            { applicant.job }
                        </Text>
                    </View>
                    <View row margin-5>
                        <Text text80 color={Colors.cyan10}>
                            {t['profile']['bio']} :
                        </Text>
                        <Text text80 color={Colors.grey20} marginL-5>
                            { applicant.bio }
                        </Text>
                    </View>
                    <View margin-5>
                        <Text text80 color={Colors.cyan10}>
                            {t['profile']['appeal_point']} :
                        </Text>
                        <Text text80 color={Colors.grey20} marginL-5>
                            { applicant.appeal_point }
                        </Text>
                    </View>
                </View>

                <View padding-s2>
                    <Text text60 marginV-5>
                        {t['profile']['matching_history']}
                    </Text>
                    {
                        Object.keys(applicant.recruitments).length === 0 && (
                            <View center>
                                <View center marginT-s5>
                                    <FontAwesome5 name={'box-open'} size={50} color={Colors.grey30} />
                                </View>
                                <Text center margin-s2 text70> {t['title']['no_data']} </Text>
                            </View>
                        )
                    }
                    {
                        applicant.recruitments.map((recruitment, index) => (
                            <List.Item
                                key={index}
                                title={
                                    <View row>
                                        <Text>{recruitment.title}</Text>
                                        <Badge backgroundColor={applicationStatusColor[recruitment.status]} label={t['applicants']['status'][recruitment.status]}/>
                                    </View>
                                }
                                description={recruitment.worker_evaluation??t['applications']['no_worker_evaluation']}
                                left={props => <Avatar
                                    size={50}
                                    source={{
                                        uri: serverURL+'uploads/recruitments/sm_'+recruitment.image// + '?' + new Date(),
                                    }}
                                    label={'IMG'}
                                    style={{width: 400, height: 400}}
                                />}
                                right={props => (
                                    <View row center>
                                        <MaterialCommunityIcons
                                            name={'star'}
                                            size={25}
                                            color={Colors.yellow30}
                                        />
                                        <Text color={Colors.grey10} marginL-5 text65>{ recruitment.worker_review }</Text>
                                    </View>
                                )}
                            />
                        ))
                    }
                </View>
            </ScrollView>
            <Modal visible={openApproveDialog} dismissable onDismiss={() => setOpenApproveDialog(false)} contentContainerStyle={styles.memoModal}>
                <View padding-s3>
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
                        value={employMemo}
                        onChangeText={value => setEmployMemo(value)}
                    />
                </View>
                <View row center padding-s3>
                    <Button
                        mode={'contained'}
                        onPress={() => {
                            dispatch(setApplicantStatus(applicant['recruitment_id'], applicant.id, 'approved', employMemo, navigation));
                            setOpenApproveDialog(false);
                            setEmployMemo('');
                        }}
                        color={Colors.green30}
                    >{t['applicants']['status']['approved']}</Button>
                    <Button mode={'contained'} onPress={() => setOpenApproveDialog(false)} style={{ backgroundColor: Colors.grey30, color: Colors.white, marginLeft: 20 }}>{t['action']['back']}</Button>
                </View>
            </Modal>
            <Modal visible={openRejectDialog} dismissable onDismiss={() => setOpenRejectDialog(false)} contentContainerStyle={styles.memoModal}>
                <View padding-s3>
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
                        value={employMemo}
                        onChangeText={value => setEmployMemo(value)}
                    />
                </View>
                <View row center padding-s3>
                    <Button
                        mode={'contained'}
                        onPress={() => {
                            dispatch(setApplicantStatus(applicant['recruitment_id'], applicant.id, 'rejected', employMemo, navigation));
                            setOpenRejectDialog(false);
                            setEmployMemo('');
                        }}
                        color={Colors.red30}
                    >{t['applicants']['status']['rejected']}</Button>
                    <Button mode={'contained'} onPress={() => setOpenRejectDialog(false)} style={{ backgroundColor: Colors.grey30, color: Colors.white, marginLeft: 20 }}>{t['action']['back']}</Button>
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
    favouriteIcon: {
        position: 'absolute',
        height: 40,
        width: 120,
        top: 0,
        right: 10,
        backgroundColor: Colors.yellow30,
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.cyan10,
        paddingBottom: 1
    },
    memoModal: {
        backgroundColor: 'white',
        borderRadius: 20,
        margin: 10,
        padding: 0
    },
});

export default Applicant;
