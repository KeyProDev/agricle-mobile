import React, {useContext, useState} from 'react';
import {Checkbox, Colors, Text, View, ExpandableSection, Card, Spacings} from 'react-native-ui-lib';
import {Appbar, Searchbar, Button, Modal, TextInput} from 'react-native-paper';
import PTRView from 'react-native-pull-to-refresh';
import InfiniteScroll from 'react-native-infinite-scroll';
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../translation/translations";
import {useFocusEffect} from "@react-navigation/native";
import {getMatters, setMatter, setFavourite} from "../../redux/Matter/actions";
import {format_address, serverURL} from "../../constants/config";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Dimensions, Image, StyleSheet, Alert} from 'react-native';
import {getAll} from "../../redux/Notice/actions";
import {deleteRecruitment} from "../../redux/Recruitment/actions";
import Loader from "../../components/Loader";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {formatDate, formatDay, formatTime} from "../../utils/core_func";

const emptyImage = require('../../assets/images/empty.jpg');
const { width, height } = Dimensions.get('window');

const List = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const { matters, loading } = useSelector(state => state.matter);
    const [ openFilterModal, setOpenFilterModal ] = useState(false);
    const [conditions, setConditions] = useState({});
    const [ onLoadImage, setLoadImage ] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getMatters());
        }, [])
    );

    const loadMorePage = () => {
        dispatch(getMatters(matters.length, 10));
    };

    const handleConditionsChange = (key) => (value) => {
        setConditions({
            ...conditions,
            [key]: value,
        })
    }

    const handleMatterClick = (matterId) => {
        dispatch(setMatter(matterId));
        navigation.navigate('MatterApply');
    }

    const handleFavouriteClick = (matterId, is_favourite) => {
        return Alert.alert(
            t['alert']['confirm'],
            is_favourite ? t['alert']['are_you_sure_to_unset_favourite_matter'] : t['alert']['are_you_sure_to_set_favourite_matter'],
            [
                {
                    text: t['action']['yes'],
                    onPress: () => {
                        dispatch(setFavourite(matterId))
                    },
                },
                {
                    text: t['action']['no'],
                },
            ]
        );
    }

    return (
        <View style={styles.container}>
            <Loader isLoading={loading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['header']['matters_view']} color={Colors.white}/>
                <Appbar.Action icon={'filter'} onPress={() => {setOpenFilterModal(!openFilterModal)}} color={Colors.white} />
            </Appbar.Header>
            <PTRView onRefresh={() => dispatch(getMatters())}>
                <InfiniteScroll
                    horizontal={false}  //true - if you want in horizontal
                    onLoadMoreAsync={loadMorePage}
                    distanceFromEnd={10} // distance in density-independent pixels from the right end
                >
                    {
                        matters.length === 0 && (
                            <View style={{ marginTop: height / 3 }}>
                                <View center marginT-s5>
                                    <FontAwesome5 name={'box-open'} size={50} color={Colors.grey30} />
                                </View>
                                <Text center margin-s2 text70> {t['title']['no_data']} </Text>
                            </View>
                        )
                    }
                    {
                        matters.length>0 && matters.map((matter, index) => (
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
                                            <Text color={Colors.black} numberOfLines={1} style={{ width: width * 0.4 }}>
                                                {matter.title}
                                            </Text>
                                            <Text text90 color={Colors.blue30}>
                                                ({matter.producer_name})
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
                                    name={matter.is_favourite ? 'star' : 'star-outline'}
                                    size={24}
                                    color={Colors.cyan30}
                                    style={{ position: 'absolute', bottom: 10, right: 10 }}
                                    onPress={() => handleFavouriteClick(matter.id, matter.is_favourite)}
                                />
                            </Card>
                        ))
                    }
                </InfiniteScroll>
            </PTRView>
            <Modal
                visible={openFilterModal}
                onDismiss={() => {
                    setOpenFilterModal(false);
                }}
                contentContainerStyle={styles.filterModal}
            >
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
                    value={conditions.keyword}
                    onChangeText={handleConditionsChange('keyword')}
                />
                <View row spread centerV margin-s3>
                    <Text cyan30 text60>
                        {t['recruitment']['reward']['title']}
                    </Text>
                </View>
                <View row center>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('cash')}
                            value={conditions.cash}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['pay_mode']['cash']}
                        </Text>
                    </View>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('card')}
                            value={conditions.card}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['pay_mode']['card']}
                        </Text>
                    </View>
                </View>
                <View row spread centerV margin-s3>
                    <Text cyan30 text60>
                        {t['recruitment']['environment']}
                    </Text>
                </View>
                <View row center>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('traffic_cost')}
                            value={conditions.traffic_cost}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['traffic']['title']}
                        </Text>
                    </View>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('toilet')}
                            value={conditions.toilet}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['toilet']['title']}
                        </Text>
                    </View>
                </View>
                <View row center>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('park')}
                            value={conditions.park}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['park']['title']}
                        </Text>
                    </View>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('insurance')}
                            value={conditions.insurance}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['insurance']['title']}
                        </Text>
                    </View>
                </View>
                <View row spread centerV margin-s3>
                    <Text cyan30 text60>
                        {t['recruitment']['period']['title']}
                    </Text>
                </View>
                <View row center>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('day1')}
                            value={conditions.day1}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['period']['day1']}
                        </Text>
                    </View>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('day2_3')}
                            value={conditions.day2_3}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['period']['day2_3']}
                        </Text>
                    </View>
                </View>
                <View row center>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('in_week')}
                            value={conditions.in_week}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['period']['in_week']}
                        </Text>
                    </View>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('week_month')}
                            value={conditions.week_month}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['period']['week_month']}
                        </Text>
                    </View>
                </View>
                <View row center>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('month1_3')}
                            value={conditions.month1_3}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['period']['month1_3']}
                        </Text>
                    </View>
                    <View row style={{ width: width * 0.4 }}>
                        <Checkbox
                            marginR-s2
                            color={Colors.cyan30}
                            onValueChange={handleConditionsChange('half_year')}
                            value={conditions.half_year}
                        />
                        <Text text70 marginR-s3 $textDefault marginB-s2>
                            {t['recruitment']['period']['half_year']}
                        </Text>
                    </View>
                </View>
                <View center paddingV-s1>
                    <Button
                        mode={'contained'}
                        style={{ backgroundColor: Colors.cyan10, color: Colors.white, width: 200 }}
                        center
                        onPress={() => {
                            dispatch(getMatters(0, 10, conditions));
                            setOpenFilterModal(false);
                        }}
                        icon={'note-search'}
                    >
                        <Text text70>
                            {t['action']['search']}
                        </Text>
                    </Button>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: height,
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
    filterModal: {
        backgroundColor: 'white',
        borderRadius: 20,
        margin: 20,
        padding: 10
    },

});

export default List;
