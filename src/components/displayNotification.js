import React, {useEffect, useId, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); // home, admin, booking
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    body: '',
    type: 'general', // general, booking, delay, arrival
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

  // Your backend API URL - UPDATE THIS!
  const API_BASE_URL = 'http://10.0.2.2:3000/api';
  const ADMIN_ACCESS_CODE = 'ADMIN123'; // Change this!

  useEffect(() => {
    fetch('http://10.0.2.2:3000/api/hello')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await requestPermissions();
    await setupNotifications();
    await subscribeToTopics();
  };

  const requestPermissions = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        setFcmToken(token);
        console.log('FCM Token:', token);
        
        // Send token to your backend
        await sendTokenToBackend(token);
      }

      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
    } catch (error) {
      console.log('Permission error:', error);
    }
  };

  const sendTokenToBackend = async (token) => {
    try {
      await fetch(`${API_BASE_URL}/register-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          userId: 'user123', // Replace with actual user ID
          deviceType: Platform.OS,
        }),
      });
    } catch (error) {
      console.log('Error sending token to backend:', error);
    }
  };

  const subscribeToTopics = async () => {
    try {
      await messaging().subscribeToTopic('all_users');
      await messaging().subscribeToTopic('bus_updates');
      await messaging().subscribeToTopic('booking_updates');
      console.log('Subscribed to topics');
    } catch (error) {
      console.log('Error subscribing to topics:', error);
    }
  };

  const setupNotifications = async () => {
    await createNotificationChannels();

    // Handle foreground messages
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      await displayNotification(remoteMessage);
    });

    // Handle background notification tap
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage);
      handleNotificationTap(remoteMessage);
    });

    // Handle notification tap when app is closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened app from quit state:', remoteMessage);
          handleNotificationTap(remoteMessage);
        }
      });
 
    return unsubscribeForeground;
  };

  // const createNotificationChannels = async () => {
  //   try {
  //     // Default channel
  //     await notifee.createChannel({
  //       id: 'default',
  //       name: 'General Notifications',
  //       importance: AndroidImportance.HIGH,
  //       sound: 'default',
  //       vibration: true,
  //     });

  //     // Bus updates channel
  //     await notifee.createChannel({
  //       id: 'bus_updates',
  //       name: 'Bus Updates',
  //       importance: AndroidImportance.HIGH,
  //       sound: 'default',
  //       vibration: true,
  //     });

  //     // Booking channel
  //     await notifee.createChannel({
  //       id: 'booking',
  //       name: 'Booking Notifications',
  //       importance: AndroidImportance.HIGH,
  //       sound: 'default',
  //       vibration: true,
  //     });
  //   } catch (error) {
  //     console.log('Error creating notification channels:', error);
  //   }
  // };
  const createNotificationChannels = async () => {
  try {
    const channels = [
      { id: 'default', name: 'General Notifications' },
      { id: 'general', name: 'General' },
      { id: 'booking', name: 'Booking Notifications' },
      { id: 'booking_confirmation', name: 'Booking Confirmed' },
      { id: 'bus_update', name: 'Bus Updates' },
      { id: 'bus_updates', name: 'Bus Updates (legacy)' },
      { id: 'delay', name: 'Delay Alerts' }
    ];

    for (const ch of channels) {
      await notifee.createChannel({
        id: ch.id,
        name: ch.name,
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    }

    console.log('✅ Notification channels created');
  } catch (error) {
    console.log('❌ Error creating notification channels:', error);
  }
};

  const vibrationMap = {
  general: [300, 500, 300, 500],
  booking: [200, 200, 200, 200],
  bus_update: [500, 300, 500, 300],
  delay: [700, 300, 700, 300],
};  

  // const displayNotification = async (remoteMessage) => {
  //   try {
  //     const channelId = remoteMessage.data?.type || 'default';
      
  //     await notifee.displayNotification({
  //       title: remoteMessage.notification?.title || 'Bus App',
  //       body: remoteMessage.notification?.body || 'New update available',
  //       android: {
  //         channelId: channelId,
  //         importance: AndroidImportance.HIGH,
  //         pressAction: {
  //           id: 'default',
  //         },
  //         smallIcon: 'ic_launcher',
  //         sound: 'default',
  //         vibrationPattern: [300, 500, 300, 500],
  //       },
  //       ios: {
  //         sound: 'default',
  //       },
  //       data: remoteMessage.data,
  //     });
  //   } catch (error) {
  //     console.log('Error displaying notification:', error);
  //   }
  // };

  const displayNotification = async (remoteMessage) => {
  try {
    const channelId = remoteMessage.data?.type || 'default';
      const type = remoteMessage.data?.type || 'booking';
    const pattern = vibrationMap[type] || [300, 500];

    const title =
      remoteMessage.notification?.title ||
      remoteMessage.data?.title ||
      'New Notification';

    const body =
      remoteMessage.notification?.body ||
      remoteMessage.data?.body ||
      'You have a new message';

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        sound: 'default',
        importance: AndroidImportance.HIGH,
      vibrationPattern: pattern, // ✅ dynamic per type
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
      data: remoteMessage.data,
    });
  } catch (error) {
    console.log('❌ Error displaying notification:', error);
  }
};


  const handleNotificationTap = (remoteMessage) => {
    const notificationType = remoteMessage.data?.type;
    
    switch (notificationType) {
      case 'booking':
        setCurrentPage('booking');
        break;
      case 'bus_update':
        setCurrentPage('tracking');
        break;
      default:
        setCurrentPage('home');
    }
  };

  const handleAdminLogin = () => {
    if (adminCode === ADMIN_ACCESS_CODE) {
      setIsAdmin(true);
      setShowAdminModal(false);
      setCurrentPage('admin');
      Alert.alert('Success', 'Admin access granted!');
    } else {
      Alert.alert('Error', 'Invalid admin code!');
    }
  };

  const sendNotification = async () => {
    if (!notificationData.title || !notificationData.body) {
      Alert.alert('Error', 'Please fill in both title and body');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: notificationData.title,
          body: notificationData.body,
          type: notificationData.type,
          topic: 'all_users',
        }),
      });   
 
    
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Notification sent successfully!');
        setNotificationData({title: '', body: '', type: 'general'});
      } else {
        Alert.alert('Error', result.error || 'Failed to send notification');
      }
    } catch (error) {
      console.log('Error sending notification:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    await displayNotification({
      notification: {
        title: notificationData.title || 'Test Notification',
        body: notificationData.body || 'This is a test notification',
      },
      data: {
        type: notificationData.type,
      },
    });
  };

  // Quick notification templates
  const quickNotifications = [
    {
      title: 'Bus Delayed',
      body: 'Bus is running 15 minutes late due to traffic',
      type: 'bus_update',
    },
    {
      title: 'Booking Confirmed',
      body: 'Your bus booking has been confirmed',
      type: 'booking',
    },
    {
      title: 'Bus Arrived',
      body: 'Your bus has arrived at the station',
      type: 'bus_update',
    },
    {
      title: 'Special Offer',
      body: 'Get 100% off on your next booking!',
      type: 'general',
    },
  ];

  const renderHomePage = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Booking & Tracking</Text>
      <Text style={styles.subtitle}>Welcome to your bus app!</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => setCurrentPage('booking')}>
          <Text style={styles.buttonText}>Book Bus</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setCurrentPage('tracking')}>
          <Text style={styles.buttonText}>Track Bus</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.adminButton}
        onPress={() => setShowAdminModal(true)}>
        <Text style={styles.adminButtonText}>Admin Panel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAdminPanel = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Notification Panel</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setCurrentPage('home');
            setIsAdmin(false);
          }}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Templates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Templates:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickNotifications.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={styles.templateCard}
              onPress={() => setNotificationData(template)}>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateBody}>{template.body}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Custom Notification Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Notification Title:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter notification title"
          value={notificationData.title}
          onChangeText={text =>
            setNotificationData({...notificationData, title: text})
          }
        />

        <Text style={styles.label}>Notification Body:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter notification message"
          value={notificationData.body}
          onChangeText={text =>
            setNotificationData({...notificationData, body: text})
          }
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Notification Type:</Text>
        <View style={styles.typeContainer}>
          {['general', 'booking', 'bus_update', 'delay'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                notificationData.type === type && styles.typeButtonSelected,
              ]}
              onPress={() =>
                setNotificationData({...notificationData, type: type})
              }>
              <Text
                style={[
                  styles.typeButtonText,
                  notificationData.type === type && styles.typeButtonTextSelected,
                ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={sendTestNotification}>
            <Text style={styles.buttonText}>Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sendButton, isLoading && styles.buttonDisabled]}
            onPress={sendNotification}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Sending...' : 'Send to All'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preview */}
      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Preview:</Text>
        <View style={styles.notificationPreview}>
          <Text style={styles.previewNotificationTitle}>
            {notificationData.title || 'Notification Title'}
          </Text>
          <Text style={styles.previewNotificationBody}>
            {notificationData.body || 'Notification body will appear here...'}
          </Text>
          <Text style={styles.previewType}>Type: {notificationData.type}</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderBookingPage = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Book Your Bus</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentPage('home')}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTrackingPage = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Bus</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentPage('home')}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'admin' && isAdmin && renderAdminPanel()}
      {currentPage === 'booking' && renderBookingPage()}
      {currentPage === 'tracking' && renderTrackingPage()}

      {/* Admin Login Modal */}
      <Modal
        visible={showAdminModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAdminModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Admin Access</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter admin code"
              value={adminCode}
              onChangeText={setAdminCode}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowAdminModal(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={handleAdminLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  adminButton: {
    backgroundColor: '#FF9500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  adminButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  templateCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  templateBody: {
    fontSize: 12,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  typeButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    color: '#333',
    fontSize: 14,
  },
  typeButtonTextSelected: {
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testButton: {
    backgroundColor: '#34C759',
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  previewContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  notificationPreview: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  previewNotificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  previewNotificationBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
  previewType: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    flex: 1,
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    flex: 1,
  },
});

export default App;