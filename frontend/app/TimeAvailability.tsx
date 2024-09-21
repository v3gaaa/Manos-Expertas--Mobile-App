import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { Feather } from '@expo/vector-icons';

export default function TimeAvailability() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId, selectedDate } = route.params as { workerId: string; selectedDate: string };
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [selectingEndTime, setSelectingEndTime] = useState<boolean>(false);

  const availableTimes = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleTimeSelect = (time: string) => {
    if (!selectingEndTime) {
      setSelectedStartTime(time);
      setSelectingEndTime(true);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {selectingEndTime ? 'Hora de finalización' : 'Hora de inicio'}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>
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
              <Text style={[
                styles.timeText,
                ((item === selectedStartTime && !selectingEndTime) ||
                (item === selectedEndTime && selectingEndTime)) &&
                styles.selectedTimeText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          numColumns={3}
          columnWrapperStyle={styles.timeRow}
        />
      </View>
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
    color: Theme.colors.bamxGrey,
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
    backgroundColor: Theme.colors.white,
    alignItems: 'center',
    marginBottom: spacing,
    flex: 1,
    marginHorizontal: spacing / 2,
    ...Theme.shadows.shadow,
  },
  selectedTimeButton: {
    backgroundColor: Theme.colors.bamxGreen,
  },
  timeText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
  },
  selectedTimeText: {
    color: Theme.colors.white,
  },
  reserveButton: {
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