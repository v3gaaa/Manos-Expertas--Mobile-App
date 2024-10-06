import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Feather } from '@expo/vector-icons';

export default function BookingSuccess() {
  const navigation = useNavigation();
  const route = useRoute();
  const { workerId, selectedDates, hoursPerDay } = route.params as { workerId: string; selectedDates: string[]; hoursPerDay: number };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Feather name="check-circle" size={100} color={Theme.colors.bamxGreen} />
        <Text style={styles.title}>¡Reserva exitosa!</Text>
        <Text style={styles.subtitle}>Tu reserva ha sido confirmada</Text>

        <Text style={styles.description}>
          Detalles de la reserva:
        </Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>ID del Trabajador: {workerId}</Text>
          <Text style={styles.detailsText}>Fechas: {selectedDates.join(', ')}</Text>
          <Text style={styles.detailsText}>Horas por día: {hoursPerDay}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={handleGoHome}
      >
        <Text style={styles.homeButtonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing * 2,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xxl,
    color: Theme.colors.black,
    marginTop: spacing * 2,
    marginBottom: spacing,
  },
  subtitle: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.lg,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing * 2,
  },
  description: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    textAlign: 'center',
    marginBottom: spacing * 2,
  },
  detailsContainer: {
    backgroundColor: Theme.colors.white,
    padding: spacing * 2,
    borderRadius: spacing,
    ...Theme.shadows,
  },
  detailsText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    marginBottom: spacing,
  },
  homeButton: {
    margin: spacing * 2,
    paddingVertical: spacing * 1.5,
    borderRadius: spacing,
    backgroundColor: Theme.colors.bamxGreen,
    alignItems: 'center',
    ...Theme.shadows,
  },
  homeButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
});
