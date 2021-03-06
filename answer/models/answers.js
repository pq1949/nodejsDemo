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
    qid: String,
    exam_id: String,
    exam_title: String,
    sdp_app_id: String,
    title: String,
    corrects: Array,
    update_time: String
});

let User = mongoose.model('Answers', userSchema)

module.exports = User
