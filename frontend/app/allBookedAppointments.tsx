// allBookedAppointments.tsx
import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import Footer from '../components/footer';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

// Placeholder data
const bookingPlaceholders = [
  { id: '1', workerName: 'Alfredo Morfin', profession: 'Carpintero', date: '08 Oct 2024', startHour: '10:00', endHour: '12:00' },
  { id: '2', workerName: 'María Lopez', profession: 'Plomero', date: '12 Oct 2024', startHour: '13:00', endHour: '14:30' },
  { id: '3', workerName: 'Carlos Gutierrez', profession: 'Electricista', date: '15 Oct 2024', startHour: '09:00', endHour: '11:00' },
  { id: '4', workerName: 'Elena Rodriguez', profession: 'Jardinero', date: '20 Oct 2024', startHour: '08:00', endHour: '10:00' },
];

const AllBookedAppointments = () => {
  const renderBookingCard = ({ item }: { item: any }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.workerName}>{item.workerName}</Text>
      <Text style={styles.profession}>{item.profession}</Text>
      <Text style={styles.date}>Fecha: {item.date}</Text>
      <Text style={styles.time}>Hora: {item.startHour} - {item.endHour}</Text>
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Ver trabajador</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Citas Agendadas</Text>
      <FlatList
        data={bookingPlaceholders}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    textAlign: 'center',
    marginVertical: spacing * 2,
    color: Theme.colors.black,
  },
  listContainer: {
    paddingHorizontal: spacing * 2,
  },
  bookingCard: {
    backgroundColor: Theme.colors.white,
    padding: spacing * 2,
    borderRadius: spacing,
    marginBottom: spacing * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  workerName: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    marginBottom: spacing / 2,
  },
  profession: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing / 2,
  },
  date: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
    marginBottom: spacing / 2,
  },
  time: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
    marginBottom: spacing,
  },
  detailsButton: {
    paddingVertical: spacing / 2,
    backgroundColor: Theme.colors.green,
    borderRadius: spacing / 2,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.white,
    fontSize: Theme.size.sm,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default AllBookedAppointments;
