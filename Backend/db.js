const mongoose = require('mongoose');

const connectDB = async () => {

  try {
    console.log('MongoDB connecteing');

    await mongoose.connect('', {
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

