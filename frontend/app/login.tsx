import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppTextInput from '../components/appTextInput';
import { logIn } from '../utils/apiHelper';
import { Eye, EyeOff } from 'lucide-react-native';
import { sanitizeEmail, sanitizeInput, isValidEmail } from '../utils/inputValidation';

const MAX_LOGIN_ATTEMPTS = 15;
const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Load login attempts from AsyncStorage
    loadLoginAttempts();
  }, []);

  const loadLoginAttempts = async () => {
    try {
      const attempts = await AsyncStorage.getItem('loginAttempts');
      const lockout = await AsyncStorage.getItem('lockoutTime');
      if (attempts) setLoginAttempts(parseInt(attempts, 10));
      if (lockout) setLockoutTime(parseInt(lockout, 10));
    } catch (error) {
      console.error('Error loading login attempts:', error);
    }
  };

  const saveLoginAttempts = async (attempts: number, lockout: number | null) => {
    try {
      await AsyncStorage.setItem('loginAttempts', attempts.toString());
      if (lockout) {
        await AsyncStorage.setItem('lockoutTime', lockout.toString());
      } else {
        await AsyncStorage.removeItem('lockoutTime');
      }
    } catch (error) {
      console.error('Error saving login attempts:', error);
    }
  };

  const handleLogIn = async () => {
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedEmail.trim() || !sanitizedPassword.trim()) {
      Alert.alert('Error', 'Por favor, ingresa tu email y contraseña');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido');
      return;
    }

    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      const currentTime = new Date().getTime();
      if (lockoutTime && currentTime < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime - currentTime) / 60000);
        Alert.alert('Error', `Tu cuenta está bloqueada. Intenta de nuevo en ${remainingTime} minutos.`);
        return;
      } else {
        // Reset attempts if lockout period has passed
        setLoginAttempts(0);
        setLockoutTime(null);
        await saveLoginAttempts(0, null);
      }
    }

    setIsLoading(true);
    try {
      const response = await logIn(sanitizedEmail, sanitizedPassword);
  
      if (response.success) {
        const { token, user } = response;
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        Alert.alert('Éxito', `Inicio de sesión exitoso. Bienvenido, ${user.name}!`);
        setLoginAttempts(0);
        setLockoutTime(null);
        await saveLoginAttempts(0, null);
        if (user.admin) {
          navigation.navigate('AdminHome');
        } else {
          navigation.navigate('Home');
        }
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const newLockoutTime = new Date().getTime() + LOCK_DURATION;
          setLockoutTime(newLockoutTime);
          await saveLoginAttempts(newAttempts, newLockoutTime);
          Alert.alert('Error', 'Has excedido el número máximo de intentos. Tu cuenta ha sido bloqueada por 30 minutos.');
        } else {
          await saveLoginAttempts(newAttempts, null);
          Alert.alert('Error', `Credenciales incorrectas. Intentos restantes: ${MAX_LOGIN_ATTEMPTS - newAttempts}`);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Ocurrió un problema al intentar iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.mainTitle}>Iniciar Sesión</Text>
            <Text style={styles.subTitle}>Bienvenido de vuelta</Text>
          </View>
          <View style={styles.form}>
            <AppTextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <AppTextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                maxLength={50}
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
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogIn} style={styles.btn} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={Theme.colors.white} />
            ) : (
              <Text style={styles.btnText}>Ingresar</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
            <Text style={styles.registerLinkText}>
              Crea una cuenta nueva
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing * 2,
  },
  forgotPasswordText: {
    fontFamily: fonts.MontserratBold,
    fontSize: Theme.size.xs,
    color: Theme.colors.bamxRed,
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
  registerLink: {
    padding: spacing,
    marginTop: spacing,
  },
  registerLinkText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontWeight: '700',
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
    fontSize: Theme.size.sm,
  },
});

export default Login;