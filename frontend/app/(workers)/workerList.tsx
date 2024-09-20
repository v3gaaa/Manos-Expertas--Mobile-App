import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { IWorker } from '../../components/types';
import { getWorkersByProfession } from '../../utils/apiHelper';

const workerList = async () => {
    const [worker, setWorker] = useState<IWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [Profession, setProfession] = useState('');

    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const workerData = await getWorkersByProfession(Profession);
                if (!workerData) {
                    Alert.alert('Error', 'Trabajador no encontrado');
                    return;
                }
                setWorker(workerData);
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchWorker();
    }, []);
    if (!worker || loading) { {
        return <Text>Loading...</Text>;
      }
    }
    if (error) {
        return <Text>Error...</Text>;
    }
  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 5,
          marginBottom: 10,
          gap: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        data={worker}
        keyExtractor={(worker) => worker.name}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: '/(workers)/[worker]', 
              params: { name: item.name }, 
            }}
            asChild
          >
            <TouchableOpacity>
              <View style={styles.item}>
                <Text style={styles.name}>{item.name}</Text>
                <Image source={{ uri: item.profilePicture }} style={styles.picture} />
                <Text>{item.profession}</Text>
                <Text>{item.phoneNumber}</Text>
                <Text>{item.address.city}</Text>
                <Text>{item.address.state}</Text>
                <Text>{item.description}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 2,
    borderRadius: 10,
    marginHorizontal: 2,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 5,
    textAlign: 'center',
  },
  picture: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

export { workerList };