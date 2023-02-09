import React, {useContext, useState} from 'react';
import {StyleSheet, ScrollView, Dimensions} from "react-native";
import {Appbar, Card} from "react-native-paper";
import {Colors, Text, View, Image, Incubator} from "react-native-ui-lib";
import {LocalizationContext} from "../../translation/translations";
import {useDispatch, useSelector} from "react-redux";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";
import {createAddon} from "../../redux/Recruitment/actions";
import {format_address, serverURL} from "../../constants/config";

const { TextField } = Incubator;
const emptyImage = require('../../assets/images/empty.jpg');
const { width } = Dimensions.get('window');

const Addon = ({ navigation }) => {
    const dispatch = useDispatch();
    const { recruitment } = useSelector(state => state.recruitment);
    const { t } = useContext(LocalizationContext);
    const [ text, setText ] = useState('');

    const handleAddonClick = () => {
        const postscript = text;
        setText('');
        dispatch(createAddon(recruitment.id, postscript));
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['title']['recruitment_create']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView>
                <View paddingH-s3 marginT-10>
                    <View row flex center>
                        <Image source={recruitment.image === '' ? emptyImage : { uri: serverURL+'uploads/recruitments/sm_'+recruitment.image }} cover borderRadius={10}/>
                    </View>
                    <Text text50 color={Colors.black} marginV-s2>
                        { recruitment.title }
                    </Text>
                    <Text text80 color={Colors.grey20}>
                        { recruitment.description }
                    </Text>
                    <View row marginT-10>
                        <Fontisto name={'map-marker-alt'} size={20} color={Colors.cyan30} />
                        <Text text80 color={Colors.grey20} marginL-10>
                            { format_address(recruitment.post_number, recruitment.prefectures, recruitment.city, recruitment.workplace) }
                        </Text>
                    </View>
                    <View row marginT-10>
                        <Ionicons name={'calendar'} size={20} color={Colors.cyan30} />
                        <Text text80 color={Colors.grey20} marginL-10>
                            { recruitment.work_date_start } ~ { recruitment.work_date_end }
                        </Text>
                    </View>
                    <View row marginT-10>
                        <Ionicons name={'ios-time'} size={20} color={Colors.cyan30} />
                        <Text text80 color={Colors.grey20} marginL-10>
                            { recruitment.work_time_start } ~ { recruitment.work_time_end }
                        </Text>
                    </View>
                    <View marginT-10>
                        {
                            recruitment.postscript.map((item, index) => (
                                <Card key={index} style={{ backgroundColor: Colors.cyan30, marginTop: 5 }}>
                                    <Card.Content>
                                        <Text text70 color={Colors.white}>
                                            {item.content}
                                        </Text>
                                        <View row right margin-5>
                                            <Ionicons name={'ios-time'} size={20} color={Colors.white} />
                                            <Text text80 marginL-5 color={Colors.white}>
                                                {item.time}
                                            </Text>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </View>
                    <View row center marginT-10>
                        <TextField
                            multiline
                            rows={4}
                            width={width-50}
                            placeholderTextColor={Colors.cyan10}
                            floatingPlaceholderColor={Colors.cyan10}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            maxLength={100}
                            marginT-10
                            showCharCounter
                            placeholder={t['recruitment']['add_on']}
                            trailingAccessory={
                                <Ionicons name={'md-add'} size={20} color={Colors.cyan30} onPress={() => handleAddonClick()} />
                            }
                            value={text}
                            onChangeText={(value) => setText(value)}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.cyan10,
        paddingBottom: 1
    },
});

export default Addon;
