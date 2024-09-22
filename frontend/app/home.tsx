import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWorkersByProfession, getProfessions } from '../utils/apiHelper';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import SearchBar from '../components/SearchBar';
import WorkerCard from '../components/WorkerCard';
import CitasCard from '../components/CitasCard';

const Home: React.FC = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ name: string; lastName: string; profilePicture: string } | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<string>('Todo');
  const [professions, setProfessions] = useState<string[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
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
    };
    loadUser();
  }, [navigation]);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const professionData = await getProfessions();
        setProfessions(['Todo', ...professionData]);
      } catch (error) {
        console.error('Error fetching professions: ', error);
      }
    };
    fetchProfessions();
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const workerData = await getWorkersByProfession(selectedProfession === 'Todo' ? '' : selectedProfession);
        setWorkers(workerData || []);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    fetchWorkers();
  }, [selectedProfession]);

  const handleSearch = () => {
    if (searchText.trim() === '') {
      Alert.alert('Error', 'Por favor ingrese un término de búsqueda.');
      return;
    }
    navigation.navigate('SearchScreen', { query: searchText });
  };

  const renderWorkerCard = ({ item }: { item: any }) => (
    <WorkerCard 
      id={item._id}
      name={item.name} 
      profession={item.profession} 
      profilePicture={item.profilePicture} 
      rating={item.rating || 4.5} 
    />
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Simulate fetching bookings; replace with actual API call
        const bookingData = [
          { id: '1', name: 'Mateo', lastName: 'Boaz', profession: 'Pintor', date: '7 Oct 2024', rating: 4.0, reviews: 51 },
          { id: '2', name: 'Johan', lastName: 'Günter', profession: 'Carpintero', date: '23 Ago 2024', rating: 3.9, reviews: 12 },
          // Add more sample bookings here
        ];
        setBookings(bookingData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  const renderBookingCard = ({ item }: { item: any }) => (
    <CitasCard 
      name={item.name}
      lastName={item.lastName}
      profession={item.profession}
      date={item.date}
      reviews={item.reviews}
      rating={item.rating}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {userData && (
          <View style={styles.profileContainer}>
            <Image source={{ uri: userData.profilePicture || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.basiclines.com%2Fwp-content%2Fuploads%2F2019%2F01%2Fblank-user.jpg&f=1&nofb=1&ipt=ca5e2c2b13f2cf4fb7ec7284dd85147bf639caab21a1a44c81aa07b30eab197e&ipo=images' }} style={styles.profileImage} />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Hola, bienvenido 🎉</Text>
              <Text style={styles.userName}>{userData.name} {userData.lastName}</Text>
            </View>
          </View>
        )}
        <SearchBar searchText={searchText} setSearchText={setSearchText} handleSearch={handleSearch} />
      </View>

      <View style={styles.professionCarouselContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={professions}
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

      <FlatList
        data={workers}
        renderItem={renderWorkerCard}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.workerGrid} // Removed flexWrap
      />

      {/* Citas Agendadas Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Citas agendadas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('allBookedAppointments')}>
          <Text style={styles.viewAllButton}>Ver Todo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings.slice(0, 4)} // Only show the 4 closest appointments
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display 2 columns
        columnWrapperStyle={styles.row} // Ensure rows are displayed properly
        contentContainerStyle={styles.bookingGrid}
      />

    </ScrollView>
  );
};

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
  searchBarContainer: {
    marginTop: spacing * 2,
    marginBottom: spacing * 2,
    alignItems: 'center',
  },
  professionCarouselContainer: {
    paddingVertical: spacing * 2,
    paddingLeft: spacing,
    paddingRight: spacing,
  },
  professionButton: {
    paddingHorizontal: spacing * 2,
    paddingVertical: 5,
    backgroundColor: Theme.colors.almostWhite,
    borderRadius: spacing,
    marginRight: spacing,
    justifyContent: 'center',
    height: 'auto',
    alignSelf: 'flex-start',
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
  workerGrid: {
    paddingVertical: spacing,
    paddingLeft: spacing,
    paddingRight: spacing,
  },
  workerCard: {
    backgroundColor: Theme.colors.white,
    padding: spacing,
    borderRadius: spacing,
    marginBottom: spacing * 2,
    marginRight: spacing,
    width: 150,
    height: 200,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing * 2,
    marginTop: spacing * 2,
  },
  sectionTitle: {
    fontSize: Theme.size.lg,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing,
  },
  viewAllButton: {
    fontSize: Theme.size.sm,
    color: "blue",
    fontFamily: fonts.PoppinsMedium,
    marginTop: 6,
  },
  bookingGrid: {
    paddingHorizontal: spacing * 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing * 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing * 2,
  },
});

export default Home;
