import {AppRegistry} from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {name as appName} from './app.json';

// Background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  
  // Display notification when app is in background
  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'New Message',
    body: remoteMessage.notification?.body || 'You have a new message',
    android: {
      channelId: 'default',
      importance: 4, // High importance
      pressAction: {
        id: 'default',
      },
      smallIcon: 'ic_launcher',
      sound: 'default',
    },
  });
});

// Handle notification events (tap, dismiss, etc.)
notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('Background notification event:', type, detail);
  
  if (type === EventType.PRESS) {
    console.log('User pressed notification');
    // Handle notification tap - navigate to specific screen
  }
});

// Register the app
AppRegistry.registerComponent(appName, () => App);