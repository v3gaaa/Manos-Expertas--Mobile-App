import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBooking } from '../utils/apiHelper';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Feather } from '@expo/vector-icons';
import { registerForPushNotificationsAsync, scheduleBookingNotification, sendNewBookingNotification } from '../utils/notificationService';

export default function TimeAvailability() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId, startDate, endDate, workerName, workerLastName } = route.params as { 
    workerId: string; 
    startDate: string; 
    endDate: string;
    workerName: string;
    workerLastName: string;
  };
  
  const [hoursPerDay, setHoursPerDay] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const setup = async () => {
      try {
        await registerForPushNotificationsAsync();
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserId(parsedUser._id);
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del usuario');
        }
      } catch (error) {
        console.error('Error en la configuración:', error);
        Alert.alert('Error', 'Hubo un problema al inicializar la aplicación');
      }
    };
    
    setup();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleHourSelect = useCallback((hours: number) => {
    setHoursPerDay(hours);
  }, []);

  const getDaysBetweenDates = useCallback((start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
  }, []);

  const handleReserve = useCallback(async () => {
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener la información del usuario');
      return;
    }
  
    setIsLoading(true);
    try {
      const bookingResponse = await createBooking({
        worker: workerId,
        user: userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        hoursPerDay,
      });
  
      const bookingData = {
        _id: bookingResponse._id,
        startDate,
        worker: {
          name: workerName,
          lastName: workerLastName
        }
      };
  
      await Promise.all([
        sendNewBookingNotification(bookingData),
        scheduleBookingNotification(bookingData)
      ]);
  
      navigation.navigate('BookingSuccess', { 
        workerId, 
        startDate, 
        endDate, 
        hoursPerDay 
      });
    } catch (error) {
      console.error('Error creando la reserva:', error);
      Alert.alert('Error', 'Hubo un problema al crear la reserva');
    } finally {
      setIsLoading(false);
    }
  }, [userId, workerId, startDate, endDate, hoursPerDay, workerName, workerLastName, navigation]);

  const totalDays = getDaysBetweenDates(startDate, endDate);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Horas por día</Text>
      </View>
      <Animated.ScrollView 
        contentContainerStyle={styles.content}
        style={{ opacity: fadeAnim }}
      >
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
        <View style={styles.summaryContainer}>
          
          <Text style={styles.summaryTitle}>Resumen de la reserva:</Text>
          <Text style={styles.summaryText}>Fecha de inicio: {startDate}</Text>
          <Text style={styles.summaryText}>Fecha de fin: {endDate}</Text>
          <Text style={styles.summaryText}>Días totales: {totalDays}</Text>
          <Text style={styles.summaryText}>Horas por día: {hoursPerDay}</Text>
          <Text style={styles.summaryText}>Total de horas: {totalDays * hoursPerDay}</Text>
        </View>
      </Animated.ScrollView>
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={handleReserve}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Theme.colors.white} />
        ) : (
          <Text style={styles.reserveButtonText}>Reservar</Text>
        )}
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
    padding: spacing,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    color: Theme.colors.black,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
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
    marginBottom: spacing * 3,
  },
  hourButton: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: spacing * 2,
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
  summaryContainer: {
    backgroundColor: Theme.colors.white,
    padding: spacing * 2,
    borderRadius: spacing * 2,
    ...Theme.shadows,
  },
  summaryTitle: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.lg,
    color: Theme.colors.black,
    marginBottom: spacing,
  },
  summaryText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing / 2,
  },
  reserveButton: {
    margin: spacing * 2,
    paddingVertical: spacing * 1.5,
    borderRadius: spacing * 3,
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