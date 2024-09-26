import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getWorkerById, editWorker, uploadImage } from '../utils/apiHelper';
import ImageUploader from '../components/ImageUpload'; 
import AppTextInput from '../components/appTextInput'; // Reusing AppTextInput for consistency
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import SuccessModal from '../components/SuccessModal'; // Import SuccessModal

const EditWorker: React.FC = () => {
  const route = useRoute();
  const { workerId } = route.params as { workerId: string }; 
  console.log('Worker ID:', workerId);

  const [worker, setWorker] = useState<any>(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profession, setProfession] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const fetchedWorker = await getWorkerById(workerId);
        console.log('Fetched worker:', fetchedWorker);

        if (fetchedWorker) {
          setWorker(fetchedWorker);
          setName(fetchedWorker.name);
          setLastName(fetchedWorker.lastName);
          setProfession(fetchedWorker.profession);
          setPhoneNumber(fetchedWorker.phoneNumber);
          setProfilePicture(fetchedWorker.profilePicture);
          setAddress(fetchedWorker.address);
          setDescription(fetchedWorker.description);
        } else {
          setWorker(null);
        }
      } catch (error) {
        console.error('Error fetching worker:', error);
        setWorker(null);
      }
    };

    fetchWorker();
  }, [workerId]);

  const handleEditWorker = async () => {
    if (!name || !lastName || !profession || !phoneNumber || !address.street || !address.city || !address.state || !address.zipCode) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos.');
      return;
    }

    let imageUri = profilePicture;

    if (profilePicture) {
      const uploadedImage = await uploadImage(profilePicture);
      if (uploadedImage) {
        imageUri = uploadedImage; 
      } else {
        Alert.alert('Error', 'No se pudo subir la imagen.');
        return;
      }
    }

    const updatedWorker = {
      name,
      lastName,
      profession,
      phoneNumber,
      profilePicture: imageUri,
      address,
      description
    };

    try {
      const response = await editWorker(workerId, updatedWorker);
      console.log('Response:', response);

      if (response) {
        setModalVisible(true); 
        setName(''); 
        setLastName('');
        setProfession('');
        setPhoneNumber('');
        setProfilePicture('');
        setAddress({
          street: '',
          city: '',
          state: '',
          zipCode: ''
        });
        setDescription('');
      } else {
        Alert.alert('Error', 'No se pudo actualizar la información del trabajador.');
      }
    } catch (error) {
      console.error('Error updating worker:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar la información.');
    }
  };

  if (!worker) {
    return <Text>No se encontró al trabajador.</Text>;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ padding: spacing * 2 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.mainTitle, { margin: spacing }]}>Editar información del trabajador</Text>
            </View>

            <View style={{ marginVertical: spacing * 2 }}>
              <Text style={styles.subTitle}>Nombre</Text>
              <AppTextInput placeholder="Nombre" value={name} onChangeText={setName} />
              <Text style={styles.subTitle}>Apellido</Text>
              <AppTextInput placeholder="Apellido" value={lastName} onChangeText={setLastName} />
              <Text style={styles.subTitle}>Profesión</Text>
              <AppTextInput placeholder="Profesión" value={profession} onChangeText={setProfession} />
              <Text style={styles.subTitle}>Número de teléfono</Text>
              <AppTextInput placeholder="Teléfono" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
              
              <Text style={styles.subTitle}>Agregar foto de perfil</Text>
              <ImageUploader onImageSelected={(uri) => setProfilePicture(uri)} />
              <Text style={styles.subTitle}>Calle</Text>
              <AppTextInput placeholder="Calle" value={address.street} onChangeText={(text) => setAddress({ ...address, street: text })} />
              <Text style={styles.subTitle}>Ciudad</Text>
              <AppTextInput placeholder="Ciudad" value={address.city} onChangeText={(text) => setAddress({ ...address, city: text })} />
              <Text style={styles.subTitle}>Estado</Text>
              <AppTextInput placeholder="Estado" value={address.state} onChangeText={(text) => setAddress({ ...address, state: text })} />
              <Text style={styles.subTitle}>Código Postal</Text>
              <AppTextInput placeholder="Código Postal" value={address.zipCode} onChangeText={(text) => setAddress({ ...address, zipCode: text })} keyboardType="numeric" />
              <Text style={styles.subTitle}>Descripción</Text>
              <AppTextInput placeholder="Descripción" value={description} onChangeText={setDescription} />
            </View>

            <TouchableOpacity onPress={handleEditWorker} style={styles.btn}>
              <Text style={styles.btnText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal 
        modalVisible={modalVisible}
        message="Información del trabajador actualizada correctamente."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing * 2,
  },
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
    marginBottom: spacing - 4,
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
  },
});

export default EditWorker;