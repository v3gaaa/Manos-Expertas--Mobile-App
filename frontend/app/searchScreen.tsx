import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getWorkersByQuery } from '../utils/apiHelper'; // Ensure this is imported correctly
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Theme } from '../constants/theme';

const SearchScreen: React.FC = () => {
  const route = useRoute();
  const { query } = route.params as { query: string };
  const [workers, setWorkers] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        console.log('Search query:', query); // Debugging
        const workerData = await getWorkersByQuery(query);
        console.log('Fetched workers:', workerData); // Debugging
        setWorkers(workerData || []);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    fetchWorkers();
  }, [query]);

  const renderWorkerCard = ({ item }: { item: any }) => (
    <View style={styles.workerCard}>
      <Image source={{ uri: item.profilePicture }} style={styles.workerImage} />
      <Text style={styles.workerName}>{item.name} {item.lastName}</Text>
      <Text style={styles.workerProfession}>{item.profession}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados de búsqueda</Text>
      {workers.length === 0 ? (
        <Text style={styles.noResultsText}>No se encontraron trabajadores</Text>
      ) : (
        <FlatList
          data={workers}
          renderItem={renderWorkerCard}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.workerRow}
          contentContainerStyle={styles.workerGrid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing * 2,
    backgroundColor: Theme.colors.bgColor,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    marginBottom: spacing * 2,
    textAlign: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
  },
  workerGrid: {
    paddingVertical: spacing,
  },
  workerRow: {
    justifyContent: 'space-between',
    marginBottom: spacing * 2,
  },
  workerCard: {
    backgroundColor: Theme.colors.white,
    padding: spacing,
    borderRadius: spacing,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  workerImage: {
    width: '100%',
    height: 100,
    borderRadius: 50,
    marginBottom: spacing,
  },
  workerName: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.sm,
    marginBottom: spacing / 2,
    textAlign: 'center',
  },
  workerProfession: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
  },
});

export default SearchScreen;