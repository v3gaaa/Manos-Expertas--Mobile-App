import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, SafeAreaView, SectionList, StatusBar, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/footer';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';
import { getUserBookings, updateBookingStatus, createReview } from '../utils/apiHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const AllBookedAppointments = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const navigation = useNavigation();

  const fetchUserBookings = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        const userId = parsedUser._id;
        const userBookings = await getUserBookings(userId);
        setBookings(userBookings || []);
      } else {
        Alert.alert('Error', 'No se pudo obtener la información del usuario');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Hubo un problema al obtener tus reservas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserBookings();
  }, [fetchUserBookings]);

  const groupBookings = useCallback((bookings) => {
    const activeBookings = bookings.filter(booking => booking.status !== 'completed');
    const completedBookings = bookings.filter(booking => booking.status === 'completed');

    const groupedActive = activeBookings.reduce((acc, booking) => {
      const date = new Date(booking.startDate);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(booking);
      return acc;
    }, {});

    const sections = Object.entries(groupedActive).map(([title, data]) => ({ title, data }));
    
    if (completedBookings.length > 0) {
      sections.push({ title: 'Citas Completadas', data: completedBookings });
    }

    return sections;
  }, []);

  const handleCompleteBooking = async (booking) => {
    try {
      await updateBookingStatus(booking._id, 'completed');
      setSelectedBooking(booking);
      setModalVisible(true);
    } catch (error) {
      console.error('Error completing booking:', error);
      Alert.alert('Error', 'Hubo un problema al completar la reserva');
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (rating === 0) {
        Alert.alert('Error', 'Por favor, selecciona una calificación');
        return;
      }

      await createReview({
        worker: selectedBooking.worker._id,
        user: selectedBooking.user,
        booking: selectedBooking._id,
        rating,
        comment
      });

      setModalVisible(false);
      setRating(0);
      setComment('');
      fetchUserBookings();
      Alert.alert('Éxito', 'Tu reseña ha sido enviada. ¡Gracias por tu feedback!');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Hubo un problema al enviar tu reseña');
    }
  };

  const renderBookingCard = ({ item }: { item: any }) => (
    <View style={[styles.bookingCard, item.status === 'completed' && styles.completedBookingCard]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de la cita con ${item.worker.name} ${item.worker.lastName}`}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.worker.name[0]}{item.worker.lastName[0]}
          </Text>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.workerName}>{item.worker.name} {item.worker.lastName}</Text>
          <Text style={styles.profession}>{item.worker.profession}</Text>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={14} color={Theme.colors.bamxGreen} />
            <Text style={styles.infoText}>
              {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="clock" size={14} color={Theme.colors.bamxGreen} />
            <Text style={styles.infoText}>{item.hoursPerDay} horas por día</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={24} color={Theme.colors.bamxGrey} />
      </TouchableOpacity>
      {item.status !== 'completed' && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleCompleteBooking(item)}
          accessibilityRole="button"
          accessibilityLabel="Marcar cita como completada"
        >
          <Text style={styles.completeButtonText}>Completar</Text>
        </TouchableOpacity>
      )}
      {item.status === 'completed' && !item.hasReview && (
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => {
            setSelectedBooking(item);
            setModalVisible(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Dejar una reseña"
        >
          <Text style={styles.reviewButtonText}>Dejar reseña</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderReviewModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Deja tu reseña</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Feather
                  name={star <= rating ? "star" : "star"}
                  size={30}
                  color={star <= rating ? Theme.colors.bamxYellow : Theme.colors.bamxGrey}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating === 0 ? 'Selecciona una calificación' : `Has seleccionado ${rating} ${rating === 1 ? 'estrella' : 'estrellas'}`}
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Escribe tu comentario aquí (opcional)"
            placeholderTextColor={Theme.colors.bamxGrey}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity 
            style={[styles.submitButton, rating === 0 && styles.disabledButton]}
            onPress={handleSubmitReview}
            disabled={rating === 0}
          >
            <Text style={styles.submitButtonText}>Enviar reseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Después</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Theme.colors.bamxYellow} barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver atrás"
        >
          <Feather name="arrow-left" size={24} color={Theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Citas Agendadas</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.bamxGreen} />
        </View>
      ) : (
        <SectionList
          sections={groupBookings(bookings)}
          renderItem={renderBookingCard}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Theme.colors.bamxGreen]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Feather name="calendar" size={64} color={Theme.colors.bamxGrey} />
              <Text style={styles.noBookingsText}>No tienes citas agendadas.</Text>
              <TouchableOpacity
                style={styles.newBookingButton}
                onPress={() => navigation.navigate('WorkerList')}
              >
                <Text style={styles.newBookingButtonText}>Agendar una cita</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {renderReviewModal()}

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.bamxYellow,
    paddingVertical: spacing * 2,
    paddingHorizontal: spacing * 2,
    borderBottomLeftRadius: spacing * 2,
    borderBottomRightRadius: spacing * 2,
  },
  backButton: {
    padding: spacing,
    marginRight: spacing,
  },
  title: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    color: Theme.colors.black,
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: Theme.colors.bamxYellow,
    paddingVertical: spacing,
    paddingHorizontal: spacing * 2,
    marginTop: spacing,
    borderRadius: spacing,
    marginHorizontal: spacing,
  },
  sectionHeaderText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
    textTransform: 'capitalize',
  },
  bookingCard: {
    backgroundColor: Theme.colors.white,
    marginHorizontal: spacing * 2,
    marginVertical: spacing,
    borderRadius: spacing,
    ...Theme.shadows,
  },
  completedBookingCard: {
    backgroundColor: '#D2D4C8', // Light grey
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing * 1.5,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Theme.colors.bamxGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing,
  },
  avatarText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
  bookingInfo: {
    flex: 1,
  },
  workerName: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.black,
  },
  profession: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
    marginBottom: spacing / 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing / 4,
  },
  infoText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
    marginLeft: spacing / 2,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing * 2,
    paddingTop: spacing * 10,
  },
  noBookingsText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    textAlign: 'center',
    color: Theme.colors.bamxGrey,
    marginTop: spacing * 2,
    marginBottom: spacing * 3,
  },
  newBookingButton:  {
    backgroundColor: Theme.colors.bamxGreen,
    paddingVertical: spacing,
    paddingHorizontal: spacing * 2,
    borderRadius: spacing * 3,
  },
  newBookingButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
  },
  completeButton: {
    backgroundColor: Theme.colors.bamxGreen,
    paddingVertical: spacing,
    paddingHorizontal: spacing * 2,
    borderRadius: spacing,
    alignSelf: 'flex-end',
    marginRight: spacing * 2,
    marginBottom: spacing,
  },
  completeButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.sm,
    color: Theme.colors.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Theme.colors.white,
    borderRadius: spacing * 2,
    padding: spacing * 3,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.xl,
    color: Theme.colors.black,
    marginBottom: spacing * 2,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing,
  },
  starButton: {
    padding: spacing / 2,
  },
  ratingText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
    marginBottom: spacing * 2,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Theme.colors.bamxGrey,
    borderRadius: spacing,
    padding: spacing,
    marginBottom: spacing * 2,
    fontSize: Theme.size.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Theme.colors.bamxGreen,
    paddingVertical: spacing * 1.5,
    borderRadius: spacing,
    marginBottom: spacing,
  },
  disabledButton: {
    backgroundColor: Theme.colors.bamxGrey,
  },
  submitButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.white,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing,
    borderRadius: spacing,
  },
  cancelButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
  },
  reviewButton: {
    backgroundColor: Theme.colors.bamxYellow,
    paddingVertical: spacing,
    paddingHorizontal: spacing * 2,
    borderRadius: spacing,
    alignSelf: 'flex-end',
    marginRight: spacing * 2,
    marginBottom: spacing,
  },
  reviewButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
  },
});

export default AllBookedAppointments;