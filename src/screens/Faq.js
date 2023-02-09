import React, {useContext} from 'react';
import {Colors, Text, View} from 'react-native-ui-lib';
import {Appbar, Button, List} from 'react-native-paper';
import {LocalizationContext} from '../translation/translations';
import {ScrollView, StyleSheet} from 'react-native';

const Faq = ({navigation}) => {
    const { t } = useContext(LocalizationContext);
    const [expanded, setExpanded] = React.useState(0);
    const [ role, setRole ] = React.useState('worker');
    const faqData = role === 'worker' ? [
        { question: 'question1', answer: 'This is answer1 content area.' },
        { question: 'question2', answer: 'This is answer2 content area.' },
        { question: 'question3', answer: 'This is answer3 content area.' }
    ] : [
        { question: 'question11', answer: 'This is answer1 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question22', answer: 'This is answer2 content area.' },
        { question: 'question33', answer: 'This is answer3 content area.' }
    ]

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon={'menu'} onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['faq']['title']} color={Colors.white}/>
            </Appbar.Header>
            <View row center margin-10>
                <Button icon="hail" mode={role === 'worker' ? 'contained' : 'outlined'} onPress={() => setRole('worker')} style={{ marginRight: 20 }}>
                    {t['role']['worker']}
                </Button>
                <Button icon="forest" mode={role === 'worker' ? 'outlined' : 'contained'} onPress={() => setRole('producer')}>
                    {t['role']['producer']}
                </Button>
            </View>
            <ScrollView>
                <List.Section>
                    {
                        faqData.map((item, index) => (
                            <List.Accordion
                                title={item.question}
                                left={props => <Text marginH-10 text60>Q.</Text>}
                                key={index}
                                expanded={index === expanded}
                                onPress={() => setExpanded(index)}
                            >
                                <View padding-10>
                                    <Text>
                                        {item.answer}
                                    </Text>
                                </View>
                            </List.Accordion>
                        ))
                    }
                </List.Section>
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

export default Faq;
