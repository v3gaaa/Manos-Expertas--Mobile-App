import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import ImageUploader from '../components/ImageUpload'; // Assuming you have this component
import AppTextInput from '../components/appTextInput';
import { createWorker, uploadImage } from '../utils/apiHelper'; // Import the uploadImage function

const AddWorker: React.FC = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profession, setProfession] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [description, setDescription] = useState('');

  const handleAddWorker = async () => {
    if (!name || !lastName || !profession || !phone) {
      Alert.alert('Error', 'Por favor llene los datos requeridos.');
      return;
    }

    try {
      let imageUri = profilePicture;

      // Step 1: Upload the image if it's provided
      if (profilePicture) {
        const uploadedImage = await uploadImage(profilePicture); // Upload the image
        if (uploadedImage) {
          imageUri = uploadedImage; // Assuming uploadImage returns the URI of the uploaded image
        } else {
          Alert.alert('Error', 'No se pudo subir la imagen.');
          return;
        }
      }

      // Step 2: Create the new worker with the uploaded image URI
      const newWorker = {
        name,
        lastName,
        profession,
        phoneNumber: phone,
        profilePicture: imageUri, // Use the uploaded image URI
        address: {
          street,
          city,
          state,
          zipCode,
        },
        description,
      };

      const response = await createWorker(newWorker);
      
      if (response) {
        Alert.alert('Éxito', `Trabajador ${name} agregado como ${profession}`);
      } else {
        Alert.alert('Error', 'No se pudo agregar al trabajador.');
      }
    } catch (error) {
      console.error('Error adding worker:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el trabajador.');
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
              <Text style={[styles.mainTitle, { margin: spacing }]}>Agregar Trabajador</Text>
              <Text style={styles.subTitle}>Completa la información del trabajador</Text>
            </View>

            <View style={{ marginVertical: spacing * 2 }}>
              <AppTextInput placeholder="Nombre" value={name} onChangeText={setName} />
              <AppTextInput placeholder="Apellido" value={lastName} onChangeText={setLastName} />
              <AppTextInput placeholder="Profesión" value={profession} onChangeText={setProfession} />
              <AppTextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              
              {/* Image uploader component */}
              <Text style={styles.subTitle}>Foto</Text>
              <ImageUploader onImageSelected={(uri) => setProfilePicture(uri)} />

              <Text style={styles.subTitle}>Dirección</Text>
              <AppTextInput placeholder="Calle" value={street} onChangeText={setStreet} />
              <AppTextInput placeholder="Ciudad" value={city} onChangeText={setCity} />
              <AppTextInput placeholder="Estado" value={state} onChangeText={setState} />
              <AppTextInput placeholder="Código Postal" value={zipCode} onChangeText={setZipCode} />
              <Text style={styles.subTitle}>Descripción</Text>
              <AppTextInput placeholder="Descripción" value={description} onChangeText={setDescription} />
            </View>

            <TouchableOpacity onPress={handleAddWorker} style={styles.btn}>
              <Text style={styles.btnText}>Agregar Trabajador</Text>
            </TouchableOpacity>
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

export default AddWorker;