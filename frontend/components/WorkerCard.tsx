import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import fonts from '../constants/fonts';
import spacing from '../constants/spacing';

interface WorkerCardProps {
  id: string;
  name: string;
  lastName: string;
  profession: string;
  rating: number;
  profilePicture?: string;
}

export default function WorkerCard({ id, name, lastName, profession, rating, profilePicture }: WorkerCardProps) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('WorkerDetail', { workerId: id });
  };

  const defaultProfilePicture = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.basiclines.com%2Fwp-content%2Fuploads%2F2019%2F01%2Fblank-user.jpg&f=1&nofb=1&ipt=ca5e2c2b13f2cf4fb7ec7284dd85147bf639caab21a1a44c81aa07b30eab197e&ipo=images';

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer} accessibilityRole="button" accessibilityLabel={`Ver detalles de ${name} ${lastName}, ${profession}`}>
      <Image 
        source={{ uri: profilePicture || defaultProfilePicture }} 
        style={styles.profileImage} 
      />
      <View style={styles.detailSection}>
        <Text style={styles.workerName} numberOfLines={1}>{name} {lastName}</Text>
        <Text style={styles.professionText} numberOfLines={1}>{profession}</Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={16} color={Theme.colors.bamxYellow} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    borderRadius: spacing * 2,
    backgroundColor: Theme.colors.white,
    shadowColor: Theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginRight: spacing * 2,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  detailSection: {
    padding: spacing,
  },
  workerName: {
    fontSize: Theme.size.md,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.black,
    marginBottom: spacing / 2,
  },
  professionText: {
    fontSize: Theme.size.sm,
    fontFamily: fonts.PoppinsRegular,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing / 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: spacing / 2,
    fontSize: Theme.size.sm,
    fontFamily: fonts.PoppinsMedium,
    color: Theme.colors.black,
  },
});