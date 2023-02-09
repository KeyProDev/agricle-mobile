import React, {useContext, useEffect, useState} from "react";
import {Appbar, Modal} from "react-native-paper";
import {
    View,
    Text,
    Colors,
    Incubator,
    Avatar,
    RadioGroup,
    RadioButton,
    Button
} from "react-native-ui-lib";
import {LocalizationContext} from "../translation/translations";
import {useDispatch, useSelector} from "react-redux";
import {Pressable, ScrollView, StyleSheet} from "react-native";
import {getProfile, updateProfile} from "../redux/User/actions";
import {useFocusEffect} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-crop-picker";
import DatePicker from "react-native-date-picker";
import {Dropdown} from "react-native-element-dropdown/index";
import {pref_city, serverURL} from "../constants/config";
import {getPrefectures} from "../redux/Base/actions";
import moment from "moment";

const userIcon = require('../assets/images/user.png');
const { TextField } = Incubator;

const Profile = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useContext(LocalizationContext);
    const {user, errors} = useSelector(state => state.user);
    const base = useSelector(state => state.base);
    const [isOpenBirthdayModal, setBirthdayModal] = useState(false)
    const [ openImagePickerModal, setOpenImagePickerModal ] = useState(false);
    const [ profile, setProfile ] = useState({
        role: '',
        avatar: {uri: ''},
        family_name: '',
        name: '',
        nickname: '',
        gender: '',
        birthday: new Date(),
        post_number: '',
        prefectures: '',
        city: '',
        address: '',
        contact_address: '',
        cell_phone: '',
        emergency_phone: '',
        emergency_relation: '',
        job: '',
        bio: '',
        appeal_point: '',
        management_mode: '',
        agency_name: '',
        agency_phone: '',
        insurance: '',
        other_insurance: '',
        product_name: '',
    });

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getProfile());
        }, [])
    );

    useEffect(() => {
        setProfile(state => ({
            ...user,
            birthday: new Date(user.birthday),
            avatar: { uri: serverURL+'avatars/'+user.avatar }
        }));
        getAddress();
    }, [user])

    useEffect(() => {
        setProfile((state) => ({ ...state, city: base.city }))
    }, [base.city])

    useEffect(() => {
        setProfile((state) => ({ ...state, prefectures: base.prefectures }))
    }, [base.prefectures])

    const handleProfileChange = (key) => (value) => {
        setProfile({
            ...profile,
            [key] : value
        });
    }

    const getAddress = () => {
        dispatch(getPrefectures(profile.post_number));
    }

    const pickPictureOnGallery = () => {
        ImagePicker.openPicker({
            width: 800,
            height: 600,
            cropping: true,
        })
            .then(image => {
                handleProfileChange('avatar')({uri: image.path, type: image.mime, size: image.size});
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
                handleProfileChange('avatar')({uri: image.path, type: image.mime, size: image.size});
                setOpenImagePickerModal(false);
            })
            .catch(err => {
                setOpenImagePickerModal(false);
            });
    }

    const update = () => {
        const data = new FormData();
        const fields = {...profile};

        data.append('data', JSON.stringify(fields));

        if(profile.avatar !== '' && profile.avatar.type && profile.avatar.uri && profile.avatar !== user.avatar) {
            data.append('image', {
                type: profile.avatar.type,
                name: moment().toString(),
                uri: Platform.OS === 'ios' ? profile.avatar.uri.replace('file://', '') : profile.avatar.uri,
            });
        }

        dispatch(updateProfile(data, navigation));
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['title']['update_profile']} color={Colors.white}/>
                <Appbar.Action icon={'close'} onPress={() => {
                    navigation.navigate(user.role === 'producer' ? 'ProducerHome' : 'WorkerHome');
                }} color={Colors.white} />
                <Appbar.Action icon={'content-save'} onPress={update} color={Colors.white} />
            </Appbar.Header>
            <ScrollView>
                <View center padding-s5 backgroundColor={Colors.cyan30}>
                    <Avatar
                        size={100}
                        source={
                            profile.avatar === 'default.png' ?
                                userIcon :
                                profile.avatar
                        }
                        label={'IMG'}
                    />
                    <Text center color={Colors.white} text50 marginT-10>{profile.family_name}</Text>
                    <Text center color={Colors.white} text60>{profile.email}</Text>
                </View>
                <View padding-s5 backgroundColor={Colors.white}>
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        enableErrors={errors.family_name?1:0}
                        marginB-5
                        validationMessage={errors.family_name}
                        validationMessageStyle={styles.validationMessageStyle}
                        value={profile.family_name}
                        onChangeText={handleProfileChange('family_name')}
                        placeholder={profile.role === 'producer' ? t['profile']['producer_name'] : t['profile']['family_name']}
                    />
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        enableErrors={errors.name?1:0}
                        marginB-5
                        validationMessage={errors.name}
                        validationMessageStyle={styles.validationMessageStyle}
                        value={profile.name}
                        onChangeText={handleProfileChange('name')}
                        placeholder={profile.role === 'producer' ? t['profile']['producer_name_read'] : t['profile']['name']}
                    />
                    {
                        profile.role === 'worker' && (
                            <>
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.nickname?1:0}
                                    marginB-5
                                    validationMessage={errors.nickname}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.nickname}
                                    onChangeText={handleProfileChange('nickname')}
                                    placeholder={t['profile']['nickname']}
                                />
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.birthday?1:0}
                                    marginB-5
                                    validationMessage={errors.birthday}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.birthday.getFullYear()+'/'+(profile.birthday.getMonth()+1)+'/'+profile.birthday.getDate()}
                                    placeholder={t['profile']['birthday']}
                                    onPressIn={() => setBirthdayModal(true)}
                                    onChangeText={() => setBirthdayModal(true)}
                                />
                                <DatePicker
                                    modal
                                    title={t['profile']['birthday']}
                                    open={isOpenBirthdayModal}
                                    date={profile.birthday}
                                    mode={'date'}
                                    locale={'ja'}
                                    onConfirm={(date) => {
                                        handleProfileChange('birthday')(date)
                                        setBirthdayModal(false)
                                    }}
                                    confirmText={t['action']['yes']}
                                    onCancel={() => {
                                        setBirthdayModal(false)
                                    }}
                                    cancelText={t['action']['no']}
                                />
                                <RadioGroup row center initialValue={profile.gender} onValueChange={handleProfileChange('gender')}>
                                    <Text style={styles.radioGroup} $textDefault color={Colors.cyan10}>
                                        {t['profile']['gender']['title']}
                                    </Text>
                                    <RadioButton color={Colors.cyan30} style={styles.radioGroup} size={20} value={'man'} label={t['profile']['gender']['man']}/>
                                    <RadioButton color={Colors.cyan30} style={styles.radioGroup} size={20} value={'woman'} label={t['profile']['gender']['woman']}/>
                                </RadioGroup>
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.cell_phone?1:0}
                                    marginB-5
                                    validationMessage={errors.cell_phone}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.cell_phone}
                                    onChangeText={handleProfileChange('cell_phone')}
                                    placeholder={t['profile']['cell_phone']}
                                />
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.emergency_phone?1:0}
                                    marginB-5
                                    validationMessage={errors.emergency_phone}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.emergency_phone}
                                    onChangeText={handleProfileChange('emergency_phone')}
                                    placeholder={t['profile']['emergency_phone']}
                                />
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.emergency_relation?1:0}
                                    marginB-5
                                    validationMessage={errors.emergency_relation}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.emergency_relation}
                                    onChangeText={handleProfileChange('emergency_relation')}
                                    placeholder={t['profile']['emergency_relation']}
                                />
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.job?1:0}
                                    marginB-5
                                    validationMessage={errors.job}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.job}
                                    onChangeText={handleProfileChange('job')}
                                    placeholder={t['profile']['job']}
                                />
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.bio?1:0}
                                    marginB-5
                                    validationMessage={errors.bio}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    multiline
                                    placeholder={t['profile']['bio']}
                                    value={profile.bio}
                                    onChangeText={handleProfileChange('bio')}
                                    maxLength={100}
                                />
                            </>
                        )
                    }
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        enableErrors={errors.post_number?1:0}
                        marginB-5
                        trailingAccessory={
                            <Button
                                size={'small'}
                                backgroundColor={Colors.cyan30}
                                marginB-1
                                borderRadius={5}
                                label={t['action']['get_address']}
                                labelStyle={{ fontSize: 12 }}
                                onPress={getAddress}
                            />
                        }
                        validationMessage={errors.post_number}
                        validationMessageStyle={styles.validationMessageStyle}
                        value={profile.post_number}
                        onChangeText={handleProfileChange('post_number')}
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
                        onChangeText={handleProfileChange('prefectures')}
                        onChange={item => {
                            handleProfileChange({ prefectures: item.value });
                        }}
                        value={profile.prefectures}
                    />
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        enableErrors={errors.city?1:0}
                        marginB-5
                        validationMessage={errors.city}
                        validationMessageStyle={styles.validationMessageStyle}
                        value={profile.city}
                        placeholder={t['profile']['city']}
                        onChangeText={handleProfileChange('city')}
                    />
                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        enableErrors={errors.address?1:0}
                        marginB-5
                        validationMessage={errors.address}
                        validationMessageStyle={styles.validationMessageStyle}
                        value={profile.address}
                        onChangeText={handleProfileChange('address')}
                        placeholder={t['profile']['address']}
                    />

                    {
                        profile.role === 'producer' && (
                            <>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    data={[
                                        { label: t['profile']['management_mode']['individual'], value: 'individual' },
                                        { label: t['profile']['management_mode']['corporation'], value: 'corporation' },
                                        { label: t['profile']['management_mode']['other'], value: 'other' },
                                    ]}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={t['profile']['management_mode']['title']}
                                    searchPlaceholder={t['matters']['search_label']}
                                    onChangeText={handleProfileChange('management_mode')}
                                    onChange={item => handleProfileChange('management_mode')(item.value)}
                                    value={profile.management_mode}
                                />
                                {errors.management_mode && <Text style={styles.validationMessageStyle}>{errors.management_mode}</Text>}
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.contact_address?1:0}
                                    marginB-5
                                    validationMessage={errors.contact_address}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.contact_address}
                                    onChangeText={handleProfileChange('contact_address')}
                                    placeholder={t['profile']['contact_address']}
                                />
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.agency_name?1:0}
                                    marginB-5
                                    validationMessage={errors.agency_name}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.agency_name}
                                    onChangeText={handleProfileChange('agency_name')}
                                    placeholder={t['profile']['agency_name']}
                                />
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.agency_phone?1:0}
                                    marginB-5
                                    validationMessage={errors.agency_phone}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.agency_phone}
                                    onChangeText={handleProfileChange('agency_phone')}
                                    placeholder={t['profile']['agency_phone']}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    data={[
                                        { label: t['profile']['insurance']['yes'], value: 1 },
                                        { label: t['profile']['insurance']['no'], value: 0 },
                                    ]}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={t['profile']['insurance']['title']}
                                    searchPlaceholder={t['matters']['search_label']}
                                    onChangeText={handleProfileChange('insurance')}
                                    onChange={item => handleProfileChange('insurance')(item.value)}
                                    value={profile.insurance}
                                />
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.other_insurance?1:0}
                                    marginB-5
                                    validationMessage={errors.other_insurance}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.other_insurance}
                                    onChangeText={handleProfileChange('other_insurance')}
                                    placeholder={t['profile']['other_insurance']}
                                />
                                <TextField
                                    placeholderTextColor={Colors.cyan10}
                                    floatingPlaceholderColor={Colors.cyan10}
                                    floatingPlaceholder
                                    fieldStyle={styles.withUnderline}
                                    errorColor={Colors.orange60}
                                    enableErrors={errors.product_name?1:0}
                                    marginB-5
                                    validationMessage={errors.product_name}
                                    validationMessageStyle={styles.validationMessageStyle}
                                    value={profile.product_name}
                                    onChangeText={handleProfileChange('product_name')}
                                    placeholder={t['profile']['product_name']}
                                />
                            </>
                        )
                    }

                    <TextField
                        placeholderTextColor={Colors.cyan10}
                        floatingPlaceholderColor={Colors.cyan10}
                        floatingPlaceholder
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        multiline
                        maxLength={100}
                        enableErrors={errors.appeal_point?1:0}
                        marginB-5
                        validationMessage={errors.appeal_point}
                        validationMessageStyle={styles.validationMessageStyle}
                        rows={4}
                        placeholder={t['profile']['appeal_point']}
                        value={profile.appeal_point}
                        onChangeText={handleProfileChange('appeal_point')}
                    />
                </View>
            </ScrollView>
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
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
    dropdown: {
        height: 30,
        marginTop: 15,
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
    validationMessageStyle: {
        fontSize: 10,
        margin: 0,
        color: Colors.red20
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.cyan10,
        paddingBottom: 1
    },
    radioGroup: {
        margin: 10
    }
});

export default Profile;
