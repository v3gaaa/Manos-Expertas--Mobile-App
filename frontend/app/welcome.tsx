import React from 'react';
import { ScrollView, StyleSheet, View, Text, SafeAreaView, ImageBackground, Dimensions, TouchableOpacity} from 'react-native';
const { width, height } = Dimensions.get('window');
import spacing from '../constants/spacing';
import {Theme} from '../constants/theme';
import fonts from '../constants/fonts';
import Spacing from '../constants/spacing';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'welcome'>;

const Welcome:React.FC<Props> = ({navigation:{navigate}}) => {
return (
<SafeAreaView>
    <View>
        <ImageBackground style={{height: height/2.5, }}
            resizeMode='contain'
            source={require('../assets/images/welcomeProfessions.png')}
        />
        </View>
        <View style={{paddingHorizontal: spacing*3,paddingTop: spacing,}}>
            <Text style={styles.mainTitle}>¡BIENVENIDO A MANOS EXPERTAS!</Text>
            <Text style={styles.subTitle}>Manos Expertas ofrece un catálogo de trabajadores avalados por el Banco de Alimentos de México, listos para brindarte su ayuda. </Text>
        </View>
        <View style={{paddingHorizontal: spacing*2, paddingTop:Spacing*5, flexDirection:'row'}}>
            <TouchableOpacity 
                onPress={()=>navigate('login')}
                style={{
                backgroundColor: Theme.colors.bamxYellow,
                borderRadius: Spacing,
                paddingVertical: spacing*1.5,
                paddingHorizontal: spacing*1.6,
                width: "45%",
                ...Theme.shadows.shadow,
                marginHorizontal: spacing*1.5,
                }}>
                <Text style={[styles.btnText, {color: Theme.colors.black}]}>Inicia sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigate('Register')}
                style={{
                backgroundColor: Theme.colors.bamxGreen,
                borderRadius: Spacing,
                paddingVertical: spacing*1.5,
                paddingHorizontal: spacing*2,
                width: "45%",
                ...Theme.shadows.shadow,
            }}>
                <Text style={[styles.btnText, {color: Theme.colors.white}]}>Regístrate</Text>
            </TouchableOpacity>
    </View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    mainTitle: {
        fontFamily: fonts.CocoSharp,
        fontSize: Theme.size.h1,
        color: Theme.colors.bamxGreen,
        marginBottom: spacing*1.2,
        textAlign: 'center',
    },
    subTitle: {
        fontFamily: fonts.PoppinsMedium,
        fontWeight: '600',
        fontSize: Theme.size.md,
        color: Theme.colors.bamxGrey,
        marginBottom: spacing*1.2,
    },
    btn: {
        paddingHorizontal: spacing*2,
        paddingVertical: spacing*4,
    },
    btnText:{
        fontFamily: fonts.PoppinsSemiBold,
        fontWeight: '800',
        fontSize: Theme.size.sm,
        textAlign: 'center',
    }
})

export default Welcome;
