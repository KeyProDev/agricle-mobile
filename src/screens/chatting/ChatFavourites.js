import React, {useContext, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../translation/translations";
import {Avatar, Colors, Spacings, Text, View} from "react-native-ui-lib";
import {useFocusEffect} from "@react-navigation/native";
import {enterChatting, getFavourites} from '../../redux/Chat/actions';
import {Appbar, Badge, List, TextInput} from 'react-native-paper';
import {serverURL} from "../../constants/config";
import {Dimensions, ScrollView} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const userIcon = require('../../assets/images/user.png');
const { height } = Dimensions.get('window');

const ChatFavourites = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {favourites, unreadMessages} = useSelector(state => state.chat);
    const {user} = useSelector(state => state.auth);
    const [keyword, setKeyword] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getFavourites());
        }, [])
    );

    let users = [];
    if(favourites) {
        if(keyword === '') users = favourites;
        else users = favourites.filter(favourite => favourite.family_name.indexOf(keyword) !== -1);
    }

    return (
        <View>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['header']['chatting']['free']} color={Colors.white}/>
            </Appbar.Header>
            {
                !(typeof favourites !== 'undefined' && favourites.length > 0) && (
                    <View style={{ marginTop: height / 3 }}>
                        <View center marginT-s5>
                            <FontAwesome5 name={'box-open'} size={50} color={Colors.grey30} />
                        </View>
                        <Text center margin-s2 text70> {t['title']['no_data']} </Text>
                    </View>
                )
            }

            <View>
                <TextInput
                    label={t['applications']['search_label']}
                    mode={'outlined'}
                    activeOutlineColor={Colors.cyan10}
                    outlineColor={Colors.cyan10}
                    style={{
                        margin: Spacings.s1,
                        backgroundColor: Colors.white,
                        height: 40
                    }}
                    value={keyword}
                    onChangeText={value => setKeyword(value)}
                />
            </View>
            <ScrollView>
                {
                    users.length > 0 && users.map((favourite, index) => (
                        <List.Item
                            key={index}
                            title={user.role === 'producer' ? favourite.nickname : favourite.family_name}
                            // description={favourite.bio}
                            left={props => (
                                <View row>
                                    <Avatar
                                        size={50}
                                        source={
                                            favourite.avatar === 'default.png' ? userIcon : {uri: serverURL+'avatars/'+favourite.avatar}
                                        }
                                        label={'IMG'}
                                        style={{width: 400, height: 400}}
                                    />
                                    {
                                        unreadMessages.filter(message => message.sender.id === favourite.id).length > 0 && (
                                            <Badge size={24} style={{ marginLeft: -10, marginBottom: 20 }}>
                                                {unreadMessages.filter(message => message.sender.id === favourite.id).length}
                                            </Badge>
                                        )
                                    }
                                </View>
                            )}
                            onPress={() => {
                                dispatch(enterChatting(favourite['id'], 0, () => {
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

export default ChatFavourites;
