import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getWorkersByQuery, getAllWorkers, getWorkerAverageRating } from '../utils/apiHelper';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Theme } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

interface Worker {
  _id: string;
  name: string;
  lastName: string;
  profession: string;
  profilePicture: string;
  rating?: number;
}

export default function SearchScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { query } = route.params as { query: string };
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(query);

  const fetchWorkers = async (searchTerm: string) => {
    try {
      setLoading(true);
      let workerData;
      if (!searchTerm || searchTerm.trim() === '' || searchTerm.toLowerCase() === 'todos') {
        workerData = await getAllWorkers();
      } else {
        workerData = await getWorkersByQuery(searchTerm);
      }
      
      // Fetch ratings for each worker
      const workersWithRatings = await Promise.all(workerData.map(async (worker: Worker) => {
        const ratingData = await getWorkerAverageRating(worker._id);
        return {
          ...worker,
          rating: ratingData ? ratingData.averageRating : undefined
        };
      }));
      
      // Sort workers by rating (highest to lowest)
      const sortedWorkers = workersWithRatings.sort((a, b) => {
        if (a.rating === undefined && b.rating === undefined) return 0;
        if (a.rating === undefined) return 1;
        if (b.rating === undefined) return -1;
        return b.rating - a.rating;
      });
      
      setWorkers(sortedWorkers || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers(query);
  }, [query]);

  const handleSearch = () => {
    fetchWorkers(searchQuery);
  };

  const renderWorkerCard = ({ item }: { item: Worker }) => (
    <TouchableOpacity
      style={styles.workerCard}
      onPress={() => navigation.navigate('WorkerDetail', { workerId: item._id })}
    >
      <Image 
        source={{ uri: item.profilePicture || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.basiclines.com%2Fwp-content%2Fuploads%2F2019%2F01%2Fblank-user.jpg&f=1&nofb=1&ipt=ca5e2c2b13f2cf4fb7ec7284dd85147bf639caab21a1a44c81aa07b30eab197e&ipo=images' }} 
        style={styles.workerImage} 
      />
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{item.name} {item.lastName}</Text>
        <Text style={styles.workerProfession}>{item.profession}</Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={16} color={Theme.colors.bamxYellow} />
          <Text style={styles.ratingText}>{item.rating ? item.rating.toFixed(1) : 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Búsqueda de Trabajadores</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar trabajadores..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Feather name="search" size={24} color={Theme.colors.white} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.bamxYellow} />
          <Text style={styles.loadingText}>Buscando trabajadores...</Text>
        </View>
      ) : workers.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Feather name="search" size={64} color={Theme.colors.bamxGrey} />
          <Text style={styles.noResultsText}>No se encontraron trabajadores</Text>
          <Text style={styles.noResultsSubtext}>Intenta con otra búsqueda</Text>
        </View>
      ) : (
        <FlatList
          data={workers}
          renderItem={renderWorkerCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.workerList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>{workers.length} resultados encontrados</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

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
    marginRight: spacing,
  },
  title: {
    flex: 1,
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.lg,
    color: Theme.colors.black,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing * 2,
    paddingTop: spacing,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: Theme.colors.white,
    borderRadius: spacing,
    paddingHorizontal: spacing,
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
  },
  searchButton: {
    marginLeft: spacing,
    backgroundColor: Theme.colors.bamxYellow,
    borderRadius: spacing,
    padding: spacing,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing,
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing * 2,
  },
  noResultsText: {
    marginTop: spacing * 2,
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.lg,
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
  },
  noResultsSubtext: {
    marginTop: spacing,
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
  },
  workerList: {
    padding: spacing * 2,
  },
  resultsCount: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing,
  },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    padding: spacing * 1.5,
    borderRadius: spacing * 1.5,
    marginBottom: spacing * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  workerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: spacing * 1.5,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    marginBottom: spacing / 4,
  },
  workerProfession: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing / 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
    marginLeft: spacing / 2,
  },
});