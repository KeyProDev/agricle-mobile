import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, ImageBackground, Dimensions} from 'react-native';
import { showMessage } from "react-native-flash-message";
import { useSelector, useDispatch } from 'react-redux'
import {LocalizationContext} from '../../translation/translations';
import { register } from "../../redux/Auth/actions";
import { getPrefectures } from "../../redux/Base/actions";
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { pref_city } from '../../constants/config';
import {
    View,
    Button,
    Colors,
    Text,
    Incubator,
    RadioButton,
    RadioGroup,
} from "react-native-ui-lib";
import Loader from "../../components/Loader";
import {Card} from "react-native-paper";

const { TextField } = Incubator;
const { height, width } = Dimensions.get('screen');

const Register = ({navigation}) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const base = useSelector(state => state.base);
    const { t } = useContext(LocalizationContext);

    const [isOpenBirthdayModal, setBirthdayModal] = useState(false)
    const [profile, setProfile] = useState({
        role: 'worker',
        family_name: null,
        name: null,
        nickname: null,
        gender: 'man',
        birthday: new Date(),
        post_number: null,
        prefectures: null,
        city: null,
        address: null,
        contact_address: null,
        cell_phone: null,
        emergency_phone: null,
        emergency_relation: null,
        job: null,
        bio: null,
        appeal_point: null,
        management_mode: null,
        agency_name: null,
        agency_phone: null,
        insurance: null,
        other_insurance: null,
        product_name: null,

        email: null,
        password: null,
        password_confirmation: null,
    });

    const handleChangeProfile = useCallback(
        (key) => (value) => {
            setProfile(state => ({ ...state, [key]: value }))
        },
        [profile],
    );

    const handleRegisterClick = () => {
        dispatch(register(profile, () => {
            showMessage({
                message: t['auth']['connect_error'],
                type: "info",
            });
        }));
    }

    const getAddress = () => {
        dispatch(getPrefectures(profile.post_number));
    }

    useEffect(() => {
        setProfile((state) => ({ ...state, city: base.city }))
    }, [base.city])

    useEffect(() => {
        setProfile((state) => ({ ...state, prefectures: base.prefectures }))
    }, [base.prefectures])

    return (
        <ImageBackground source={require('../../assets/images/register_bg.jpg')} style={styles.container}>
            <Loader isLoading={auth.loading} />
            <View flex center>
                <Text
                    text30
                    marginB-s2
                    bold
                    center
                    color={Colors.white}
                    onPress={() =>
                        navigation.navigate('Splash')}
                >
                    {t['auth']['register']}
                </Text>
                <Card style={{ borderRadius:20, padding: 10, width: width * 0.8, height: height*0.7 }}>
                    <ScrollView
                        contentContainerStyle={styles.scrollView}
                    >
                        <RadioGroup row center initialValue={profile.role} onValueChange={handleChangeProfile('role')}>
                            <Text $textDefault color={'#4CAF50'} style={styles.radioGroup}>
                                {t['role']['title']}
                            </Text>
                            <RadioButton color={'#4CAF50'} style={styles.radioGroup} size={20} value={'worker'} label={t['role']['worker']} />
                            <RadioButton color={'#4CAF50'} style={styles.radioGroup} size={20} value={'producer'} label={t['role']['producer']} />
                        </RadioGroup>
                        <TextField
                            placeholderTextColor={'#4CAF50'}
                            floatingPlaceholderColor={'#4CAF50'}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            enableErrors={auth.errors.family_name?1:0}
                            marginB-5
                            validationMessage={auth.errors.family_name}
                            validationMessageStyle={styles.validationMessageStyle}
                            value={profile.family_name}
                            onChangeText={handleChangeProfile('family_name')}
                            placeholder={profile.role === 'producer' ? t['profile']['producer_name'] : t['profile']['family_name']}
                        />
                        <TextField
                            placeholderTextColor={'#4CAF50'}
                            floatingPlaceholderColor={'#4CAF50'}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            enableErrors={auth.errors.name?1:0}
                            marginB-5
                            validationMessage={auth.errors.name}
                            validationMessageStyle={styles.validationMessageStyle}
                            value={profile.name}
                            onChangeText={handleChangeProfile('name')}
                            placeholder={profile.role === 'producer' ? t['profile']['producer_name_read'] : t['profile']['name']}
                        />
                        {
                            profile.role === 'worker' && (
                                <>
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.nickname?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.nickname}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.nickname}
                                        onChangeText={handleChangeProfile('nickname')}
                                        placeholder={t['profile']['nickname']}
                                    />
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.birthday?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.birthday}
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
                                            handleChangeProfile('birthday')(date)
                                            setBirthdayModal(false)
                                        }}
                                        confirmText={t['action']['yes']}
                                        onCancel={() => {
                                            setBirthdayModal(false)
                                        }}
                                        cancelText={t['action']['no']}
                                    />
                                    <RadioGroup row center initialValue={profile.gender} onValueChange={handleChangeProfile('gender')}>
                                        <Text style={styles.radioGroup} $textDefault color={'#4CAF50'}>
                                            {t['profile']['gender']['title']}
                                        </Text>
                                        <RadioButton color={'#4CAF50'} style={styles.radioGroup} size={20} value={'man'} label={t['profile']['gender']['man']}/>
                                        <RadioButton color={'#4CAF50'} style={styles.radioGroup} size={20} value={'woman'} label={t['profile']['gender']['woman']}/>
                                    </RadioGroup>
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.cell_phone?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.cell_phone}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.cell_phone}
                                        onChangeText={handleChangeProfile('cell_phone')}
                                        placeholder={t['profile']['cell_phone']}
                                    />
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.emergency_phone?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.emergency_phone}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.emergency_phone}
                                        onChangeText={handleChangeProfile('emergency_phone')}
                                        placeholder={t['profile']['emergency_phone']}
                                    />
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.emergency_relation?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.emergency_relation}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.emergency_relation}
                                        onChangeText={handleChangeProfile('emergency_relation')}
                                        placeholder={t['profile']['emergency_relation']}
                                    />
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.job?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.job}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.job}
                                        onChangeText={handleChangeProfile('job')}
                                        placeholder={t['profile']['job']}
                                    />
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.bio?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.bio}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        multiline
                                        placeholder={t['profile']['bio']}
                                        value={profile.bio}
                                        onChangeText={handleChangeProfile('bio')}
                                        maxLength={100}
                                    />
                                </>
                            )
                        }
                        <TextField
                            placeholderTextColor={'#4CAF50'}
                            floatingPlaceholderColor={'#4CAF50'}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            enableErrors={auth.errors.post_number?1:0}
                            marginB-5
                            trailingAccessory={
                                <Button
                                    size={'small'}
                                    backgroundColor={'#4CAF50'}
                                    marginB-1
                                    borderRadius={5}
                                    label={t['action']['get_address']}
                                    labelStyle={{ fontSize: 12 }}
                                    onPress={getAddress}
                                />
                            }
                            validationMessage={auth.errors.post_number}
                            validationMessageStyle={styles.validationMessageStyle}
                            value={profile.post_number}
                            onChangeText={handleChangeProfile('post_number')}
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
                            onChangeText={handleChangeProfile('prefectures')}
                            onChange={item => {
                                handleChangeProfile({ prefectures: item.value });
                            }}
                            value={profile.prefectures}
                        />
                        <TextField
                            placeholderTextColor={'#4CAF50'}
                            floatingPlaceholderColor={'#4CAF50'}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            enableErrors={auth.errors.city?1:0}
                            marginB-5
                            validationMessage={auth.errors.city}
                            validationMessageStyle={styles.validationMessageStyle}
                            value={profile.city}
                            placeholder={t['profile']['city']}
                            onChangeText={handleChangeProfile('city')}
                        />
                        <TextField
                            placeholderTextColor={'#4CAF50'}
                            floatingPlaceholderColor={'#4CAF50'}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            enableErrors={auth.errors.address?1:0}
                            marginB-5
                            validationMessage={auth.errors.address}
                            validationMessageStyle={styles.validationMessageStyle}
                            value={profile.address}
                            onChangeText={handleChangeProfile('address')}
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
                                        onChangeText={handleChangeProfile('management_mode')}
                                        onChange={item => handleChangeProfile('management_mode')(item.value)}
                                        value={profile.management_mode}
                                    />
                                    {auth.errors.management_mode && <Text style={styles.validationMessageStyle}>{auth.errors.management_mode}</Text>}
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.contact_address?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.contact_address}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.contact_address}
                                        onChangeText={handleChangeProfile('contact_address')}
                                        placeholder={t['profile']['contact_address']}
                                    />
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.agency_name?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.agency_name}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.agency_name}
                                        onChangeText={handleChangeProfile('agency_name')}
                                        placeholder={t['profile']['agency_name']}
                                    />
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.agency_phone?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.agency_phone}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.agency_phone}
                                        onChangeText={handleChangeProfile('agency_phone')}
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
                                        onChangeText={handleChangeProfile('insurance')}
                                        onChange={item => handleChangeProfile('insurance')(item.value)}
                                        value={profile.insurance}
                                    />
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.other_insurance?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.other_insurance}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.other_insurance}
                                        onChangeText={handleChangeProfile('other_insurance')}
                                        placeholder={t['profile']['other_insurance']}
                                    />
                                    <TextField
                                        placeholderTextColor={'#4CAF50'}
                                        floatingPlaceholderColor={'#4CAF50'}
                                        floatingPlaceholder
                                        fieldStyle={styles.withUnderline}
                                        errorColor={Colors.orange60}
                                        enableErrors={auth.errors.product_name?1:0}
                                        marginB-5
                                        validationMessage={auth.errors.product_name}
                                        validationMessageStyle={styles.validationMessageStyle}
                                        value={profile.product_name}
                                        onChangeText={handleChangeProfile('product_name')}
                                        placeholder={t['profile']['product_name']}
                                    />
                                </>
                            )
                        }

                        <TextField
                            placeholderTextColor={'#4CAF50'}
                            floatingPlaceholderColor={'#4CAF50'}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            multiline
                            maxLength={100}
                            enableErrors={auth.errors.appeal_point?1:0}
                            marginB-5
                            validationMessage={auth.errors.appeal_point}
                            validationMessageStyle={styles.validationMessageStyle}
                            rows={4}
                            placeholder={t['profile']['appeal_point']}
                            value={profile.appeal_point}
                            onChangeText={handleChangeProfile('appeal_point')}
                        />

                        <TextField
                            placeholderTextColor={'#4CAF50'}
                            floatingPlaceholderColor={'#4CAF50'}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            enableErrors={auth.errors.email?1:0}
                            marginB-5
                            validationMessage={auth.errors.email}
                            validationMessageStyle={styles.validationMessageStyle}
                            value={profile.email}
                            onChangeText={handleChangeProfile('email')}
                            placeholder={'Email'}
                        />
                        <TextField
                            placeholderTextColor={'#4CAF50'}
                            floatingPlaceholderColor={'#4CAF50'}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            secureTextEntry
                            enableErrors={auth.errors.password?1:0}
                            marginB-5
                            validationMessage={auth.errors.password}
                            validationMessageStyle={styles.validationMessageStyle}
                            value={profile.password}
                            onChangeText={handleChangeProfile('password')}
                            placeholder={t['profile']['password']}
                        />
                        <TextField
                            placeholderTextColor={'#4CAF50'}
                            floatingPlaceholderColor={'#4CAF50'}
                            floatingPlaceholder
                            fieldStyle={styles.withUnderline}
                            errorColor={Colors.orange60}
                            secureTextEntry
                            marginB-5
                            enableErrors={auth.errors.password_confirmation?1:0}
                            validationMessage={auth.errors.password_confirmation}
                            validationMessageStyle={styles.validationMessageStyle}
                            value={profile.password_confirmation}
                            onChangeText={handleChangeProfile('password_confirmation')}
                            placeholder={t['profile']['confirm_password']}
                        />
                    </ScrollView>
                    <Button
                        label={t['auth']['register']}
                        marginV-10
                        marginH-70
                        size={Button.sizes.medium}
                        backgroundColor={'#4CAF50'}
                        borderRadius={4}
                        onPress={handleRegisterClick}
                    />
                    <Text
                        text70
                        center
                        color={'#4CAF50'}
                        onPress={() =>
                            navigation.navigate('Login')}
                    >
                        {t['auth']['already_have_account']}
                    </Text>
                </Card>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain'
    },
    scrollView: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginHorizontal: 10,
    },
    dropdown: {
        height: 30,
        marginTop: 15,
        marginBottom: 5,
        borderBottomColor: '#4CAF50',
        borderBottomWidth: 1,
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#4CAF50',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#4CAF50',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        color: '#4CAF50',
    },
    validationMessageStyle: {
        fontSize: 10,
        margin: 0,
        color: Colors.red20
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: '#4CAF50',
        paddingBottom: 1
    },
    radioGroup: {
        margin: 10
    }
});

export default Register;
