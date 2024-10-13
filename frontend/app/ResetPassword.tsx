import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import AppTextInput from '../components/appTextInput';
import { resetPassword } from '../utils/apiHelper';
import { useNavigation } from '@react-navigation/native';

const ResetPassword: React.FC<any> = ({ route }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
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
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: spacing * 2 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.mainTitle, { margin: spacing }]}>Restablecer Contraseña</Text>
          <Text style={styles.subTitle}>Ingresa el código que recibiste y tu nueva contraseña</Text>
        </View>
        <View style={{ marginVertical: spacing * 2 }}>
          <AppTextInput
            placeholder="Código de Verificación"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          <AppTextInput
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity onPress={handleResetPassword} style={styles.btn}>
          <Text style={styles.btnText}>Restablecer Contraseña</Text>
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
  },
});

export default ResetPassword;
