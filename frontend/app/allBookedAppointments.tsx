import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, SafeAreaView, SectionList, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/footer';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { getUserBookings } from '../utils/apiHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const AllBookedAppointments = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation();

  const fetchUserBookings = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        const userId = parsedUser._id;
        const userBookings = await getUserBookings(userId);
        setBookings(userBookings || []);
      } else {
        Alert.alert('Error', 'No se pudo obtener la información del usuario');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Hubo un problema al obtener tus reservas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserBookings();
  }, [fetchUserBookings]);

  const groupBookingsByMonth = useCallback((bookings) => {
    const grouped = bookings.reduce((acc, booking) => {
      const date = new Date(booking.startDate);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(booking);
      return acc;
    }, {});

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, []);

  const renderBookingCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalles de la cita con ${item.worker.name} ${item.worker.lastName}`}
    >
      <View style={styles.cardContent}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.worker.name[0]}{item.worker.lastName[0]}
          </Text>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.workerName}>{item.worker.name} {item.worker.lastName}</Text>
          <Text style={styles.profession}>{item.worker.profession}</Text>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={14} color={Theme.colors.bamxGreen} />
            <Text style={styles.infoText}>
              {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="clock" size={14} color={Theme.colors.bamxGreen} />
            <Text style={styles.infoText}>{item.hoursPerDay} horas por día</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={24} color={Theme.colors.bamxGrey} />
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Theme.colors.bamxYellow} barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver atrás"
        >
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Citas Agendadas</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.bamxGreen} />
        </View>
      ) : (
        <SectionList
          sections={groupBookingsByMonth(bookings)}
          renderItem={renderBookingCard}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Theme.colors.bamxGreen]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Feather name="calendar" size={64} color={Theme.colors.bamxGrey} />
              <Text style={styles.noBookingsText}>No tienes citas agendadas.</Text>
              <TouchableOpacity
                style={styles.newBookingButton}
                onPress={() => navigation.navigate('WorkerList')}
              >
                <Text style={styles.newBookingButtonText}>Agendar una cita</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.bamxYellow,
    paddingVertical: spacing * 2,
    paddingHorizontal: spacing * 2,
    borderBottomLeftRadius: spacing * 2,
    borderBottomRightRadius: spacing * 2,
  },
  backButton: {
    padding: spacing,
    marginRight: spacing,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    color: Theme.colors.black,
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: Theme.colors.bamxYellow,
    paddingVertical: spacing,
    paddingHorizontal: spacing * 2,
    marginTop: spacing,
    borderRadius: spacing,
    marginHorizontal: spacing,
  },
  sectionHeaderText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    textTransform: 'capitalize',
  },
  bookingCard: {
    backgroundColor: Theme.colors.white,
    marginHorizontal: spacing * 2,
    marginVertical: spacing,
    borderRadius: spacing,
    ...Theme.shadows,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing * 1.5,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Theme.colors.bamxGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing,
  },
  avatarText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
  bookingInfo: {
    flex: 1,
  },
  workerName: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
  },
  profession: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing / 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing / 4,
  },
  infoText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
    marginLeft: spacing / 2,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing * 2,
    paddingTop: spacing * 10,
  },
  noBookingsText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    textAlign: 'center',
    color: Theme.colors.bamxGrey,
    marginTop: spacing * 2,
    marginBottom: spacing * 3,
  },
  newBookingButton: {
    backgroundColor: Theme.colors.bamxGreen,
    paddingVertical: spacing,
    paddingHorizontal: spacing * 2,
    borderRadius: spacing * 3,
  },
  newBookingButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
});

export default AllBookedAppointments;