const mysql = require('mysql')
const mysqlClient = mysql.createConnection({
  host: '140.143.99.193',
  port: '3306',
  user: 'testuser',
  database: 'testdb',
  password: '123456'
})

mysqlClient.connect(function (err) {
  if (err) {
    console.error('mysql error connecting: ' + err.stack);
    return;
  }
  console.log('mysql connected as id ' + mysqlClient.threadId);
})

mysqlClient.query(`INSERT INTO demo (content, type) VALUES ('test', 'right') `, function (error, results, fields) {
  if (error) console.log(error)
  console.log(results)
});


mysqlClient.query(`SELECT * FROM demo order by customer_id desc limit 100; `, function (error, results, fields) {
  if (error) console.log(error)
  console.log(results)
});
