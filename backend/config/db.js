import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/lotoreya_dev'
    await mongoose.connect(mongoUrl)
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

export function disconnectDB() {
  return mongoose.disconnect()
}
