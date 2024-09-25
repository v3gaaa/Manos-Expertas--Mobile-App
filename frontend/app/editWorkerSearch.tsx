import React, { useState } from 'react';
import { SafeAreaView, KeyboardAvoidingView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { getWorkersByNameAndProfession } from '../utils/apiHelper'; 
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import AppTextInput from '../components/appTextInput';
import HorizontalWorkerCard from '../components/HorizontalWorkerCard';

const EditWorkerSearch = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profession, setProfession] = useState('');
    const [workerInfo, setWorkerInfo] = useState<any[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false); 
    const [isSearched, setIsSearched] = useState(false);

    const handleSearch = async () => {
        const workerData = await getWorkersByNameAndProfession(name, lastName, profession);
        setWorkerInfo(workerData);
        setIsCollapsed(true); 
        setIsSearched(true);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView style={styles.container}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.mainTitle, { margin: spacing }]}>Editar trabajador</Text>
                    </View>

                    {/* Collapsible Search Form */}
                    {!isCollapsed && (
                        <View style={styles.formContainer}>
                            <Text style={styles.subTitle}>Ingresa los datos para buscarlo</Text>
                            <AppTextInput
                                placeholder="Nombre"
                                value={name}
                                onChangeText={setName}
                            />
                            <AppTextInput
                                placeholder="Apellido"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                            <AppTextInput
                                placeholder="Profesión"
                                value={profession}
                                onChangeText={setProfession}
                            />
                            <TouchableOpacity onPress={handleSearch} style={styles.btn}>
                                <Text style={styles.btnText}>Buscar</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Toggle Search Form */}
                    <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.resultToggle}>
                        <Text style={styles.toggleText}>
                            {isCollapsed ? 'Mostrar búsqueda' : 'Ocultar búsqueda'}
                        </Text>
                    </TouchableOpacity>


                    {/* Displaying the worker information */}
                    {isSearched && (
                        <View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.mainTitle, { margin: spacing }]}>Resultados</Text>
                                <Text style={styles.subTitle}>Da click en el trabajador para ir a editarlo</Text>
                            </View>

                            <View style={styles.resultsContainer}>
                                {workerInfo !== null && workerInfo.length > 0 ? (
                                    <View style={styles.workerCardWrapper}>
                                        {workerInfo.map((worker) => (
                                            <View key={worker.id} style={styles.workerCardContainer}>
                                                <HorizontalWorkerCard 
                                                  id={worker.id}
                                                  name={worker.name}
                                                  lastName={worker.lastName}
                                                  profession={worker.profession}
                                                  profilePicture={worker.profilePicture}
                                                  rating={worker.rating}
                                                />
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <Text style={styles.resultText}>No se encontraron trabajadores con esos datos.</Text>
                                )}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    marginTop: 20,
  },
  mainTitle: {
    fontFamily: fonts.CocoSharp,
    fontSize: Theme.size.xl,
    color: Theme.colors.bamxGreen,
    marginBottom: spacing * 1.2,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: fonts.PoppinsMedium,
    fontWeight: '600',
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing - 3,
    textAlign: 'center',
  },
  resultToggle: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  toggleText: {
    fontFamily: fonts.PoppinsMedium,
    color: Theme.colors.bamxYellow,
  },
  resultsContainer: {
    marginTop: 10,
    padding: 10,
  },
  workerCardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workerCardContainer: {
    width: '100%', 
    marginBottom: spacing, 
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  btn: {
    padding: spacing,
    width: '60%',
    alignSelf: 'center',
    backgroundColor: Theme.colors.bamxRed,
    borderRadius: spacing,
    marginTop: spacing,
    ...Theme.shadows,
  },
  btnText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontWeight: '700',
    fontSize: Theme.size.aftm,
    textAlign: 'center',
    color: Theme.colors.white,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: Theme.colors.bamxGrey,
  },
});

export default EditWorkerSearch;
