const moment = require("moment");
const User = require("../models/answers");

function findAnswer(answerObj = {}, cb) {
  // if this email exists, update the entry, don't insert
  const conditions = {};
  answerObj.qid && (conditions.qid = answerObj.qid);
  answerObj.exam_id && (conditions.exam_id = answerObj.exam_id);
  answerObj.sdp_app_id && (conditions.sdp_app_id = answerObj.sdp_app_id);
  User.find(conditions, (err, result) => {
    if (err) throw err;
    cb && cb(result[0])
    console.log("%j find info : %j", conditions, result);
  });
}

function upsertAnswer(answerObj = {}, cb) {
  // if this email exists, update the entry, don't insert
  const conditions = { qid: answerObj.qid };
  if(conditions.qid) {
    answerObj.exam_id && (conditions.exam_id = answerObj.exam_id);
    answerObj.sdp_app_id && (conditions.sdp_app_id = answerObj.sdp_app_id);
    answerObj.update_time = moment().format('YYYY-MM-DD HH:mm:ss:SSS')
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    User.findOneAndUpdate(conditions, answerObj, options, (err, result) => {
      if (err) throw err;
      console.log("%j insert info : %j", answerObj, result);
      cb && cb({
        success: true,
        message: 'insert or update success!'
      })
    });
  } else {
    cb && cb({
      success: false,
      message: 'need qid'
    })
  }

}

module.exports = {
  upsertAnswer,
  findAnswer
};
