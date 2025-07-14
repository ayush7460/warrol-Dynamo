// server.js - Complete Backend for Bus App
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import admin from 'firebase-admin';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';


dotenv.config();


import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from './routes/auth.js';
import busRoutes2 from './routes/buses.js';
import routeRoutes from './routes/routes.js';
import scheduleRoutes from './routes/schedules.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import searchRoutes from './routes/search.js';

import fs from 'fs';

// Middleware
app.use(express.json());          // This line is essential
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cors({ origin: 'http://192.168.237.222:3000' }));app.use(express.static('public'));



// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   projectId: serviceAccount.project_id,
// });

 


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes2);
app.use('/api/routes', routeRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

// Error handling
app.use(errorHandler);


// Initialize Firebase Admin SDK
// Make sure to place firebase-service-account.json in your project root
// let serviceAccount;
// try {
// } catch (error) {
//   console.error('Firebase service account file not found. Please add firebase-service-account.json');
//   process.exit(1);
// }
const serviceAccount = JSON.parse(
  fs.readFileSync('./firebase-service-account.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});



// In-memory storage for demo (use database in production)
let userTokens = [];
let notificationHistory = [];
let busRoutes = [];
let bookings = [];

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    totalUsers: userTokens.length,
    totalNotifications: notificationHistory.length
  });
});

// Register FCM token
app.post('/api/register-token', async (req, res) => {
  try {
    const { token, userId, deviceType } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token is required'
      });
    }

    // Check if token already exists
    const existingTokenIndex = userTokens.findIndex(t => t.token === token);
    
    if (existingTokenIndex !== -1) {
      // Update existing token
      userTokens[existingTokenIndex] = {
        ...userTokens[existingTokenIndex],
        userId: userId || userTokens[existingTokenIndex].userId,
        deviceType: deviceType || userTokens[existingTokenIndex].deviceType,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Add new token
      userTokens.push({
        token,
        userId: userId || `user_${Date.now()}`,
        deviceType: deviceType || 'unknown',
        registeredAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
    }

    console.log(`Token registered: ${token.substring(0, 20)}...`);
    res.status(200).json({
      success: true,
      message: 'Token registered successfully',
      totalUsers: userTokens.length
    });

  } catch (error) {
    console.error('Error registering token:', error);
    res.status(500).json({
      error: 'Failed to register token',
      details: error.message
    });
  }
});

// Send notification to topic
app.post('/api/send-notification', async (req, res) => {
  try {
    const { title, body, type = 'general', topic = 'all_users', data = {} } = req.body;

    // Validate input
    if (!title || !body) {
      return res.status(400).json({
        error: 'Title and body are required'
      });
    }

    // Create notification payload
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        type: type,
        timestamp: new Date().toISOString(),
        ...data
      },
      android: {
        notification: {
          title: title,
          body: body,
          channelId: type === 'general' ? 'default' : type,
          priority: 'high',
          sound: 'default',
          icon: 'ic_launcher',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
            sound: 'default',
            badge: 1,
          },
        },
      },
      topic: topic,
    };

    // Send notification
    const response = await admin.messaging().send(message);
    
    // Store in history
    notificationHistory.push({
      id: response,
      title,
      body,
      type,
      topic,
      sentAt: new Date().toISOString(),
      success: true,
      recipientCount: userTokens.length
    });

    console.log('Successfully sent message:', response);
    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      messageId: response,
      recipientCount: userTokens.length
    });

  } catch (error) {
    console.error('Error sending message:', error);
    
    // Store failed notification in history
    notificationHistory.push({
      title: req.body.title,
      body: req.body.body,
      type: req.body.type,
      topic: req.body.topic,
      sentAt: new Date().toISOString(),
      success: false,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to send notification',
      details: error.message
    });
  }
});

// Send notification to specific user
app.post('/api/send-notification-to-user', async (req, res) => {
  try {
    const { title, body, userId, type = 'general', data = {} } = req.body;

    if (!title || !body || !userId) {
      return res.status(400).json({
        error: 'Title, body, and userId are required'
      });
    }

    // Find user token
    const userToken = userTokens.find(t => t.userId === userId);
    
    if (!userToken) {
      return res.status(404).json({
        error: 'User not found or not subscribed to notifications'
      });
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        type: type,
        timestamp: new Date().toISOString(),
        ...data
      },
      android: {
        notification: {
          title: title,
          body: body,
          channelId: type === 'general' ? 'default' : type,
          priority: 'high',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
            sound: 'default',
          },
        },
      },
      token: userToken.token,
    };

    const response = await admin.messaging().send(message);
    
    // Store in history
    notificationHistory.push({
      id: response,
      title,
      body,
      type,
      userId,
      sentAt: new Date().toISOString(),
      success: true,
      recipientCount: 1
    });

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      messageId: response
    });

  } catch (error) {
    console.error('Error sending message to user:', error);
    res.status(500).json({
      error: 'Failed to send notification',
      details: error.message
    });
  }
});

