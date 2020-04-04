const pool = require('./pool');
const bcrypt = require('bcrypt');

function User() {};

User.prototype = {
    find : function(user = null, callback)
    {

        if(user) {
            //console.log(user);
            var field = Number.isInteger(user) ? 'id' : 'login';
        }
        
        //console.log("field: "+field);

        let sql = `SELECT * FROM users WHERE ${field} = '${user}'`;
        //console.log('sql query:' + sql);

        pool.query(sql, function(err, result) 
        {
            /*
            rows.map(row => {
              console.log(`Read: ${JSON.stringify(row)}`);
            });
            */
            //console.log(JSON.stringify(result.rows, null, "    "));
            //console.log('Pwd = ' + result.rows[0].password);

            if(result.rows[0] === undefined)
                callback(null);

            if(err) { console.log('Error query' + err); }
            
            if(result) { callback(result.rows[0]); } else { callback(null); }
        });
        //console.log('debug 2');
    },

    create : function(body, callback) 
    {
        var pwd = body.password;
        var bind = [];
        body.password = bcrypt.hashSync(pwd,10);

        for(prop in body) { bind.push(body[prop]); }
        
        let sql = `INSERT INTO users(login, password, email) VALUES ($1, $2, $3) RETURNING id`;

        pool.query(sql, bind, function(err, result) {
            
            if (err){
             console.log(err);
            } else {
              var newlyCreatedUserId = result.rows[0].id;
            }
            callback(newlyCreatedUserId);
        });
    },

    update : function(body, callback) 
    {
        var pwd = body.password;
        var bind = [];
        body.password = bcrypt.hashSync(pwd,10);

        var userID = null;

        for(prop in body){ bind.push(body[prop]); }

        let sqlSelect = `SELECT id FROM users WHERE login = '${body.login}'`;
        console.log(sqlSelect);

        pool.query(sqlSelect, function(err, result) 
        {
            if(result.rows[0].id === undefined)
                callback(null);

            if(err) { console.log('Error query' + err); }
            
            if(result) 
            { 
                userID = result.rows[0].id;

                let sqlUpdate = `UPDATE users SET login = '${body.login}', password = '${body.password}', email = '${body.email}' WHERE ID = ${userID}`;
                console.log(sqlUpdate);
                pool.query(sqlUpdate, function(err, result) {
                    if (err){ console.log(err); } 
                });

                callback(userID); 
            } 
            else { 
                callback(null); 
            }
        });
            // SELECT id FROM users WHERE login = 'qwerty'
            // UPDATE users SET login = 'login1', password = 'passwd1', email = 'email1' WHERE ID = 17;
    },

    login : function(login, password, callback)
    {
        this.find(login, function(user) {
            
            //console.log("find: " + user);

            if(user) {

                //console.log(password + " " + user.password);

                if(bcrypt.compareSync(password, user.password)) {
                    callback(user);
                    return;
                }  
            }
            callback(null);
        });
    }
}

module.exports = User;