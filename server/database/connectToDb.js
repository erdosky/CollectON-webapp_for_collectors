const mongoose = require('mongoose');

var connectionURL = 'mongodb+srv://albert_rzad:WzM5a2ZMi0iqOAAf@cluster0.bmjjztl.mongodb.net/?retryWrites=true&w=majority';

function connectToDatabase() {
  mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Successfully conncted to database.")
  }).catch((error) => {
    console.error('Error connecting to the database:', error);
  });
}

connectToDatabase();

module.exports = connectToDatabase





