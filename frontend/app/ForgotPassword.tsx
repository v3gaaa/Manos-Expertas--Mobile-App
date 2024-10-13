import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import AppTextInput from '../components/appTextInput';
import { requestPasswordReset } from '../utils/apiHelper';
import { ArrowLeft } from 'lucide-react-native';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      setEmailError('Por favor, ingresa un correo electrónico válido');
      return;
    }
    setEmailError('');
    setIsLoading(true);
    try {
      const response = await requestPasswordReset(email);
      if (response.success) {
        Alert.alert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña');
        navigation.navigate('ResetPassword', { email });
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      Alert.alert('Error', 'Ocurrió un problema al intentar solicitar el restablecimiento de contraseña');
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
          <Text style={styles.subTitle}>Ingresa tu correo electrónico para restablecer tu contraseña</Text>
        </View>
        <View style={styles.form}>
          <AppTextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>
        <TouchableOpacity onPress={handlePasswordReset} style={styles.btn} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Theme.colors.white} />
          ) : (
            <Text style={styles.btnText}>Enviar Solicitud</Text>
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
  }
});

export default ForgotPassword;