// Send notification to multiple users
app.post('/api/send-notification-multicast', async (req, res) => {
  try {
    const { title, body, userIds, type = 'general', data = {} } = req.body;

    if (!title || !body || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        error: 'Title, body, and userIds array are required'
      });
    }

    // Get tokens for specified users
    const tokens = userTokens
      .filter(t => userIds.includes(t.userId))
      .map(t => t.token);

    if (tokens.length === 0) {
      return res.status(404).json({
        error: 'No valid tokens found for specified users'
      });
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        type: type,
        timestamp: new Date().toISOString(),
        ...data
      },
      android: {
        notification: {
          title: title,
          body: body,
          channelId: type === 'general' ? 'default' : type,
          priority: 'high',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
            sound: 'default',
          },
        },
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    
    // Store in history
    notificationHistory.push({
      title,
      body,
      type,
      userIds,
      sentAt: new Date().toISOString(),
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      recipientCount: tokens.length
    });

    res.status(200).json({
      success: true,
      message: 'Notifications sent successfully',
      successCount: response.successCount,
      failureCount: response.failureCount,
      totalTokens: tokens.length
    });

  } catch (error) {
    console.error('Error sending multicast message:', error);
    res.status(500).json({
      error: 'Failed to send notifications',
      details: error.message
    });
  }
});

// Get notification history
app.get('/api/notification-history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const history = notificationHistory
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
      .slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      data: history,
      total: notificationHistory.length,
      limit,
      offset
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch notification history',
      details: error.message
    });
  }
});

// Get registered users
app.get('/api/users', (req, res) => {
  try {
    const users = userTokens.map(user => ({
      userId: user.userId,
      deviceType: user.deviceType,
      registeredAt: user.registeredAt,
      lastUpdated: user.lastUpdated
    }));

    res.status(200).json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch users',
      details: error.message
    });
  }
});

// Remove user token
app.delete('/api/remove-token', (req, res) => {
  try {
    const { token, userId } = req.body;
    
    if (!token && !userId) {
      return res.status(400).json({
        error: 'Token or userId is required'
      });
    }

    const initialLength = userTokens.length;
    
    if (token) {
      userTokens = userTokens.filter(t => t.token !== token);
    } else if (userId) {
      userTokens = userTokens.filter(t => t.userId !== userId);
    }

    const removedCount = initialLength - userTokens.length;

    res.status(200).json({
      success: true,
      message: `${removedCount} token(s) removed`,
      remainingUsers: userTokens.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to remove token',
      details: error.message
    });
  }
});

// Bus location update endpoint
app.post('/api/bus/location-update', async (req, res) => {
  try {
    const { busId, latitude, longitude, routeId, status } = req.body;

    if (!busId || !latitude || !longitude) {
      return res.status(400).json({
        error: 'busId, latitude, and longitude are required'
      });
    }

    // Update bus location (in production, save to database)
    const busUpdate = {
      busId,
      latitude,
      longitude,
      routeId,
      status,
      timestamp: new Date().toISOString()
    };

    // Send notification to users tracking this bus
    const message = {
      notification: {
        title: 'Bus Location Updated',
        body: `Bus ${busId} location has been updated`,
      },
      data: {
        type: 'bus_location',
        busId,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        timestamp: new Date().toISOString(),
      },
      topic: `bus_${busId}`,
    };

    const response = await admin.messaging().send(message);
    
    res.status(200).json({
      success: true,
      message: 'Bus location updated successfully',
      messageId: response,
      busUpdate
    });

  } catch (error) {
    console.error('Error updating bus location:', error);
    res.status(500).json({
      error: 'Failed to update bus location',
      details: error.message
    });
  }
});

// Bus delay notification
app.post('/api/bus/delay-notification', async (req, res) => {
  try {
    const { busId, delayMinutes, reason, routeId } = req.body;

    if (!busId || !delayMinutes) {
      return res.status(400).json({
        error: 'busId and delayMinutes are required'
      });
    }

    const message = {
      notification: {
        title: 'Bus Delayed',
        body: `Bus ${busId} is delayed by ${delayMinutes} minutes${reason ? ': ' + reason : ''}`,
      },
      data: {
        type: 'bus_delay',
        busId,
        delayMinutes: delayMinutes.toString(),
        reason: reason || '',
        timestamp: new Date().toISOString(),
      },
      topic: `bus_${busId}`,
    };

    const response = await admin.messaging().send(message);
    
    res.status(200).json({
      success: true,
      message: 'Delay notification sent successfully',
      messageId: response
    });

  } catch (error) {
    console.error('Error sending delay notification:', error);
    res.status(500).json({
      error: 'Failed to send delay notification',
      details: error.message
    });
  }
});

