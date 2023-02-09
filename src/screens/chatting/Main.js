import React, {useContext} from 'react';
import {Appbar, Avatar, Badge, Card, Paragraph} from 'react-native-paper';
import {Colors, View} from "react-native-ui-lib";
import {Dimensions, ScrollView, StyleSheet} from 'react-native';
import {LocalizationContext} from "../../translation/translations";
import {useDispatch, useSelector} from "react-redux";
import {useFocusEffect} from "@react-navigation/native";
import {getUnreadMessages} from "../../redux/Chat/actions";

const recruitmentChatting = require('../../assets/images/recruitmentChatting.png');
const userChatting = require('../../assets/images/userChatting.jpg');

const { width, height } = Dimensions.get('window');

const Main = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);

    const { unreadMessages } = useSelector(state => state.chat);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getUnreadMessages());
        }, [])
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['header']['chatting']['favourites']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView style={{ marginBottom: 50 }}>
                <Card style={{ marginHorizontal: 20, marginTop: 20 }} onPress={() => navigation.navigate('ChatRecruitments')}>
                    <Card.Title
                        title={t['header']['chatting']['favourites']}
                        left={(props) => (
                            <View row>
                                <Avatar.Icon {...props} backgroundColor={Colors.cyan30} icon="playlist-star" />
                                {
                                    unreadMessages.filter(message => parseInt(message.recruitment_id) > 0).length > 0 && (
                                        <Badge size={24} style={{ marginLeft: -10, marginBottom: 20 }}>
                                            {unreadMessages.filter(message => parseInt(message.recruitment_id) !== 0).length}
                                        </Badge>
                                    )
                                }
                            </View>
                        )}
                    />
                    <Card.Content>
                        <Paragraph>{t['header']['chatting']['favourites']}</Paragraph>
                    </Card.Content>
                    <Card.Cover source={recruitmentChatting} />
                </Card>
                <Card style={{ marginHorizontal: 20, marginVertical: 20 }} onPress={() => navigation.navigate('ChatFavourites')}>
                    <Card.Title
                        title={t['header']['chatting']['free']}
                        left={(props) => (
                            <View row>
                                <Avatar.Icon {...props} backgroundColor={Colors.cyan30} icon="account-switch-outline" />
                                {
                                    unreadMessages.filter(message => parseInt(message.recruitment_id) === 0).length > 0 && (
                                        <Badge size={24} style={{ marginLeft: -10, marginBottom: 20 }}>
                                            {unreadMessages.filter(message => parseInt(message.recruitment_id) === 0).length}
                                        </Badge>
                                    )
                                }
                            </View>
                        )}
                    />
                    <Card.Content>
                        <Paragraph>{t['header']['chatting']['free']}</Paragraph>
                    </Card.Content>
                    <Card.Cover source={userChatting} />
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: height,
        resizeMode: 'contain',
    },
});

export default Main;
