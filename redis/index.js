const redis = require("redis")
const options = {
  host: '127.0.0.1',
  port: 9527,
  password: '123456.a'
}
const client = redis.createClient(options)

client.on('connect', function (res) {
  console.log('connect')
  // client.set('someKey', 'testValue',redis.print);
  // client.get('someKey', redis.print);
  // client.get('unknownKey', redis.print);
  client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
  client.hgetall("hosts", function (err, obj) {
    console.dir(obj);
  });
  client.quit()
})

client.on('ready', function (res) {
  console.log('ready')
})

client.on("error", function (err) {
  console.log("Error " + err)
})
