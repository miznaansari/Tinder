const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./db');
const { activeUsers } = require('./utils/socketManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

connectDB();
app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('userConnected', (userId) => {
    activeUsers.set(userId.toString(), socket);
    console.log(`User ${userId} connected`);
  });

  socket.on('disconnect', () => {
    activeUsers.forEach((value, key) => {
      if (value === socket) {
        activeUsers.delete(key);
        console.log(`User ${key} disconnected`);
      }
    });
  });
});

app.use('/api', require('./routers/Createuser'));
app.use('/api/friend-requests', require('./routers/friendRequestRoutes'));

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
