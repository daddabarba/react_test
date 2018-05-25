const express = require('express');
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const jsonParse = bodyParser.json();
const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const port = process.env.PORT || 5000;



var url = "mongodb://localhost:27018/";


class dbWrap {
    constructor(client, address){
        this.data = {
            clt: client,
            url: address,
            collections: ["feeds", "users"]
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

        this.state = this.state + " Collection created!";
    }

    handleDB(err,db){
        if (err) {
            this.state = "Failed to load DB";
            throw err;
        }else {
            this.state = "Database created!";

            this.db = db.db("mydb");


            for (var i in this.data.collections){
                console.log("Creating collection " + this.data.collections[i]);
                this.db.createCollection(this.data.collections[i], this.handleConnection);
            }

            //db.close();
        }
    }

    connect(){
        this.data.clt.connect(this.data.url, this.handleDB);
    }
}

var dataBase = new dbWrap(MongoClient, url);

dataBase.connect();

app.post('/api/hello', jsonParse, (req, res) => {
    console.log('Sending Response for hello request');
    console.log(dataBase.state);

    res.send({ express: "ciao " + req.body.a});
});

app.post('/api/login', jsonParse, (req, res) => {
    console.log('Sending Response for login request');
    console.log('Searching user: ' + req.body.usrname + " with password " + req.body.password);

    console.log(dataBase.db.collection("users").findOne({username: req.body.usrname, password: req.body.password}));

    res.send({ userID: null});
});

app.listen(port, () => console.log(`Listening on port ${port}`));

