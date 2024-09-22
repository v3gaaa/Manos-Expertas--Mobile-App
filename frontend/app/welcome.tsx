import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import spacing from '../constants/spacing';
import { Theme } from '../constants/theme';
import fonts from '../constants/fonts';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function Welcome({ navigation: { navigate } }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../assets/images/welcomeProfessions.png')}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.mainTitle}>¡BIENVENIDO A MANOS EXPERTAS!</Text>
            <Text style={styles.subTitle}>
              Manos Expertas ofrece un catálogo de trabajadores avalados por el Banco de Alimentos de México, listos para brindarte su ayuda.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => navigate('Login')}
              style={[styles.button, styles.loginButton]}
            >
              <Text style={[styles.buttonText, styles.loginButtonText]}>Inicia sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigate('Register')}
              style={[styles.button, styles.registerButton]}
            >
              <Text style={[styles.buttonText, styles.registerButtonText]}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between', // Ensure the content grows to allow scrolling
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing,
  },
  imageContainer: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: spacing * 2,
  },
  mainTitle: {
    fontFamily: fonts.CocoSharp,
    fontSize: Theme.size.xl,
    color: Theme.colors.bamxGreen,
    marginBottom: spacing * 1.5,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
    paddingHorizontal: spacing,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing * 2,
  },
  button: {
    flex: 1,
    borderRadius: spacing,
    paddingVertical: spacing * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows,
  },
  loginButton: {
    backgroundColor: Theme.colors.bamxYellow,
    marginRight: spacing,
  },
  registerButton: {
    backgroundColor: Theme.colors.bamxGreen,
    marginLeft: spacing,
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    textAlign: 'center',
  },
  loginButtonText: {
    color: Theme.colors.black,
  },
  registerButtonText: {
    color: Theme.colors.white,
  },
});