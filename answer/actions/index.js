const moment = require("moment");
const Answers = require("../models/answers");

function findAnswer (answerObj = {}, cb) {
  // if this email exists, update the entry, don't insert
  const conditions = {};
  answerObj.qid && (conditions.qid = answerObj.qid);
  answerObj.exam_id && (conditions.exam_id = answerObj.exam_id);
  answerObj.sdp_app_id && (conditions.sdp_app_id = answerObj.sdp_app_id);
  if (conditions.exam_id) {
    Answers.find(conditions, (err, result) => {
      if (err) throw err;
      cb && cb({
        success: true,
        message: result
      })
      console.log("%j find info : %j", conditions, result);
    });
  } else {
    cb && cb({
      success: false,
      message: 'need exam_id'
    })
  }

}

function upsertAnswer (answerArr = [], cb) {
  console.log('upsertAnswer', answerArr)
  for(let i = 0; i < answerArr.length; i++) {
    const answerObj = answerArr[i]
    const conditions = { qid: answerObj.qid };
    if (conditions.qid) {
      answerObj.exam_id && (conditions.exam_id = answerObj.exam_id);
      answerObj.sdp_app_id && (conditions.sdp_app_id = answerObj.sdp_app_id);
      answerObj.update_time = moment().format('YYYY-MM-DD HH:mm:ss:SSS')
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      Answers.findOneAndUpdate(conditions, answerObj, options, (err, result) => {
        if (err) throw err;
        console.log("%j insert info : %j", answerObj, result);
      });
    } else {
      cb && cb({
        success: false,
        message: 'need qid'
      })
      return
    }
  }
  cb && cb({
    success: true,
    message: 'insert or update success!'
  })
}

module.exports = {
  upsertAnswer,
  findAnswer
};
