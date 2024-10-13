import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';
import ImageUploader from '../components/ImageUpload'; 
import AppTextInput from '../components/appTextInput';
import SuccessModal from '../components/SuccessModal';
import { createAdminUser, uploadImage } from '../utils/apiHelper'; 
import { 
  isValidEmail, 
  isValidName, 
  isValidPhone, 
  isValidPassword, 
  sanitizeInput, 
  sanitizeEmail, 
  sanitizePhone,
  getValidationErrorMessage,
  escapeSQLInput
} from '../utils/inputValidation';

const RegisterAdmin: React.FC = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddAdmin = async () => {
    const sanitizedName = sanitizeInput(name);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPhone = sanitizePhone(phone);
    const sanitizedPassword = escapeSQLInput(password);

    if (!isValidName(sanitizedName)) {
      Alert.alert('Error', getValidationErrorMessage('name'));
      return;
    }

    if (!isValidName(sanitizedLastName)) {
      Alert.alert('Error', getValidationErrorMessage('lastName'));
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      Alert.alert('Error', getValidationErrorMessage('email'));
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert('Error', getValidationErrorMessage('password'));
      return;
    }

    if (!isValidPhone(sanitizedPhone)) {
      Alert.alert('Error', getValidationErrorMessage('phone'));
      return;
    }

    try {
      const salt = CryptoJS.lib.WordArray.random(16).toString();
      const hashedPassword = CryptoJS.SHA512(sanitizedPassword + salt).toString();

      let imageUri = profilePicture;

      if (profilePicture) {
        const uploadedImage = await uploadImage(profilePicture); 
        if (uploadedImage) {
          imageUri = uploadedImage; 
        } else {
          Alert.alert('Error', 'Failed to upload the image.');
          return;
        }
      }

      const newAdmin = {
        name: sanitizedName,
        lastName: sanitizedLastName,
        email: sanitizedEmail,
        password: hashedPassword, 
        phoneNumber: sanitizedPhone,
        profilePicture: imageUri || '', 
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        },
        admin: true,
        salt,
      };

      const response = await createAdminUser(newAdmin);
      
      if (response) {
        setModalVisible(true);
        Alert.alert('Success', `Admin ${sanitizedName} added.`);
        // Reset form fields
        setName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setProfilePicture('');
      } else {
        Alert.alert('Error', 'Could not add the admin.');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      Alert.alert('Error', 'There was a problem adding the admin.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ padding: spacing * 2 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.mainTitle, { margin: spacing }]}>Agregar Admin</Text>
              <Text style={styles.subTitle}>Completa la información del admin</Text>
            </View>

            <View style={{ marginVertical: spacing * 2 }}>
              <AppTextInput placeholder="Nombre" value={name} onChangeText={setName} />
              <AppTextInput placeholder="Apellido" value={lastName} onChangeText={setLastName} />
              <AppTextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <AppTextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
              <AppTextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              
              {/* Image uploader component */}
              <Text style={styles.subTitle}>Agregar foto de perfil</Text>
              <ImageUploader onImageSelected={(uri) => setProfilePicture(uri)} />
            </View>

            <TouchableOpacity onPress={handleAddAdmin} style={styles.btn}>
              <Text style={styles.btnText}>Agregar Admin</Text>
            </TouchableOpacity>

            <SuccessModal
              modalVisible={modalVisible}
              onClose={() => setModalVisible(false)}
              message="Admin agregado exitosamente"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainTitle: {
    fontFamily: fonts.CocoSharp,
    fontSize: Theme.size.xl,
    color: Theme.colors.bamxGreen,
    marginBottom: spacing * 1.2,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: fonts.PoppinsMedium,
    fontWeight: '600',
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing - 3,
    textAlign: 'center',
  },
  btn: {
    padding: spacing,
    width: '60%',
    alignSelf: 'center',
    backgroundColor: Theme.colors.bamxRed,
    borderRadius: spacing,
    marginTop: spacing,
    ...Theme.shadows,
  },
  btnText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontWeight: '700',
    fontSize: Theme.size.aftm,
    textAlign: 'center',
    color: Theme.colors.white,
  }
});

export default RegisterAdmin;