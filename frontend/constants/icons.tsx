import React from 'react';
import { FontAwesome, FontAwesome5, AntDesign, Ionicons, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export const icons = {
  Home: (size = 24, color = "black") => <FontAwesome5 name="home" size={size} color={color} />,
  Back: (size = 24, color = "black") => <AntDesign name="back" size={size} color={color} />,
  Search: (size = 24, color = "black") => <FontAwesome name="search" size={size} color={color} />,
  UserLog: (size = 24, color = "black") => <FontAwesome name="user-circle" size={size} color={color} />,
  User: (size = 24, color = "black") => <FontAwesome name="user" size={size} color={color} />,
  Pin: (size = 24, color = "black") => <FontAwesome5 name="map-location-dot" size={size} color={color} />,
  Calendar: (size = 24, color = "black") => <Ionicons name="calendar" size={size} color={color} />,
  Book: (size = 24, color = "black") => <FontAwesome name="book" size={size} color={color} />,
  StarFull: (size = 24, color = "black") => <AntDesign name="star" size={size} color={color} />,
  StarEmpty: (size = 24, color = "black") => <AntDesign name="staro" size={size} color={color} />,
  Man: (size = 24, color = "black") => <MaterialCommunityIcons name="face-man" size={size} color={color} />,
  Woman: (size = 24, color = "black") => <MaterialCommunityIcons name="face-woman" size={size} color={color} />,
  Journal: (size = 24, color = "black") => <Ionicons name="journal" size={size} color={color} />,
  MoreHorizontal: (size = 24, color = "black") => <Feather name="more-horizontal" size={size} color={color} />,
  MoreVertical: (size = 24, color = "black") => <Feather name="more-vertical" size={size} color={color} />,
  UserAdd: (size = 24, color = "black") => <FontAwesome5 name="user-plus" size={size} color={color} />,
  Add: (size = 24, color = "black") => <FontAwesome name="plus" size={size} color={color} />,
  CalendarNew: (size = 24, color = "black") => <FontAwesome name="calendar-plus-o" size={size} color={color} />,
  Settings: (size = 24, color = "black") => <Ionicons name="settings-sharp" size={size} color={color} />,
  Phone: (size = 24, color = "black") => <FontAwesome5 name="phone" size={size} color={color} />,
  Image: (size = 24, color = "black") => <FontAwesome name="image" size={size} color={color} />,
  RightCircle: (size = 24, color = "black") => <AntDesign name="rightcircle" size={size} color={color} />,
  LeftCircle: (size = 24, color = "black") => <AntDesign name="leftcircle" size={size} color={color} />,
  AddFile: (size = 24, color = "black") => <AntDesign name="addfile" size={size} color={color} />,
  Check: (size = 24, color = "black") => <Entypo name="check" size={size} color={color} />,
  Done: (size = 24, color = "black") => <Entypo name="check" size={size} color={color} />,

  // Social Media Icons
  facebook: (size = 24, color = "black", backgroundColor?: string) => (
    <View style={[styles.iconContainer, backgroundColor ? { backgroundColor } : undefined]}>
      <FontAwesome5 name="facebook" size={size} color={color} />
    </View>
  ),
  Google: (size = 24, color = "black", backgroundColor?: string) => (
    <View style={[styles.iconContainer, backgroundColor ? { backgroundColor } : undefined]}>
      <FontAwesome5 name="google-plus" size={size} color={color} />
    </View>
  ),
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: 4, // Add some padding if a background color is applied
    borderRadius: 4, // Optional: adjust for rounded corners
  },
});
