import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { icons } from '../constants/icons';
import { Theme } from '../constants/theme';
import fonts from '../constants/fonts';


type IconNames = keyof typeof icons;

type GreenSquareProps = {
  title: string;
  utility: string;
  iconName: IconNames;
  onPress: () => void;
};

const GreenSquare = ({ title, utility, iconName, onPress }: GreenSquareProps) => { 
    const IconComponent = icons[iconName];
    return (
        <View style={styles.container}>
            {/* Title Section */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{`${title}`}</Text>
            </View>
            
            {/* Card Section */}
            <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
                <View style={styles.toolContainer}>
                    {IconComponent && IconComponent(20, 'white')}
                </View>
            
                <View style={styles.iconContainer}>
                    <Image
                        source={{
                            uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic-00.iconduck.com%2Fassets.00%2Fuser-square-icon-512x512-d7zixn6s.png&f=1&nofb=1&ipt=98f8cacaca0cd250471a94c44b2e7361d69981a275b596c37009badd6c218564&ipo=images',
                        }}
                        style={styles.icon}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{`${utility}`}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        maxWidth: 130,
        fontSize: 16,
        fontFamily: fonts.PoppinsMedium,
        color: Theme.colors.bamxGrey,
        textAlign: 'center',
    },
    card: {
        backgroundColor: Theme.colors.bamxGreen,
        borderRadius: 12,
        width: 130,
        height: 120,     
        position: 'relative',
        alignSelf: 'center',       
    },
    toolContainer: {
        position: 'absolute',
        right: 8,
        top: 8,
        alignItems: 'flex-end',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    icon: {
        width: 52,
        height: 54,
        borderRadius: 8,
    },
    textContainer: {
        bottom: 8,
        width: '100%',
        marginBottom: 4,
        alignSelf: 'center',
    },
    text: {
        color: 'white',
        fontSize: 12,
        fontFamily: fonts.PoppinsMedium,
        textAlign: 'center',
        fontWeight: 'thin',
    },  
});

export default GreenSquare;