import React, {useContext, useState} from 'react';
import {Avatar, Card, Colors, View} from 'react-native-ui-lib';
import {Button, Dialog, Menu, Paragraph, Text} from "react-native-paper";
import {ScrollView, Image} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import {LocalizationContext} from "../translation/translations";
import {useDispatch} from "react-redux";
import {deleteRecruitment, getApplicants, setRecruitment, setRecruitmentStatus} from "../redux/Recruitment/actions";
import {serverURL} from '../constants/config'
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const emptyImage = require('../assets/images/empty.jpg');

const RecruitmentList = ({navigation, recruitments}) => {
    const dispatch = useDispatch();
    const [ openMenu, setOpenMenu ] = useState(false);
    const [ activeId, setActiveId ] = useState(null);
    const [ onLoadImage, setLoadImage ] = useState({});
    const [ openPublishDialog, setOpenPublishDialog ] = useState(false);
    const [ openDeleteDialog, setOpenDeleteDialog ] = useState(false);
    const [ openCompleteDialog, setOpenCompleteDialog ] = useState(false);
    const { t } = useContext(LocalizationContext);

    const handleEditClick = (recruitmentId) => {
        dispatch(setRecruitment(recruitmentId));
        navigation.navigate('RecruitmentEdit');
    }

    const handleReviewClick = (recruitmentId) => {
        dispatch(setRecruitment(recruitmentId));
        dispatch(getApplicants(recruitmentId, () => { navigation.navigate('RecruitmentReview') } ));
    }

    const handleCompleteClick = () => {
        const recruitmentId = activeId;
        setActiveId(null);
        dispatch(setRecruitmentStatus(recruitmentId, 'completed'));
    }

    const handleApplicantsClick = (recruitmentId) => {
        dispatch(setRecruitment(recruitmentId));
        dispatch(getApplicants(recruitmentId, () => { navigation.navigate('RecruitmentApplicants') } ));
    }

    const handleAddonClick = (recruitmentId) => {
        dispatch(setRecruitment(recruitmentId));
        navigation.navigate('RecruitmentAddon');
    }

    const handleResultClick = (recruitmentId) => {
        dispatch(setRecruitment(recruitmentId));
        dispatch(getApplicants(recruitmentId, () => { navigation.navigate('RecruitmentResult') } ));
    }

    const handlePublishClick = () => {
        const recruitmentId = activeId;
        setActiveId(null);
        dispatch(setRecruitmentStatus(recruitmentId, 'collecting'));
    }

    const handleDeleteClick = () => {
        const recruitmentId = activeId;
        setActiveId(null);
        setOpenDeleteDialog(false);
        dispatch(deleteRecruitment(recruitmentId));
    }

    return (
        <>
            {
                !(typeof recruitments !== 'undefined' && recruitments.length > 0) && (
                    <View center style={{ height: '100%' }}>
                        <SimpleLineIcons name={'social-dropbox'} size={100} color={Colors.grey30}/>
                        <Text center margin-s5 text70> {t['title']['no_data']} </Text>
                    </View>
                )
            }
            <ScrollView>
                {
                    typeof recruitments !== 'undefined' && recruitments.length > 0 && recruitments.map((recruitment, index) => (
                        <Card
                            row
                            key={index}
                            height={100}
                            borderRadius={10}
                            padding-s2
                            margin-s2
                            onPress={() => {
                                if(recruitment.status === 'draft') handleEditClick(recruitment.id);
                                else if(recruitment.status === 'collecting') handleApplicantsClick(recruitment.id);
                                else if(recruitment.status === 'working') handleReviewClick(recruitment.id);
                                else if(recruitment.status === 'completed') handleResultClick(recruitment.id);
                            }}
                        >
                            <Image
                                source={onLoadImage[recruitment.id] ? {uri: serverURL + 'uploads/recruitments/' + recruitment.image} : emptyImage}
                                style={{width: 120, height: '100%', borderRadius: 5}}
                                onLoad={() => setLoadImage({...onLoadImage, [recruitment.id]: true })}
                            />
                            <View paddingL-20 flex>
                                <Text text70 color={Colors.cyan10}>
                                    {recruitment.title}
                                </Text>
                                <Text text80 color={Colors.grey10}>
                                    {recruitment.workplace}
                                </Text>
                                <Text text90 color={Colors.grey40}>
                                    {recruitment.work_date_start} ~ {recruitment.work_date_end}
                                </Text>
                            </View>
                            <View center>
                                {
                                    recruitment.status === 'draft' && (
                                        <Menu
                                            visible={openMenu && activeId === recruitment.id}
                                            onDismiss={() => {
                                                setActiveId(null);
                                                setOpenMenu(false);
                                            }}
                                            anchor={
                                                <Entypo
                                                    name={'dots-three-vertical'}
                                                    size={20}
                                                    onPress={() => {
                                                        setActiveId(recruitment.id);
                                                        setOpenMenu(true);
                                                    }}
                                                />
                                            }
                                        >
                                            <Menu.Item onPress={() => {
                                                setOpenMenu(false);
                                                setOpenPublishDialog(true);
                                            }} title={t['action']['publish']} />
                                            <Menu.Item onPress={() => handleEditClick(recruitment.id)} title={t['action']['edit']} />
                                            <Menu.Item onPress={() => {
                                                setOpenMenu(false);
                                                setOpenDeleteDialog(true)
                                            }} title={t['action']['delete']} />
                                        </Menu>
                                    )
                                }
                                {
                                    recruitment.status === 'collecting' && (
                                        <Menu
                                            visible={activeId === recruitment.id && openMenu}
                                            onDismiss={() => {
                                                setActiveId(null);
                                                setOpenMenu(false);
                                            }}
                                            anchor={
                                                <Entypo
                                                    name={'dots-three-vertical'}
                                                    size={20}
                                                    onPress={() => {
                                                        setActiveId(recruitment.id);
                                                        setOpenMenu(true);
                                                    }}
                                                />
                                            }
                                        >
                                            <Menu.Item onPress={() => handleApplicantsClick(recruitment.id)} title={t['action']['detail']} />
                                            <Menu.Item onPress={() => handleEditClick(recruitment.id)} title={t['action']['copy']} />
                                            <Menu.Item onPress={() => handleAddonClick(recruitment.id)} title={t['action']['add_on']} />
                                        </Menu>
                                    )
                                }
                                {
                                    recruitment.status === 'working' && (
                                        <Menu
                                            visible={activeId === recruitment.id && openMenu}
                                            onDismiss={() => {
                                                setActiveId(null);
                                                setOpenMenu(false);
                                            }}
                                            anchor={
                                                <Entypo
                                                    name={'dots-three-vertical'}
                                                    size={20}
                                                    onPress={() => {
                                                        setActiveId(recruitment.id);
                                                        setOpenMenu(true);
                                                    }}
                                                />
                                            }
                                        >
                                            <Menu.Item onPress={() => handleReviewClick(recruitment.id)} title={t['action']['evaluate']} />
                                            <Menu.Item onPress={() => handleEditClick(recruitment.id)} title={t['action']['copy']} />
                                            <Menu.Item onPress={() => {
                                                setOpenMenu(false);
                                                setOpenCompleteDialog(true);
                                            }} title={t['action']['complete']} />

                                        </Menu>
                                    )
                                }
                            </View>
                        </Card>
                    ))
                }
            </ScrollView>
            <Dialog visible={openPublishDialog} onDismiss={() => setOpenPublishDialog(false)}>
                <Dialog.Content>
                    <Paragraph>{t['alert']['would_you_publish']}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setOpenPublishDialog(false)}>{t['action']['no']}</Button>
                    <Button onPress={handlePublishClick}>{t['action']['yes']}</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={openDeleteDialog} onDismiss={() => setOpenDeleteDialog(false)}>
                <Dialog.Content>
                    <Paragraph>{t['alert']['delete_recruitment_message']}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setOpenDeleteDialog(false)}>{t['action']['no']}</Button>
                    <Button onPress={handleDeleteClick}>{t['action']['yes']}</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={openCompleteDialog} onDismiss={() => setOpenCompleteDialog(false)}>
                <Dialog.Content>
                    <Paragraph>{t['alert']['are_you_sure_to_complete_work']}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setOpenCompleteDialog(false)}>{t['action']['no']}</Button>
                    <Button onPress={handleCompleteClick}>{t['action']['yes']}</Button>
                </Dialog.Actions>
            </Dialog>
        </>
    );
};

export default RecruitmentList;
