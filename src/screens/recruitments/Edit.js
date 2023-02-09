import React, {useContext, useEffect, useState,} from 'react';
import {StyleSheet, ScrollView, Dimensions, Image, Pressable} from "react-native";
import {Appbar, Switch, Modal, Button as PaperButton} from "react-native-paper";
import {
    Colors,
    Incubator,
    RadioGroup,
    RadioButton,
    Text,
    View,
    ChipsInput, ListItem
} from "react-native-ui-lib";
import {LocalizationContext} from "../../translation/translations";
import ImagePicker from 'react-native-image-crop-picker';
import NumericInput from 'react-native-numeric-input';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Ionicons from "react-native-vector-icons/Ionicons";
import {showMessage} from "react-native-flash-message";
import moment from "moment";
import {Button} from "galio-framework";
import {useDispatch, useSelector} from "react-redux";
import {getPrefectures} from "../../redux/Base/actions";
import {Dropdown} from "react-native-element-dropdown";
import {pref_city, serverURL} from "../../constants/config";
import {update} from "../../redux/Recruitment/actions";
import {useFocusEffect} from "@react-navigation/native";
import Loader from "../../components/Loader";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const { TextField } = Incubator;
const { width } = Dimensions.get('window');
const emptyImage = require('../../assets/images/empty.jpg');

