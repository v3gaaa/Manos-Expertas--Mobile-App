import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

const TimeAvailability: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId, selectedDate } = route.params as { workerId: string; selectedDate: string };
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [selectingEndTime, setSelectingEndTime] = useState<boolean>(false); // Controlar la selección de fin

  // Lista de horas disponibles para seleccionar
  const availableTimes = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleTimeSelect = (time: string) => {
    if (!selectingEndTime) {
      setSelectedStartTime(time);
      setSelectingEndTime(true); // Cambiar a la selección de hora de fin
    } else {
      setSelectedEndTime(time);
    }
  };

  const handleReserve = () => {
    if (selectedStartTime && selectedEndTime) {
      navigation.navigate('BookingSuccess', {
        workerId,
        selectedDate,
        startDate: selectedStartTime,
        endDate: selectedEndTime,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectingEndTime ? 'Selecciona la hora de finalización' : 'Selecciona la hora de inicio'}
      </Text>
      <FlatList
        data={availableTimes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.timeButton,
              (item === selectedStartTime && !selectingEndTime) ||
              (item === selectedEndTime && selectingEndTime)
                ? styles.selectedTimeButton
                : null,
            ]}
            onPress={() => handleTimeSelect(item)}
          >
            <Text style={styles.timeText}>{item}</Text>
          </TouchableOpacity>
        )}
        numColumns={3}
        columnWrapperStyle={styles.timeRow}
      />

      <TouchableOpacity
        style={[
          styles.reserveButton,
          !(selectedStartTime && selectedEndTime) && styles.disabledButton,
        ]}
        onPress={handleReserve}
        disabled={!(selectedStartTime && selectedEndTime)}
      >
        <Text style={styles.buttonText}>Reservar</Text>
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
  timeRow: {
    justifyContent: 'space-between',
    marginBottom: spacing,
  },
  timeButton: {
    padding: spacing,
    borderRadius: spacing,
    backgroundColor: Theme.colors.lightGreen,
    alignItems: 'center',
    marginBottom: spacing,
    flex: 1,
    marginHorizontal: spacing / 2,
  },
  selectedTimeButton: {
    backgroundColor: Theme.colors.green,
  },
  timeText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.black,
  },
  reserveButton: {
    paddingVertical: spacing,
    borderRadius: spacing,
    backgroundColor: Theme.colors.green,
    alignItems: 'center',
    marginTop: spacing * 2,
  },
  disabledButton: {
    backgroundColor: Theme.colors.grey,
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.white,
  },
});

export default TimeAvailability;
