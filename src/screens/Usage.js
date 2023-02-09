import React, {useContext, useRef, useState} from 'react';
import {Colors, Text, View, Carousel, Spacings, Image} from 'react-native-ui-lib';
import {Dimensions, StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import {LocalizationContext} from '../translation/translations';

const { width, height } = Dimensions.get('window');
const data = [
    {
        title: (
            <View center>
                <Text text50 color={Colors.cyan30}>title1</Text>
            </View>
        ),
        content: (
            <View center>
                <Text>
                    content1
                </Text>
            </View>
        ),
        image: require('../assets/images/usage1.png'),
    },
    {
        title: (
            <View center>
                <Text text50 color={Colors.cyan30}>title2</Text>
            </View>
        ),
        content: (
            <View center>
                <Text>
                    content2
                </Text>
            </View>
        ),
        image: require('../assets/images/usage1.png'),
    },
]

const Usage = ({navigation}) => {
    const { t } = useContext(LocalizationContext);
    const [ numberOfPagesShown, setNumberOfPageShown ] = useState(6);
    const [ currentPage, setCurrentPage ] = useState(0);
    const carousel = useRef(null);

    const onChangePage = (currentPage) => {
        setCurrentPage(currentPage);
    };

    const onPagePress = (index) => {
        if (carousel && carousel.current) {
            carousel.current.goToPage(index, true);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.cyan30 }} statusBarHeight={20}>
                <Appbar.Action icon={'menu'} onPress={() => navigation.openDrawer()} color={Colors.white} />
                <Appbar.Content title={t['usage']['title']} color={Colors.white}/>
            </Appbar.Header>
            <View style={{ position: 'absolute', bottom: 0 }}>
                <Carousel
                    key={numberOfPagesShown}
                    ref={carousel}
                    autoplay
                    onChangePage={onChangePage}
                    pageWidth={width}
                    itemSpacings={0}
                    initialPage={0}
                    pageControlPosition={Carousel.pageControlPositions.UNDER}
                    pageControlProps={{
                        onPagePress,
                        containerStyle: {backgroundColor: Colors.cyan30, height: 50},
                        size: 15,
                    }}
                >
                    {data.map((item, i) => {
                        return (
                            <View
                                key={i}
                                style={{ height: height - 150 }}
                                column
                                spread
                            >
                                <View>
                                    {item.title}
                                    {item.content}
                                </View>
                                <View style={{ height: height - 300 }} center>
                                    <Image
                                        source={item.image}
                                        style={{ height: '100%' }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </Carousel>
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
});

export default Usage;
