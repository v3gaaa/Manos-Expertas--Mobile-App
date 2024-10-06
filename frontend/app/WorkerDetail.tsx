import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [workerId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.bamxGreen} />
      </View>
    );
  }

  if (!workerData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del trabajador.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Theme.colors.black} />
          </TouchableOpacity>
          <Image 
            source={{ uri: workerData.profilePicture || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.basiclines.com%2Fwp-content%2Fuploads%2F2019%2F01%2Fblank-user.jpg&f=1&nofb=1&ipt=ca5e2c2b13f2cf4fb7ec7284dd85147bf639caab21a1a44c81aa07b30eab197e&ipo=images' }} 
            style={styles.image} 
          />
          <Text style={styles.name}>{`${workerData.name} ${workerData.lastName}`}</Text>
          <Text style={styles.profession}>{workerData.profession}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color="#FFD33C" />
            <Text style={styles.ratingText}>5.0 (332 reviews)</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <Text style={styles.description}>{workerData.description}</Text>

          <Text style={styles.sectionTitle}>Experiencia</Text>
          <Text style={styles.experienceText}>{workerData.experience || 'No especificada'}</Text>

          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.specialtiesContainer}>
            {workerData.specialties && workerData.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.calendarButton} 
          onPress={() => navigation.navigate('CalendarAvailability', { workerId: workerData._id })}
        >
          <Feather name="calendar" size={24} color={Theme.colors.white} />
          <Text style={styles.calendarButtonText}>Agendar cita</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.bgColor,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.bgColor,
    padding: spacing * 2,
  },
  errorText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxRed,
    textAlign: 'center',
  },
  header: {
    backgroundColor: Theme.colors.bamxYellow,
    paddingTop: spacing * 6,
    paddingBottom: spacing * 3,
    paddingHorizontal: spacing * 2,
    alignItems: 'center',
    borderBottomLeftRadius: spacing * 2,
    borderBottomRightRadius: spacing * 2,
  },
  backButton: {
    position: 'absolute',
    top: spacing * 2,
    left: spacing * 2,
    zIndex: 1,
    padding: spacing,
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
    backgroundColor: Theme.colors.white,
    paddingHorizontal: spacing,
    paddingVertical: spacing / 2,
    borderRadius: spacing,
  },
  ratingText: {
    marginLeft: spacing / 2,
    fontSize: Theme.size.sm,
    fontFamily: fonts.PoppinsMedium,
    color: Theme.colors.black,
  },
  infoContainer: {
    padding: spacing * 2,
  },
  sectionTitle: {
    fontSize: Theme.size.lg,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.black,
    marginTop: spacing * 2,
    marginBottom: spacing,
  },
  description: {
    fontSize: Theme.size.md,
    fontFamily: fonts.PoppinsRegular,
    color: Theme.colors.black,
    lineHeight: 24,
  },
  experienceText: {
    fontSize: Theme.size.md,
    fontFamily: fonts.PoppinsRegular,
    color: Theme.colors.black,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing,
  },
  specialtyTag: {
    backgroundColor: Theme.colors.bamxGreen,
    paddingHorizontal: spacing,
    paddingVertical: spacing / 2,
    borderRadius: spacing,
    marginRight: spacing,
    marginBottom: spacing,
  },
  specialtyText: {
    color: Theme.colors.white,
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.bamxGreen,
    paddingVertical: spacing * 1.5,
    paddingHorizontal: spacing * 2,
    borderRadius: spacing * 3,
    marginHorizontal: spacing * 2,
    marginTop: spacing * 2,
    marginBottom: spacing * 4,
  },
  calendarButtonText: {
    color: Theme.colors.white,
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    marginLeft: spacing,
  },
});