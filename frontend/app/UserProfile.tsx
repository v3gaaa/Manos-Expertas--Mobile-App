// UserProfile.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Footer from '../components/footer'; // Assuming the footer is located here

const UserProfile = () => {
  return (
    <View style={styles.container}>
      <Text>User Profile</Text>
      {/* Wrapping the footer within a proper View */}
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default UserProfile;