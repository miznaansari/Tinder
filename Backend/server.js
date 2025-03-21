const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const { addUser, removeUser, getUser, activeUsers } = require('./utils/socketManager');
const chatRoutes = require('./routers/chatRoutes');
const createUserRoutes = require('./routers/Createuser');
const friendRequestRoutes = require('./routers/friendRequestRoutes');
const Chat = require('./models/chat');
const FriendRequest = require('./models/FriendRequest');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Connect to Database
connectDB();
app.use(cors());
app.use(express.json());

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api', createUserRoutes);
app.use('/api/friend-requests', friendRequestRoutes);

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('user-online', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User Online: ${userId}, Socket ID: ${socket.id}`);
    io.emit('update-online-users', Array.from(onlineUsers.keys()));
  });

  socket.on('disconnect', () => {
    const userId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
    if (userId) {
      onlineUsers.delete(userId);
      console.log(`User Offline: ${userId}, Socket ID: ${socket.id}`);
      io.emit('update-online-users', Array.from(onlineUsers.keys()));
    }
    console.log('Client disconnected:', socket.id);
  });
});




// const onlineUsers = new Map();

// io.on('connection', (socket) => {
//   console.log(`New connection active: ${socket.id}`);

//   socket.on('userConnected', async (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log(`User ${userId} is now online`);

//     try {
//       const acceptedRequests = await FriendRequest.find({
//         status: 1,
//         $or: [{ sender: userId }, { receiver: userId }]
//       });

//       const friendIds = acceptedRequests.map(request =>
//         userId.toString() === request.receiver.toString()
//           ? request.sender.toString()
//           : request.receiver.toString()
//       );

//       if (friendIds.length === 0) {
//         console.log('No friends to notify for user:', userId);
//         return;
//       }

//       console.log('Friends to notify:', friendIds);

//       // Notify only online friends
//       friendIds.forEach(friendId => {
//         const friendSocketId = onlineUsers.get(friendId);
//         if (friendSocketId) {
//           io.to(friendSocketId).emit('friendOnlineNotification', { userId });
//           console.log(`Notification sent to friend: ${friendId}`);
//         }
//       });

//       // No need to broadcast to all users
//     } catch (error) {
//       console.error('Error finding friends:', error);
//     }
//   });

//   socket.on('disconnect', async () => {
//     const userId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
//     if (userId) {
//       onlineUsers.delete(userId);
//       console.log(`User ${userId} went offline`);

//       try {
//         const acceptedRequests = await FriendRequest.find({
//           status: 1,
//           $or: [{ sender: userId }, { receiver: userId }]
//         });

//         const friendIds = acceptedRequests.map(request =>
//           userId.toString() === request.receiver.toString()
//             ? request.sender.toString()
//             : request.receiver.toString()
//         );

//         if (friendIds.length === 0) {
//           console.log('No friends to notify on disconnect for user:', userId);
//           return;
//         }

//         // Notify only online friends about offline status
//         friendIds.forEach(friendId => {
//           const friendSocketId = onlineUsers.get(friendId);
//           if (friendSocketId) {
//             io.to(friendSocketId).emit('friendOfflineNotification', { userId });
//             console.log(`Offline notification sent to friend: ${friendId}`);
//           }
//         });

//       } catch (error) {
//         console.error('Error finding friends on disconnect:', error);
//       }
//     }
//   });
// });



// Socket.IO Connection
io.on('connection', (socket) => {
  // console.log(`New client connected: ${socket.id}`);

  socket.on('userConnected', (userId) => {
    activeUsers.set(userId.toString(), socket);
    console.log(`User ${userId} connected`);
  });

  socket.on('userConnected', (userId) => {
    addUser(userId.toString(), socket);
    // console.log(`User ${userId} connected`);
  });
  
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;
  
    try {
      // const chat = new Chat({ senderId, receiverId, message });
      // await chat.save();
  
      // console.log(`Message saved: ${message}`);
  
      // Notify receiver
      const receiverSocket = getUser(receiverId.toString());
      if (receiverSocket) {
        // console.log(`Sending message to receiver: ${receiverId}`);
        receiverSocket.emit('receiveMessage', data);
      } else {
        console.log(`Receiver not connected: ${receiverId}`);
      }
  
      // Optionally notify sender
      const senderSocket = getUser(senderId.toString());
      if (senderSocket) {
        senderSocket.emit('messageSent', data);
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  });
  
  
  socket.on('disconnect', () => {
    removeUser(socket);
    console.log('Client disconnected:', socket.id);
  });
  
});


// Endpoint to handle Google Sign-In data
app.post('/api/google-login', async (req, res) => {
  const { name, email, profilePicture } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({ name, email, profilePicture, password: '123123123', dob: new Date() });
      await user.save();
    }
    res.status(200).json({ message: 'User signed in successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error signing in', error });
  }
});

// Start Server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
