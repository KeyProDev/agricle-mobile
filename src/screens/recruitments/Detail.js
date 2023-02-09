import React, {useContext} from 'react';
import {StyleSheet, ScrollView, ImageBackground, Dimensions} from "react-native";
import {Appbar, List} from "react-native-paper";
import {View, Text, Avatar, Colors} from 'react-native-ui-lib';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import {LocalizationContext} from "../../translation/translations";
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {serverURL} from '../../constants/config';
import ApplicantStatus from '../../components/ApplicantStatus';
import { getAge } from '../../utils/core_func';
const emptyImage = require('../../assets/images/empty.jpg');
const userImage = require('../../assets/images/user.png');

const { width } = Dimensions.get('window');

const Result = ({ navigation }) => {
    const { t } = useContext(LocalizationContext);
    const { recruitment } = useSelector(state => state.recruitment);

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['title']['recruitment_detail']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView>
                <ImageBackground source={recruitment.image === '' ? emptyImage : { uri: serverURL+'uploads/recruitments/sm_'+recruitment.image }}  style={styles.imageView} />
                <View padding-s3>
                    <Text text50 color={Colors.grey10}> {recruitment.title} </Text>
                    <View row padding-s1>
                        <Text text60 marginR-s1>
                            {
                                recruitment['producer']['family_name']
                            }
                        </Text>
                        <Ionicons name={'star'} color={Colors.yellow20} size={20} />
                        <Text text60 color={Colors.yellow20} marginR-s1>
                            {
                                recruitment['producer']['review']
                            }
                        </Text>
                    </View>
                    <View margin-10>
                        <Text text60 marginT-s1 color={Colors.grey10}> {t['recruitment']['description']} </Text>
                        <Text text80 marginT-s1 > {recruitment['description']} </Text>
                    </View>
                    <View row margin-10>
                        <View flex row>
                            <MaterialCommunityIcons name={'calendar-text'} size={20} color={Colors.cyan30} />
                            <View>
                                <Text text80 color={Colors.grey20} marginL-10>
                                    {
                                        moment(recruitment.work_date_start).format('YYYY年MM月DD日')
                                    }
                                </Text>
                                {
                                    recruitment.work_date_start !== recruitment.work_date_end && (
                                        <Text text80 color={Colors.grey20} marginL-10>
                                            ~{
                                            moment(recruitment.work_date_end).format('YYYY年MM月DD日')
                                        }
                                        </Text>
                                    )
                                }
                            </View>
                        </View>
                        <View flex row>
                            <MaterialCommunityIcons name={'timer'} size={20} color={Colors.cyan30} />
                            <Text text80 color={Colors.grey20} marginL-10>
                                {
                                    moment(recruitment.work_date_start + ' ' + recruitment.work_time_start).format('kk:mm')
                                }~
                                {
                                    moment(recruitment.work_date_start + ' ' + recruitment.work_time_end).format('kk:mm')
                                }
                            </Text>
                        </View>
                    </View>
                    <View row margin-10>
                        <MaterialCommunityIcons name={'google-maps'} size={20} color={Colors.cyan30} />
                        <Text text80 color={Colors.grey20} marginL-10>
                            { recruitment.workplace }
                        </Text>
                    </View>
                </View>
                <View>
                    <List.Section title={(
                        <Text marginH-s2 text60 color={Colors.grey10}> {t['applicants']['applicant_list']} </Text>
                    )}>
                        {
                            recruitment.applicants.map((applicant, index) => (
                                <List.Accordion
                                    key={index}
                                    title={(
                                        <View>
                                            <Text text60 color={Colors.black}>{applicant.nickname}</Text>
                                            <ApplicantStatus status={applicant.status} />
                                        </View>
                                    )}
                                    left={props => <Avatar
                                        size={50}
                                        source={
                                            applicant.avatar === 'default.png' ? userImage : { uri: serverURL+'avatars/'+applicant.avatar }
                                        }
                                        label={'IMG'}
                                        style={{width: 400, height: 400}}
                                    />}
                                    style={{ backgroundColor: Colors.white }}
                                >
                                    <View>
                                        <View row>
                                            <View row marginR-s3 centerV>
                                                <Text text70 color={Colors.cyan30}>{t['profile']['age']}:</Text>
                                                <Text marginH-s3 >{getAge(applicant.birthday)}歳</Text>
                                            </View>
                                            <View row centerV>
                                                <Text text70 color={Colors.cyan30}>{t['profile']['job']}:</Text>
                                                <Text marginH-s3 >{applicant.job}</Text>
                                            </View>
                                        </View>
                                        <View centerV>
                                            <Text text70 color={Colors.cyan30}>{t['applicants']['apply_memo']}:</Text>
                                            <Text >{applicant.apply_memo}</Text>
                                        </View>
                                        <View centerV>
                                            <Text text70 color={Colors.cyan30}>{applicant.status === 'abandoned' ? t['applications']['worker_comment'] : t['applications']['worker_evaluation']}:</Text>
                                            <Text >{applicant.recruitment_evaluation ? applicant.recruitment_evaluation : t['applications']['no_recruitment_evaluation']}</Text>
                                        </View>
                                        <View row centerV padding-s1>
                                            <Text text70 marginR-s3 color={Colors.cyan30}>{t['applications']['worker_review']}:</Text>
                                            <Ionicons name={'star'} color={Colors.yellow20} size={20} />
                                            <Text text60 color={Colors.yellow20}>
                                                { applicant.worker_review }
                                            </Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                            ))
                        }
                    </List.Section>
                </View>
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
    imageView: {
        width: '100%',
        height: width * 0.6,
        resizeMode: 'contain'
    }
});

export default Result;
