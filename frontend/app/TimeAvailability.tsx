import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBooking } from '../utils/apiHelper';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Feather } from '@expo/vector-icons';

export default function TimeAvailability() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId, selectedDates } = route.params as { workerId: string; selectedDates: string[] };
  
  const [hoursPerDay, setHoursPerDay] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);  // Estado para almacenar el userId

  // Obtener el userId desde AsyncStorage al montar el componente
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserId(parsedUser._id);  // Guarda el userId del usuario logueado
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del usuario');
        }
      } catch (error) {
        console.error('Error cargando el userId:', error);
        Alert.alert('Error', 'Hubo un problema al cargar el usuario');
      }
    };
    loadUserId();
  }, []);

  const handleHourSelect = (hours: number) => {
    setHoursPerDay(hours);
  };

  const handleReserve = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener la información del usuario');
      return;
    }

    try {
      for (const date of selectedDates) {
        await createBooking({
          worker: workerId,
          user: userId,  // Pasar el userId correcto desde AsyncStorage
          startDate: new Date(date),
          endDate: new Date(date),
          hoursPerDay,
        });
      }
      navigation.navigate('BookingSuccess', { workerId, selectedDates, hoursPerDay });
    } catch (error) {
      console.error('Error creando la reserva:', error);
      Alert.alert('Error', 'Hubo un problema al crear la reserva');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Horas por día</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Selecciona las horas de trabajo por día</Text>
        <View style={styles.hoursContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
            <TouchableOpacity
              key={hour}
              style={[
                styles.hourButton,
                hoursPerDay === hour && styles.selectedHourButton,
              ]}
              onPress={() => handleHourSelect(hour)}
            >
              <Text
                style={[
                  styles.hourButtonText,
                  hoursPerDay === hour && styles.selectedHourButtonText,
                ]}
              >
                {hour}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={handleReserve}
      >
        <Text style={styles.reserveButtonText}>Reservar</Text>
      </TouchableOpacity>
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
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    color: Theme.colors.black,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: spacing * 2,
  },
  subtitle: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.lg,
    color: Theme.colors.black,
    marginBottom: spacing * 2,
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hourButton: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: spacing,
    marginBottom: spacing,
    ...Theme.shadows,
  },
  selectedHourButton: {
    backgroundColor: Theme.colors.bamxGreen,
  },
  hourButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
  },
  selectedHourButtonText: {
    color: Theme.colors.white,
  },
  reserveButton: {
    margin: spacing * 2,
    paddingVertical: spacing * 1.5,
    borderRadius: spacing,
    backgroundColor: Theme.colors.bamxGreen,
    alignItems: 'center',
    ...Theme.shadows,
  },
  reserveButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
});
