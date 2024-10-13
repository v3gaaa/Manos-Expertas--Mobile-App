import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { getWorkerById, getWorkerAverageRating, getWorkerReviewCount } from '../utils/apiHelper';
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

interface IWorker {
  _id: string;
  name: string;
  lastName: string;
  profession: string;
  profilePicture: string;
  description: string;
  reviews: Array<{
    user: { name: string };
    rating: number;
    comment: string;
  }>;
}

export default function WorkerDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workerId } = route.params as { workerId: string };
  const [workerData, setWorkerData] = useState<IWorker | null>(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const [worker, rating, reviews] = await Promise.all([
          getWorkerById(workerId),
          getWorkerAverageRating(workerId),
          getWorkerReviewCount(workerId)
        ]);

        if (!worker) {
          Alert.alert('Error', 'Trabajador no encontrado');
          return;
        }

        setWorkerData(worker);
        setAverageRating(rating?.averageRating || 0);
        setReviewCount(reviews?.count || 0);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un problema al intentar obtener los datos del trabajador');
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    };

    fetchWorkerData();
  }, [workerId, fadeAnim]);

  const renderStars = useCallback((rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Feather 
        key={i} 
        name={i < Math.floor(rating) ? "star" : "star"}
        size={16} 
        color={i < Math.floor(rating) ? Theme.colors.bamxYellow : Theme.colors.bamxGrey} 
      />
    ));
  }, []);

  const renderReviews = useCallback(() => {
    if (!workerData?.reviews || workerData.reviews.length === 0) {
      return (
        <Text style={styles.noReviewsText}>Este trabajador aún no tiene reseñas.</Text>
      );
    }

    return workerData.reviews.map((review, index) => (
      <View key={index} style={styles.reviewContainer}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>{review.user.name}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(review.rating)}
          </View>
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
      </View>
    ));
  }, [workerData, renderStars]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.bamxGreen} />
      </View>
    );
  }

  if (!workerData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del trabajador.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Theme.colors.white} />
          </TouchableOpacity>
          <Image 
            source={{ uri: workerData.profilePicture || 'https://example.com/default-profile.jpg' }} 
            style={styles.image} 
          />
          <Text style={styles.name}>{`${workerData.name} ${workerData.lastName}`}</Text>
          <Text style={styles.profession}>{workerData.profession}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(averageRating)}
            <Text style={styles.ratingText}>
              {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'})
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <Text style={styles.description}>{workerData.description}</Text>

          <Text style={styles.sectionTitle}>Reseñas</Text>
          {renderReviews()}
        </View>
      </Animated.ScrollView>
      
      <TouchableOpacity 
        style={styles.calendarButton} 
        onPress={() => navigation.navigate('CalendarAvailability', { 
          workerId: workerData._id,
          workerName: workerData.name,
          workerLastName: workerData.lastName
        })}
      >
        <Feather name="calendar" size={24} color={Theme.colors.white} />
        <Text style={styles.calendarButtonText}>Agendar cita</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgColor,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.bgColor,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.bgColor,
    padding: spacing * 2,
  },
  errorText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.md,
    color: Theme.colors.bamxRed,
    textAlign: 'center',
  },
  header: {
    backgroundColor: Theme.colors.bamxGreen,
    paddingTop: spacing * 6,
    paddingBottom: spacing * 3,
    paddingHorizontal: spacing * 2,
    alignItems: 'center',
    borderBottomLeftRadius: spacing * 2,
    borderBottomRightRadius: spacing * 2,
  },
  backButton: {
    position: 'absolute',
    top: spacing * 2,
    left: spacing * 2,
    zIndex: 1,
    padding: spacing,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing,
    borderWidth: 3,
    borderColor: Theme.colors.white,
  },
  name: {
    fontSize: Theme.size.xl,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.white,
    marginBottom: spacing / 2,
  },
  profession: {
    fontSize: Theme.size.md,
    fontFamily: fonts.PoppinsMedium,
    color: Theme.colors.white,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing * 1.5,
    paddingVertical: spacing,
    borderRadius: spacing * 1.5,
  },
  ratingText: {
    marginLeft: spacing,
    fontSize: Theme.size.sm,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.white,
  },
  infoContainer: {
    padding: spacing * 2,
  },
  sectionTitle: {
    fontSize: Theme.size.lg,
    fontFamily: fonts.PoppinsSemiBold,
    color: Theme.colors.black,
    marginTop: spacing * 2,
    marginBottom: spacing,
  },
  description: {
    fontSize: Theme.size.md,
    fontFamily: fonts.PoppinsRegular,
    color: Theme.colors.black,
    lineHeight: 24,
  },
  reviewContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: spacing,
    padding: spacing,
    marginBottom: spacing,
    elevation: 2,
    shadowColor: Theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing / 2,
  },
  reviewerName: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
  },
  reviewComment: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: Theme.size.sm,
    color: Theme.colors.black,
    marginTop: spacing / 2,
  },
  noReviewsText: {
    fontFamily: fonts.PoppinsItalic,
    fontSize: Theme.size.sm,
    color: Theme.colors.bamxGrey,
    textAlign: 'center',
    marginTop: spacing,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.bamxGreen,
    paddingVertical: spacing * 1.5,
    paddingHorizontal: spacing * 2,
    borderRadius: spacing * 3,
    margin: spacing * 2,
    ...Theme.shadows,
  },
  calendarButtonText: {
    color: Theme.colors.white,
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: Theme.size.md,
    marginLeft: spacing,
  },
});