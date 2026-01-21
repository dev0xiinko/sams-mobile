import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Check if running in Expo Go - notifications module crashes on import in Expo Go SDK 53+
const isExpoGo = Constants.appOwnership === 'expo';

// Placeholder types for when module isn't loaded
type NotificationSubscription = { remove: () => void } | null;

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Push notifications are not supported in Expo Go for SDK 53+
  if (isExpoGo) {
    console.log('Push notifications are not supported in Expo Go. Use a development build for full functionality.');
    return null;
  }

  try {
    // Dynamic imports to avoid crash on module load
    const Notifications = await import('expo-notifications');
    const Device = await import('expo-device');

    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
      });
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch (error) {
    console.log('Error registering for push notifications:', error);
    return null;
  }
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<string | null> {
  if (isExpoGo) {
    console.log('Notifications have limited support in Expo Go.');
    return null;
  }

  try {
    const Notifications = await import('expo-notifications');
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null,
    });
    return identifier;
  } catch (error) {
    console.log('Error scheduling notification:', error);
    return null;
  }
}

export async function addNotificationReceivedListener(
  callback: (notification: unknown) => void
): Promise<NotificationSubscription> {
  if (isExpoGo) return null;

  try {
    const Notifications = await import('expo-notifications');
    return Notifications.addNotificationReceivedListener(callback);
  } catch {
    return null;
  }
}

export async function addNotificationResponseListener(
  callback: (response: unknown) => void
): Promise<NotificationSubscription> {
  if (isExpoGo) return null;

  try {
    const Notifications = await import('expo-notifications');
    return Notifications.addNotificationResponseReceivedListener(callback);
  } catch {
    return null;
  }
}
