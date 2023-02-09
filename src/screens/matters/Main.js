import React, {useContext, useState} from 'react';
import {Checkbox, Colors, Text, View, ExpandableSection, Card} from "react-native-ui-lib";
import {Appbar, Searchbar, Button} from "react-native-paper";
import {Dimensions, Image, StyleSheet} from 'react-native';
import InfiniteScroll from 'react-native-infinite-scroll';
import Ionicons from "react-native-vector-icons/Ionicons";
import {useDispatch, useSelector} from "react-redux";
import {LocalizationContext} from "../../translation/translations";
import {useFocusEffect} from "@react-navigation/native";
import {getMatters, setMatter} from "../../redux/Matter/actions";
import {serverURL} from "../../constants/config";
import dayjs from 'dayjs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const emptyImage = require('../../assets/images/empty.jpg');
const { width } = Dimensions.get('window');

const Main = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {matters} = useSelector(state => state.matter);
    const [conditions, setConditions] = useState({});
    const [openEquipmentView, setOpenEquipmentView] = useState(false);
    const [openRewardView, setOpenRewardView] = useState(false);
    const [openPeriodView, setOpenPeriodView] = useState(false);
    const [ onLoadImage, setLoadImage ] = useState({});

    const initializeScreen = () => {
        setConditions({})
        setOpenEquipmentView(false);
        setOpenRewardView(false);
        setOpenPeriodView(false);
        dispatch(getMatters());
    }

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

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.green30 }}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['header']['matters_view']} color={Colors.white}/>
                <Appbar.Action icon={'refresh'} onPress={initializeScreen} color={Colors.white} />
            </Appbar.Header>
            <InfiniteScroll
                horizontal={false}  //true - if you want in horizontal
                onLoadMoreAsync={loadMorePage}
                distanceFromEnd={10} // distance in density-independent pixels from the right end
            >
                <View row spread margin-s3>
                    <Searchbar
                        placeholder={t['matters']['search_label']}
                        onChangeText={handleConditionsChange('keyword')}
                        value={conditions.keyword}
                        style={{ width: width * 0.7, height: 40 }}
                    />
                    <Button color={Colors.green10} mode={'contained'} style={{height: 40}} center
                            onPress={() => {
                                dispatch(getMatters(0, 10, conditions))
                            }}
                    >
                        <Ionicons name={'search'} size={16} color={Colors.white} />
                        <Text text65 color={Colors.white}>{t['action']['search']}</Text>
                    </Button>
                </View>
                <ExpandableSection
                    expanded={openRewardView}
                    sectionHeader={
                        <View row spread centerV margin-s3>
                            <Text green30 text60>
                                {t['recruitment']['reward']['title']}
                            </Text>
                            <Ionicons name={ openRewardView ? 'ios-chevron-down' : 'ios-chevron-up'} size={30} color={Colors.green30} />
                        </View>
                    }
                    onPress={() => setOpenRewardView(!openRewardView)}
                >
                    <View row center>
                        <View row style={{ width: width * 0.4 }}>
                            <Checkbox
                                marginR-s2
                                color={Colors.green30}
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
                                color={Colors.green30}
                                onValueChange={handleConditionsChange('card')}
                                value={conditions.card}
                            />
                            <Text text70 marginR-s3 $textDefault marginB-s2>
                                {t['recruitment']['pay_mode']['card']}
                            </Text>
                        </View>
                    </View>
                </ExpandableSection>
                <ExpandableSection
                    expanded={openEquipmentView}
                    sectionHeader={
                        <View row spread centerV margin-s3>
                            <Text green30 text60>
                                {t['recruitment']['environment']}
                            </Text>
                            <Ionicons name={ openEquipmentView ? 'ios-chevron-down' : 'ios-chevron-up'} size={30} color={Colors.green30} />
                        </View>
                    }
                    onPress={() => setOpenEquipmentView(!openEquipmentView)}
                >
                    <View row center>
                        <View row style={{ width: width * 0.4 }}>
                            <Checkbox
                                marginR-s2
                                color={Colors.green30}
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
                                color={Colors.green30}
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
                                color={Colors.green30}
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
                                color={Colors.green30}
                                onValueChange={handleConditionsChange('insurance')}
                                value={conditions.insurance}
                            />
                            <Text text70 marginR-s3 $textDefault marginB-s2>
                                {t['recruitment']['insurance']['title']}
                            </Text>
                        </View>
                    </View>
                </ExpandableSection>
                <ExpandableSection
                    expanded={openPeriodView}
                    sectionHeader={
                        <View row spread centerV margin-s3>
                            <Text green30 text60>
                                {t['recruitment']['period']['title']}
                            </Text>
                            <Ionicons name={ openPeriodView ? 'ios-chevron-down' : 'ios-chevron-up'} size={30} color={Colors.green30} />
                        </View>
                    }
                    onPress={() => setOpenPeriodView(!openPeriodView)}
                >
                    <View row center>
                        <View row style={{ width: width * 0.4 }}>
                            <Checkbox
                                marginR-s2
                                color={Colors.green30}
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
                                color={Colors.green30}
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
                                color={Colors.green30}
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
                                color={Colors.green30}
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
                                color={Colors.green30}
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
                                color={Colors.green30}
                                onValueChange={handleConditionsChange('half_year')}
                                value={conditions.half_year}
                            />
                            <Text text70 marginR-s3 $textDefault marginB-s2>
                                {t['recruitment']['period']['half_year']}
                            </Text>
                        </View>
                    </View>
                </ExpandableSection>
                {
                    matters.length === 0 && (
                        <View>
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
                            row
                            key={index}
                            height={100}
                            borderRadius={10}
                            padding-s2
                            margin-s2
                            onPress={() => handleMatterClick(matter.id)}
                        >
                            <Image
                                source={onLoadImage[matter.id] ? {uri: serverURL + 'uploads/recruitments/' + matter.image} : emptyImage}
                                style={{width: 120, height: '100%', borderRadius: 5}}
                                onLoad={() => setLoadImage({...onLoadImage, [matter.id]: true })}
                            />
                            <View paddingL-20 flex>
                                <Text text70 color={Colors.green10}>
                                    {matter.title}
                                </Text>
                                <Text text80 color={Colors.grey10}>
                                    {matter.workplace}
                                </Text>
                                <Text text90 color={Colors.grey40}>
                                    {matter.work_date_start} ~ {matter.work_date_end}
                                </Text>
                            </View>
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

export default Main;
