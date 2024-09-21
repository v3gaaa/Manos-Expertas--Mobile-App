import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

const BookingSuccess: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId, selectedDate, startDate, endDate } = route.params as {
    workerId: string;
    selectedDate: string;
    startDate: string;
    endDate: string;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gracias por reservar</Text>
      <Text style={styles.details}>Día: {selectedDate}</Text>
      <Text style={styles.details}>Hora de inicio: {startDate}</Text>
      <Text style={styles.details}>Hora de finalización: {endDate}</Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing * 2,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    marginBottom: spacing * 2,
    textAlign: 'center',
  },
  details: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    marginBottom: spacing,
  },
  continueButton: {
    marginTop: spacing * 2,
    paddingVertical: spacing,
    borderRadius: spacing,
    backgroundColor: Theme.colors.green,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.white,
  },
});

export default BookingSuccess;
