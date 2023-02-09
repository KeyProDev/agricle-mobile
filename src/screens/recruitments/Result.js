import React, {useContext} from 'react';
import {StyleSheet, ScrollView, ImageBackground, Dimensions} from "react-native";
import {Appbar, Button, List} from "react-native-paper";
import {View, Text, Avatar, Colors} from "react-native-ui-lib";
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import {LocalizationContext} from "../../translation/translations";
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {format_address, serverURL} from "../../constants/config";
import Fontisto from "react-native-vector-icons/Fontisto";
import {setRecruitment} from "../../redux/Recruitment/actions";
import {formatDate, formatDay, formatTime} from "../../utils/core_func";
const emptyImage = require('../../assets/images/empty.jpg');
const userImage = require('../../assets/images/user.png');

const { width } = Dimensions.get('window');

const Result = ({ navigation }) => {
    const { t } = useContext(LocalizationContext);
    const { recruitment } = useSelector(state => state.recruitment);
    const dispatch = useDispatch();

    const handleReviewClick = () => {
        dispatch(setRecruitment(recruitment['id']));
        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentReview' } });
    }

    const handleEditClick = (isEdit = false) => {
        dispatch(setRecruitment(recruitment.id));
        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentEdit', params: { isEdit } } });
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={recruitment['status'] === 'canceled' ? t['title']['recruitment_canceled'] : recruitment['status'] === 'deleted' ? t['title']['recruitment_deleted'] : t['title']['recruitment_result']} color={Colors.white}/>
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
                            { recruitment['producer']['review'] }
                        </Text>
                    </View>
                    {
                        recruitment.status === 'canceled' && <View>
                            <Text color={Colors.red10}>
                                { recruitment.comment }
                            </Text>
                        </View>
                    }
                    <Text text70> {recruitment['description']} </Text>
                    <Text marginT-s1 text70 bold color={Colors.black}>
                        {t['recruitment']['workplace']}
                    </Text>
                    <Text marginT-s1 text70>
                        {format_address(recruitment.post_number, recruitment.prefectures, recruitment.city, recruitment.workplace)}
                    </Text>
                    <View row marginT-s1>
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
                    <View row marginT-s1>
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
                                            <Text>{applicant.nickname}</Text>
                                            <View row>
                                                <Text text60 color={Colors.yellow20}>{applicant.worker_review}</Text>
                                                <MaterialCommunityIcons
                                                    name={'star'}
                                                    size={20}
                                                    color={Colors.yellow20}
                                                />
                                            </View>
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
                                    // right={props => (
                                    //     <View flex right centerV>
                                    //         <MaterialCommunityIcons
                                    //             name={applicant.is_favourite ? 'bookmark' : 'bookmark-outline'}
                                    //             size={20}
                                    //             color={Colors.yellow20}
                                    //             onPress={() => {
                                    //                 dispatch(setFavouriteUser(applicant.user_id))
                                    //             }}
                                    //         />
                                    //     </View>
                                    // )}
                                    style={{ backgroundColor: Colors.white }}
                                >
                                    <View>
                                        <Text>
                                            {
                                                applicant.worker_evaluation ? applicant.worker_evaluation : t['applications']['no_worker_evaluation']
                                            }
                                        </Text>
                                        <View row right>
                                            <Text>{t['applications']['worker_review']}:</Text>
                                            <Ionicons name={'star'} color={Colors.yellow20} size={20} />
                                            <Text text60 color={Colors.yellow20} marginR-s1>
                                                {
                                                    applicant.worker_review
                                                }
                                            </Text>
                                        </View>
                                        <Text>
                                            {
                                                applicant.recruitment_evaluation ? applicant.recruitment_evaluation : t['applications']['no_recruitment_evaluation']
                                            }
                                        </Text>
                                        <View row right>
                                            <Text>{t['applications']['producer_review']}:</Text>
                                            <Ionicons name={'star'} color={Colors.yellow20} size={20} />
                                            <Text text60 color={Colors.yellow20} marginR-s1>
                                                {
                                                    applicant.recruitment_review
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                            ))
                        }
                    </List.Section>
                </View>
                <View row marginB-s5 marginH-s2 center>
                    {
                        recruitment.status === 'completed' && (
                            <Button mode={'contained'} icon={'star'} color={'#1A73E8'}
                                    onPress={handleReviewClick} style={{marginLeft: 5}}>
                                {t['action']['evaluate']}
                            </Button>
                        )
                    }
                    <Button mode={'outlined'} icon={'content-copy'} color={'#1A73E8'} onPress={() => handleEditClick()} style={{ marginLeft: 5 }}>
                        {t['action']['copy']}
                    </Button>
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
