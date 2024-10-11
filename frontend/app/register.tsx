import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppTextInput from '../components/appTextInput';
import { signUp } from '../utils/apiHelper';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,50}$/;

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
      return;
    }

    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error', 
        'La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial, y no exceder 50 caracteres.'
      );
      return;
    }

    try {
      const salt = CryptoJS.lib.WordArray.random(16).toString();
      const hashedPassword = CryptoJS.SHA512(password + salt).toString();

      const newUser = {
        name,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber: phone,
        profilePicture: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        },
        admin: false,
        salt,
      };

      const response = await signUp(newUser);

      if (response && response.token) {
            //Async Storage cleanup
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        Alert.alert('Éxito', 'Usuario registrado exitosamente');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Error al registrarse, por favor intenta nuevamente');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un problema al intentar registrarse');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ padding: spacing * 2 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.mainTitle, { margin: spacing }]}>Crea una cuenta</Text>
              <Text style={styles.subTitle}>Ingresa y explora todos los servicios que tenemos para ti</Text>
            </View>
            <View style={{ marginVertical: spacing * 2 }}>
              <AppTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <AppTextInput
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
              />
              <AppTextInput
                placeholder="Apellido"
                value={lastName}
                onChangeText={setLastName}
              />
              <AppTextInput
                placeholder="Teléfono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <AppTextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity onPress={handleRegister} style={styles.btn}>
              <Text style={styles.btnText}>Regístrate</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ padding: spacing }}>
              <Text style={{
                fontFamily: fonts.PoppinsSemiBold,
                fontWeight: '700',
                color: Theme.colors.bamxGrey,
                textAlign: 'center',
                fontSize: Theme.size.sm,
                marginTop: spacing - 5,
              }}>
                Ya tengo una cuenta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    marginBottom: spacing * 1.2,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: fonts.PoppinsMedium,
    fontWeight: '600',
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing - 3,
  },
  btn: {
    padding: spacing,
    width: '60%',
    alignSelf: 'center',
    backgroundColor: Theme.colors.bamxRed,
    borderRadius: spacing,
    marginTop: spacing,
    ...Theme.shadows,
  },
  btnText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontWeight: '700',
    fontSize: Theme.size.aftm,
    textAlign: 'center',
    color: Theme.colors.white,
  }
});

export default Register;