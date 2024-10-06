import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
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
  const { workerId } = route.params as { workerId: string };
  const [selectedDates, setSelectedDates] = useState<{ [date: string]: { selected: boolean, selectedColor: string } }>({});
  const [availableDates, setAvailableDates] = useState<{ [date: string]: { disabled: boolean } }>({});

  useEffect(() => {
    const checkAvailability = async () => {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      let currentDate = today;
      const newAvailableDates: { [date: string]: { disabled: boolean } } = {};

      while (currentDate <= nextMonth) {
        const availability = await checkWorkerAvailability(workerId, currentDate);
        const dateString = currentDate.toISOString().split('T')[0];
        newAvailableDates[dateString] = { disabled: availability.availableHours === 0 };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setAvailableDates(newAvailableDates);
    };

    checkAvailability();
  }, [workerId]);

  const handleDateSelect = (day: DateData) => {
    setSelectedDates(prevDates => {
      const newDates = { ...prevDates };
      if (newDates[day.dateString]) {
        delete newDates[day.dateString];
      } else {
        newDates[day.dateString] = { selected: true, selectedColor: Theme.colors.bamxRed };
      }
      return newDates;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Selecciona fechas</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{...selectedDates, ...availableDates}}
          minDate={new Date().toISOString().split('T')[0]}
        />
      </View>
      <TouchableOpacity 
        style={[styles.continueButton, Object.keys(selectedDates).length === 0 && styles.disabledButton]} 
        disabled={Object.keys(selectedDates).length === 0} 
        onPress={() => navigation.navigate('TimeAvailability', { workerId, selectedDates: Object.keys(selectedDates) })}
      >
        <Text style={styles.buttonText}>Continuar</Text>
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
  calendarContainer: {
    backgroundColor: Theme.colors.white,
    margin: spacing * 2,
    borderRadius: spacing,
    ...Theme.shadows,
  },
  continueButton: {
    margin: spacing * 2,
    paddingVertical: spacing * 1.5,
    borderRadius: spacing,
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