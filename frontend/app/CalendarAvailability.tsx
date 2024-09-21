import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

const CalendarAvailability: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId } = route.params as { workerId: string };
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    navigation.navigate('TimeAvailability', { workerId, selectedDate: day.dateString });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una fecha</Text>
      <Calendar
        onDayPress={handleDateSelect}
        markedDates={{
          [selectedDate || '']: { selected: true, selectedColor: Theme.colors.bamxRed },
        }}
        theme={{
          todayTextColor: Theme.colors.bamxYellow,
          arrowColor: Theme.colors.bamxYellow,
        }}
      />
      <TouchableOpacity 
        style={styles.continueButton} 
        disabled={!selectedDate} 
        onPress={() => navigation.navigate('TimeAvailability', { workerId, selectedDate })}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
    padding: spacing * 2,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    marginBottom: spacing * 2,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: spacing * 2,
    paddingVertical: spacing,
    borderRadius: spacing,
    backgroundColor: Theme.colors.green,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.white,
  },
});

export default CalendarAvailability;
