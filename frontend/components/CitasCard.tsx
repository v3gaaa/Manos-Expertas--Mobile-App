import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { icons } from '../constants/icons';

type CitasCardProps = {
  name: string;
  lastName: string;
  profession: string;
  date: string;
  reviews: number;
  rating: number;
};

const CitasCard = ({ name, lastName, profession, date, reviews, rating }: CitasCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic-00.iconduck.com%2Fassets.00%2Fuser-square-icon-512x512-d7zixn6s.png&f=1&nofb=1&ipt=98f8cacaca0cd250471a94c44b2e7361d69981a275b596c37009badd6c218564&ipo=images',
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{`${name} ${lastName}`}</Text>
        <Text style={styles.profession}>{profession}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.ratingContainer}>
        {icons.StarFull(16, '#FFD33C')}
        <Text style={styles.rating}>{`${rating}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#14A436',
    borderRadius: 12,
    width: 168,
    height: 'auto', // Set to auto to handle content overflow
    minHeight: 110, // Minimum height of 110px
    padding: 8,
    position: 'relative',
  },
  imageContainer: {
    position: 'absolute',
    width: 52,
    height: 52,
    left: 8,
    top: 8,
    //backgroundColor: '#E8E8E8',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textContainer: {
    position: 'absolute',
    left: 76,
    top: 8,
    right: 8,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  profession: {
    fontSize: 10,
    fontWeight: '300',
    color: '#F2F2F7',
    marginTop: 5,
  },
  date: {
    fontSize: 9,
    color: '#F2F2F7',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 8,
    top: 74, // Adjusted to make sure it's right under the image
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#EDEDFC',
    marginLeft: 5,
  },
});

export default CitasCard;
