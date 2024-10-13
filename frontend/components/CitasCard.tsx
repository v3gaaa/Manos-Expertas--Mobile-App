import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StarIcon } from 'lucide-react-native';

type CitasCardProps = {
  name: string;
  lastName: string;
  profession: string;
  date: string;
  reviews: number;
  rating: number;
};

export default function CitasCard({ name, lastName, profession, date, reviews, rating }: CitasCardProps) {
  const getInitials = (name: string, lastName: string) => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <View style={styles.card}>
      <View style={styles.initialsContainer}>
        <Text style={styles.initials}>{getInitials(name, lastName)}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{`${name} ${lastName}`}</Text>
        <Text style={styles.profession} numberOfLines={1}>{profession}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <StarIcon size={16} color="#FFD33C" />
        <Text style={styles.rating}>{rating.toFixed(1)}</Text>
        <Text style={styles.reviews}>({reviews} reviews)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#14A436',
    borderRadius: 12,
    width: 168,
    minHeight: 110,
    padding: 8,
    justifyContent: 'space-between',
  },
  initialsContainer: {
    width: 52,
    height: 52,
    backgroundColor: '#0D7A26',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textContainer: {
    marginLeft: 60,
    marginTop: -52,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profession: {
    fontSize: 10,
    fontWeight: '400',
    color: '#F2F2F7',
    marginTop: 4,
  },
  date: {
    fontSize: 9,
    color: '#F2F2F7',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EDEDFC',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 10,
    color: '#F2F2F7',
    marginLeft: 4,
  },
});