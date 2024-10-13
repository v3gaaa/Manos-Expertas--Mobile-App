import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, Animated } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import AppTextInput from '../components/appTextInput';
import { resetPassword } from '../utils/apiHelper';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';

const ResetPassword: React.FC<any> = ({ route }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateCode = (code: string) => {
    return code.length === 6 && /^\d+$/.test(code);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validatePasswordsMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const handleResetPassword = async () => {
    let isValid = true;

    if (!validateCode(code)) {
      setCodeError('El código debe ser de 6 dígitos');
      isValid = false;
    } else {
      setCodeError('');
    }

    if (!validatePassword(newPassword)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!validatePasswordsMatch(newPassword, confirmPassword)) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await resetPassword(email, code, newPassword);
      if (response.success) {
        Alert.alert('Éxito', 'Tu contraseña ha sido restablecida con éxito');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'Ocurrió un problema al intentar restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={Theme.colors.bamxGreen} size={24} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Restablecer Contraseña</Text>
          <Text style={styles.subTitle}>Ingresa el código que recibiste y tu nueva contraseña</Text>
        </View>
        <View style={styles.form}>
          <AppTextInput
            placeholder="Código de Verificación"
            value={code}
            onChangeText={(text) => {
              setCode(text);
              setCodeError('');
            }}
            keyboardType="numeric"
            error={codeError}
          />
          {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}
          <View style={styles.passwordContainer}>
            <AppTextInput
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              error={passwordError}
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
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          <View style={styles.passwordContainer}>
            <AppTextInput
              placeholder="Confirmar Nueva Contraseña"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
              }}
              secureTextEntry={!showConfirmPassword}
              error={confirmPasswordError}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff color={Theme.colors.bamxGrey} size={24} />
              ) : (
                <Eye color={Theme.colors.bamxGrey} size={24} />
              )}
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        </View>
        <TouchableOpacity onPress={handleResetPassword} style={styles.btn} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Theme.colors.white} />
          ) : (
            <Text style={styles.btnText}>Restablecer Contraseña</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
  },
  content: {
    flex: 1,
    padding: spacing * 2,
  },
  backButton: {
    position: 'absolute',
    top: spacing * 2,
    left: spacing * 2,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing * 6,
    marginBottom: spacing * 4,
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
    marginBottom: spacing * 1.2,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing * 4,
  },
  passwordContainer: {
    position: 'relative',
    marginTop: spacing * 2,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  errorText: {
    color: Theme.colors.bamxRed,
    fontSize: Theme.size.sm,
    marginTop: spacing,
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
});

export default ResetPassword;