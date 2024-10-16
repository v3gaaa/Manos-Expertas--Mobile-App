import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppTextInput from '../components/appTextInput';
import { requestVerification, verifyAndRegister } from '../utils/apiHelper';
import { Eye, EyeOff } from 'lucide-react-native';
import { 
  isValidEmail, 
  isValidName, 
  isValidPhone, 
  isValidPassword, 
  sanitizeInput, 
  sanitizeEmail, 
  sanitizePhone,
  getValidationErrorMessage
} from '../utils/inputValidation';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('details'); // 'details' or 'verification'
  const navigation = useNavigation();

  const handleRequestVerification = async () => {
    const sanitizedEmail = sanitizeEmail(email);
    
    if (!isValidEmail(sanitizedEmail)) {
      Alert.alert('Error', getValidationErrorMessage('email'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await requestVerification(sanitizedEmail);
      if (response.success) {
        setStep('verification');
        Alert.alert('Éxito', 'Código de verificación enviado a su correo');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Verification request error:', error);
      Alert.alert('Error', 'Ocurrió un problema al enviar el código de verificación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedPhone = sanitizePhone(phone);
  
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
  
    setIsLoading(true);
    try {
      const newUser = {
        name: sanitizedName,
        lastName: sanitizedLastName,
        email: sanitizedEmail,
        password: password,
        phoneNumber: sanitizedPhone,
        profilePicture: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        },
        admin: false,
        salt: ''
      };
  
      const response = await verifyAndRegister(newUser, verificationCode);
  
      if (response.success) {
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        Alert.alert('Éxito', 'Usuario registrado exitosamente');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error', 'Ocurrió un problema al intentar registrar al usuario');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.mainTitle}>Crea una cuenta</Text>
              <Text style={styles.subTitle}>Ingresa y explora todos los servicios que tenemos para ti</Text>
            </View>
            {step === 'details' ? (
              <View style={styles.form}>
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
                <View style={styles.passwordContainer}>
                  <AppTextInput
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff color={Theme.colors.bamxGrey} size={24} />
                    ) : (
                      <Eye color={Theme.colors.bamxGrey} size={24} />
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleRequestVerification} style={styles.btn} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color={Theme.colors.white} />
                  ) : (
                    <Text style={styles.btnText}>Solicitar Verificación</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <AppTextInput
                  placeholder="Código de Verificación"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                />
                <TouchableOpacity onPress={handleRegister} style={styles.btn} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color={Theme.colors.white} />
                  ) : (
                    <Text style={styles.btnText}>Registrarse</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>
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
    backgroundColor: Theme.colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing * 3,
  },
  mainTitle: {
    fontFamily: fonts.CocoSharp,
    fontSize: Theme.size.xl,
    color: Theme.colors.bamxGreen,
    marginBottom: spacing,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: fonts.PoppinsMedium,
    fontWeight: '600',
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing * 2,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  btn: {
    padding: spacing,
    width: '60%',
    alignSelf: 'center',
    backgroundColor: Theme.colors.bamxRed,
    borderRadius: spacing,
    ...Theme.shadows,
  },
  btnText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontWeight: '700',
    fontSize: Theme.size.aftm,
    textAlign: 'center',
    color: Theme.colors.white,
  },
  loginLink: {
    padding: spacing,
    marginTop: spacing,
  },
  loginLinkText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontWeight: '700',
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
    fontSize: Theme.size.sm,
  },
});

export default Register;