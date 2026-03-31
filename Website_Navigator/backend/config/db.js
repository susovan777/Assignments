import mongoose from 'mongoose';

export const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database Connection failed:', error.message);
    process.exit(1);
  }
};
