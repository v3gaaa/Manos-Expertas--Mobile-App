import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const AddWorker: React.FC = () => {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');

  const handleAddWorker = () => {
    if (!name || !profession) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    
    // Here you would normally handle the addition of the worker
    Alert.alert('Success', `Worker ${name} added as ${profession}`);
    
    // Reset the fields
    setName('');
    setProfession('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Worker</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Profession"
        value={profession}
        onChangeText={setProfession}
      />

      <Button title="Add Worker" onPress={handleAddWorker} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default AddWorker;
