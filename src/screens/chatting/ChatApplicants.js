import * as React from 'react';
import {Appbar, Badge, List, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from "react-redux";
import {useContext} from "react";
import {LocalizationContext} from "../../translation/translations";
import {Avatar, Colors, Text, View} from "react-native-ui-lib";
import {ScrollView, StyleSheet} from "react-native";
import {enterChatting} from "../../redux/Chat/actions";
import {serverURL} from "../../constants/config";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const userIcon = require('../../assets/images/user.png');

const ChatApplicants = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {user} = useSelector(state => state.auth);
    const {applicants, recruitment, unreadMessages} = useSelector(state => state.chat);

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.navigate('ChatMain')} color={Colors.white} />
                <Appbar.Content title={t['action']['applicants_list']} color={Colors.white}/>
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
                            // description={applicant.bio}
                            left={props => (
                                <View row>
                                    <Avatar
                                        size={50}
                                        source={
                                            applicant.avatar === 'default.png' ? userIcon : {uri: serverURL+'avatars/'+applicant.avatar}
                                        }
                                        label={'IMG'}
                                        style={{width: 400, height: 400}}
                                    />
                                    {
                                        unreadMessages.filter(message => message.sender.id === applicant.worker_id).length > 0 && (
                                            <Badge size={24} style={{ marginLeft: -10, marginBottom: 20 }}>
                                                {unreadMessages.filter(message => message.sender.id === applicant.worker_id).length}
                                            </Badge>
                                        )
                                    }
                                </View>
                            )}
                            onPress={() => {
                                dispatch(enterChatting(applicant['worker_id'], recruitment['id'], () => {
                                    navigation.navigate(user.role === 'producer' ? 'ProducerHome' : 'WorkerHome', { screen: 'Chat', params: { screen: 'Chatting' } });
                                }));
                            }}
                        />
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

export default ChatApplicants;
