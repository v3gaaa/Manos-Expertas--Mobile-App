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
import { 
  isValidEmail, 
  isValidName, 
  isValidPhone, 
  isValidPassword, 
  sanitizeInput, 
  sanitizeEmail, 
  sanitizePhone,
  getValidationErrorMessage,
  escapeSQLInput
} from '../utils/inputValidation';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedPhone = sanitizePhone(phone);
  
    if (!isValidEmail(sanitizedEmail)) {
      Alert.alert('Error', getValidationErrorMessage('email'));
      return;
    }
  
    if (!isValidPassword(password)) {
      Alert.alert('Error', getValidationErrorMessage('password'));
      return;
    }
  
    if (!isValidName(sanitizedName)) {
      Alert.alert('Error', getValidationErrorMessage('name'));
      return;
    }
  
    if (!isValidName(sanitizedLastName)) {
      Alert.alert('Error', getValidationErrorMessage('lastName'));
      return;
    }
  
    if (!isValidPhone(sanitizedPhone)) {
      Alert.alert('Error', getValidationErrorMessage('phone'));
      return;
    }
  
    try {
      // Eliminamos la generación de salt y el hasheo del password
      const newUser = {
        name: sanitizedName,
        lastName: sanitizedLastName,
        email: sanitizedEmail,
        password: password,  // Enviar la contraseña tal cual
        phoneNumber: sanitizedPhone,
        profilePicture: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        },
        admin: false,
        salt: '',
      };
  

      const response = await signUp(newUser);

      if (response && response.token) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Failed to register, please try again');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while trying to register');
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