import * as React from 'react';
import {Appbar, Text} from 'react-native-paper';
import {Colors, View, TabController} from "react-native-ui-lib";
import {Dimensions, ScrollView, StyleSheet} from "react-native";
import {useContext, useEffect, useState} from "react";
import PTRView from 'react-native-pull-to-refresh';
import {LocalizationContext} from "../../translation/translations";
import {useDispatch, useSelector} from "react-redux";
import {errors, getAll, setRecruitment} from "../../redux/Recruitment/actions";
import {useFocusEffect} from "@react-navigation/native";
import DraftItem from "../../components/DraftItem";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import CollectingItem from "../../components/CollectingItem";
import WorkingItem from "../../components/WorkingItem";
import CompleteItem from "../../components/CompleteItem";
import Loader from "../../components/Loader";
import {recruitmentStatusColor} from "../../constants/config";

const { height } = Dimensions.get('window');

const List = ({ navigation }) => {
    const { t } = useContext(LocalizationContext);
    const dispatch = useDispatch();
    const recruitment = useSelector(state => state.recruitment);
    const [ loading, setLoading ] = useState(false);

    const draftRecruitments = recruitment.recruitments.filter(recruitment => recruitment.status === 'draft');
    const collectingRecruitments = recruitment.recruitments.filter(recruitment => recruitment.status === 'collecting');
    const workingRecruitments = recruitment.recruitments.filter(recruitment => recruitment.status === 'working');
    const completedRecruitments = recruitment.recruitments.filter(recruitment => recruitment.status === 'completed');
    const canceledRecruitments = recruitment.recruitments.filter(recruitment => recruitment.status === 'canceled');
    const deletedRecruitments = recruitment.recruitments.filter(recruitment => recruitment.status === 'deleted');

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getAll());
        }, [])
    );

    useEffect(() => {
        setLoading(recruitment.loading)
    }, [recruitment.loading]);

    return (
        <View style={styles.container}>
            <Loader isLoading={loading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['title']['recruitment_list']} color={Colors.white}/>
                <Appbar.Action icon={'plus'} onPress={() => {
                    dispatch(setRecruitment(null));
                    dispatch(errors('', {}));
                    navigation.navigate('RecruitmentCreate');
                }} color={Colors.white} />
            </Appbar.Header>
            <TabController
                items={[
                    {label: t['recruitment']['status']['draft'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: recruitmentStatusColor.draft }},
                    {label: t['recruitment']['status']['collecting'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: recruitmentStatusColor.collecting }},
                    {label: t['recruitment']['status']['working'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: recruitmentStatusColor.working }},
                    {label: t['recruitment']['status']['completed'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: recruitmentStatusColor.completed }},
                    {label: t['recruitment']['status']['canceled'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: recruitmentStatusColor.canceled }},
                    {label: t['recruitment']['status']['deleted'], style: { borderWidth: 3, padding: 5, borderRadius: 10, margin: 5, borderColor: recruitmentStatusColor.deleted }},
                ]}
            >
                <TabController.TabBar indicatorStyle={{ height: 0 }} enableShadow={false}/>
                <View flex>
                    <TabController.TabPage index={0} lazy>
                        <PTRView onRefresh={() => dispatch(getAll())}>
                            <View paddingH-s3>
                                {
                                    !(typeof draftRecruitments !== 'undefined' && draftRecruitments.length > 0) && (
                                        <View center style={{ marginTop: height/4 }}>
                                            <SimpleLineIcons name={'social-dropbox'} size={100} color={Colors.grey30}/>
                                            <Text center margin-s5 text70> {t['title']['no_data']} </Text>
                                        </View>
                                    )
                                }
                                {
                                    draftRecruitments.map((item, index) => (
                                        <DraftItem key={index} recruitment={item} navigation={navigation}/>
                                    ))
                                }
                            </View>
                        </PTRView>
                    </TabController.TabPage>
                    <TabController.TabPage index={1} lazy>
                        <PTRView onRefresh={() => dispatch(getAll())}>
                            <View paddingH-s3>
                                {
                                    !(typeof collectingRecruitments !== 'undefined' && collectingRecruitments.length > 0) && (
                                        <View center style={{ marginTop: height/4 }}>
                                            <SimpleLineIcons name={'social-dropbox'} size={100} color={Colors.grey30}/>
                                            <Text center margin-s5 text70> {t['title']['no_data']} </Text>
                                        </View>
                                    )
                                }
                                {
                                    collectingRecruitments.map((item, index) => (
                                        <CollectingItem key={index} recruitment={item} navigation={navigation} refresh={() => dispatch(getAll())}/>
                                    ))
                                }
                            </View>
                        </PTRView>
                    </TabController.TabPage>
                    <TabController.TabPage index={2} lazy>
                        <PTRView onRefresh={() => dispatch(getAll())}>
                            <View paddingH-s3>
                                {
                                    !(typeof workingRecruitments !== 'undefined' && workingRecruitments.length > 0) && (
                                        <View center style={{ marginTop: height/4 }}>
                                            <SimpleLineIcons name={'social-dropbox'} size={100} color={Colors.grey30}/>
                                            <Text center margin-s5 text70> {t['title']['no_data']} </Text>
                                        </View>
                                    )
                                }
                                {
                                    workingRecruitments.map((item, index) => (
                                        <WorkingItem key={index} recruitment={item} navigation={navigation}/>
                                    ))
                                }
                            </View>
                        </PTRView>
                    </TabController.TabPage>
                    <TabController.TabPage index={3} lazy>
                        <PTRView onRefresh={() => dispatch(getAll())}>
                            <View paddingH-s3>
                                {
                                    !(typeof completedRecruitments !== 'undefined' && completedRecruitments.length > 0) && (
                                        <View center style={{ marginTop: height/4 }}>
                                            <SimpleLineIcons name={'social-dropbox'} size={100} color={Colors.grey30}/>
                                            <Text center margin-s5 text70> {t['title']['no_data']} </Text>
                                        </View>
                                    )
                                }
                                {
                                    completedRecruitments.map((item, index) => (
                                        <CompleteItem key={index} recruitment={item} navigation={navigation}/>
                                    ))
                                }
                            </View>
                        </PTRView>
                    </TabController.TabPage>
                    <TabController.TabPage index={4} lazy>
                        <PTRView onRefresh={() => dispatch(getAll())}>
                            <View paddingH-s3>
                                {
                                    !(typeof canceledRecruitments !== 'undefined' && canceledRecruitments.length > 0) && (
                                        <View center style={{ marginTop: height/4 }}>
                                            <SimpleLineIcons name={'social-dropbox'} size={100} color={Colors.grey30}/>
                                            <Text center margin-s5 text70> {t['title']['no_data']} </Text>
                                        </View>
                                    )
                                }
                                {
                                    canceledRecruitments.map((item, index) => (
                                        <CompleteItem key={index} recruitment={item} navigation={navigation}/>
                                    ))
                                }
                            </View>
                        </PTRView>
                    </TabController.TabPage>
                    <TabController.TabPage index={5} lazy>
                        <PTRView onRefresh={() => dispatch(getAll())}>
                            <View paddingH-s3>
                                {
                                    !(typeof deletedRecruitments !== 'undefined' && deletedRecruitments.length > 0) && (
                                        <View center style={{ marginTop: height/4 }}>
                                            <SimpleLineIcons name={'social-dropbox'} size={100} color={Colors.grey30}/>
                                            <Text center margin-s5 text70> {t['title']['no_data']} </Text>
                                        </View>
                                    )
                                }
                                {
                                    deletedRecruitments.map((item, index) => (
                                        <CompleteItem key={index} recruitment={item} navigation={navigation}/>
                                    ))
                                }
                            </View>
                        </PTRView>
                    </TabController.TabPage>
                </View>
            </TabController>
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

export default List;
