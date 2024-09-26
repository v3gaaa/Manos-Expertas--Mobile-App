import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { getWorstWorkers } from '../utils/apiHelper';
import HorizontalWorkerCard from '../components/HorizontalWorkerCard';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

const WorstWorkersScreen: React.FC = () => {
    const [worstWorkers, setWorstWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorstWorkers = async () => {
            try {
                const workers = await getWorstWorkers();
                setWorstWorkers(workers);
            } catch (err) {
                setError('Error fetching worst workers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchWorstWorkers();
    }, []);

    const renderWorkerCard = ({ item }: { item: any }) => (
        <HorizontalWorkerCard 
            id={item._id}
            name={item.name} 
            lastName={item.lastName}
            profession={item.profession} 
            profilePicture={item.profilePicture} 
            rating={item.rating || 4.5} 
        />
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {loading ? (
                <ActivityIndicator size="large" color={Theme.colors.bamxGreen} />
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Peores Trabajadores</Text>
                    {worstWorkers.length > 0 && worstWorkers !== null ? (
                        <FlatList
                            data={worstWorkers}
                            renderItem={renderWorkerCard}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={styles.listContainer}
                            horizontal
                        />
                    ) : (
                        <Text style={styles.noResultsText}>No se encontraron trabajadores.</Text>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: spacing,
        flex: 1,
        alignItems: 'center', 
    },
    title: {
        fontFamily: fonts.CocoSharp,
        fontSize: Theme.size.xl,
        color: Theme.colors.bamxGreen,
        marginTop: spacing,
        marginBottom: spacing,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: Theme.colors.bamxRed,
        textAlign: 'center',
    },
    listContainer: {
        paddingVertical: spacing,
    },
    cardContainer: {
        marginVertical: spacing / 2, 
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: Theme.colors.bamxGrey,
    },
});

export default WorstWorkersScreen;
