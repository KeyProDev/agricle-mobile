import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ScrollView} from "react-native";
import {Appbar, Button, List, Modal} from "react-native-paper";
import {View, Text, Avatar, Colors, Incubator} from "react-native-ui-lib";
import { Rating } from "react-native-rating-element";
import {LocalizationContext} from "../../translation/translations";
import {useDispatch, useSelector} from "react-redux";
import {evaluateWorker, getApplicants} from "../../redux/Recruitment/actions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {serverURL} from "../../constants/config";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const { TextField } = Incubator;
const userIcon = require('../../assets/images/user.png');

const Review = ({ navigation }) => {
    const dispatch = useDispatch();
    const { recruitment, applicants, applicant } = useSelector(state => state.recruitment);
    const { t } = useContext(LocalizationContext);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [workerEvaluation, setWorkerEvaluation] = useState('');
    const [workerReview, setWorkerReview] = useState(0);
    const [currentApplicant, setCurrentApplicant] = useState({});

    useEffect(() => {
       dispatch(getApplicants(recruitment.id));
    }, []);

    const handleSetReview = () => {
        setCurrentApplicant({});
        setOpenReviewModal(false);
        dispatch(evaluateWorker(currentApplicant.id, workerEvaluation, workerReview));
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['title']['recruitment_review']} color={Colors.white}/>
            </Appbar.Header>
            {
                !(typeof applicants !== 'undefined' && applicants.length > 0) && (
                    <View center style={{ height: '100%' }}>
                        <SimpleLineIcons name={'user'} size={100} color={Colors.grey30}/>
                        <Text center margin-s1 text70> {t['title']['no_data']} </Text>
                    </View>
                )
            }
            <ScrollView>
                {
                    applicants.map((applicant, index) => (
                        <List.Item
                            key={index}
                            title={applicant.nickname}
                            description={applicant.bio}
                            left={props => (
                                <Avatar
                                    size={50}
                                    source={
                                        applicant.avatar === 'default.png' ?
                                            userIcon :
                                            { uri: serverURL+'avatars/'+applicant.avatar}
                                    }
                                    label={'IMG'}
                                    style={{width: 400, height: 400}}
                                />
                            )}
                            onPress={() => {
                                setCurrentApplicant(applicant);
                                setOpenReviewModal(true);
                            }}
                            right={props => (
                                <View row center>
                                    <MaterialCommunityIcons
                                        name={'star'}
                                        size={25}
                                        color={Colors.yellow30}
                                    />
                                    <Text color={Colors.grey10} marginL-5 text65>{ applicant.worker_review }</Text>
                                </View>
                            )}
                        />
                    ))
                }
            </ScrollView>

            <Modal
                visible={openReviewModal}
                onDismiss={() => {
                    setCurrentApplicant({});
                    setOpenReviewModal(false);
                }}
                contentContainerStyle={styles.reveiwModal}
            >
                <View style={styles.profile}>
                    <View center>
                        <Avatar
                            size={100}
                            source={
                                currentApplicant.avatar === 'default.png' ?
                                    userIcon :
                                    { uri: serverURL+'avatars/'+currentApplicant.avatar}
                            }
                            label={'IMG'}
                        />
                    </View>
                    <View center>
                        <Text text60 color={Colors.white} style={{ fontWeight: 'bold' }}>
                            { currentApplicant.family_name }
                        </Text>
                        <Text text65 color={Colors.white}>
                            { currentApplicant.email }
                        </Text>
                    </View>
                </View>
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
                        placeholder={t['applicants']['evaluation']}
                        value={workerEvaluation}
                        onChangeText={value => setWorkerEvaluation(value)}
                    />
                    <View center>
                        <Rating
                            rated={workerReview}
                            totalCount={5}
                            ratingColor="#f1c644"
                            ratingBackgroundColor="#d4d4d4"
                            size={24}
                            onIconTap={(position) => setWorkerReview(position)}
                            icon="ios-star"
                            direction="row"
                        />
                    </View>
                </View>
                <View center paddingV-s1>
                    <Button mode={'contained'} onPress={handleSetReview} style={{ backgroundColor: Colors.cyan30, color: Colors.white, width: 50 }}>
                        {t['action']['evaluate']}
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

export default Review;
