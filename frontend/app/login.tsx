import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppTextInput from '../components/appTextInput';
import { logIn } from '../utils/apiHelper';
import { Eye, EyeOff } from 'lucide-react-native';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor, ingresa tu email y contraseña');
      return;
    }

    setIsLoading(true);
    try {
      const response = await logIn(email, password);
  
      if (response.success) {
        const { token, user } = response;
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        Alert.alert('Éxito', `Inicio de sesión exitoso. Bienvenido, ${user.name}!`);
        if (user.admin) {
          navigation.navigate('AdminHome');
        } else {
          navigation.navigate('Home');
        }
      } else {
        Alert.alert('Error', response.message);
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