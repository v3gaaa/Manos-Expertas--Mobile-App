import React, { useState, useEffect } from 'react';
import { ScrollView, Platform, StyleSheet, View, Text, SafeAreaView, Alert, KeyboardAvoidingView, Image, TouchableOpacity } from 'react-native';
import Footer from '../components/footer';
import AppTextInput from '../components/appTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByEmail, updateUser, uploadImage } from '../utils/apiHelper';
import { IUser } from '../utils/apiHelper';
import { Theme } from '../constants/theme';
import fonts from '../constants/fonts';
import spacing from '../constants/spacing';
import { icons } from '../constants/icons';
import * as ImagePicker from 'expo-image-picker';
import { Cloudinary } from "@cloudinary/url-gen";

const UserProfile = () => {
  const [user, setUser] = useState<IUser>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePicture: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    admin: false,
    salt: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const userProfile = await getUserByEmail(userData.email);
          if (userProfile) setUser(userProfile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        Alert.alert('Error', 'Could not load user profile.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await updateUser(user);
      if (updatedUser) {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        Alert.alert('Success', 'User profile updated successfully.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Could not update profile.');
    }
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please allow access to your photo library to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      try {
        const cloudinaryUrl = await uploadImage(imageUri);
        if (cloudinaryUrl) {
          setUser(prevUser => ({
            ...prevUser,
            profilePicture: cloudinaryUrl
          }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      }
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            
            {/* Profile Picture */}
            <View style={styles.profilePictureContainer}>
              <Image 
                source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }} 
                style={styles.profilePicture} 
              />
              <TouchableOpacity style={styles.editIcon} onPress={handleImageUpload}>
                {icons.Image(24, Theme.colors.bamxYellow)}
              </TouchableOpacity>
            </View>

            {/* Name and Last Name in two columns */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>{icons.User(20, Theme.colors.bamxGreen)} Name:</Text>
                <AppTextInput
                  placeholder="Name"
                  value={user.name}
                  onChangeText={(text) => setUser({ ...user, name: text })}
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>{icons.UserTie(20, Theme.colors.bamxGreen)} Last Name:</Text>
                <AppTextInput
                  placeholder="Last Name"
                  value={user.lastName}
                  onChangeText={(text) => setUser({ ...user, lastName: text })}
                />
              </View>
            </View>

            {/* Phone Number */}
            <Text style={styles.label}>{icons.Phone(20, Theme.colors.bamxGreen)} Phone Number:</Text>
            <AppTextInput
              placeholder="Phone Number"
              value={user.phoneNumber}
              onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
              keyboardType="phone-pad"
            />

            {/* Address Fields */}
            <Text style={styles.label}>{icons.Road(20, Theme.colors.green)} Street:</Text>
            <AppTextInput
              placeholder="Street"
              value={user.address.street}
              onChangeText={(text) => setUser({ ...user, address: { ...user.address, street: text } })}
            />
            <Text style={styles.label}>{icons.LocationCity(20, Theme.colors.green)} City:</Text>
            <AppTextInput
              placeholder="City"
              value={user.address.city}
              onChangeText={(text) => setUser({ ...user, address: { ...user.address, city: text } })}
            />
            <Text style={styles.label}>{icons.HomeCity(20, Theme.colors.green)} State:</Text>
            <AppTextInput
              placeholder="State"
              value={user.address.state}
              onChangeText={(text) => setUser({ ...user, address: { ...user.address, state: text } })}
            />
            <Text style={styles.label}>{icons.Pin(20, Theme.colors.green)} Zip Code:</Text>
            <AppTextInput
              placeholder="Zip Code"
              value={user.address.zipCode}
              onChangeText={(text) => setUser({ ...user, address: { ...user.address, zipCode: text } })}
            />

            {/* Update Profile Button */}
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Footer />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: Theme.colors.bgColor,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: spacing * 2,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: Theme.colors.white,
    borderRadius: 50,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing * 1.5,
  },
  column: {
    flex: 1,
    marginHorizontal: spacing / 2,
  },
  label: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
    marginBottom: spacing / 2,
  },
  updateButton: {
    backgroundColor: Theme.colors.bamxYellow,
    padding: spacing,
    borderRadius: spacing,
    alignItems: 'center',
    marginVertical: spacing * 2,
    marginBottom: spacing * 4,
  },
  updateButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.white,
    fontSize: Theme.size.sm,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default UserProfile;