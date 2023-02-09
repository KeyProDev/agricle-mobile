import React, {useContext} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../translation/translations";
import {Avatar, Colors, Text, View} from "react-native-ui-lib";
import Ionicons from "react-native-vector-icons/Ionicons";
import Pusher from "pusher-js/react-native";
import {List} from "react-native-paper";
import dayjs from "dayjs";
import pusherConfig from "../../constants/pusher.json";
import {enterChatting, getUnreadMessages} from "../../redux/Chat/actions";
import {serverURL} from "../../constants/config";
import {StyleSheet} from "react-native";

const Messages = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const { unreadMessages } = useSelector(state => state.chat);
    const {user} = useSelector(state => state.auth);
    const pusher = new Pusher(pusherConfig.key, pusherConfig);
    const chatChannel = pusher.subscribe('chat');

    chatChannel.bind(`receive-${user.id}`, () => {
        dispatch(getUnreadMessages());
    });

    return (
        <View marginB-s3>
            <Text style={styles.listHeader}>
                {
                    t['title']['message']
                }
            </Text>
            {
                !(typeof unreadMessages !== 'undefined' && unreadMessages.length > 0) && (
                    <View center marginT-s5>
                        <Ionicons name={'md-chatbox-ellipses'} size={50} color={Colors.grey30}/>
                        <Text center margin-s2 text70> {t['title']['no_data']} </Text>
                    </View>
                )
            }
            {
                typeof unreadMessages !== 'undefined' && unreadMessages.length > 0 && unreadMessages.map((message, index) => (
                    <List.Item
                        key={index}
                        title={message.sender.family_name}
                        description={message.message}
                        left={props => <View center>
                            <Avatar
                                size={50}
                                source={{
                                    uri: message.sender.avatar === 'default.png' ? 'https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg' : serverURL+'avatars/'+message.sender.avatar// + '?' + new Date(),
                                }}
                                label={'IMG'}
                                style={{width: 400, height: 400}}
                            />
                        </View>}
                        onPress={() => {
                            dispatch(enterChatting(message.sender.id, message['recruitment_id'], () => {
                                navigation.navigate(user.role === 'producer' ? 'ProducerHome' : 'WorkerHome', { screen: 'Chat', params: { screen: 'Chatting' } });
                            }));
                        }}
                        right={props => (
                            <View center>
                                <Text>{dayjs(message.created_at).format('YYYY/MM/DD') }</Text>
                                <Text>{dayjs(message.created_at).format('hh:mm:ss') }</Text>
                            </View>
                        )}
                    />
                ))
            }
        </View>
    );
};

const styles = StyleSheet.create({
    listHeader: {
        borderLeftColor: Colors.cyan30,
        borderLeftWidth: 3,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        fontSize: 20,
        color: Colors.cyan10,
    },
});

export default Messages;
