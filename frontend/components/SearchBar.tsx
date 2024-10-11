import React, { FC } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: () => void;
}

const SearchBar: FC<SearchBarProps> = ({ searchText, setSearchText, handleSearch }) => {
  return (
    <View style={styles.searchBar}>
      <AntDesign name="search1" size={20} color={Theme.colors.black} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Busca trabajos o trabajadores..."
        placeholderTextColor="rgba(0, 0, 0, 0.61)"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <AntDesign name="arrowright" size={20} color={Theme.colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F0D9', // Background color from Figma
    borderWidth: 1.5,
    borderColor: 'rgba(237, 237, 252, 0.2)', // Border from Figma
    borderRadius: 14, // Updated border-radius from Figma
    paddingHorizontal: spacing,
    alignItems: 'center',
    width: 327, // Exact width from Figma
    height: 53,  // Exact height from Figma
  },
  searchIcon: {
    marginLeft: 16, // Left padding for icon from Figma
  },
  searchInput: {
    marginLeft: spacing,
    flex: 1,
    fontFamily: fonts.PoppinsMedium,
    fontSize: 14, // Font size from Figma
    color: Theme.colors.black,
    lineHeight: 21, // Matching line height from Figma
  },
  searchButton: {
    marginRight: 16, // Adjust button padding to match design
  },
});

export default SearchBar;
