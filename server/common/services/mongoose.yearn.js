const mongoose = require('mongoose');
require('dotenv').config();

const options = {
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    //geting rid off the depreciation errors
    useNewUrlParser: true,
    useUnifiedTopology: true
};

let dbString = process.env.MONGO_URL_DEV_YEARN;
let count = 0;
const connectWithRetry = () => {
    mongoose.connect(dbString, options).then(()=>{
        console.log('Connected to db.')
    }).catch(err=>{
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
