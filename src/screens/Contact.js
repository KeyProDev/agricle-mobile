import React, {useContext, useState} from 'react';
import {Colors, Incubator, Text, View} from 'react-native-ui-lib';
import {LocalizationContext} from '../translation/translations';
import {Appbar, Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown/index';
import {useDispatch} from 'react-redux';
import {sendContact} from '../redux/Base/actions';

const { TextField } = Incubator;

const Contact = ({navigation}) => {
    const { t } = useContext(LocalizationContext);
    const dispatch = useDispatch();
    const [ contact, setContact ] = useState({});
    const [ errors, setErrors ] = useState({});

    const types = [
        { label: "type1", value: "type1" },
        { label: "type2", value: "type2" },
        { label: "type3", value: "type3" },
        { label: "type4", value: "type4" },
        { label: "type5", value: "type5" },
        { label: "type6", value: "type6" },
    ]

    const handleChange = (key) => (value) => {
        setContact({
            ...contact,
            [key] : value
        });
    }

    const handleSendClick = () => {
        if(!contact.type) {
            setErrors({ ...errors, type: t['contact']['type_error'] });
            return;
        }
        else {
            delete errors['type']
        }
        if(!contact.content) {
            setErrors({ ...errors, content: t['contact']['content_error'] });
            return;
        }
        else {
            delete errors['content'];
        }
        dispatch(sendContact(contact, () => {
            alert(t['contact']['success_msg']);
            setContact({});
        }));
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon={'menu'} onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['contact']['title']} color={Colors.white}/>
            </Appbar.Header>
            <View paddingH-s3>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={types}
                    labelField="label"
                    valueField="value"
                    placeholder={t['contact']['type_placeholder']}
                    onChange={item => {
                        handleChange('type')(item.value);
                    }}
                    value={contact.type}
                />
                {errors.type && <Text style={styles.validationMessageStyle}>{errors.type}</Text>}
                <TextField
                    placeholderTextColor={Colors.cyan10}
                    floatingPlaceholderColor={Colors.cyan10}
                    floatingPlaceholder
                    fieldStyle={styles.withUnderline}
                    errorColor={Colors.orange60}
                    multiline
                    maxLength={100}
                    enableErrors={errors.content?1:0}
                    marginB-5
                    validationMessage={errors.content}
                    validationMessageStyle={styles.validationMessageStyle}
                    rows={4}
                    placeholder={t['contact']['content']}
                    value={contact.content}
                    onChangeText={handleChange('content')}
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
                    value={contact.name}
                    onChangeText={handleChange('name')}
                    placeholder={t['contact']['name']}
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
                    value={contact.address}
                    onChangeText={handleChange('address')}
                    placeholder={t['contact']['address']}
                />
                <Button icon="hail" mode={'contained'} onPress={() => handleSendClick()} >
                    {t['contact']['send']}
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
    dropdown: {
        height: 40,
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
});

export default Contact;
