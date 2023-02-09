import React, {useContext, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../translation/translations";
import {Checkbox, Colors, Text, View} from "react-native-ui-lib";
import {Appbar, List} from 'react-native-paper';
import PTRView from 'react-native-pull-to-refresh';
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import {
    getApplicants,
    setRecruitment,
    getAll as getAllRecruitments,
    getApplicant
} from "../../redux/Recruitment/actions";
import {readNews, getAll, addUnreadNews, getUnreadNotices, deleteNews} from "../../redux/Notice/actions";
import Pusher from "pusher-js/react-native";
import pusherConfig from "../../constants/pusher.json";
import {Alert, Dimensions, StyleSheet, TouchableHighlight} from 'react-native';
import Loader from "../../components/Loader";
import {useFocusEffect} from "@react-navigation/native";
import {getApplications, setApplication} from "../../redux/Application/actions";

const { height } = Dimensions.get('window');

const Notifications = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const { notices, loading } = useSelector(state => state.notice);
    const {user} = useSelector(state => state.auth);
    const pusher = new Pusher(pusherConfig.key, pusherConfig);
    const chatChannel = pusher.subscribe('chat');
    const [ selectionMode, setSelectionMode ] = useState(false);
    const [ selectedNews, setSelectedNews ] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getAll());
            dispatch(getUnreadNotices())
        }, [])
    );

    chatChannel.bind(`news-${user.id}`, () => {
        dispatch(addUnreadNews());
    });

    const deleteClickHandle = () => {
        if(selectedNews.length > 0) dispatch(deleteNews(selectedNews));
        else alert(t['alert']['no_selected']);
    }

    return (
        <View style={styles.container}>
            <Loader isLoading={loading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['title']['news']} color={Colors.white}/>
                {
                    selectionMode && (
                        <>
                            <Appbar.Action icon="close" onPress={() => setSelectionMode(false)} color={Colors.white} />
                            <Appbar.Action icon="check-all" onPress={() => {
                                if(selectedNews.length !== notices.length) setSelectedNews(notices.map(news => news.id))
                                else setSelectedNews([]);
                            }} color={Colors.white} />
                            <Appbar.Action icon="delete" onPress={() => {
                                return Alert.alert(
                                    t['alert']['confirm'],
                                    t['alert']['are_you_sure_to_delete_all_news'],
                                    [
                                        {
                                            text: t['action']['yes'],
                                            onPress: () => {
                                                deleteClickHandle();
                                                setSelectionMode(false);
                                            },
                                        },
                                        {
                                            text: t['action']['no'],
                                        },
                                    ]
                                );
                            }} color={Colors.white} />
                        </>
                    )
                }
            </Appbar.Header>
            <PTRView onRefresh={() => dispatch(getAll())}>
                {
                    !(typeof notices !== 'undefined' && notices.length > 0) && (
                        <View style={{ marginTop: height / 3 }}>
                            <View center marginT-s5>
                                <Ionicons name={'notifications'} size={50} color={Colors.grey30}/>
                            </View>
                            <Text center margin-s2 text70> {t['title']['no_data']} </Text>
                        </View>
                    )
                }
                {
                    typeof notices !== 'undefined' && notices.length > 0 && notices.map((news, index) => (
                        <List.Item
                            key={index}
                            title={t['title']['news']}
                            description={news.message}
                            style={{ borderLeftWidth: 3, marginLeft: 1, marginVertical: 2, borderLeftColor: news.read ? Colors.cyan30 : Colors.red30 }}
                            left={props => (
                                <View center>
                                    {
                                        selectionMode ? (
                                            <Checkbox
                                                value={selectedNews.includes(news.id)}
                                                onValueChange={(value) => {
                                                    if(value) setSelectedNews([...selectedNews, news.id]);
                                                    else setSelectedNews(selectedNews.filter(item => news.id !== item))
                                                }}
                                            />
                                        ) : (
                                            <Ionicons
                                                name={'notifications'}
                                                size={30}
                                                color={ news.read ? Colors.cyan30 : Colors.red30 }
                                            />
                                        )
                                    }
                                </View>
                            )}
                            onLongPress={() => {
                                if(!selectionMode) {
                                    setSelectionMode(true);
                                    setSelectedNews([news.id]);
                                }
                            }}
                            onPress={() => {
                                if(selectionMode) {
                                    if(selectedNews.includes(news.id)) setSelectedNews(selectedNews.filter(item => news.id !== item))
                                    else setSelectedNews([...selectedNews, news.id]);
                                }
                                else {
                                    dispatch(readNews(news.id));
                                    let type = news['type'].split("/");
                                    // notices for producer
                                    if(type[0] === 'recruitment_applicants_view') {
                                        dispatch(setRecruitment(type[1]));
                                        dispatch(getApplicants(type[1], () => navigation.navigate('RecruitmentMain', { screen: 'RecruitmentApplicants' })));
                                    }
                                    else if(type[0] === 'recruitment_result_view') {
                                        dispatch(setRecruitment(type[1]));
                                        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentResult' } });
                                    }
                                    else if(type[0] === 'recruitment_detail_view') {
                                        dispatch(setRecruitment(type[1]));
                                        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentPreview' } });
                                    }
                                    // notices for worker
                                    else if(type[0] === 'application_detail_view') {
                                        dispatch(setApplication(type[1], () => navigation.navigate('Applications', { screen: 'ApplicationDetail' })));
                                    }
                                    else if(type[0] === 'matter_review_view' || type[0] === 'result_detail_view') {
                                        dispatch(setApplication(type[1], () => navigation.navigate('ApplicationDetail')));
                                    }
                                }
                            }}
                            right={props => (
                                <View center>
                                    <Text>{dayjs(news.created_at).format('YYYY/MM/DD') }</Text>
                                    <Text>{dayjs(news.created_at).format('HH:mm') }</Text>
                                </View>
                            )}
                        />
                    ))
                }
            </PTRView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
    listHeader: {
        borderLeftColor: Colors.cyan30,
        borderLeftWidth: 3,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        fontSize: 20,
        color: Colors.cyan10,
    },
});

export default Notifications;
