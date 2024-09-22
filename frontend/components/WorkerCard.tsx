import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import fonts from '../constants/fonts';
import spacing from '../constants/spacing';

interface WorkerCardProps {
  id: string; // Añade la propiedad id
  name: string;
  profession: string;
  profilePicture: string;
  rating: number;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ id, name, profession, profilePicture, rating }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('WorkerDetail', { workerId: id });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      <Image source={{ uri: profilePicture || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.basiclines.com%2Fwp-content%2Fuploads%2F2019%2F01%2Fblank-user.jpg&f=1&nofb=1&ipt=ca5e2c2b13f2cf4fb7ec7284dd85147bf639caab21a1a44c81aa07b30eab197e&ipo=images'}} style={styles.profileImage} />
      <View style={styles.detailSection}>
        <View style={styles.textRatingContainer}>
          <Text style={styles.workerName}>{name}</Text>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={14} color="#FFD33C" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
        <Text style={styles.professionText}>{profession}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 156,
    height: 193,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
    marginBottom: spacing * 2,
  },
  profileImage: {
    width: '100%',
    height: 134,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#E8E8E8',
  },
  detailSection: {
    padding: spacing,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  textRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  workerName: {
    fontSize: 14,
    fontFamily: fonts.PoppinsMedium,
    color: '#101010',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 10,
    fontFamily: fonts.PoppinsMedium,
    color: '#101010',
  },
  professionText: {
    fontSize: 12,
    fontFamily: fonts.PoppinsMedium,
    color: '#939393',
  },
});

export default WorkerCard;
