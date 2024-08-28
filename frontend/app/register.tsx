import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AppTextInput from '../components/appTextInput';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<Props> = ({navigation:{navigate}}) => {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{padding:spacing*2}}>
                    <View style={{alignItems:'center'}}>
                        <Text style={[styles.mainTitle, {margin: spacing}]}>Crea una cuenta</Text>
                        <Text style={styles.subTitle}>Ingresa y explora todos los servicios que tenemos para ti</Text>
                        
                    </View>
                    <View style={{marginVertical:spacing*2}}>
                        <AppTextInput placeholder='Email'/>
                        <AppTextInput placeholder="Nombre"/>
                        <AppTextInput placeholder="Apellido"/>
                        <AppTextInput placeholder="Telefono"/>
                        <AppTextInput placeholder="Password"/>
                    </View>
                    <TouchableOpacity style={styles.btn} >
                        <Text style={styles.btnText}>Regístrate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('login')} style={{padding:spacing}}>
                        <Text style={{
                            fontFamily: fonts.PoppinsSemiBold,
                            fontWeight: '700',
                            color: Theme.colors.bamxGrey,
                            textAlign: 'center',
                            fontSize: Theme.size.sm,
                            marginTop: spacing - 5,
                        }}>
                            Ya tengo una cuenta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        marginBottom: spacing-3,
    },
    btn: {
        padding: spacing,
        width: '60%',
        alignSelf: 'center',
        backgroundColor: Theme.colors.bamxRed,
        borderRadius: spacing,
        marginTop: spacing,
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

export default Register;
