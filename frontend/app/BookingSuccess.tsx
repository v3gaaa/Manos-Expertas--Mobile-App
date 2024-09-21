import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Feather } from '@expo/vector-icons';

export default function BookingSuccess() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId, selectedDate, startDate, endDate } = route.params as {
    workerId: string;
    selectedDate: string;
    startDate: string;
    endDate: string;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={80} color={Theme.colors.bamxGreen} />
        </View>
        <Text style={styles.title}>¡Reserva exitosa!</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={24} color={Theme.colors.bamxGrey} />
            <Text style={styles.details}>Día: {selectedDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="clock" size={24} color={Theme.colors.bamxGrey} />
            <Text style={styles.details}>Hora de inicio: {startDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="clock" size={24} color={Theme.colors.bamxGrey} />
            <Text style={styles.details}>Hora de finalización: {endDate}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
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
  iconContainer: {
    marginBottom: spacing * 2,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    color: Theme.colors.bamxGreen,
    marginBottom: spacing * 3,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: spacing,
    padding: spacing * 2,
    width: '100%',
    ...Theme.shadows.shadow,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing,
  },
  details: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    marginLeft: spacing,
  },
  continueButton: {
    marginTop: spacing * 3,
    paddingVertical: spacing * 1.5,
    paddingHorizontal: spacing * 3,
    borderRadius: spacing,
    backgroundColor: Theme.colors.bamxGreen,
    alignItems: 'center',
    ...Theme.shadows.shadow,
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
});