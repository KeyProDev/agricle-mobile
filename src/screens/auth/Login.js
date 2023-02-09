import React, {useCallback, useContext, useState} from 'react';
import {View, Incubator, Button, Colors, Text} from 'react-native-ui-lib';
import {Dimensions, ImageBackground, StyleSheet} from "react-native";
import { useSelector, useDispatch } from 'react-redux'
import {LocalizationContext} from '../../translation/translations';
import { login } from "../../redux/Auth/actions";
import Loader from "../../components/Loader";
import {Card} from "react-native-paper";

const { TextField } = Incubator;
const { width } = Dimensions.get('screen');

const Login = ({navigation}) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const { t } = useContext(LocalizationContext);

    const [credential, setCredential] = useState({
        email: null,
        password: null,
    });

    const handleChangeCredential = useCallback(
        (key) => (value) => {
            setCredential(state => ({ ...state, [key]: value }))
        },
        [credential],
    );

    const handleRegisterClick = () => {
        dispatch(login(credential));
    }

    return (
        <ImageBackground source={require('../../assets/images/login_bg.jpg')} style={styles.container} blurRadius={1}>
            <Loader isLoading={auth.loading} />
            <View flex center>
                <Text
                    text30
                    marginB-s5
                    bold
                    center
                    color={'#4d8d49'}
                    onPress={() =>
                        navigation.navigate('Splash')}
                >
                    {t['auth']['login']}
                </Text>
                <Card style={{ width: width * 0.8, padding: 20, borderRadius:20 }}>
                    {
                        Object.keys(auth.errors).length !== 0 &&
                        (auth.errors.connect_error ? (
                            <Text text70 color={Colors.red20} center>
                                {t['auth']['connect_error']}
                            </Text>
                        ) : (
                            <Text text70 color={Colors.red20} center>
                                {t['auth']['email_or_password_error']}
                            </Text>
                        ))
                    }
                    <TextField
                        text70
                        marginV-10
                        placeholderTextColor={'#4CAF50'}
                        floatingPlaceholderColor={'#4CAF50'}
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        enableErrors={auth.errors.email?1:0}
                        validationMessage={auth.errors.email}
                        validationMessageStyle={styles.validationMessageStyle}
                        floatingPlaceholder
                        placeholder={'Email'}
                        onChangeText={handleChangeCredential('email')}
                        floatOnFocus
                        value={credential.email}
                    />
                    <TextField
                        text70
                        marginV-10
                        secureTextEntry
                        placeholderTextColor={'#4CAF50'}
                        floatingPlaceholderColor={'#4CAF50'}
                        fieldStyle={styles.withUnderline}
                        errorColor={Colors.orange60}
                        enableErrors={auth.errors.password?1:0}
                        validationMessage={auth.errors.password}
                        validationMessageStyle={styles.validationMessageStyle}
                        floatingPlaceholder
                        placeholder={t['profile']['password']}
                        onChangeText={handleChangeCredential('password')}
                        floatOnFocus
                        value={credential.password}
                    />
                    <Button
                        marginV-10
                        label={t['auth']['login']}
                        size={Button.sizes.medium}
                        backgroundColor={'#4CAF50'}
                        borderRadius={4}
                        onPress={handleRegisterClick}
                    />
                    <Text
                        text70
                        marginV-10
                        center
                        color={'#4CAF50'}
                        onPress={() =>
                            navigation.navigate('Register')}
                    >
                        {t['auth']['to_register']}
                    </Text>
                </Card>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        filter: `blur(5px)`
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.green10,
        paddingBottom: 1
    },
    validationMessageStyle: {
        fontSize: 12,
        margin: 0,
        color: Colors.red20
    }
});

export default Login;
