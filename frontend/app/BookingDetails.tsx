import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getBookingById } from '../utils/apiHelper';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

const BookingDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookingId } = route.params as { bookingId: string };

  const [bookingDetails, setBookingDetails] = useState<any>(null); // Estado para almacenar los detalles de la reserva
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const booking = await getBookingById(bookingId); 
        setBookingDetails(booking);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los detalles de la reserva');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.bamxGreen} />
      </View>
    );
  }

  if (!bookingDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontraron detalles para esta reserva.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Reserva</Text>

      <View style={styles.detailCard}>
        <Text style={styles.workerName}>
          {bookingDetails.worker.name} {bookingDetails.worker.lastName}
        </Text>
        <Text style={styles.profession}>{bookingDetails.worker.profession}</Text>
        <Text style={styles.label}>Fecha de Inicio:</Text>
        <Text style={styles.value}>
          {new Date(bookingDetails.startDate).toLocaleDateString()}
        </Text>
        <Text style={styles.label}>Fecha de Fin:</Text>
        <Text style={styles.value}>
          {new Date(bookingDetails.endDate).toLocaleDateString()}
        </Text>
        <Text style={styles.label}>Horas por Día:</Text>
        <Text style={styles.value}>{bookingDetails.hoursPerDay}</Text>
        <Text style={styles.label}>Total de Horas:</Text>
        <Text style={styles.value}>{bookingDetails.totalHours}</Text>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{bookingDetails.status}</Text>
      </View>

      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
    padding: spacing * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    color: Theme.colors.black,
    textAlign: 'center',
    marginBottom: spacing * 2,
  },
  detailCard: {
    backgroundColor: Theme.colors.white,
    padding: spacing * 2,
    borderRadius: spacing,
    marginBottom: spacing * 2,
    ...Theme.shadows,
  },
  workerName: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.lg,
    color: Theme.colors.black,
    marginBottom: spacing,
  },
  profession: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing * 2,
  },
  label: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    marginBottom: spacing / 2,
  },
  value: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing * 1.5,
  },
  goBackButton: {
    backgroundColor: Theme.colors.bamxGreen,
    padding: spacing * 1.5,
    borderRadius: spacing,
    alignItems: 'center',
  },
  goBackButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
  errorText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    textAlign: 'center',
    color: Theme.colors.bamxRed,
    marginTop: spacing * 4,
  },
});

export default BookingDetails;
