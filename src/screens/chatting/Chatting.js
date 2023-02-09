import * as React from 'react';
import {Appbar, TextInput} from 'react-native-paper';
import {Colors, Spacings, Text, View} from "react-native-ui-lib";
import {Dimensions, StyleSheet} from "react-native";
import moment from "moment";
import {useContext} from "react";
import {LocalizationContext} from "../../translation/translations";
import pusherConfig from '../../constants/pusher.json';
import Pusher from "pusher-js/react-native";
import {useDispatch, useSelector} from "react-redux";
import {useFocusEffect} from "@react-navigation/native";
import {getMessages, removeMessages, receive, send} from "../../redux/Chat/actions";
import Ionicons from "react-native-vector-icons/Ionicons";
import InfiniteScroll from "react-native-infinite-scroll";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from "../../components/Loader";

const { width, height } = Dimensions.get('window');

const Chatting = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {user} = useSelector(state => state.auth);
    const {receiver, messages, recruitment_id, loading} = useSelector(state => state.chat);
    const [msg, setMsg] = React.useState({
        id: 10000000000,
        recruitment_id: recruitment_id,
        sender_id: user.id,
        receiver_id: receiver.id,
        owner_id: user.id,
        message_id: '',
        message: '',
        read: 0,
        created_at: '',
    });

    const pusher = new Pusher(pusherConfig.key, pusherConfig);
    const chatChannel = pusher.subscribe('chat');

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getMessages(0, 10, receiver.id, recruitment_id));
        }, [])
    );

    chatChannel.bind(`receive-${user.id}`, (data) => {
        if(data.recruitment_id === recruitment_id && navigation.isFocused() === true) dispatch(receive(data));
    });

    const sendMessage = () => {
        dispatch(send({
            ...msg,
            message_id: 'sending-'+messages.length,
            created_at: new Date()
        }));
        setMsg({ ...msg, message: '' });
    }

    const getMessage = () => {
        dispatch(getMessages(messages.length, 10, receiver.id, recruitment_id));
    }

    return (
        <View style={styles.container}>
            <Loader isLoading={loading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.navigate('ChatMain')} color={Colors.white} />
                <Appbar.Content title={receiver['family_name']} color={Colors.white}/>
                <Appbar.Action icon="delete" onPress={() => {
                    dispatch(removeMessages(recruitment_id, receiver.id))
                }} color={Colors.white} />
            </Appbar.Header>
            <InfiniteScroll
                horizontal={false}
                onLoadMoreAsync={getMessage}
                distanceFromEnd={10}
                style={{ transform: [{ scaleY: -1 }] }}
            >
                {
                    !(typeof messages !== 'undefined' && messages.length > 0) && (
                        <View center style={{ height: '100%', transform: [{ scaleY: -1 }], marginBottom: height/1.8 }}>
                            <MaterialCommunityIcons name={'message-text-clock-outline'} size={80} color={Colors.grey30}/>
                            <Text center margin-s1 text70> {t['title']['no_data']} </Text>
                        </View>
                    )
                }
                {
                    messages.sort((a,b) => b.id-a.id).map((message, index) => {
                        return message.sender_id === user.id ? (
                            <View key={index} flex right style={{ transform: [{ scaleY: -1 }] }}>
                                <View style={styles.sendMessage}>
                                    <Text color={Colors.white}>
                                        {message.message}
                                    </Text>
                                    <View row marginT-s3>
                                        <Ionicons name={message.read ? 'ios-checkmark-done-sharp' : 'time'} size={18} color={Colors.white} />
                                        <Text marginL-s2 color={Colors.white}>{moment(message.created_at).format('YYYY-MM-DD kk:mm:ss')}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View key={index} flex left style={{ transform: [{ scaleY: -1 }] }}>
                                <View style={styles.receiveMessage}>
                                    <Text>
                                        {message.message}
                                    </Text>
                                    <View row marginT-s3>
                                        <Ionicons name={message.read ? 'ios-checkmark-done-sharp' : 'time'} size={18} color={Colors.cyan30} />
                                        <Text marginL-s2>{moment(message.created_at).format('YYYY-MM-DD kk:mm:ss')}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
            </InfiniteScroll>
            <View>
                <TextInput
                    label={t['chatting']['enter_message']}
                    right={<TextInput.Icon name="send" onPress={sendMessage} color={Colors.cyan30}/>}
                    mode={'outlined'}
                    activeOutlineColor={Colors.cyan30}
                    outlineColor={Colors.cyan30}
                    style={styles.input}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') sendMessage()
                    }}
                    value={msg.message}
                    onChangeText={value => setMsg({
                        ...msg,
                        message: value
                    })}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
    sendMessage: {
        margin: Spacings.s2,
        padding: Spacings.s5,
        paddingVertical: Spacings.s2,
        width: width * 0.6,
        backgroundColor: Colors.cyan20,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 50,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 0,
    },
    receiveMessage: {
        margin: Spacings.s2,
        paddingLeft: 30,
        paddingVertical: Spacings.s2,
        width: width * 0.6,
        backgroundColor: Colors.grey60,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 35,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 35,
    },
    input: {
        margin: Spacings.s1,
        backgroundColor: Colors.white,
    }
});

export default Chatting;
