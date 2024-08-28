import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AppTextInput from '../components/appTextInput';

type Props = NativeStackScreenProps<RootStackParamList, "login">;

const Login: React.FC<Props> = ({ navigation: { navigate } }) => {
    return (
        <SafeAreaView>
            <View style={{padding:spacing*2}}>
                <View style={{alignItems:'center'}}>
                    <Text style={[styles.mainTitle, {margin: spacing*3}]}>Iniciar Sesión</Text>
                    <Text style={styles.subTitle}>Bienvenido de vuelta</Text>
                </View>
                <View style={{marginVertical:spacing*3}}>
                    <AppTextInput placeholder="Email"/>
                    <AppTextInput placeholder="Password"/>
                </View>
                <View>
                    <Text style={{fontFamily: fonts.MontserratBold, fontSize:Theme.size.xs, color: Theme.colors.bamxRed, alignSelf:'flex-end'}}>¿Olvidaste tu contraseña?</Text>
                </View>
                <TouchableOpacity style={styles.btn} >
                    <Text style={styles.btnText}>Ingresa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('Register')} style={{padding:spacing}}>
                    <Text style={{
                        fontFamily: fonts.PoppinsSemiBold,
                        fontWeight: '700',
                        color: Theme.colors.bamxGrey,
                        textAlign: 'center',
                        fontSize: Theme.size.sm,
                        marginTop: spacing,
                    }}>
                        Crea una cuenta nueva</Text>
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
        fontSize: Theme.size.xl,
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
        padding: spacing,
        width: '60%',
        alignSelf: 'center',
        backgroundColor: Theme.colors.bamxRed,
        borderRadius: spacing,
        marginTop: spacing*3,
        ...Theme.shadows.shadow,
    },
    btnText:{
        fontFamily: fonts.PoppinsSemiBold,
        fontWeight: '700',
        fontSize: Theme.size.aftm,
        textAlign: 'center',
        color: Theme.colors.white,
    }
})

export default Login;
