const util = require('util');
var pg = require('pg');

const dbConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123321',
  database: 'testprj',
  max: 25,
  idleTimeoutMillis: 5000
};

const pool = new pg.Pool(dbConfig);

pool.connect(function(err, client, done) {
  if (err) {
      console.error('Error connecting to pg server' + err.stack);
      callback(err);
  } else {
      console.log('Connection established with pg db server');
  }
});  

pool.query = util.promisify(pool.query);
module.exports = pool;