const express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
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

app.post('/api/getUnpubFeeds', jsonParse, (req, res) => {
    console.log('Sending Response for unpublished feeds request');
    console.log('Searching id: ' + req.body._id );

    dataBase.db.collection("feeds").find({UID: ObjectId(req.body._id), body:-1}).toArray().then(
        function(value){
            res.send(value);
        }

    ).catch(
        function () {
            res.send({userID: null});
        }
    );

});

app.post('/api/getPubFeeds', jsonParse, (req, res) => {
    console.log('Sending Response for published feeds request');
    console.log('Searching id: ' + req.body._id );

    dataBase.db.collection("feeds").find({UID: ObjectId(req.body._id), body:{$ne: -1}}).toArray().then(
        function(value){
            res.send(value);
        }

    ).catch(
        function () {
            res.send(null);
        }
    );

});

app.post('/api/getUType', jsonParse, (req, res) => {
    console.log('Sending Response for type request');
    console.log('Searching id: ' + req.body._id );

    dataBase.db.collection("users").findOne({_id: ObjectId(req.body._id)}).then(
        function(value){

            res.send({type: value.type});
        }

    ).catch(
        function () {
            res.send(null);
        }
    );

});

app.post('/api/getPoints', jsonParse, (req, res) => {
    console.log('Sending Response for points request');
    console.log('Searching id: ' + req.body._id );

    dataBase.db.collection("users").findOne({_id: ObjectId(req.body._id)}).then(
        function(value){
            res.send({points: value.points});
        }

    ).catch(
        function () {
            res.send(null);
        }
    );

});

app.post('/api/getConfirmation', jsonParse, (req, res) => {
    console.log('Sending Response for confirmation request');
    console.log('Searching id: ' + req.body._id );

    dataBase.db.collection("users").findOne({_id: ObjectId(req.body._id)}).then(
        function(value){
            console.log("returning " + value.confirmation);
            res.send(value.confirmation);
        }

    ).catch(
        function () {
            res.send(null);
        }
    );

});

app.post('/api/givePoints', jsonParse, (req, res) => {
    console.log('Sending Response for giving points request');
    console.log('Searching id: ' + req.body.username + " to give " + req.body.points + " points. From " + req.body.me);

    var data = req.body;

    dataBase.db.collection("users").findOne({username: req.body.username}).then(
        function(value){
            console.log("previous points " + value.points);
            var givenPoints = data.points;
            data.points = Number(value.points) + Number(data.points);
            console.log("new points " + data.points);

            data._id = value._id;

            dataBase.db.collection("users").findOneAndUpdate({_id: ObjectId(data._id)}, {$set: {points: data.points}});

            dataBase.db.collection("users").findOne({_id: ObjectId(req.body.me)}).then(
                function(value){
                    data.location = value.location;

                    dataBase.db.collection("feeds").insert({UID: data._id, body:-1, location: data.location, points: givenPoints});
                    res.send("Success");
                }
            ).catch(
                function () {
                    res.send(null);
                }
            );
        }

    ).catch(
        function () {
            res.send(null);
        }
    );

});

app.post('/api/addUser', jsonParse, (req, res) => {
    console.log('Sending Response for login request');
    console.log('Searching user: ' + req.body.username + " with password " + req.body.password);

    var confirmed = req.body.type === "Receiver";
    var data = req.body;

    data.confirmation = confirmed;
    data.points = 0;

    dataBase.db.collection("users").insert(data);
    res.send("Success");

});

app.post('/api/login', jsonParse, (req, res) => {
    console.log('Sending Response for login request');
    console.log('Searching user: ' + req.body.username + " with password " + req.body.password);

    dataBase.db.collection("users").findOne(req.body).then(
        function(value){

            res.send({userID: value._id});
        }

    ).catch(
        function () {
            res.send({userID: null});
        }
    );

});

app.listen(port, () => console.log(`Listening on port ${port}`));

