import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Feather } from '@expo/vector-icons';

export default function CalendarAvailability() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId } = route.params as { workerId: string };
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Selecciona una fecha</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate || '']: { selected: true, selectedColor: Theme.colors.bamxRed },
          }}
          theme={{
            backgroundColor: Theme.colors.white,
            calendarBackground: Theme.colors.white,
            textSectionTitleColor: Theme.colors.bamxGrey,
            selectedDayBackgroundColor: Theme.colors.bamxRed,
            selectedDayTextColor: Theme.colors.white,
            todayTextColor: Theme.colors.bamxYellow,
            dayTextColor: Theme.colors.black,
            textDisabledColor: Theme.colors.lightGrey,
            dotColor: Theme.colors.bamxRed,
            selectedDotColor: Theme.colors.white,
            arrowColor: Theme.colors.bamxYellow,
            monthTextColor: Theme.colors.bamxGreen,
            textDayFontFamily: fonts.PoppinsRegular,
            textMonthFontFamily: fonts.PoppinsSemiBold,
            textDayHeaderFontFamily: fonts.PoppinsMedium,
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>
      <TouchableOpacity 
        style={[styles.continueButton, !selectedDate && styles.disabledButton]} 
        disabled={!selectedDate} 
        onPress={() => navigation.navigate('TimeAvailability', { workerId, selectedDate })}
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
    ...Theme.shadows.shadow,
  },
  continueButton: {
    margin: spacing * 2,
    paddingVertical: spacing * 1.5,
    borderRadius: spacing,
    backgroundColor: Theme.colors.bamxGreen,
    alignItems: 'center',
    ...Theme.shadows.shadow,
  },
  disabledButton: {
    backgroundColor: Theme.colors.lightGrey,
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
});