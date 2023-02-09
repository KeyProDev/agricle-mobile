import React, {useContext} from "react";
import {StyleSheet, ImageBackground, Dimensions} from "react-native";
import {View, Text, Colors} from 'react-native-ui-lib';
import {LocalizationContext} from "../translation/translations";
import {Button} from "react-native-paper";

const backgroundImage = require('../assets/images/SplashBg.png');
const { height, width } = Dimensions.get('window');

export default function Splash({ navigation }) {
    const { t } = useContext(LocalizationContext);
    return (
        <ImageBackground source={backgroundImage} style={styles.contentStyle}>
            <View style={{ backgroundColor: 'rgba(0,0,0,.3)', width: width, height: height }} flex center>
            <Text style={styles.header}>
                {t['landing']['welcome']}
            </Text>
            <Text style={styles.headerContent}>
                {t['landing']['welcome_detail']}
            </Text>
            <View row>
                <Button mode="outlined" style={styles.button} color={Colors.white} labelStyle={{ fontSize:20, fontWeight: 'bold' }} onPress={() => { navigation.navigate('Login') }}>
                    {t['auth']['login']}
                </Button>
                <Button mode="outlined" style={styles.button} color={Colors.white} labelStyle={{ fontSize:20, fontWeight: 'bold' }} onPress={() => { navigation.navigate('Register') }}>
                    {t['auth']['register']}
                </Button>
            </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    contentStyle: {
        width: '100%',
        height: '100%',
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        fontSize: 40,
        color: Colors.white,
        fontWeight: 'bold',
        marginVertical: 20,
        marginHorizontal: 5,
        textAlign: 'center'
    },
    headerContent: {
        fontSize: 24,
        lineHeight: 36,
        color: Colors.white,
        fontWeight: 'bold',
        marginHorizontal: width * 0.1,
        marginVertical: 10,
        textAlign: 'center',
    },
    button : {
        borderColor: Colors.white,
        borderWidth: 2,
        color: Colors.white,
        marginHorizontal: 5,
        marginVertical: 20,
    }
});
