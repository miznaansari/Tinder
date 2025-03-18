const mongoose = require('mongoose');

const connectDB = async () => {
  // mongodb+srv://miznaansari:2sAc7wuwKHHzfnoh@mizna.jfncd.mongodb.net/Tinder?retryWrites=true&w=majority&appName=Mizna
  try {
    console.log('MongoDB connecteing');

    await mongoose.connect('mongodb+srv://miznaansari:2sAc7wuwKHHzfnoh@mizna.jfncd.mongodb.net/Tinder?retryWrites=true&w=majority&appName=Mizna', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


//2sAc7wuwKHHzfnoh

