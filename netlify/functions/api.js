const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    await client.connect();
    const db = client.db('toilet-reviews');
    const collection = db.collection('reviews');

    if (event.httpMethod === 'GET') {
      const reviews = await collection.find({}).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(reviews)
      };
    }

    if (event.httpMethod === 'POST') {
      const reviews = JSON.parse(event.body);
      await collection.deleteMany({});
      await collection.insertMany(reviews);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'success' })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Database operation failed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    await client.close();
  }
}