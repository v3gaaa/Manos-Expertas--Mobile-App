import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, ScrollView, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWorstWorkers } from '../utils/apiHelper';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import SearchBar from '../components/SearchBar';
import WorkerCard from '../components/WorkerCard';
import GreenSquare from '../components/GreenSquare'

const AdminHome: React.FC = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ name: string; lastName: string; profilePicture: string } | null>(null);
  const [worstWorkers, setWorstWorkers] = useState<any[]>([]);
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
    const fetchWorstWorkers = async () => {
      try {
        const workerData = await getWorstWorkers();
        setWorstWorkers(workerData || []);
        console.log(workerData);
      } catch (error) {
        console.error('Error fetching worst workers:', error);
      }
    };
    fetchWorstWorkers();
  }, []);

  const renderWorkerCard = ({ item }: { item: any }) => (
    <WorkerCard 
      id={item._id}
      name={item.name} 
      lastName={item.lastName}
      profession={item.profession} 
      profilePicture={item.profilePicture} 
      rating={item.rating || 4.5} 
    />
  );

  const handleSearch = () => {
    if (searchText.trim() === '') {
      Alert.alert('Error', 'Por favor ingrese un término de búsqueda.');
      return;
    }
    navigation.navigate('AdminSearchScreen', { query: searchText });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
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

      {/* Worst workers section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trabajadores con peor calificación</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllWorstWorkers')}>
          <Text style={styles.viewAllButton}>Ver Todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={worstWorkers.slice(0, 4)}
        renderItem={renderWorkerCard}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.workerGrid} 
      />
      
      {/* Add/edit workers section */}
      <View style={styles.bottomContainer}>
          <View style={styles.greenSquaresContainer}>
            <GreenSquare
              title="Agregar trabajadores"
              utility="Nuevo perfil"
              iconName="FolderOpen"
              onPress={() => navigation.navigate('AddWorker')}
            />
            <GreenSquare
              title="Editar trabajadores"
              utility="Editar perfil"
              iconName="Settings"
              onPress={() => navigation.navigate('EditWorkerSearch')}
            />
          </View>
      </View>

      {/* Add admin button */}
      <TouchableOpacity onPress={() => navigation.navigate('RegisterAdmin')} style={styles.btn}>
        <Text style={styles.btnText}>Añadir admin</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  headerContainer: {
    backgroundColor: Theme.colors.bamxYellow,
    paddingBottom: spacing * 2,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing * 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing * 2,
    marginTop: spacing * 2,
  },
  viewAllButton: {
    fontSize: Theme.size.sm,
    color: "blue",
    fontFamily: fonts.PoppinsMedium,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing,
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
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end', 
    marginBottom: 20, 
  },
  greenSquaresContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
  },
  btn: {
    padding: spacing,
    width: '60%',
    alignSelf: 'center',
    backgroundColor: Theme.colors.bamxRed,
    borderRadius: spacing,
    marginTop: spacing,
    ...Theme.shadows,
  },
  btnText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: 16,
    textAlign: 'center',
    color: Theme.colors.white,
  }
});

export default AdminHome;