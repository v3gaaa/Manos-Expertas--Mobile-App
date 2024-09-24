import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getWorkersByNameAndProfession } from '../utils/apiHelper'; // Import the function

// Hardcoded values for testing
const name = 'Juan';
const lastName = 'Perez';
const profession = 'Pintor';

const EditWorker: React.FC = () => {
  const [worker, setWorker] = useState<any>(null); // State to hold worker information

  useEffect(() => {
    const fetchWorker = async () => {
      const fetchedWorker = await getWorkersByNameAndProfession(name, lastName, profession);
      console.log('Fetched worker:', fetchedWorker);

      // Check if the fetchedWorker is an array and get the first item
      if (Array.isArray(fetchedWorker) && fetchedWorker.length > 0) {
        setWorker(fetchedWorker[0]); // Set the first worker from the array
      } else {
        setWorker(null); // No worker found
      }
    };

    fetchWorker();
  }, []);

  // If worker data is not available, show a message
  if (!worker) {
    return <Text>No se encontró al trabajador.</Text>; // Show message if no worker found
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información del Trabajador</Text>
      <Text style={styles.label}>Nombre: {worker.name}</Text>
      <Text style={styles.label}>Apellido: {worker.lastName}</Text>
      <Text style={styles.label}>Profesión: {worker.profession}</Text>
      <Text style={styles.label}>Teléfono: {worker.phoneNumber}</Text>
      {worker.profilePicture && (
        <Image source={{ uri: worker.profilePicture }} style={styles.image} />
      )}
      <Text style={styles.label}>Dirección: {`${worker.address.street}, ${worker.address.city}, ${worker.address.state}, ${worker.address.zipCode}`}</Text>
      <Text style={styles.label}>Descripción: {worker.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
});

export default EditWorker;


