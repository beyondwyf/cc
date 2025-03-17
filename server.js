import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { config } from 'dotenv'
import { connectToDatabase, closeDatabaseConnection } from './src/config/db.js'

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  if (req.url === '/api/reviews' && req.method === 'POST') {
    try {
      const buffers = []
      for await (const chunk of req) {
        buffers.push(chunk)
      }
      const data = Buffer.concat(buffers).toString()
      const reviews = JSON.parse(data)
      
      const db = await connectToDatabase()
      const collection = db.collection('reviews')
      
      // 清空并重新插入所有评论
      await collection.deleteMany({})
      await collection.insertMany(reviews)
      
      console.log('Successfully saved reviews to MongoDB')
      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'success' }))
      
      await closeDatabaseConnection()
    } catch (error) {
      console.error('Error saving reviews:', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Failed to save reviews' }))
    }
    return
  }

  if (req.url === '/api/reviews' && req.method === 'GET') {
    try {
      const db = await connectToDatabase()
      const collection = db.collection('reviews')
      
      const reviews = await collection.find({}).toArray()
      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(reviews))
      
      await closeDatabaseConnection()
    } catch (error) {
      console.error('Error fetching reviews:', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Failed to fetch reviews' }))
    }
    return
  }

  res.writeHead(404)
  res.end()
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})