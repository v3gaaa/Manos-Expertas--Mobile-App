import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

type SuccessModalProps = {
    modalVisible: boolean;
    message: string;
  };

const SuccessModal = ({ modalVisible, message }: SuccessModalProps) => {
  const navigation = useNavigation();

  const handleClose = () => {
    navigation.navigate('AdminHome');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: spacing,
    padding: spacing * 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: Theme.size.md,
    fontFamily: fonts.PoppinsMedium,
    textAlign: 'center',
    marginBottom: spacing * 2,
  },
  button: {
    backgroundColor: Theme.colors.bamxYellow,
    borderRadius: spacing,
    padding: spacing,
  },
  buttonText: {
    color: 'white',
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    textAlign: 'center',
  },
});

export default SuccessModal;
