import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
}

export async function sendNewBookingNotification(booking: {
  _id: string;
  startDate: string;
  worker: { name: string; lastName: string };
}) {
  // Obtener el usuario actual desde AsyncStorage
  const user = await AsyncStorage.getItem('user');
  if (!user) {
    console.error('No user found in AsyncStorage');
    return;
  }
  
  const { _id: userId } = JSON.parse(user);

  // Ensure we have valid values for name and lastName
  const workerName = booking.worker?.name || 'Usuario';
  const workerLastName = booking.worker?.lastName || '';
  const workerFullName = `${workerName} ${workerLastName}`.trim();

  const notification = {
    id: Date.now().toString(),
    title: 'Gracias por apoyar 🙌',
    body: `Tu reserva fue confirmada ✅`,
    date: new Date().toISOString(),
    read: false,
    bookingId: booking._id,
    userId, // Añadir el ID del usuario
  };

  try {
    const storedNotifications = await AsyncStorage.getItem('notifications');
    const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    notifications.unshift(notification);
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: { bookingId: booking._id },
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error saving notification:', error);
  }
}

export async function scheduleBookingNotification(booking: {
  _id: string;
  startDate: string;
  worker: { name: string; lastName: string };
}) {
  const workerName = booking.worker?.name || 'Usuario';
  const workerLastName = booking.worker?.lastName || '';
  const workerFullName = `${workerName} ${workerLastName}`.trim();

  const notificationDate = new Date(booking.startDate);
  notificationDate.setDate(notificationDate.getDate() - 1);
  notificationDate.setHours(12, 0, 0, 0);

  const trigger = notificationDate;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de Reserva',
      body: `Mañana tienes una cita con ${workerFullName}`,
      data: { bookingId: booking._id },
    },
    trigger,
  });
}

export async function getUnreadNotificationsCount(): Promise<number> {
  try {
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      console.error('No user found in AsyncStorage');
      return 0;
    }
    
    const { _id: userId } = JSON.parse(user);
    const storedNotifications = await AsyncStorage.getItem('notifications');
    if (!storedNotifications) return 0;

    const notifications = JSON.parse(storedNotifications);
    // Filtrar las notificaciones para el usuario actual
    const unreadNotifications = notifications.filter(
      (n: { read: boolean, userId: string }) => !n.read && n.userId === userId
    );
    return unreadNotifications.length;
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    return 0;
  }
}


