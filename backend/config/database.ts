import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI!;
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
    return conn;
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error: any) {
    console.error('Error closing MongoDB connection:', error.message);
  }
};

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

export { connectDB, disconnectDB };