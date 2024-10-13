import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import { checkWorkerAvailability } from '../utils/apiHelper';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Feather } from '@expo/vector-icons';

export default function CalendarAvailability() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId, workerName, workerLastName } = route.params as { 
    workerId: string;
    workerName: string;
    workerLastName: string;
  };
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<{ [date: string]: { disabled: boolean; textColor: string; color: string } }>({});
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkAvailability = async () => {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
      
      try {
        const response = await checkWorkerAvailability(workerId, today, nextMonth);
        const newAvailableDates: { [date: string]: { disabled: boolean; textColor: string; color: string } } = {};
        
        Object.entries(response.availability).forEach(([date, isAvailable]) => {
          newAvailableDates[date] = { 
            disabled: !isAvailable,
            textColor: isAvailable ? Theme.colors.black : Theme.colors.white,
            color: isAvailable ? 'transparent' : Theme.colors.red
          };
        });

        setAvailableDates(newAvailableDates);
        setIsLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error checking availability:', error);
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [workerId, fadeAnim]);

  const isDateRangeAvailable = useCallback((start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      if (availableDates[dateString]?.disabled) {
        return false;
      }
    }
    return true;
  }, [availableDates]);

  const handleDateSelect = useCallback((day: DateData) => {
    if (availableDates[day.dateString]?.disabled) {
      alert('Esta fecha no está disponible');
      return;
    }

    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (day.dateString < startDate) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else {
      if (isDateRangeAvailable(startDate, day.dateString)) {
        setEndDate(day.dateString);
      } else {
        alert('El rango seleccionado incluye fechas no disponibles');
        setStartDate(day.dateString);
        setEndDate(null);
      }
    }
  }, [startDate, endDate, availableDates, isDateRangeAvailable]);

  const getMarkedDates = useCallback(() => {
    const marked = { ...availableDates };
    
    if (startDate) {
      marked[startDate] = { 
        ...marked[startDate],
        startingDay: true, 
        color: Theme.colors.bamxGreen,
        textColor: Theme.colors.white,
      };
    }
    if (endDate) {
      marked[endDate] = { 
        ...marked[endDate],
        endingDay: true, 
        color: Theme.colors.bamxGreen,
        textColor: Theme.colors.white,
      };
    }

    if (startDate && endDate) {
      let currentDate = new Date(startDate);
      const lastDate = new Date(endDate);
      while (currentDate < lastDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = currentDate.toISOString().split('T')[0];
        if (dateString !== endDate) {
          marked[dateString] = { 
            ...marked[dateString],
            color: Theme.colors.bamxGreen,
            textColor: Theme.colors.white,
          };
        }
      }
    }

    return marked;
  }, [availableDates, startDate, endDate]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Selecciona fechas</Text>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.bamxGreen} />
          <Text style={styles.loadingText}>Cargando disponibilidad...</Text>
        </View>
      ) : (
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={getMarkedDates()}
              minDate={new Date().toISOString().split('T')[0]}
              markingType={'period'}
              theme={{
                backgroundColor: Theme.colors.white,
                calendarBackground: Theme.colors.white,
                textSectionTitleColor: Theme.colors.bamxGrey,
                selectedDayBackgroundColor: Theme.colors.bamxGreen,
                selectedDayTextColor: Theme.colors.white,
                todayTextColor: Theme.colors.bamxGreen,
                dayTextColor: Theme.colors.black,
                textDisabledColor: Theme.colors.red,
                dotColor: Theme.colors.bamxGreen,
                selectedDotColor: Theme.colors.white,
                arrowColor: Theme.colors.bamxGreen,
                monthTextColor: Theme.colors.black,
                textDayFontFamily: fonts.PoppinsRegular,
                textMonthFontFamily: fonts.PoppinsSemiBold,
                textDayHeaderFontFamily: fonts.PoppinsMedium,
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
            />
          </View>
          <View style={styles.dateDisplay}>
            <Text style={styles.dateText}>Inicio: {startDate || 'No seleccionado'}</Text>
            <Text style={styles.dateText}>Fin: {endDate || 'No seleccionado'}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.continueButton, (!startDate || !endDate) && styles.disabledButton]} 
            disabled={!startDate || !endDate || isLoading} 
            onPress={() => navigation.navigate('TimeAvailability', { 
              workerId, 
              startDate, 
              endDate,
              workerName,
              workerLastName
            })}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </Animated.View>
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
    padding: spacing,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    color: Theme.colors.black,
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    marginTop: spacing,
  },
  content: {
    flex: 1,
    padding: spacing * 2,
  },
  calendarContainer: {
    backgroundColor: Theme.colors.white,  
    borderRadius: spacing * 2,
    ...Theme.shadows,
    padding: spacing,
    marginBottom: spacing * 2,
  },
  dateDisplay: {
    backgroundColor: Theme.colors.white,
    padding: spacing * 1.5,
    borderRadius: spacing,
    ...Theme.shadows,
    marginBottom: spacing * 2,
  },
  dateText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    marginBottom: spacing / 2,
  },
  continueButton: {
    paddingVertical: spacing * 1.5,
    borderRadius: spacing * 3,
    backgroundColor: Theme.colors.bamxGreen,
    alignItems: 'center',
    ...Theme.shadows,
  },
  disabledButton: {
    backgroundColor: Theme.colors.babyGrey,
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
});