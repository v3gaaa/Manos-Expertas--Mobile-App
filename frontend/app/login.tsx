import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Text, TouchableOpacity } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppTextInput from '../components/appTextInput';
import { logIn, getUserByEmail } from '../utils/apiHelper';
// Regex for email and password
//const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,50}$/;
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogIn = async () => {
    //if (!emailRegex.test(email)) {
      //Alert.alert('Error', 'Por favor ingresa un correo válido.');
      //return;
    //}

    //if (!passwordRegex.test(password)) {
      //Alert.alert(
        //'Error', 
        //'La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial, y no exceder 50 caracteres.'
      //);
      //return;
    //}
    try {
      const response = await logIn(email, password);

      if (response && response.token) {
        // Obtiene el token y los datos del usuario
        const { token, user } = response;

        // Guarda el token y los datos del usuario en el almacenamiento local
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user)); // Optional: store user details

        Alert.alert('Éxito', `Inicio de sesión exitoso. Bienvenido, ${user.name}!`);

        // Navega basado en permisos del usuario
        if (user.admin) {
          navigation.navigate('AdminHome'); // Si es admin, navega a la pantalla de inicio de admin
        } else {
          navigation.navigate('Home'); // Navegar a la pantalla de inicio
        }
      } else {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un problema al intentar iniciar sesión');
    }
  };

  return (
    <SafeAreaView>
      <View style={{ padding: spacing * 2 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.mainTitle, { margin: spacing * 3 }]}>Iniciar Sesión</Text>
          <Text style={styles.subTitle}>Bienvenido de vuelta</Text>
        </View>
        <View style={{ marginVertical: spacing * 3 }}>
          <AppTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            maxLength={50} // Limits password length to 50 characters
          />
        </View>
        <View>
          <Text style={{ fontFamily: fonts.MontserratBold, fontSize: Theme.size.xs, color: Theme.colors.bamxRed, alignSelf: 'flex-end' }}>
            ¿Olvidaste tu contraseña?
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogIn} style={styles.btn}>
          <Text style={styles.btnText}>Ingresa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ padding: spacing }}>
          <Text style={{
            fontFamily: fonts.PoppinsSemiBold,
            fontWeight: '700',
            color: Theme.colors.bamxGrey,
            textAlign: 'center',
            fontSize: Theme.size.sm,
            marginTop: spacing,
          }}>
            Crea una cuenta nueva
          </Text>
        </TouchableOpacity>
      </View>
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

export default Login;
