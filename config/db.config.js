const { default: mongoose } = require("mongoose");
 
 const mongoURI = "mongodb://localhost:27017/user-management";

 const configureDbconn = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true
      }).then(() => {
        console.log("Successfully connected to the database");    
      }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
      });
 }

 module.exports = configureDbconn