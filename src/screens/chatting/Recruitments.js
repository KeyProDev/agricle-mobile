import React, {useContext, useState} from 'react';
import {Card, Colors, Text, View} from "react-native-ui-lib";
import {Image, ScrollView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../translation/translations";
import {useFocusEffect} from "@react-navigation/native";
import {getRecruitments, setRecruitment, getApplicants, enterChatting} from "../../redux/Chat/actions";
import {serverURL} from "../../constants/config";

const emptyImage = require('../../assets/images/empty.jpg');

const Recruitments = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {recruitments} = useSelector(state => state.chat);
    const {user} = useSelector(state => state.auth);
    const [ onLoadImage, setLoadImage ] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getRecruitments());
        }, [])
    );

    const handleRecruitmentClick = (recruitmentId) => {
        const recruitment = recruitments.find(recruitment => recruitment.id === recruitmentId);
        dispatch(setRecruitment(recruitment));

        if(user.role === 'producer') {
            dispatch(getApplicants(recruitmentId, () => {
                navigation.navigate('ChatApplicants');
            }))
        }
        else {
            dispatch(enterChatting(recruitment['producer_id'], recruitmentId, () => {
                navigation.navigate('ProducerHome', { screen: 'Chat', params: { screen: 'Chatting' } });
            }));
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {
                    recruitments.map((recruitment, index) => (
                        <Card
                            row
                            key={index}
                            height={100}
                            borderRadius={10}
                            padding-s2
                            margin-s2
                            onPress={() => {
                                handleRecruitmentClick(recruitment.id)
                            }}
                        >
                            <Image
                                source={onLoadImage[recruitment.id] ? {uri: serverURL + 'uploads/recruitments/' + recruitment.image} : emptyImage}
                                style={{width: 120, height: '100%', borderRadius: 5}}
                                onLoad={() => setLoadImage({...onLoadImage, [recruitment.id]: true })}
                            />
                            <View paddingL-20 flex>
                                <Text text70 color={Colors.green10}>
                                    {recruitment.title}
                                </Text>
                                <Text text80 color={Colors.grey10}>
                                    {recruitment.workplace}
                                </Text>
                                <Text text90 color={Colors.grey40}>
                                    {recruitment.work_date_start} ~ {recruitment.work_date_end}
                                </Text>
                            </View>
                        </Card>
                    ))
                }
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
});

export default Recruitments;
