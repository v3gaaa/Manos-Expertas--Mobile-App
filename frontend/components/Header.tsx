// components/Header.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import SearchBar from './SearchBar';

interface HeaderProps {
  userData: { name: string; lastName: string; profilePicture: string } | null;
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ userData, searchText, setSearchText, handleSearch }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Image source={{ uri: userData?.profilePicture }} style={styles.profileImage} />
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Hola, bienvenido 🎉</Text>
          <Text style={styles.userName}>{userData?.name} {userData?.lastName}</Text>
        </View>
      </View>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <SearchBar searchText={searchText} setSearchText={setSearchText} handleSearch={handleSearch} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Theme.colors.bamxYellow,
    paddingBottom: spacing * 2,
    borderBottomLeftRadius: spacing * 2,
    borderBottomRightRadius: spacing * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing,
    paddingHorizontal: spacing * 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: Theme.size.ms,
    fontFamily: fonts.PoppinsMedium,
    color: Theme.colors.black,
  },
  userName: {
    fontSize: Theme.size.xl,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.black,
  },
  searchBarContainer: {
    marginTop: spacing,
    paddingHorizontal: spacing * 2,
  },
});

export default Header;
