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

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('userConnected', (userId) => {
    activeUsers.set(userId.toString(), socket);
    console.log(`User ${userId} connected`);
  });

  socket.on('userConnected', (userId) => {
    addUser(userId.toString(), socket);
    console.log(`User ${userId} connected`);
  });
  
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;
  
    try {
      const chat = new Chat({ senderId, receiverId, message });
      await chat.save();
  
      console.log(`Message saved: ${message}`);
  
      // Notify receiver
      const receiverSocket = getUser(receiverId.toString());
      if (receiverSocket) {
        console.log(`Sending message to receiver: ${receiverId}`);
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

// Start Server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
