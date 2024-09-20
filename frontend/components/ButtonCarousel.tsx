// components/ButtonCarousel.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

interface ButtonCarouselProps {
  professions: string[];
  selectedProfession: string;
  setSelectedProfession: (profession: string) => void;
}

const ButtonCarousel: React.FC<ButtonCarouselProps> = ({ professions, selectedProfession, setSelectedProfession }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.professionCarousel}>
      {professions.map((profession) => (
        <TouchableOpacity
          key={profession}
          style={[styles.professionButton, selectedProfession === profession && styles.professionButtonSelected]}
          onPress={() => setSelectedProfession(profession)}
        >
          <Text style={[styles.professionButtonText, selectedProfession === profession && styles.professionButtonTextSelected]}>
            {profession}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  professionCarousel: {
    flexDirection: 'row',
    marginVertical: spacing * 2,
  },
  professionButton: {
    paddingHorizontal: spacing * 2,
    paddingVertical: 5,
    backgroundColor: Theme.colors.almostWhite,
    borderRadius: spacing,
    marginRight: spacing,
    justifyContent: 'center',
    height: 'auto',
    alignSelf: 'flex-start',
  },
  professionButtonSelected: {
    backgroundColor: Theme.colors.bamxRed,
  },
  professionButtonText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
  },
  professionButtonTextSelected: {
    color: Theme.colors.white,
  },
});

export default ButtonCarousel;
