import React, {useContext, useState} from 'react';
import {Alert, Dimensions, Image, StyleSheet} from 'react-native';
import {Card, Colors, Text, View} from 'react-native-ui-lib';
import {Appbar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {LocalizationContext} from '../../../translation/translations';
import {useFocusEffect} from '@react-navigation/native';
import {getFavouriteMatters, getMatters, removeFavourite, setFavourite, setMatter} from '../../../redux/Matter/actions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {format_address, serverURL} from '../../../constants/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InfiniteScroll from 'react-native-infinite-scroll';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {formatDate, formatDay, formatTime} from "../../../utils/core_func";

const emptyImage = require('../../../assets/images/empty.jpg');
const { width, height } = Dimensions.get('window');

const FavouriteMatter = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {favouriteMatters} = useSelector(state => state.matter);
    const [ onLoadImage, setLoadImage ] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getFavouriteMatters());
        }, [])
    );

    const loadMorePage = () => {
        dispatch(getMatters(favouriteMatters.length, 10));
    };

    const handleMatterClick = (matterId) => {
        dispatch(setMatter(matterId));
        navigation.navigate('MatterApply');
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['header']['favourite_recruitment']} color={Colors.white}/>
                <Appbar.Action icon={'sort'} onPress={() => {}} color={Colors.white} />
            </Appbar.Header>
            <InfiniteScroll
                horizontal={false}  //true - if you want in horizontal
                onLoadMoreAsync={loadMorePage}
                distanceFromEnd={10} // distance in density-independent pixels from the right end
            >
                {
                    favouriteMatters.length === 0 && (
                        <View style={{ marginTop: height / 3 }}>
                            <View center marginT-s5>
                                <FontAwesome5 name={'box-open'} size={50} color={Colors.grey30} />
                            </View>
                            <Text center margin-s2 text70> {t['favourites']['no_favourite']} </Text>
                        </View>
                    )
                }
                {
                    favouriteMatters.length>0 && favouriteMatters.map((matter, index) => (
                        <Card
                            key={index}
                            borderRadius={10}
                            padding-s2
                            margin-s2
                            onPress={() => handleMatterClick(matter.id)}
                            containerStyle={{ backgroundColor: Colors.cyan80 }}
                        >
                            <View row flex centerV>
                                <View flex-2 marginR-s2>
                                    <Image
                                        source={onLoadImage[matter.id] && matter.image !== '' ? {uri: serverURL + 'uploads/recruitments/sm_' + matter.image} : emptyImage}
                                        style={{width: width / 3, height: width / 4, borderRadius: 5}}
                                        onLoad={() => setLoadImage({...onLoadImage, [matter.id]: true })}
                                    />
                                    {/*<View center style={{ marginTop: -25 }}>*/}
                                    {/*    <Badge backgroundColor={applicationStatusColor[matter.status]} label={t['applicants']['status'][matter.status]}/>*/}
                                    {/*</View>*/}
                                </View>
                                <View flex-3>
                                    <View row centerV marginB-s1>
                                        <Text color={Colors.black} numberOfLines={1} style={{ width: width * 0.5 }}>
                                            {matter.title}
                                        </Text>
                                    </View>
                                    <View marginB-s1>
                                        <Text text90>
                                            {format_address(matter.post_number, matter.prefectures, matter.city, matter.workplace)}
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'calendar-text'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {formatDate(matter.work_date_start, 'symbol')}
                                            ({formatDay(matter.work_date_start, 'short')})
                                            {
                                                matter.work_date_end !== matter.work_date_start && (
                                                    <Text text90 >
                                                        &nbsp;~&nbsp; {formatDate(matter.work_date_end, 'symbol')}
                                                        ({formatDay(matter.work_date_end, 'short')})
                                                    </Text>
                                                )
                                            }
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'clock-outline'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {formatTime(matter.work_time_start, 'symbol')}
                                            &nbsp;~&nbsp;
                                            {formatTime(matter.work_time_end, 'symbol')}
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'account-group'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {matter.worker_amount}名
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'bank'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {matter.reward_type}({matter.reward_cost} 円 )・{t['recruitment']['pay_mode'][matter.pay_mode]}
                                        </Text>
                                    </View>
                                    <View row centerV>
                                        <MaterialCommunityIcons name={'train-car'} size={20} color={Colors.cyan30} />
                                        <Text marginL-s2 text90>
                                            {t['recruitment']['traffic'][matter.traffic_type]}
                                            {matter.traffic_type === 'beside' ? '('+matter.traffic_cost+' 円)' : ''}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Ionicons
                                name={'star'}
                                size={24}
                                color={Colors.cyan30}
                                style={{ position: 'absolute', bottom: 10, right: 10 }}
                                onPress={() => {
                                    return Alert.alert(
                                        t['alert']['confirm'],
                                        t['alert']['are_you_sure_to_unset_favourite_matter'],
                                        [
                                            {
                                                text: t['action']['yes'],
                                                onPress: () => {
                                                    dispatch(setFavourite(matter.id));
                                                    dispatch(removeFavourite(matter.id));
                                                },
                                            },
                                            {
                                                text: t['action']['no'],
                                            },
                                        ]
                                    );
                                }}
                            />
                        </Card>

                    ))
                }
            </InfiniteScroll>
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

export default FavouriteMatter;
