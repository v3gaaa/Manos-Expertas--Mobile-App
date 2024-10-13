import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import AppTextInput from '../components/appTextInput';
import { requestPasswordReset } from '../utils/apiHelper';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
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
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: spacing * 2 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.mainTitle, { margin: spacing }]}>Restablecer Contraseña</Text>
          <Text style={styles.subTitle}>Ingresa tu correo electrónico para restablecer tu contraseña</Text>
        </View>
        <View style={{ marginVertical: spacing * 2 }}>
          <AppTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity onPress={handlePasswordReset} style={styles.btn}>
          <Text style={styles.btnText}>Enviar Solicitud</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  btn: {
    padding: spacing,
    width: '60%',
    alignSelf: 'center',
    backgroundColor: Theme.colors.bamxRed,
    borderRadius: spacing,
    marginTop: spacing * 3,
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
