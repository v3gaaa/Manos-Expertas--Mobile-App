import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fonts from '../constants/fonts';
import spacing from '../constants/spacing';
import { icons } from '../constants/icons';

const Home: React.FC = () => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem('userToken');
            setUserToken(token);
        };
        loadToken();
    }, []);
    
    const handleLogOut = async () => {
        await AsyncStorage.removeItem('userToken');
        Alert.alert('Logout', 'Has cerrado la sesión');
        navigation.navigate('Welcome'); 
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.mainTitle, {color: Theme.colors.black}]}>Hola, bienvenido</Text>
            {icons.Celebrate ? icons.Celebrate(30, Theme.colors.bamxRed) : null} {/* Ensure Celebrate is defined */}
            <Text style={{ marginBottom: spacing * 2 }}>Tu token es: {userToken}</Text>
            <Button title="Cerrar sesión" onPress={handleLogOut} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.bgColor,
    }, 
    mainTitle: {
        fontFamily: fonts.CocoSharp,
        fontSize: Theme.size.xl,
        color: Theme.colors.bamxGreen,
        marginBottom: spacing * 1.2,
        textAlign: 'center',
    },
});

export default Home;
