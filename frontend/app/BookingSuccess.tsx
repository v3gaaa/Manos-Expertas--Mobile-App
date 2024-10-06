import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Feather } from '@expo/vector-icons';

export default function BookingSuccess() {
  const navigation = useNavigation();
  const route = useRoute();
  const { workerId, startDate, endDate, hoursPerDay } = route.params as { workerId: string; startDate: string; endDate: string; hoursPerDay: number };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const getDaysBetweenDates = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    return days;
  };

  const totalDays = getDaysBetweenDates(startDate, endDate);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={100} color={Theme.colors.bamxGreen} />
        </View>
        <Text style={styles.title}>¡Reserva exitosa!</Text>
        <Text style={styles.subtitle}>Tu reserva ha sido confirmada</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Detalles de la reserva:</Text>
          <View style={styles.detailRow}>
            <Feather name="user" size={20} color={Theme.colors.bamxGrey} />
            <Text style={styles.detailsText}>ID del Trabajador: {workerId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={20} color={Theme.colors.bamxGrey} />
            <Text style={styles.detailsText}>Fecha de inicio: {startDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={20} color={Theme.colors.bamxGrey} />
            <Text style={styles.detailsText}>Fecha de fin: {endDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="clock" size={20} color={Theme.colors.bamxGrey} />
            <Text style={styles.detailsText}>Horas por día: {hoursPerDay}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={20} color={Theme.colors.bamxGrey} />
            <Text style={styles.detailsText}>Días totales: {totalDays}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="info" size={20} color={Theme.colors.bamxGrey} />
            <Text style={styles.detailsText}>Total de horas: {totalDays * hoursPerDay}</Text>
          </View>
        </View>

        <Text style={styles.thankYouText}>
          Gracias por usar nuestro servicio. Si tienes alguna pregunta, no dudes en contactarnos.
        </Text>
      </ScrollView>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing * 2,
  },
  iconContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: 100,
    padding: spacing * 2,
    marginBottom: spacing * 2,
    ...Theme.shadows,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xxl,
    color: Theme.colors.black,
    marginBottom: spacing,
  },
  subtitle: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.lg,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing * 3,
  },
  detailsContainer: {
    backgroundColor: Theme.colors.white,
    padding: spacing * 2,
    borderRadius: spacing * 2,
    width: '100%',
    ...Theme.shadows,
  },
  detailsTitle: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.lg,
    color: Theme.colors.black,
    marginBottom: spacing,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing,
  },
  detailsText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    marginLeft: spacing,
  },
  thankYouText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
    marginTop: spacing * 3,
    marginBottom: spacing * 2,
  },
  homeButton: {
    margin: spacing * 2,
    paddingVertical: spacing * 1.5,
    borderRadius: spacing * 3,
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