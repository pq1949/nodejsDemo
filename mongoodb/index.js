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

/**
  * 连接成功
  */
 mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + DB_URL);
});

/**
* 连接异常
*/
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

/**
* 连接断开
*/
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});


let userSchema = new mongoose.Schema({
    username: String,
    email: String,
    dateCrawled: String
});

let User = mongoose.model('User', userSchema)


User.find({},(err, res) => {
  console.log(res)
  console.log(res.length)
})
