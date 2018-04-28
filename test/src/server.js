const express = require('express');

const app = express();
const port = process.env.PORT || 5000;


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27018/";


class db {
    constructor(client, address){
        this.data = {
            clt: client,
            url: address,
            collections: null
        };

        this.state = 'DB not created';

        this.handleDB = this.handleDB.bind(this);
        this.connect = this.connect.bind(this);
        this.handleConnection = this.handleConnection.bind(this);
    }

    handleConnection(err, res){
        if (err) throw err;
        console.log(this.state);
        console.log("Collection created!");

        this.state = this.state + "Collection created!";
    }

    handleDB(err,db){
        if (err) {
            this.state = "Failed to load DB";
            throw err;
        }else {

            this.state = "Database created!";

            var dbo = db.db("mydb");
            dbo.createCollection("feeds", this.handleConnection);
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
    res.send({ express: dataBase.state});
});

app.listen(port, () => console.log(`Listening on port ${port}`));

