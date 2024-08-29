import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Button, Alert, TextInput, ScrollView } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppTextInput from '../components/appTextInput';
import users from '../data.json';


const Register: React.FC=() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        const salt = CryptoJS.lib.WordArray.random(128/8).toString();
        const hashedPassword = CryptoJS.SHA512(password+salt).toString();
        const newUser = {
            email,
            hashedPassword,
            salt,
            name,
            lastName,
            phone,
        };
        users.users.push(newUser);
        console.log('Updated users:', JSON.stringify(users, null, 2));

        const token = 'fake-jwt-token-'+ new Date().getTime();
        await AsyncStorage.setItem('userToken', token);

        Alert.alert('Success', 'Cuenta creada con éxito');
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{padding:spacing*2}}>
                    <View style={{alignItems:'center'}}>
                        <Text style={[styles.mainTitle, {margin: spacing}]}>Crea una cuenta</Text>
                        <Text style={styles.subTitle}>Ingresa y explora todos los servicios que tenemos para ti</Text>
                        
                    </View>
                    <View style={{marginVertical:spacing*2}}>
                        <AppTextInput placeholder="Email"
                            value={email} 
                            onChangeText={setEmail} 
                            keyboardType="email-address" 
                            autoCapitalize='none'/>
                        <AppTextInput placeholder="Nombre"
                            value={name}
                            onChangeText={setName}/>
                        <AppTextInput placeholder="Apellido"
                            value={lastName}
                            onChangeText={setLastName}/>
                        <AppTextInput placeholder="Telefono"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"/>
                        <AppTextInput placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry/>
                    </View>
                    <TouchableOpacity onPress={() => {handleRegister}}style={styles.btn} >
                        <Text style={styles.btnText}>Regístrate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{padding:spacing}}>
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
