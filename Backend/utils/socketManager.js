const activeUsers = new Map();

const addUser = (userId, socket) => {
  activeUsers.set(userId, socket);
};

const removeUser = (socket) => {
  for (const [userId, userSocket] of activeUsers.entries()) {
    if (userSocket === socket) {
      activeUsers.delete(userId);
      break;
    }
  }
};

const getUser = (userId) => {
  return activeUsers.get(userId);
};

module.exports = { addUser, removeUser, getUser, activeUsers };
