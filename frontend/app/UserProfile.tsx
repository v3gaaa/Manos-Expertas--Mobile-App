import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Platform,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { getUserByEmail, updateUser, uploadImage, deleteAccount } from '../utils/apiHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import Footer from '../components/footer';
import AppTextInput from '../components/appTextInput';
import { Theme } from '../constants/theme';
import fonts from '../constants/fonts';
import spacing from '../constants/spacing';
import { 
  isValidName, 
  isValidPhone, 
  isValidPostalCode,
  sanitizeInput, 
  sanitizePhone,
  getValidationErrorMessage,
} from '../utils/inputValidation';

interface IUser {
  _id?: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  admin: boolean;
  salt: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<IUser>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePicture: '',
    address: { street: '', city: '', state: '', zipCode: '' },
    admin: false,
    salt: '',
  });
  const [originalUser, setOriginalUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    loadUser();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (originalUser) {
      const hasChanges = JSON.stringify(user) !== JSON.stringify(originalUser);
      setHasUnsavedChanges(hasChanges);
    }
  }, [user, originalUser]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      });

      return unsubscribe;
    }, [navigation, hasUnsavedChanges])
  );

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userProfile = await getUserByEmail(userData.email);
        if (userProfile) {
          setUser(userProfile);
          setOriginalUser(userProfile);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('Error', 'Could not load user profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(user._id!);
              await AsyncStorage.removeItem('user');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'No se pudo eliminar la cuenta. Por favor, inténtalo de nuevo.');
            }
          },
        },
      ]
    );
  };


  const handleUpdateProfile = async () => {
    const sanitizedName = sanitizeInput(user.name);
    const sanitizedLastName = sanitizeInput(user.lastName);
    const sanitizedPhone = sanitizePhone(user.phoneNumber);
    const sanitizedStreet = sanitizeInput(user.address.street);
    const sanitizedCity = sanitizeInput(user.address.city);
    const sanitizedState = sanitizeInput(user.address.state);
    const sanitizedZipCode = sanitizeInput(user.address.zipCode);

    if (!isValidName(sanitizedName)) {
      Alert.alert('Error', getValidationErrorMessage('name'));
      return;
    }

    if (!isValidName(sanitizedLastName)) {
      Alert.alert('Error', getValidationErrorMessage('lastName'));
      return;
    }

    if (!isValidPhone(sanitizedPhone)) {
      Alert.alert('Error', getValidationErrorMessage('phone'));
      return;
    }

    if (!isValidPostalCode(sanitizedZipCode)) {
      Alert.alert('Error', getValidationErrorMessage('postalCode'));
      return;
    }

    const updatedUser = {
      ...user,
      name: sanitizedName,
      lastName: sanitizedLastName,
      phoneNumber: sanitizedPhone,
      address: {
        street: sanitizedStreet,
        city: sanitizedCity,
        state: sanitizedState,
        zipCode: sanitizedZipCode,
      },
    };
    try {
      const result = await updateUser(updatedUser);
      if (result) {
        await AsyncStorage.setItem('user', JSON.stringify(result));
        Alert.alert('Success', 'User profile updated successfully.');
        setUser(result);
        setOriginalUser(result);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Could not update profile.');
    }
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
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
        setUploadingImage(true);
        const cloudinaryUrl = await uploadImage(imageUri);
        if (cloudinaryUrl) {
          setUser(prevUser => ({ ...prevUser, profilePicture: cloudinaryUrl }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.bamxYellow} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <Animated.ScrollView 
          contentContainerStyle={styles.scrollView} 
          keyboardShouldPersistTaps="handled"
          style={{ opacity: fadeAnim }}
        >
          <View style={styles.container}>
            <View style={styles.profilePictureContainer}>
              <Image 
                source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }} 
                style={styles.profilePicture} 
              />
              {uploadingImage && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color={Theme.colors.bamxYellow} />
                </View>
              )}
              <TouchableOpacity style={styles.editIcon} onPress={handleImageUpload} disabled={uploadingImage}>
                <Ionicons name="camera" size={24} color={Theme.colors.bamxYellow} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Name</Text>
                  <AppTextInput
                    placeholder="Name"
                    value={user.name}
                    onChangeText={(text) => setUser({ ...user, name: text })}
                  />
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Last Name</Text>
                  <AppTextInput
                    placeholder="Last Name"
                    value={user.lastName}
                    onChangeText={(text) => setUser({ ...user, lastName: text })}
                  />
                </View>
              </View>

              <Text style={styles.label}>Phone Number</Text>
              <AppTextInput
                placeholder="Phone Number"
                value={user.phoneNumber}
                onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
                keyboardType="phone-pad"
              />

              <Text style={styles.sectionTitle}>Address</Text>
              <AppTextInput
                placeholder="Street"
                value={user.address.street}
                onChangeText={(text) => setUser({ ...user, address: { ...user.address, street: text } })}
              />
              <AppTextInput
                placeholder="City"
                value={user.address.city}
                onChangeText={(text) => setUser({ ...user, address: { ...user.address, city: text } })}
              />
              <View style={styles.row}>
                <View style={styles.column}>
                  <AppTextInput
                    placeholder="State"
                    value={user.address.state}
                    onChangeText={(text) => setUser({ ...user, address: { ...user.address, state: text } })}
                  />
                </View>
                <View style={styles.column}>
                  <AppTextInput
                    placeholder="Zip Code"
                    value={user.address.zipCode}
                    onChangeText={(text) => setUser({ ...user, address: { ...user.address, zipCode: text } })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.updateButton, hasUnsavedChanges && styles.updateButtonActive]} 
              onPress={handleUpdateProfile}
              disabled={!hasUnsavedChanges}
            >
              <Text style={styles.updateButtonText}>
                {hasUnsavedChanges ? 'Save Changes' : 'No Changes to Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteAccountButton} 
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>
        <Footer />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGreen,
    marginTop: spacing,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: spacing * 3,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Theme.colors.bamxYellow,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: Theme.colors.white,
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: Theme.colors.bamxYellow,
  },
  formContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: spacing * 2,
    padding: spacing * 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: Theme.colors.bamxGreen,
    marginBottom: spacing / 2,
  },
  sectionTitle: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGreen,
    marginTop: spacing * 2,
    marginBottom: spacing,
  },
  updateButton: {
    backgroundColor: Theme.colors.bamxGrey,
    padding: spacing * 1.5,
    borderRadius: spacing,
    alignItems: 'center',
    marginTop: spacing * 3,
    marginBottom: spacing * 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  updateButtonActive: {
    backgroundColor: Theme.colors.bamxYellow,
  },
  updateButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.white,
    fontSize: Theme.size.md,
  },
  deleteAccountButton: {
    backgroundColor: Theme.colors.bamxRed,
    padding: spacing * 1.5,
    borderRadius: spacing,
    alignItems: 'center',
    marginTop: spacing * 2,
    marginBottom: spacing * 4,
  },
  deleteAccountButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.white,
    fontSize: Theme.size.md,
  },
});

export default UserProfile;