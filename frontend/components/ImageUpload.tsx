import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';

interface ImageUploaderProps {
  onImageSelected: (imageUri: string) => void; // Callback when an image is selected
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleSelectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo', 
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorCode);
        Alert.alert('Error', 'No se pudo seleccionar la imagen.');
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage: Asset = response.assets[0];
        if (selectedImage.uri) {
          setImageUri(selectedImage.uri);  
          onImageSelected(selectedImage.uri);  
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <Text>Seleccionar Imagen</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default ImageUploader;
