import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter} from 'expo-router';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { IWorker } from '../../components/types';
import { Feather } from '@expo/vector-icons';
import {Theme} from '../../constants/theme';
import { getWorkersByProfession } from '../../utils/apiHelper';


const WorkerDetails = () => {
    const { worker } = useLocalSearchParams();
    const [workerData, setWorkerData] = useState<IWorker | null>(null);
    const [profession, setProfession] = useState('');

    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const workerData = await getWorkersByProfession(profession);
                if (!workerData) {
                    Alert.alert('Error', 'Trabajador no encontrado');
                    return;
                }
                setWorkerData(workerData);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Ocurrió un problema al intentar obtener trabajador');
            }
        };
        fetchWorker();
    }, [worker]);
    
    const router = useRouter();

  return (
    <>
    <Stack.Screen options={{
        headerTransparent: true,
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{
            shadowColor: '#171717',
            shadowOffset: { width: 2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}>
            <View style={{backgroundColor:Theme.colors.almostWhite, padding:6, borderRadius:10, marginLeft:10}}>
              <Feather name="arrow-left" size={24} color="black" />
            </View>
          </TouchableOpacity>
        ),
    }}>
    </Stack.Screen>
        <View style={styles.container}>
            <Image source={{ uri: workerData?.profilePicture }} style={styles.image} />
            <Text style={styles.name}>{workerData?.name}</Text>
            <Text>{workerData?.profession}</Text>
            <Text>{workerData?.phoneNumber}</Text>
            <Text>{workerData?.address.street}</Text>
            <Text>{workerData?.address.city}</Text>
            <Text>{workerData?.address.state}</Text>
            <Text>{workerData?.address.zipCode}</Text>
            <Text>{workerData?.description}</Text>
        </View>
    </>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default WorkerDetails;