const Edit = ({ route, navigation }) => {
    const { isEdit } = route.params;
    const dispatch = useDispatch();
    const { errors, loading } = useSelector(state => state.recruitment);
    const current = useSelector(state => state.recruitment.recruitment);
    const base = useSelector(state => state.base);
    const { t } = useContext(LocalizationContext);

    const [ openImagePickerModal, setOpenImagePickerModal ] = useState(false);
    const [ openWorkDateStartModal, setOpenWorkDateStartModal ] = useState(false);
    const [ openWorkDateEndModal, setOpenWorkDateEndModal ] = useState(false);
    const [ openWorkTimeStartModal, setOpenWorkTimeStartModal ] = useState(false);
    const [ openWorkTimeEndModal, setOpenWorkTimeEndModal ] = useState(false);

    const [image, setImage] = useState('');
    const [recruitment, setRecruitment] = useState({
        isNew: false,
        title: '',
        description: '',
        post_number: '',
        prefectures: '',
        city: '',
        workplace: '',
        reward_type: '',
        reward_cost: '',
        work_date_start: new Date(),
        work_date_end: new Date(),
        work_time_start: new Date(),
        work_time_end: new Date(),
        break_time: '',
        lunch_mode: 0,
        pay_mode: 'cash',
        traffic_type: 'beside',
        traffic_cost: '',
        worker_amount: 1,
        rain_mode: '',
        toilet: 0,
        park: 0,
        insurance: 0,
        notice: '',
        clothes: [],
        image: '',
    });
    const [ viewPreTags, setViewPreTags ] = useState(false);
    const [ preClothes, setPreClothes ] = useState([
        "作業しやすい格好",
        "帽子",
        "軍手",
        "ゴム手袋",
        "長靴",
        "雨がっぱ",
        "水分補給用水筒",
    ]);
    const [loadImage, setLoadImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRecruitmentChange = (key) => (value) => {
        setRecruitment({
            ...recruitment,
            [key] : value
        });
    };

    const getAddress = () => {
        dispatch(getPrefectures(recruitment.post_number));
    }

    const pickPictureOnGallery = () => {
        ImagePicker.openPicker({
            width: 800,
            height: 600,
            cropping: true,
        })
            .then(image => {
                handleRecruitmentChange('image')({uri: image.path, type: image.mime, size: image.size});
                setImage({uri: image.path})
                setOpenImagePickerModal(false);
            })
            .catch(err => {
                setOpenImagePickerModal(false);
            });
    };

    const pickPictureOnCamera = () => {
        ImagePicker.openCamera({
            width: 800,
            height: 600,
            cropping: true,
        })
            .then(image => {
                handleRecruitmentChange('image')({uri: image.path, type: image.mime, size: image.size});
                setImage({uri: image.path})
                setOpenImagePickerModal(false);
            })
            .catch(err => {
                setOpenImagePickerModal(false);
            });
    }

    const updateRecruitment = (isNew = false) => {
        setIsLoading(true);
        const data = new FormData();
        const fields = {...recruitment};
        fields.isNew = isNew;
        fields.work_date_start = moment(recruitment.work_date_start).format("YYYY-MM-DD");
        fields.work_date_end = moment(recruitment.work_date_end).format("YYYY-MM-DD");
        fields.work_time_start = moment(recruitment.work_time_start).format("kk:mm");
        fields.work_time_end = moment(recruitment.work_time_end).format("kk:mm");

        data.append('data', JSON.stringify(fields));

        if(recruitment.image !== '' && recruitment.image.type && recruitment.image.uri && recruitment.image !== current.image) {
            data.append('image', {
                type: recruitment.image.type,
                name: moment().toString(),
                uri: Platform.OS === 'ios' ? recruitment.image.uri.replace('file://', '') : recruitment.image.uri,
            });
        }

        dispatch(update(data, navigation));
    }

    useFocusEffect(
        React.useCallback(() => {
            setRecruitment({
                isNew: false,
                title: '',
                description: '',
                post_number: '',
                prefectures: '',
                city: '',
                workplace: '',
                reward_type: '',
                reward_cost: '',
                work_date_start: new Date(),
                work_date_end: new Date(),
                work_time_start: new Date(),
                work_time_end: new Date(),
                break_time: '',
                lunch_mode: 0,
                pay_mode: 'cash',
                traffic_type: 'beside',
                traffic_cost: '',
                worker_amount: 1,
                rain_mode: '',
                toilet: 0,
                park: 0,
                insurance: 0,
                notice: '',
                clothes: [],
                image: '',
            })
        }, [])
    );

    useEffect(() => {
        const start_time = moment(current.work_date_start + ' ' + current.work_time_start);
        const end_time = moment(current.work_date_start + ' ' + current.work_time_end);

        setRecruitment(state => ({
            ...current,
            postscript: '',
            work_date_start: new Date(current.work_date_start),
            work_date_end: new Date(current.work_date_end),
            work_time_start: new Date(start_time),
            work_time_end: new Date(end_time),
            image: current.image !== '' ? { uri: serverURL+'uploads/recruitments/sm_'+current.image } : ''
        }));
        setImage(current.image !== '' ? { uri: serverURL+'uploads/recruitments/sm_'+current.image } : '');
        getAddress();
    }, [current])

    useEffect(() => {
        setRecruitment((state) => ({ ...state, city: base.city }))
    }, [base.city])

    useEffect(() => {
        setRecruitment((state) => ({ ...state, prefectures: base.prefectures }))
    }, [base.prefectures])

    useEffect(() => {
        setIsLoading(base.loading);
    }, [base.loading, setIsLoading])

    useEffect(() => {
        setIsLoading(loading);
    }, [loading, setIsLoading])

    useEffect(() => {
        if(Object.keys(errors).length > 0) showMessage({
            message: t['alert']['error'],
            description: t['alert']['input_all_items'],
        });
    }, [errors])

    return (
        <>
            <Loader isLoading={isLoading} />
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['title']['recruitment_create']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView style={styles.container}>
                <View row style={styles.imageArea}>
                    <Image
                        source={loadImage && image !== '' ? image : emptyImage}
                        style={{ width: width, height: width * 0.6, resizeMode: 'stretch', }}
                        onLoad={() => setLoadImage(true)}
                    />
                    <Button
                        onlyIcon
                        icon="camera"
                        iconFamily="antdesign"
                        iconSize={30}
                        color={Colors.cyan30}
                        iconColor="#fff"
                        style={styles.imageButton}
                        onPress={() => setOpenImagePickerModal(true)}
                    />
                    <Modal visible={openImagePickerModal} dismissable onDismiss={() => setOpenImagePickerModal(false)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10}}>
                        <View row>
                            <View flex center>
                                <Pressable style={styles.option} onPress={pickPictureOnGallery}>
                                    <Ionicons name={'ios-images'} size={40} color={Colors.grey10}/>
                                    <Text>Gallery</Text>
                                </Pressable>
                            </View>
                            <View flex center>
                                <Pressable style={styles.option} onPress={pickPictureOnCamera}>
                                    <Ionicons name={'md-camera'} size={40} color={Colors.grey10}/>
                                    <Text>Camera</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>
                <ScrollView style={styles.formArea}>
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        marginT-10
                        enableErrors={errors.title?1:0}
                        validationMessage={errors.title}
                        validationMessageStyle={styles.validationMessageStyle}
                        rows={4}
                        placeholder={t['recruitment']['title']}
                        value={recruitment.title}
                        onChangeText={handleRecruitmentChange('title')}
                    />
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        multiline
                        maxLength={100}
                        marginT-10
                        showCharCounter
                        rows={4}
                        placeholder={t['recruitment']['description']}
                        value={recruitment.description}
                        onChangeText={handleRecruitmentChange('description')}
                    />
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        enableErrors={errors.post_number?1:0}
                        trailingAccessory={
                            <Button
                                size={'small'}
                                color={Colors.cyan30}
                                onPress={getAddress}
                                style={{ height: 30, margin: 0, marginBottom: 2, width: 80 }}
                            >
                                {t['action']['get_address']}
                            </Button>
                        }
                        validationMessage={errors.post_number}
                        validationMessageStyle={styles.validationMessageStyle}
                        value={recruitment.post_number}
                        onChangeText={handleRecruitmentChange('post_number')}
                        placeholder={t['profile']['post_number']}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={pref_city.map(item => ({ label: item.pref, value: item.id }))}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={t['profile']['prefectures']}
                        searchPlaceholder={t['matters']['search_label']}
                        onChangeText={handleRecruitmentChange('prefectures')}
                        onChange={item => {
                            handleRecruitmentChange({ prefectures: item.value });
                        }}
                        value={recruitment.prefectures}
                    />
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        marginT-10
                        enableErrors={errors.city?1:0}
                        validationMessage={errors.city}
                        validationMessageStyle={styles.validationMessageStyle}
                        rows={4}
                        placeholder={t['profile']['city']}
                        value={recruitment.city}
                        onChangeText={handleRecruitmentChange('city')}
                    />
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        marginT-10
                        enableErrors={errors.workplace?1:0}
                        validationMessage={errors.workplace}
                        validationMessageStyle={styles.validationMessageStyle}
                        rows={4}
                        placeholder={t['recruitment']['workplace']}
                        value={recruitment.workplace}
                        onChangeText={handleRecruitmentChange('workplace')}
                    />
                    <RadioGroup row marginT-s5 initialValue={recruitment.reward_type} onValueChange={handleRecruitmentChange('reward_type')}>
                        <Text $textDefault color={Colors.cyan10}>
                            {t['recruitment']['reward']['title']} :
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} >
                            <RadioButton color={Colors.cyan30} style={styles.radioGroup} size={20} value={t['recruitment']['reward']['hourly']} label={t['recruitment']['reward']['hourly']} />
                            <RadioButton color={Colors.cyan30} style={styles.radioGroup} size={20} value={t['recruitment']['reward']['daily']} label={t['recruitment']['reward']['daily']} />
                        </View>
                    </RadioGroup>
                    {errors.reward_type && <Text style={styles.validationMessageStyle}>{errors.reward_type}</Text>}

                    <View paddingL-s10>
                        <TextField
                            placeholderTextColor={Colors.cyan10}
                            floatingPlaceholderColor={Colors.cyan10}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            placeholder={t['alert']['input_placeholder']}
                            value={recruitment.reward_cost}
                            onChangeText={handleRecruitmentChange('reward_cost')}
                        />
                    </View>

                    <View flex row spread center>
                        <View>
                            <Text $textDefault color={Colors.cyan10}>
                                {t['recruitment']['work_date']} :
                            </Text>
                        </View>
                        <View flex row right>
                            <Button
                                icon="calendar" iconFamily="antdesign"
                                flex={1}
                                style={{ width: width / 3, backgroundColor: Colors.cyan30 }}
                                onPress={() => setOpenWorkDateStartModal(true)}
                            >
                                {
                                    moment(recruitment.work_date_start).format('YYYY-MM-DD').toString()
                                }
                            </Button>
                            <DateTimePickerModal
                                isVisible={openWorkDateStartModal}
                                mode="date"
                                date={recruitment.work_date_start}
                                onConfirm={(date) => {
                                    setOpenWorkDateStartModal(false)
                                    handleRecruitmentChange('work_date_start')(date)
                                }}
                                onCancel={() => setOpenWorkDateStartModal(false)}
                            />
                            <Button
                                icon="calendar" iconFamily="antdesign"
                                flex={1}
                                style={{ width: width / 3, backgroundColor: Colors.cyan30, marginRight: 0 }}
                                onPress={() => setOpenWorkDateEndModal(true)}
                            >
                                {
                                    moment(recruitment.work_date_end).format('YYYY-MM-DD').toString()
                                }
                            </Button>
                            <DateTimePickerModal
                                isVisible={openWorkDateEndModal}
                                mode="date"
                                date={recruitment.work_date_end}
                                onConfirm={(date) => {
                                    setOpenWorkDateEndModal(false)
                                    handleRecruitmentChange('work_date_end')(date)
                                }}
                                onCancel={() => setOpenWorkDateEndModal(false)}
                            />
                        </View>
                    </View>

                    <View flex row spread center>
                        <View>
                            <Text $textDefault color={Colors.cyan10}>
                                {t['recruitment']['work_time']} :
                            </Text>
                        </View>
                        <View flex row right>
                            <Button
                                icon="clockcircleo" iconFamily="antdesign"
                                flex={1}
                                style={{ width: width / 4, backgroundColor: Colors.cyan30 }}
                                onPress={() => {
                                    // setOpenWorkTimeStartModal(true)
                                    DateTimePickerAndroid.open({
                                        value: new Date(recruitment.work_time_start),
                                        mode: "time",
                                        onChange: (event, selectedDate) => {
                                            handleRecruitmentChange('work_time_start')(selectedDate)
                                        },
                                        is24Hour: true,
                                        display: 'spinner'
                                    });
                                }}
                            >
                                {
                                    moment(recruitment.work_time_start).format('kk:mm').toString()
                                }
                            </Button>
                            <DateTimePickerModal
                                isVisible={openWorkTimeStartModal}
                                mode="time"
                                is24Hour
                                locale="en_GB"
                                date={recruitment.work_time_start}
                                onConfirm={(date) => {
                                    setOpenWorkTimeStartModal(false)
                                    handleRecruitmentChange('work_time_start')(date)
                                }}
                                onCancel={() => setOpenWorkTimeStartModal(false)}
                            />
                            <Button
                                icon="clockcircleo" iconFamily="antdesign"
                                flex={1}
                                style={{ width: width / 4, backgroundColor: Colors.cyan30, marginRight: 0 }}
                                onPress={() => {
                                    // setOpenWorkTimeStartModal(true)
                                    DateTimePickerAndroid.open({
                                        value: new Date(recruitment.work_time_end),
                                        mode: "time",
                                        onChange: (event, selectedDate) => {
                                            handleRecruitmentChange('work_time_end')(selectedDate)
                                        },
                                        is24Hour: true,
                                        display: 'spinner'
                                    });
                                }}
                            >
                                {
                                    moment(recruitment.work_time_end).format('kk:mm').toString()
                                }
                            </Button>
                            <DateTimePickerModal
                                isVisible={openWorkTimeEndModal}
                                mode="time"
                                date={recruitment.work_time_end}
                                onConfirm={(date) => {
                                    setOpenWorkTimeEndModal(false)
                                    handleRecruitmentChange('work_time_end')(date)
                                }}
                                onCancel={() => setOpenWorkTimeEndModal(false)}
                            />
                        </View>
                    </View>
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        marginT-10
                        enableErrors={errors.break_time?1:0}
                        validationMessage={errors.break_time}
                        validationMessageStyle={styles.validationMessageStyle}
                        rows={4}
                        placeholder={t['recruitment']['break_time']}
                        value={recruitment.break_time}
                        onChangeText={handleRecruitmentChange('break_time')}
                    />
                    <RadioGroup row marginV-s5 initialValue={recruitment.pay_mode} onValueChange={handleRecruitmentChange('pay_mode')}>
                        <Text $textDefault color={Colors.cyan10}>
                            {t['recruitment']['pay_mode']['title']} :
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} >
                            <RadioButton color={Colors.cyan30} style={styles.radioGroup} size={20} value={'cash'} label={t['recruitment']['pay_mode']['cash']} />
                            <RadioButton color={Colors.cyan30} style={styles.radioGroup} size={20} value={'card'} label={t['recruitment']['pay_mode']['card']} />
                        </View>
                    </RadioGroup>
                    <RadioGroup row marginV-s2 initialValue={recruitment.traffic_type} onValueChange={handleRecruitmentChange('traffic_type')}>
                        <Text $textDefault color={Colors.cyan10}>
                            {t['recruitment']['traffic']['title']} :
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} >
                            <RadioButton color={Colors.cyan30} style={styles.radioGroup} size={20} value={'beside'} label={t['recruitment']['traffic']['beside']} />
                            <RadioButton color={Colors.cyan30} style={styles.radioGroup} size={20} value={'include'} label={t['recruitment']['traffic']['include']} />
                        </View>
                    </RadioGroup>
                    {
                        recruitment.traffic_type === 'beside' && (
                            <View style={{ marginLeft: 100 }}>
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    placeholder={t['alert']['input_placeholder']}
                                    value={recruitment.traffic_type === 'beside' ? recruitment.traffic_cost : ''}
                                    onChangeText={handleRecruitmentChange('traffic_cost')}
                                />
                            </View>
                        )
                    }
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        enableErrors={errors.rain_mode?1:0}
                        validationMessage={errors.rain_mode}
                        validationMessageStyle={styles.validationMessageStyle}
                        rows={4}
                        placeholder={t['recruitment']['rain_mode']}
                        value={recruitment.rain_mode}
                        onChangeText={handleRecruitmentChange('rain_mode')}
                    />
                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        marginTop: 15,
                    }}>
                        <View style={{ flex: 1 }} >
                            <Text $textDefault color={Colors.cyan10} style={{ marginTop: 5 }}>
                                {t['recruitment']['worker_amount']} :
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }} >
                            <NumericInput
                                value={recruitment.worker_amount}
                                initValue={recruitment.worker_amount}
                                onChange={handleRecruitmentChange('worker_amount')}
                                totalWidth={200}
                                totalHeight={40}
                                step={1}
                                valueType='real'
                                rounded
                                textColor={Colors.cyan30}
                                iconStyle={{ color: 'white', fontSize: 20 }}
                                rightButtonBackgroundColor={Colors.cyan30}
                                leftButtonBackgroundColor={Colors.cyan30}
                            />
                        </View>
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        marginTop: 15,
                    }}>
                        <View style={{ flex: 1 }} >
                            <Text $textDefault color={Colors.cyan10} style={{ marginTop: 5 }}>
                                {t['recruitment']['lunch_mode']['title']}&nbsp;
                                <Text>
                                    ({!!recruitment.lunch_mode ? t['recruitment']['lunch_mode']['yes'] : t['recruitment']['lunch_mode']['no']})
                                </Text>
                            </Text>
                        </View>
                        <View style={{ flex: 2 }} >
                            <Switch value={recruitment.lunch_mode} onValueChange={() => handleRecruitmentChange('lunch_mode')(!recruitment.lunch_mode)} />
                        </View>
                    </View>

                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        marginTop: 15,
                    }}>
                        <View style={{ flex: 1 }} >
                            <Text $textDefault color={Colors.cyan10} style={{ marginTop: 5 }}>
                                {t['recruitment']['toilet']['title']}&nbsp;
                                <Text>
                                    ({!!recruitment.toilet ? t['recruitment']['toilet']['yes'] : t['recruitment']['toilet']['no']})
                                </Text>
                            </Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <Switch value={recruitment.toilet} onValueChange={() => handleRecruitmentChange('toilet')(!recruitment.toilet)} />
                        </View>
                    </View>

                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        marginTop: 15,
                    }}>
                        <View style={{ flex: 1 }} >
                            <Text $textDefault color={Colors.cyan10} style={{ marginTop: 5 }}>
                                {t['recruitment']['park']['title']}&nbsp;
                                <Text>
                                    ({!!recruitment.park ? t['recruitment']['park']['yes'] : t['recruitment']['park']['no']})
                                </Text>
                            </Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <Switch value={recruitment.park} onValueChange={() => handleRecruitmentChange('park')(!recruitment.park)} />
                        </View>
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        marginTop: 15,
                    }}>
                        <View style={{ flex: 1 }} >
                            <Text $textDefault color={Colors.cyan10} style={{ marginTop: 5 }}>
                                {t['recruitment']['insurance']['title']}&nbsp;
                                <Text>
                                    ({!!recruitment.insurance ? t['recruitment']['insurance']['yes'] : t['recruitment']['insurance']['no']})
                                </Text>
                            </Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <Switch value={recruitment.insurance} onValueChange={() => handleRecruitmentChange('insurance')(!recruitment.insurance)} />
                        </View>
                    </View>

                    <View row bottom>
                        <ChipsInput
                            marginT-20
                            placeholderTextColor={Colors.cyan10}
                            containerStyle={{ width: width-100 }}
                            defaultChipProps={{
                                backgroundColor: Colors.$backgroundPrimaryHeavy,
                                labelStyle: {color: Colors.$textDefaultLight},
                                containerStyle: {borderWidth: 0},
                                dismissColor: Colors.$iconDefaultLight
                            }}
                            placeholder={t['recruitment']['clothes']['title']}
                            chips={typeof recruitment.clothes === 'string' && recruitment.clothes !== '' ? recruitment.clothes.split(',').map(item => ({ label: item })) : []}
                            onChangeTags={(e) => handleRecruitmentChange('clothes')(e.map(item => item.label).join(','))}
                        />
                        <FontAwesome5Icon
                            name={viewPreTags ? 'chevron-up' : 'chevron-down'}
                            style={{ marginLeft: 10 }}
                            size={20}
                            color={Colors.cyan30}
                            onPress={() => setViewPreTags(!viewPreTags)}
                        />
                    </View>
                    {
                        viewPreTags && preClothes.filter(item => !(typeof recruitment.clothes === 'string' && recruitment.clothes !== '') || recruitment.clothes.indexOf(item) === -1).map((item, index) => (
                            <ListItem key={index} onPress={() => handleRecruitmentChange('clothes')(typeof recruitment.clothes === 'string' && recruitment.clothes !== '' ? recruitment.clothes + `, ${item}` : item)} style={{ height: 30 }}>
                                <Text margin-s1 padding-s1>{item}</Text>
                            </ListItem>
                        ))
                    }

                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        multiline
                        marginT-10
                        maxLength={100}
                        showCharCounter
                        rows={4}
                        placeholder={t['recruitment']['notice']}
                        value={recruitment.notice}
                        onChangeText={handleRecruitmentChange('notice')}
                    />

                    <View row center>
                        {
                            isEdit ?
                                (
                                    <PaperButton icon={'content-save'} mode={'contained'} color={Colors.green30} onPress={() => updateRecruitment()} style={{ marginLeft: 5 }} disabled={isLoading}>
                                        {t['action']['save']}
                                    </PaperButton>
                                ) :
                                (
                                    <PaperButton icon={'content-copy'} mode={'contained'} color={Colors.blue30} onPress={() => updateRecruitment(true)} disabled={isLoading}>
                                        {t['action']['copy']}
                                    </PaperButton>
                                )
                        }
                    </View>
                </ScrollView>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white
    },
    imageArea: {
        height: width * 0.6,
        backgroundColor: Colors.grey70,
        zIndex: 10
    },
    formArea: {
        padding: 30
    },
    imageButton: {
        width: 60,
        height: 60,
        position: 'absolute',
        right: 30,
        bottom: -30
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.cyan10,
        paddingBottom: 1
    },
    validationMessageStyle: {
        fontSize: 10,
        margin: 0,
        color: Colors.red20
    },
    dropdown: {
        height: 30,
        marginTop: 30,
        marginBottom: 5,
        borderBottomColor: Colors.cyan10,
        borderBottomWidth: 1,
    },
    placeholderStyle: {
        fontSize: 14,
        color: Colors.cyan10,
    },
    selectedTextStyle: {
        fontSize: 14,
        color: Colors.cyan10,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        color: Colors.cyan10,
    },
    radioGroup: {
        marginLeft: 20,
    }
});

export default Edit;
