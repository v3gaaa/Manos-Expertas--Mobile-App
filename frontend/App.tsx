import React from 'react';
import {useState, useEffect, useCallback} from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from './types';
import Navigation from './navigation';
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Narnia: require('./assets/fonts/Narnia.ttf'),
    CocoSharp: require('./assets/fonts/CocoSharp.ttf'),
    Etalene: require('./assets/fonts/Etalene.ttf'),
    MontserratBold: require('./assets/fonts/MontserratBold.ttf'),
    MontserratRg: require('./assets/fonts/MontserratRg.ttf'),
    PoppinsBlack: require('./assets/fonts/PoppinsBl.ttf'),
    PoppinsBold: require('./assets/fonts/PoppinsB.ttf'),
    PoppinsExtraBold: require('./assets/fonts/PoppinsExtraBold.ttf'),
    PoppinsMedium: require('./assets/fonts/PoppinsMedium.ttf'),
    PoppinsSemiBold: require('./assets/fonts/PoppinsSemiBold.ttf'),
    Ragenik: require('./assets/fonts/Ragenik.otf'),
    RobotoBlack: require('./assets/fonts/RobotoBlack.ttf'),
    RobotoMedium: require('./assets/fonts/RobotoMedium.ttf'),
    SerifBl: require('./assets/fonts/SerifBl.ttf'),
    });
    const onLayoutRootView = useCallback(async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);
  
    if (!fontsLoaded) {
      return null; // Render nothing until fonts are loaded
    }
  
    return (
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <Navigation />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF', // Cambiar color de fondo a blanco para mezclar con el footer
    },
  });
