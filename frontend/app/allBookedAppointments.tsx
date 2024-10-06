import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/footer';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { getUserBookings } from '../utils/apiHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllBookedAppointments = () => {
  const [bookings, setBookings] = useState<any[]>([]); // Para almacenar las reservas del usuario
  const [loading, setLoading] = useState<boolean>(true); // Para manejar el estado de carga
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        // Obtén el userId desde AsyncStorage
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          const userId = parsedUser._id;

          // Llamada a la API para obtener las reservas del usuario
          const userBookings = await getUserBookings(userId);
          setBookings(userBookings || []); // Guarda las reservas obtenidas
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del usuario');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Alert.alert('Error', 'Hubo un problema al obtener tus reservas');
      } finally {
        setLoading(false); // Detén el indicador de carga
      }
    };

    fetchUserBookings();
  }, []);

  const renderBookingCard = ({ item }: { item: any }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.workerName}>{item.worker.name} {item.worker.lastName}</Text>
      <Text style={styles.profession}>{item.worker.profession}</Text>
      <Text style={styles.date}>Fecha: {new Date(item.startDate).toLocaleDateString()}</Text>
      <Text style={styles.time}>Horas por día: {item.hoursPerDay}</Text>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
      >
        <Text style={styles.detailsButtonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Citas Agendadas</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.bamxGreen} />
        </View>
      ) : bookings.length === 0 ? (
        <Text style={styles.noBookingsText}>No tienes citas agendadas.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 100, // Add extra padding at the bottom for the footer
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
    backgroundColor: Theme.colors.bamxGreen,
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
  noBookingsText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    textAlign: 'center',
    color: Theme.colors.bamxGrey,
    marginTop: spacing * 4,
  },
});

export default AllBookedAppointments;
