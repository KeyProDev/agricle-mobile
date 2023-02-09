import React, {useContext, useRef} from 'react';
import {Colors, Text, View} from "react-native-ui-lib";
import {Appbar} from "react-native-paper";
import VideoPlayer from 'react-native-video-player';
import {Dimensions, Image, ScrollView, StyleSheet} from "react-native";
import {LocalizationContext} from "../../../translation/translations";
import {serverURL} from "../../../constants/config";

const { width, height } = Dimensions.get('window');
const helpImage = require('../../../assets/images/help.png');
const topImage = require('../../../assets/images/top.jpg');
const topVideo = require('../../../assets/video/top.mp4');

const Top = ({navigation}) => {
    const { t } = useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon={'menu'} onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['top']['title']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView>
                <Image
                    source={topImage}
                    style={{width: width, height: height }}
                />
                <Text text60 marginT-s3 color={Colors.cyan10} center>生産者の皆様へのお願い</Text>
                <Text margin-s3>
                    そのための紹介動画です。
                </Text>
                <VideoPlayer
                    video={topVideo}
                    videoWidth={1600}
                    videoHeight={900}
                    thumbnail={topImage}
                />
                <Text text60 marginT-s3 color={Colors.cyan10} center>tについて</Text>
                <Text margin-s3>
                    相場や業界知識がわからないまま、先方の言い値で契約してしまったこと、ありませんか？
                </Text>
                <Text margin-s3>
                    比較ビズでは、WEB上で複数業者に一括見積りができます。費用以外にも実績・得意業界などを比較して発注先を選べます。
                </Text>
                <Text margin-s3>
                    これまで10万社以上のビジネスマッチングを支援してきました。発注先を探すなら「比較ビズ」にお任せください。
                </Text>
                <Image
                    source={helpImage}
                    style={{
                        width: width,
                        height: width * 0.6
                    }}
                    resizeMode={'stretch'}
                />
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        marginBottom: 70,
    },
});

export default Top;
