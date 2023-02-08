// MongoDB connection
require('colors');
const mongoose = require('mongoose');

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDatabase = process.env.MONGO_DATABASE;

const uri = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    authSource: 'admin'

};
module.exports = function () {
    mongoose.connect(uri, options)
        .then(() => {
            // promise resolved: it returns a mongoose instance
            console.log("\n");
            console.log("*******************************".green);
            console.log("✔ Mongo Successfully Connected!".green);
            console.log("*******************************".green);
            console.log("\n");
    
        })
        .catch(err => {
            console.log("\n");
            console.log("*******************************".red);
            console.log("    Mongo Connection Failed    ".red);
            console.log("*******************************".red);
            console.log("\n");
            console.log(err);
    
        })
}
