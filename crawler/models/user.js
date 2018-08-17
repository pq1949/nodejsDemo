const mongoose = require('mongoose');
const DB_URL = 'mongodb://140.143.99.193:27017/testdb';
const opts = {
  user: 'testuser',
  pass: '123456',
  useNewUrlParser: true
}
if (mongoose.connection.readyState == 0) {
  mongoose.connect(DB_URL, opts, (err) => {
    if(err) {
      console.log(err)
    } else {
      console.log('mongodb connected!')
    }
  });
}

let userSchema = new mongoose.Schema({
    username: String,
    email: String,
    dateCrawled: String
});

let User = mongoose.model('User', userSchema)

module.exports = User
