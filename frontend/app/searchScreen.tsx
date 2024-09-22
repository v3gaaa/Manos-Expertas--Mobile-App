import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getWorkersByQuery } from '../utils/apiHelper';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Theme } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function SearchScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { query } = route.params as { query: string };
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        if (!query || query.trim() === '') {
          console.error('Query is empty, no search will be performed.');
          setLoading(false);
          return;
        }
        setLoading(true);
        const workerData = await getWorkersByQuery(query);
        setWorkers(workerData || []);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, [query]);

  const renderWorkerCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.workerCard}
      onPress={() => navigation.navigate('WorkerDetail', { workerId: item._id })}
    >
      <Image source={{ uri: item.profilePicture || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.basiclines.com%2Fwp-content%2Fuploads%2F2019%2F01%2Fblank-user.jpg&f=1&nofb=1&ipt=ca5e2c2b13f2cf4fb7ec7284dd85147bf639caab21a1a44c81aa07b30eab197e&ipo=images'}} style={styles.workerImage} />
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{item.name} {item.lastName}</Text>
        <Text style={styles.workerProfession}>{item.profession}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Resultados de búsqueda</Text>
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
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    padding: spacing,
    borderRadius: spacing,
    marginBottom: spacing * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  workerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing,
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
  },
});