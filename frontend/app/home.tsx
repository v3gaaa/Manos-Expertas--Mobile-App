import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Alert, RefreshControl, SafeAreaView, StatusBar, ScrollView, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWorkersByProfession, getProfessions, getUserBookings, getWorkerAverageRating, getWorkerAverageRatings } from '../utils/apiHelper';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import SearchBar from '../components/SearchBar';
import WorkerCard from '../components/WorkerCard';
import CitasCard from '../components/CitasCard';
import Footer from '../components/footer';
import { Bell, Calendar, LogOut } from 'lucide-react-native';
import { getUnreadNotificationsCount } from '../utils/notificationService';

interface Booking {
  _id: string;
  worker: {
    _id: string;
    name: string;
    lastName: string;
    profession: string;
    rating?: number;
    reviews?: number;
  };
  startDate: string;
  endDate: string;
  status: string;
  hoursPerDay: number;
  totalHours: number;
}

interface Worker {
  _id: string;
  name: string;
  lastName: string;
  profession: string;
  profilePicture: string;
  rating?: number;
}

export default function Home() {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ _id: string; name: string; lastName: string; profilePicture: string } | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<string>('Todo');
  const [professions, setProfessions] = useState<string[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const loadUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');
      if (token && user) {
        setUserToken(token);
        setUserData(JSON.parse(user));
      } else {
        Alert.alert('No autenticado', 'No se encontró un token de usuario, por favor inicia sesión.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error cargando token: ', error);
    }
  }, [navigation]);

  const fetchProfessions = useCallback(async () => {
    try {
      const professionData = await getProfessions();
      setProfessions(['Todo', ...professionData]);
    } catch (error) {
      console.error('Error fetching professions: ', error);
    }
  }, []);

  const fetchWorkerRatings = async (workersData: Worker[]) => {
    try {
      const workerIds = workersData.map(worker => worker._id);
      const ratingsData = await getWorkerAverageRatings(workerIds);
  
      if (ratingsData) {
        const workersWithRatings = workersData.map(worker => {
          const ratingInfo = ratingsData.find((r: { workerId: string; averageRating: number }) => r.workerId === worker._id);
          return {
            ...worker,
            rating: ratingInfo ? ratingInfo.averageRating : 0
          };
        });
        
        const sortedWorkers = workersWithRatings
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 10);
        setWorkers(sortedWorkers);
      }
    } catch (error) {
      console.error('Error fetching worker ratings:', error);
    }
  };
  

  const fetchWorkers = useCallback(async () => {
    try {
      const workerData = await getWorkersByProfession(selectedProfession === 'Todo' ? '' : selectedProfession);
      if (workerData) {
        await fetchWorkerRatings(workerData);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  }, [selectedProfession]);

  const fetchBookings = useCallback(async () => {
    if (!userData?._id) return;
    try {
      const bookingData = await getUserBookings(userData._id);
      if (bookingData) {
        const bookingsWithRatings = await Promise.all(
          bookingData.map(async (booking: Booking) => {
            const ratingData = await getWorkerAverageRating(booking.worker._id);
            return {
              ...booking,
              worker: {
                ...booking.worker,
                rating: ratingData?.averageRating || 0
              }
            };
          })
        );
        const sortedBookings = bookingsWithRatings.sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setBookings(sortedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, [userData?._id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadUser(),
        fetchProfessions(),
        fetchWorkers(),
        fetchBookings()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadUser, fetchProfessions, fetchWorkers, fetchBookings]);

  useEffect(() => {
    loadUser();
    fetchProfessions();
    fetchWorkers();
    fetchBookings();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [loadUser, fetchProfessions, fetchWorkers, fetchBookings, fadeAnim]);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const count = await getUnreadNotificationsCount();
      setUnreadNotifications(count);
    };

    loadUnreadCount();
    const unsubscribe = navigation.addListener('focus', loadUnreadCount);
    return unsubscribe;
  }, [navigation]);

  const handleSearch = () => {
    if (searchText.trim() === '') {
      Alert.alert('Error', 'Por favor ingrese un término de búsqueda.');
      return;
    }
    navigation.navigate('SearchScreen', { query: searchText });
  };

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate('BookingDetails', { bookingId: booking._id });
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  const handleProfilePress = () => {
    navigation.navigate('UserProfile');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sí, cerrar sesión", 
          onPress: async () => {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const renderWorkerCard = ({ item }: { item: Worker }) => (
    <WorkerCard 
      id={item._id}
      name={item.name} 
      lastName={item.lastName}
      profession={item.profession} 
      profilePicture={item.profilePicture} 
      rating={item.rating || 0} 
    />
  );

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <TouchableOpacity 
      onPress={() => handleBookingPress(item)}
      style={styles.bookingCardContainer}
    >
      <CitasCard 
        name={item.worker.name}
        lastName={item.worker.lastName}
        profession={item.worker.profession}
        date={new Date(item.startDate).toLocaleDateString()}
        rating={item.worker.rating || 0}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.bamxYellow} />
      <Animated.ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ opacity: fadeAnim }}
      >
        <View style={styles.header}>
          {userData && (
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={handleProfilePress}>
                <Image 
                  source={{ 
                    uri: userData.profilePicture || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.basiclines.com%2Fwp-content%2Fuploads%2F2019%2F01%2Fblank-user.jpg&f=1&nofb=1&ipt=ca5e2c2b13f2cf4fb7ec7284dd85147bf639caab21a1a44c81aa07b30eab197e&ipo=images' 
                  }} 
                  style={styles.profileImage} 
                />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.greeting}>Hola, bienvenido 🎉</Text>
                <Text style={styles.userName}>{userData.name}</Text>
              </View>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={handleNotificationsPress}
              >
                <View>
                  <Bell color={Theme.colors.black} size={24} />
                  {unreadNotifications > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadNotifications > 99 ? '99+' : unreadNotifications}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={handleLogout}
              >
                <LogOut color={Theme.colors.black} size={24} />
              </TouchableOpacity>
            </View>
          )}
          <SearchBar searchText={searchText} setSearchText={setSearchText} handleSearch={handleSearch} />
        </View>

        <View style={styles.professionCarouselContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={professions}
            style={styles.professionCarousel}
            keyExtractor={(item) => item}
            renderItem={({ item: profession }) => (
              <TouchableOpacity
                style={[styles.professionButton, selectedProfession === profession && styles.professionButtonSelected]}
                onPress={() => setSelectedProfession(profession)}
              >
                <Text style={[styles.professionButtonText, selectedProfession === profession && styles.professionButtonTextSelected]}>
                  {profession}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Trabajadores</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { query: "todos" })}>
            <Text style={styles.viewAllButton}>Ver Todo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={workers}
          renderItem={renderWorkerCard}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workerGrid}
          ItemSeparatorComponent={() => <View style={{ width: spacing }} />}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Citas agendadas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('allBookedAppointments')}>
            <Text style={styles.viewAllButton}>Ver Todo</Text>
          </TouchableOpacity>
        </View>

        {bookings.length > 0 ? (
          <View style={styles.bookingGrid}>
            {bookings.slice(0, 4).map((booking) => (
              <View key={booking._id} style={styles.bookingCardContainer}>
                {renderBookingCard({ item: booking })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyBookingsContainer}>
            <Calendar color={Theme.colors.bamxGrey} size={48} />
            <Text style={styles.emptyBookingsText}>No tienes citas agendadas</Text>
            <TouchableOpacity style={styles.scheduleButton}>
              <Text style={styles.scheduleButtonText}>Agendar una cita</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  header: {
    paddingVertical: spacing * 2,
    paddingHorizontal: spacing * 2,
    backgroundColor: Theme.colors.bamxYellow,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing * 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: Theme.size.ms,
    fontFamily: fonts.PoppinsMedium,
    color: Theme.colors.black,
  },
  userName: {
    fontSize: Theme.size.l,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.black,
  },
  iconButton: {
    padding: spacing,
  },
  professionCarouselContainer: {
    paddingVertical: spacing * 2,
    paddingLeft: spacing,
    paddingRight: spacing,
    backgroundColor: Theme.colors.bamxYellow,
  
  },
  professionButton: {
    paddingHorizontal: spacing * 2,
    paddingVertical: spacing,
    backgroundColor: Theme.colors.almostWhite,
    borderRadius: spacing * 2,
    marginRight: spacing,
    justifyContent: 'center',
    height: 'auto',
    alignSelf: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  professionButtonSelected: {
    backgroundColor: Theme.colors.bamxRed,
  },
  professionButtonText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
  },
  professionButtonTextSelected: {
    color: Theme.colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing * 2,
    marginTop: spacing * 2,
    marginBottom: spacing,
  },
  sectionTitle: {
    fontSize: Theme.size.lg,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.bamxGrey,
  },
  viewAllButton: {
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxRed,
    fontFamily: fonts.PoppinsMedium,
  },
  workerGrid: {
    paddingHorizontal: spacing,
  },
  bookingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing * 2,
  },
  bookingCardContainer: {
    width: '48%',
    marginBottom: spacing * 2,
  },
  emptyBookingsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing * 4,
  },
  emptyBookingsText: {
    fontSize: Theme.size.m,
    fontFamily: fonts.PoppinsMedium,
    color: Theme.colors.bamxGrey,
    marginTop: spacing * 2,
    marginBottom: spacing * 3,
  },
  scheduleButton: {
    backgroundColor: Theme.colors.bamxRed,
    paddingHorizontal: spacing * 3,
    paddingVertical: spacing,
    borderRadius: spacing,
  },
  scheduleButtonText: {
    color: Theme.colors.white,
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
  },
  professionCarousel: {
    flexGrow: 0,
    height: spacing * 5,
  },
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: Theme.colors.bamxRed,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  notificationBadgeText: {
    color: Theme.colors.white,
    fontSize: Theme.size.xs,
    fontFamily: fonts.PoppinsSemiBold,
  },
});