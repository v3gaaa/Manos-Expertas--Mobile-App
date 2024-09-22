import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, ScrollView, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWorkersByProfession, getProfessions } from '../utils/apiHelper';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import SearchBar from '../components/SearchBar';
import WorkerCard from '../components/WorkerCard';
import CitasCard from '../components/CitasCard';

const AdminHome: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Admin Dashboard</Text>
    </View>
  );
};

interface HeaderProps {
  userData: { name: string; lastName: string; profilePicture: string } | null;
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ userData, searchText, setSearchText, handleSearch }) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar backgroundColor={Theme.colors.bamxYellow} barStyle="dark-content" />

      <View style={styles.header}>
        <Image source={{ uri: userData?.profilePicture }} style={styles.profileImage} />
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Hola, bienvenido</Text>
          <Text style={styles.userName}>{userData?.name} {userData?.lastName}</Text>
        </View>
      </View>

      <View style={styles.searchBarContainer}>
        <SearchBar searchText={searchText} setSearchText={setSearchText} handleSearch={handleSearch} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContainer: {
    backgroundColor: Theme.colors.bamxYellow,
    paddingBottom: spacing * 2,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdminHome;