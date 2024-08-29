import React, {useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Text, TouchableOpacity, TextInput } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppTextInput from '../components/appTextInput';
import { logIn, getUserByEmail } from '../utils/apiHelper';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogIn = async () => {
        const user = await getUserByEmail(email);
        const hashedInputPassword = CryptoJS.SHA512(password + user.salt).toString();
        const isLogged = await logIn(email, hashedInputPassword);

        if (isLogged) {
            await AsyncStorage.setItem('user', JSON.stringify(user));
            navigation.navigate('Home');
        } else {
            Alert.alert('Error', 'Usuario o contraseña incorrectos');
        }
    }
    
    return (
        <SafeAreaView>
            <View style={{padding:spacing*2}}>
                <View style={{alignItems:'center'}}>
                    <Text style={[styles.mainTitle, {margin: spacing*3}]}>Iniciar Sesión</Text>
                    <Text style={styles.subTitle}>Bienvenido de vuelta</Text>
                </View>
                <View style={{marginVertical:spacing*3}}>
                    <AppTextInput placeholder="Email"
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address" 
                        autoCapitalize='none'/>
                    <AppTextInput placeholder="Password"
                        value={password} 
                        onChangeText={setPassword} 
                        secureTextEntry/>
                </View>
                <View>
                    <Text style={{fontFamily: fonts.MontserratBold, fontSize:Theme.size.xs, color: Theme.colors.bamxRed, alignSelf:'flex-end'}}>¿Olvidaste tu contraseña?</Text>
                </View>
                <TouchableOpacity onPress={() => {handleLogIn}} style={styles.btn} >
                    <Text style={styles.btnText}>Ingresa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{padding:spacing}}>
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
