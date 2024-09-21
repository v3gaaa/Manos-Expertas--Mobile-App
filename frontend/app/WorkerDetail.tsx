import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { IWorker } from '../components/types';
import { getWorkerById } from '../utils/apiHelper';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

export default function WorkerDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId } = route.params as { workerId: string };
  const [workerData, setWorkerData] = useState<IWorker | null>(null);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const worker = await getWorkerById(workerId);
        if (!worker) {
          Alert.alert('Error', 'Trabajador no encontrado');
          return;
        }
        setWorkerData(worker);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un problema al intentar obtener los datos del trabajador');
      }
    };
    fetchWorker();
  }, [workerId]);

  if (!workerData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Image source={{ uri: workerData.profilePicture }} style={styles.image} />
        <Text style={styles.profession}>{workerData.profession}</Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={14} color="#FFD33C" />
          <Text style={styles.ratingText}>5.0 (332 reviews)</Text>
        </View>
        <Text style={styles.description}>{workerData.description}</Text>
      </View>

      <TouchableOpacity 
        style={styles.calendarButton} 
        onPress={() => navigation.navigate('CalendarAvailability', { workerId: workerData._id })}
      >
        <Feather name="calendar" size={24} color={Theme.colors.green} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.bgColor,
  },
  loadingText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.lg,
    color: Theme.colors.black,
  },
  header: {
    backgroundColor: Theme.colors.bamxYellow,
    paddingTop: spacing * 6,
    paddingBottom: spacing * 3,
    paddingHorizontal: spacing * 2,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: spacing * 6,
    left: spacing * 2,
    zIndex: 1,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing,
    borderWidth: 3,
    borderColor: Theme.colors.white,
  },
  name: {
    fontSize: Theme.size.xl,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.black,
    marginBottom: spacing / 2,
  },
  profession: {
    fontSize: Theme.size.md,
    fontFamily: fonts.PoppinsMedium,
    color: Theme.colors.black,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: Theme.size.sm,
    fontFamily: fonts.PoppinsMedium,
    color: '#101010',
  },
  description: {
    fontSize: Theme.size.sm,
    fontFamily: fonts.PoppinsRegular,
    color: Theme.colors.black,
    lineHeight: 22,
    marginTop: spacing,
    textAlign: 'center',
  },
  calendarButton: {
    alignSelf: 'center',
    marginTop: spacing * 2,
    padding: spacing,
    borderRadius: 50,
    backgroundColor: Theme.colors.lightGreen,
  },
});
