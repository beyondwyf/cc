import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config()
const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error('请设置MONGODB_URI环境变量')
}
const client = new MongoClient(uri)

export async function connectToDatabase() {
  try {
    await client.connect()
    console.log('Successfully connected to MongoDB.')
    return client.db('toilet-reviews')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

export async function closeDatabaseConnection() {
  try {
    await client.close()
    console.log('Successfully closed MongoDB connection.')
  } catch (error) {
    console.error('Error closing MongoDB connection:', error)
  }
}