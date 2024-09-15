const { MongoClient } = require('mongodb');
//const logger = require('../logger/logger');

// const username = process.env.MONGO_USERNAME;
// const password = process.env.MONGO_PASSWORD;
// const host = process.env.MONGO_HOST;
// const database = process.env.MONGO_DATABASE;
// const replicaSet = process.env.MONGO_REPLICA_SET;


try {
    // if (!username || !password || !host || !database) {
    //     throw new Error('Missing required environment variables for MongoDB connection');
    // }
   // logger.debug('username:',username,'password:',password,'host:',host,'database:',database,'replicaSet:',replicaSet);
   const uri = 'mongodb://admin:abcd1234@localhost:27017/admin?authSource=admin';
    
    const mongoClient = new MongoClient(uri, {  useNewUrlParser: true });
    
    async function connectToMongo() {
        if (!mongoClient.topology || !mongoClient.topology.isConnected()) {
            await mongoClient.connect();
            console.log('Connected to MongoDB');
          }
          return mongoClient;
    } 
    connectToMongo();
} catch (error) {
    console.log('Error connecting to MongoDB:', error.message);
}


//module.exports = { connectToMongo, mongoClient };