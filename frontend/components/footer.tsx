import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { icons } from '../constants/icons';
import { Theme } from '../constants/theme';

const Footer: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Used to get the current active route

  // Function to determine if the current screen is active
  const isActive = (screen: string) => route.name === screen;

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')} // Use navigate instead of replace
        style={styles.iconButton}
      >
        {/* Ensure icons are returned properly */}
        {icons.Home(24, isActive('Home') ? Theme.colors.bamxRed : Theme.colors.black)}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('allBookedAppointments')} // Use navigate instead of replace
        style={styles.iconButton}
      >
        {/* Ensure icons are returned properly */}
        {icons.Calendar(24, isActive('allBookedAppointments') ? Theme.colors.bamxRed : Theme.colors.black)}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('UserProfile')} // Use navigate instead of replace
        style={styles.iconButton}
      >
        {/* Ensure icons are returned properly */}
        {icons.User(24, isActive('UserProfile') ? Theme.colors.bamxRed : Theme.colors.black)}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50, // Height of the footer
    backgroundColor: Theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    ...Theme.shadows, // Apply shadows from the theme
  },
  iconButton: {
    padding: 10, // Padding around the icons
  },
});

export default Footer;