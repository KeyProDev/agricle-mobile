import React, {useContext} from 'react';
import {
    BorderRadiuses,
    Card,
    Colors,
    GridList,
    Spacings,
    Text,
    View
} from "react-native-ui-lib";
import { useFocusEffect } from '@react-navigation/native';
import {ActivityIndicator, Appbar} from "react-native-paper";
import {LocalizationContext} from "../../translation/translations";
import {Dimensions, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useDispatch, useSelector} from "react-redux";
import {errors, getAll, setActiveStatus, setRecruitment} from '../../redux/Recruitment/actions';

const { height } = Dimensions.get('screen');

const Main = ({ navigation }) => {
    const { t } = useContext(LocalizationContext);
    const recruitment = useSelector(state => state.recruitment);
    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getAll());
        }, [])
    );

    const handleListShowClick = (status) => {
        dispatch(setActiveStatus(status));
        navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentList' }});
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['title']['recruitment_list']} color={Colors.white}/>
                <Appbar.Action icon={'plus'} onPress={() => {
                    dispatch(setRecruitment(null));
                    dispatch(errors('', {}));
                    navigation.navigate('RecruitmentCreate');
                }} color={Colors.white} />
            </Appbar.Header>
            <GridList
                data={[
                    {key: 'draft', title: t['recruitment']['status']['draft'], color: Colors.purple15, backgroundColor: Colors.purple40, icon: 'ios-document-text', amount: recruitment.recruitments.filter(recruitment => recruitment['status'] === 'draft').length},
                    {key: 'collecting', title: t['recruitment']['status']['collecting'], color: Colors.orange15, backgroundColor: Colors.orange40, icon: 'ios-alarm', amount: recruitment.recruitments.filter(recruitment => recruitment['status'] === 'collecting').length},
                    {key: 'working', title: t['recruitment']['status']['working'], color: Colors.red15, backgroundColor: Colors.red40, icon: 'ios-people-sharp', amount: recruitment.recruitments.filter(recruitment => recruitment['status'] === 'working').length},
                    {key: 'completed', title: t['recruitment']['status']['completed'], color: Colors.cyan15, backgroundColor: Colors.cyan40, icon: 'md-checkmark-circle', amount: recruitment.recruitments.filter(recruitment => recruitment['status'] === 'completed').length},
                ]}
                renderItem={({item}) => {
                    return (
                        <Card flex backgroundColor={item.backgroundColor} onPress={() => handleListShowClick(item.key)}>
                            <View style={styles.item}>
                                <Ionicons name={item.icon} size={50} color={item.color} />
                                <Text text60 marginT-20 color={Colors.white}>
                                    {item.title}
                                </Text>
                                {
                                    recruitment.loading ?
                                        <View flex left marginT-10 padding-s1>
                                            <ActivityIndicator size={'large'} animating={1} color={Colors.white} />
                                        </View> :
                                        <Text text30 marginT-20 color={Colors.white}>
                                            {item.amount}件
                                        </Text>
                                }
                            </View>
                        </Card>
                    );
                }}
                maxItemWidth={200}
                itemSpacing={Spacings.s10}
                listPadding={Spacings.s5}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
    list: {
        paddingTop: Spacings.s5,
    },
    item: {
        width: '100%',
        height: height / 3,
        padding: Spacings.s5,
        borderRadius: BorderRadiuses.br10
    }
});
export default Main;
