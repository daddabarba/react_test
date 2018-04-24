const express = require('express');

const app = express();
const port = process.env.PORT || 5000;


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:5000/mydb";

class db {
    constructor(client, address){
        this.data = {
            clt: client,
            url: address
        };

        this.state = 'DB not created';

        this.handleDB = this.handleDB.bind(this);
        this.connect = this.connect.bind(this);
    }

    handleDB(err,db){
        if (err)
            this.state = "Failed to load DB";
        else {
            this.state = "Database created!";
            db.close();
        }
    }

    connect(){
        this.data.clt.connect(this.data.url, this.handleDB);
    }
}

var dataBase = new db(MongoClient, url);

dataBase.connect();

app.get('/api/hello', (req, res) => {
    res.send({ express: dataBase.state });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

