import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getBookingById } from '../utils/apiHelper';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Feather } from '@expo/vector-icons';

const BookingDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookingId } = route.params as { bookingId: string };

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Theme.colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Detalles de la Reserva</Text>
        </View>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={64} color={Theme.colors.bamxRed} />
          <Text style={styles.errorText}>No se encontraron detalles para esta reserva.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalles de la Reserva</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.workerInfoCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {bookingDetails.worker.name[0]}{bookingDetails.worker.lastName[0]}
            </Text>
          </View>
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>
              {bookingDetails.worker.name} {bookingDetails.worker.lastName}
            </Text>
            <Text style={styles.profession}>{bookingDetails.worker.profession}</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <DetailRow icon="calendar" label="Fecha de Inicio" value={new Date(bookingDetails.startDate).toLocaleDateString()} />
          <DetailRow icon="calendar" label="Fecha de Fin" value={new Date(bookingDetails.endDate).toLocaleDateString()} />
          <DetailRow icon="clock" label="Horas por Día" value={`${bookingDetails.hoursPerDay} horas`} />
          <DetailRow icon="clock" label="Total de Horas" value={`${bookingDetails.totalHours} horas`} />
          <DetailRow icon="info" label="Estado" value={bookingDetails.status} />
        </View>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => Alert.alert('Contacto', 'Función de contacto no implementada aún.')}
        >
          <Feather name="phone" size={20} color={Theme.colors.white} />
          <Text style={styles.contactButtonText}>Contactar al Trabajador</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Feather name={icon} size={20} color={Theme.colors.bamxGreen} style={styles.detailIcon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing * 2,
    backgroundColor: Theme.colors.bamxYellow,
    borderBottomLeftRadius: spacing * 2,
    borderBottomRightRadius: spacing * 2,
  },
  backButton: {
    marginRight: spacing * 2,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    color: Theme.colors.black,
    flex: 1,
  },
  scrollContent: {
    padding: spacing * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workerInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    padding: spacing * 2,
    borderRadius: spacing * 2,
    marginBottom: spacing * 2,
    ...Theme.shadows,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.bamxGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing * 2,
  },
  avatarText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.lg,
    color: Theme.colors.white,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.lg,
    color: Theme.colors.black,
  },
  profession: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
  },
  detailCard: {
    backgroundColor: Theme.colors.white,
    padding: spacing * 2,
    borderRadius: spacing * 2,
    marginBottom: spacing * 2,
    ...Theme.shadows,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing * 2,
  },
  detailIcon: {
    marginRight: spacing,
  },
  label: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
  },
  value: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
  },
  contactButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.bamxGreen,
    padding: spacing * 1.5,
    borderRadius: spacing * 3,
    ...Theme.shadows,
  },
  contactButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
    marginLeft: spacing,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing * 2,
  },
  errorText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    textAlign: 'center',
    color: Theme.colors.bamxRed,
    marginTop: spacing * 2,
  },
});

export default BookingDetails;