// Booking confirmation
app.post('/api/booking/confirmation', async (req, res) => {
  try {
    const { userId, bookingId, busId, route, departureTime, seatNumber } = req.body;

    if (!userId || !bookingId || !busId) {
      return res.status(400).json({
        error: 'userId, bookingId, and busId are required'
      });
    }

    // Store booking (in production, save to database)
    const booking = {
      bookingId,
      userId,
      busId,
      route,
      departureTime,
      seatNumber,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    bookings.push(booking);

    // Send confirmation notification
    const message = {
      notification: {
        title: 'Booking Confirmed',
        body: `Your booking for Bus ${busId} is confirmed. Seat: ${seatNumber || 'N/A'}`,
      },
      data: {
        type: 'booking_confirmation',
        bookingId,
        busId,
        route: route || '',
        departureTime: departureTime || '',
        seatNumber: seatNumber || '',
        timestamp: new Date().toISOString(),
      },
      topic: `user_${userId}`,
    };

    const response = await admin.messaging().send(message);
    
    res.status(200).json({
      success: true,
      message: 'Booking confirmed and notification sent',
      messageId: response,
      booking
    });

  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({
      error: 'Failed to confirm booking',
      details: error.message
    });
  }
});

// Booking cancellation
app.post('/api/booking/cancellation', async (req, res) => {
  try {
    const { userId, bookingId, reason } = req.body;

    if (!userId || !bookingId) {
      return res.status(400).json({
        error: 'userId and bookingId are required'
      });
    }

    // Find and update booking
    const bookingIndex = bookings.findIndex(b => b.bookingId === bookingId && b.userId === userId);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].cancellationReason = reason;
    bookings[bookingIndex].cancelledAt = new Date().toISOString();

    // Send cancellation notification
    const message = {
      notification: {
        title: 'Booking Cancelled',
        body: `Your booking ${bookingId} has been cancelled${reason ? ': ' + reason : ''}`,
      },
      data: {
        type: 'booking_cancellation',
        bookingId,
        reason: reason || '',
        timestamp: new Date().toISOString(),
      },
      topic: `user_${userId}`,
    };

    const response = await admin.messaging().send(message);
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled and notification sent',
      messageId: response,
      booking: bookings[bookingIndex]
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      error: 'Failed to cancel booking',
      details: error.message
    });
  }
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  try {
    const { userId } = req.query;
    
    let filteredBookings = bookings;
    
    if (userId) {
      filteredBookings = bookings.filter(b => b.userId === userId);
    }

    res.status(200).json({
      success: true,
      data: filteredBookings,
      total: filteredBookings.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: error.message
    });
  }
});

// Subscribe user to topic
app.post('/api/subscribe-topic', async (req, res) => {
  try {
    const { userId, topic } = req.body;

    if (!userId || !topic) {
      return res.status(400).json({
        error: 'userId and topic are required'
      });
    }

    const userToken = userTokens.find(t => t.userId === userId);
    
    if (!userToken) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    await admin.messaging().subscribeToTopic([userToken.token], topic);
    
    res.status(200).json({
      success: true,
      message: `User subscribed to topic: ${topic}`
    });

  } catch (error) {
    console.error('Error subscribing to topic:', error);
    res.status(500).json({
      error: 'Failed to subscribe to topic',
      details: error.message
    });
  }
});

// Unsubscribe user from topic
app.post('/api/unsubscribe-topic', async (req, res) => {
  try {
    const { userId, topic } = req.body;

    if (!userId || !topic) {
      return res.status(400).json({
        error: 'userId and topic are required'
      });
    }

    const userToken = userTokens.find(t => t.userId === userId);
    
    if (!userToken) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    await admin.messaging().unsubscribeFromTopic([userToken.token], topic);
    
    res.status(200).json({
      success: true,
      message: `User unsubscribed from topic: ${topic}`
    });

  } catch (error) {
    console.error('Error unsubscribing from topic:', error);
    res.status(500).json({
      error: 'Failed to unsubscribe from topic',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/register-token',
      'POST /api/send-notification',
      'POST /api/send-notification-to-user',
      'POST /api/send-notification-multicast',
      'GET /api/notification-history',
      'GET /api/users',
      'DELETE /api/remove-token',
      'POST /api/bus/location-update',
      'POST /api/bus/delay-notification',
      'POST /api/booking/confirmation',
      'POST /api/booking/cancellation',
      'GET /api/bookings',
      'POST /api/subscribe-topic',
      'POST /api/unsubscribe-topic'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bus App Server is running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔥 Firebase initialized for project: ${serviceAccount.project_id}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
