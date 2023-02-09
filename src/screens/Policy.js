import React, {useContext} from 'react';
import {Colors, Text, View} from 'react-native-ui-lib';
import {ScrollView, StyleSheet} from 'react-native';
import {LocalizationContext} from '../translation/translations';
import {Appbar, Divider} from 'react-native-paper';

const Policy = ({navigation}) => {
    const { t } = useContext(LocalizationContext);
    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={Colors.white} />
                <Appbar.Content title={t['policy']['title']} color={Colors.white}/>
            </Appbar.Header>
            <ScrollView style={{ padding: 20 }}>
                <Text text50 marginV-s2 color={Colors.cyan10}>プライバシーポリシー</Text>
                <Text marginV-s2>
                    株式会社ワンズマインド（以下「当社」といいます）は、当社が運営するウェブサイト「比較ビズ」及び関連サイト（以下、あわせて「本ウェブサイト」といいます。）について、利用者（以下「カスタマー」といいます。）の個人情報の保護及びカスタマーが本ウェブサイトを安心して利用しうる体制の構築を目的として、『比較ビズ プライバシーポリシー』（以下、単に「プライバシーポリシー」といいます。）を定め、プライバシーポリシーに基づきカスタマーより収集した個人情報を取扱うものとします。
                </Text>

                <Text text60 marginV-s2 color={Colors.cyan10}>1.プライバシーポリシーの適用範囲</Text>
                <Divider />
                <Text marginV-s2>
                    プライバシーポリシーは、本ウェブサイトにおいて当社がカスタマーより収集する個人情報の取扱いに関して適用されます。
                </Text>
                <Text marginV-s2>
                    本ウェブサイトにおいて、当社の広告主等が主体となって、その掲載した広告の中でアンケート等を実施し、カスタマーの個人情報を収集する場合があります。この場合は、当社は、メディアとして広告枠を広告主に提供しているにすぎず、広告主が個人情報の収集・利用・保有・管理等の主体となります。
                </Text>
                <Text marginV-s2>
                    広告主は、独自のプライバシーポリシー等を定め、当該プライバシーポリシー等に従い個人情報を取り扱う独立した事業者であり、このような形で収集された個人情報については、当社は保有を行わず、従ってプライバシーポリシーは適用されません。
                </Text>

                <Text text60 marginV-s2 color={Colors.cyan10}>2.個人情報の定義</Text>
                <Divider />
                <Text marginV-s2>
                    プライバシーポリシーにおいて個人情報とは、個人情報保護法に定める個人情報（生存する個人に関する情報であり、特定の個人を識別可能なものを言い、氏名、住所、電話番号等を含みます。）並びに特定の個人と結びついて使用されるメールアドレス、パスワード、クレジットカードなどの情報及びそれらと一体となった購入取引に関する情報、趣味、家族構成、年齢その他の個人に関する属性情報をいうものとします。
                </Text>

                <Text text60 marginV-s2 color={Colors.cyan10}>3.統計データの利用</Text>
                <Divider />
                <Text marginV-s2>
                    当社は、本ウェブサイトにおいて、カスタマーが本ウェブサイトの提供するサービスを利用する場合、本ウェブサイトのモニターとして登録する場合、本ウェブサイトが行う何らか情報提供を受ける旨の意思を当社に対して表示した場合、本ウェブサイトにおいて当社が実施するアンケートに協力する場合や懸賞等に応募する場合、又は本ウェブサイトにおいて当社の販売する商品を購入する場合（メンバーへの登録を含みます。）等に個人情報を収集します。
                </Text>
                <Text marginV-s2>
                    当社が本ウェブサイトにおいてカスタマーの個人情報を収集する機会は、本ウェブサイトの更新等によって変更されます。従って、前述のケースは、当社が本ウェブサイトにおいてカスタマーの個人情報を収集する機会の一部を例示したものであり、これらに限られるものではありません。
                </Text>
                <Text marginV-s2>
                    当社がカスタマーに登録をお願いする個人情報は、カスタマーが本ウェブサイトのサービスを利用する上で必要となるものに限られています。
                </Text>
                <Text marginV-s2>
                    当社がカスタマーから収集する個人情報は、本ウェブサイト内で当社が提供するサービス等によって異なります。サービスによっては、カスタマーのメールアドレス、住所、氏名、電話番号等の個人情報を収集する場合もあれば、年齢、性別、嗜好、興味などの統計的な情報を収集する場合もあります。また、カスタマーが当社の販売する商品を購入する場合には、クレジットカード番号等の登録を依頼する場合もあります。
                </Text>
                <Text marginV-s2></Text>
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
});

export default Policy;
