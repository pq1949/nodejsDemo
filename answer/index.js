const app = require("express")();
const http = require("http").Server(app);
const moment = require("moment");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const actions = require("./actions");
const VERSION = 0.1;

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*,authorization");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  if (req.method == "OPTIONS") res.sendStatus(200);
  /*让options请求快速返回*/ else next();
});

app.get(`/v${VERSION}/answer/:exam_id`, function(req, res) {
  actions.findAnswer(req.params, data => {
    res.send(data);
  });
});

// POST method route
app.post(`/v${VERSION}/answer`, function(req, res) {
  actions.upsertAnswer(req.body, data => {
    res.send(data);
  });
});

// upsertAnswer({
//   qid: "1111",
//   // exam_id: "222",
//   // sdp_app_id: "555",
//   title: "666",
//   corrects: [1, 2, 3, 4, 5],
//   update_time: moment().format("YYYY-MM-DD HH:mm:ss:SSS")
// });

// refer:  https://github.com/csbun/thal/blob/master/README.md?from=singlemessage&isappinstalled=0
// https://github.com/emadehsan/thal
// https://github.com/csbun/thal

// api https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions

http.listen(9527, function() {
  console.log("listening on *:9527");
});
