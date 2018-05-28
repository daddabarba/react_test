import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import axios from 'axios';
var querystring = require('querystring');

class Register extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            username: null,
            snumber: null,
            password: null,
            confirmPassword: null,
            type:null,
            location:null,
            result: null
        };

        this.submit = this.submit.bind(this);
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.submit();
        }
    };

    submit() {
        if (this.state.password === this.state.confirmPassword)
            this.sendCredentials();
    }


    sendCredentials = () => {

        var data = {username: this.state.username, snumber: this.state.snumber, type: this.state.type, password: this.state.password};

        if(this.state.location)
            data.location = this.state.location;

        axios.post('http://127.0.0.1:5000/api/addUser', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({result: res.data});
            })
            .catch(err => {console.log( err.toString())});
    };

    render(){
        var eq = null;
        var loc = null;

        if(this.state.password !== this.state.confirmPassword && this.state.type!== null && this.state.type!=="None")
            eq = "The two paswords do not match";

        if(this.state.type === "Giver")
            loc = <input type="text" placeholder="location" onChange= {(event) => this.setState({location: event.target.value})} onKeyPress={this._handleKeyPress} />;

        return(
            <div>
                <div>
                    <input type="text" placeholder="username" onChange= {(event) => this.setState({username: event.target.value})} onKeyPress={this._handleKeyPress} />
                    <input type="text" placeholder="snumber" onChange= {(event) => this.setState({snumber: event.target.value})} onKeyPress={this._handleKeyPress} />

                    <select onChange= {(event) => this.setState({type: event.target.value, location:null})}>
                        <option value="None"> </option>
                        <option value="Receiver">Receiver</option>
                        <option value="Giver">Giver</option>
                    </select>

                    <input type="text" placeholder="password" onChange= {(event) => this.setState({password: event.target.value})} onKeyPress={this._handleKeyPress} />
                    <input type="text" placeholder="confirm password" onChange= {(event) => this.setState({confirmPassword: event.target.value})} onKeyPress={this._handleKeyPress} />

                    {loc}

                    <button name="submit" onClick={() => {this.submit()}}> Submit </button>
                </div>
                <div>
                    {eq}
                </div>
                <div>
                    {this.state.result}
                </div>
            </div>
        );
    }
}

class Post extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="post">
                <div className="postBody">
                    {this.props.body}
                </div>
                <div className="postLocation">
                    {this.props.location}
                </div>
                <div className="postPrice">
                    {this.props.price}
                </div>
            </div>
        );
    }
}

class Feed extends React.Component {
    constructor(props){
        super(props);
    }

    renderPost(i){
        const post = this.props.posts[i];
        return(
            <Post body={post.body} location={post.location} price={post.points}/>
        );
    }

    render(){
        var posts = [];

        for(var i=0; i<this.props.posts.length; i++){
            posts.push(<div>{this.renderPost(i)}<br /></div>)
        }

        return(
            <div>
                {posts}
            </div>
        );
    }
}

class ProfileLogin extends React.Component{
    constructor(props){
        super(props);

        this.log = this.log.bind(this);
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.log();
        }
    };

    log(){
        this.props.logInFun(this.state.inputName, this.state.inputPass);
    }

    render(){
        return(
            <div>
                <input type="text" placeholder="username" onChange= {(event) => this.setState({inputName: event.target.value})} onKeyPress={this._handleKeyPress} />
                <input type="text" placeholder="password" onChange= {(event) => this.setState({inputPass: event.target.value})} onKeyPress={this._handleKeyPress} />

                <button name="Log In" onClick={() => {this.log()}}> Log In </button>
            </div>
        );
    }
}

class ProfileAccessGiver extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: null,
            points: null,
            result: null
        };
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.submit();
        }
    };

    submit = () => {

        var data = {username: this.state.username, points: this.state.points};
        axios.post('http://127.0.0.1:5000/api/givePoints', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({result: res.data});
            })
            .catch(err => {console.log( err.toString())});
    };

    render(){
        return(
            <div>
                <div>
                    You are a Giver
                </div>
                <div>
                    <input type="text" onChange= {(event) => this.setState({username: event.target.value})} onKeyPress={this._handleKeyPress} />
                    <input type="text" onChange= {(event) => this.setState({points: event.target.value})} onKeyPress={this._handleKeyPress} />

                    <button name="Submit" onClick={() => {this.submit()}}> Submit </button>
                    {this.state.result}
                </div>
            </div>
        )
    }
}

class ProfileAccessReceiver extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            pubfeeds: [],
            unpubfeeds: [],
            points: -1
        };

        this.getPubFeeds();
        this.getUnpubFeeds();
        this.getPoints();
    }

    getPubFeeds = () => {

        var data = {_id: this.props.callback.getUID()};
        axios.post('http://127.0.0.1:5000/api/getPubFeeds', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({pubfeeds: res.data});
            })
            .catch(err => {console.log( err.toString())});
    };

    getUnpubFeeds = () => {

        var data = {_id: this.props.callback.getUID()};
        axios.post('http://127.0.0.1:5000/api/getUnpubFeeds', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({unpubfeeds: res.data});
            })
            .catch(err => {console.log( err.toString())});
    };

    getPoints = () => {

        var data = {_id: this.props.callback.getUID()};
        axios.post('http://127.0.0.1:5000/api/getPoints', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({points: res.data.points});
            })
            .catch(err => {console.log( err.toString())});
    };


    render(){

        return(
            <div>
                You are a Receiver. You have {this.state.points} points
                <div className = "entire">
                    <div className = "ft-left">
                        <Feed className="ft-left" posts = {this.state.pubfeeds} />
                    </div>
                    <div className="ft-right">
                        <Feed className="ft-right" posts = {this.state.unpubfeeds} />
                    </div>
                </div>
            </div>
        )
    }
}

class ProfileAccess extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            allowed: false
        };

        this.getConfirmation();
    }

    componentDidMount(){
        this.callApi(this.props.callback.getUID())
    }

    callApi = (UID) => {

        var data = {_id: UID};
        axios.post('http://127.0.0.1:5000/api/getUType', data)
            .then(res => {
                console.log("Respose: " + res);
                this.props.callback.setUType(res.data.type);
            })
            .catch(err => {console.log( err.toString())});
    };

    getConfirmation = () => {

        var data = {_id: this.props.callback.getUID()};
        axios.post('http://127.0.0.1:5000/api/getConfirmation', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({allowed: res.data});
            })
            .catch(err => {console.log( err.toString())});
    };

    getPage(){
        if(this.props.callback.getUType() === "Giver")
            return <ProfileAccessGiver callback={this.props.callback} />;
        if(this.props.callback.getUType() === "Receiver")
            return <ProfileAccessReceiver callback={this.props.callback} />;
    }

    render(){
        var page = this.getPage();

        if(!this.state.allowed)
            page = <div> You need to be verified first </div>;

        return(
            <div>
                {page}
            </div>
        )
    }
}

class Profile extends React.Component {
    constructor(props){
        super(props);
    }

    callApi = (username, password) => {

        var data = {username: username, password: password};
        axios.post('http://127.0.0.1:5000/api/login', data)
            .then(res => {
                console.log("Respose: " + res);
                this.props.callback.setUID(res.data.userID);
            })
            .catch(err => {console.log( err.toString())});
    };

    getPage(){
        if(this.props.callback.getUID() == null)
            return <ProfileLogin logInFun={this.callApi} />;

        return <div><ProfileAccess callback={this.props.callback} /></div>
    }

    render(){
        var page = this.getPage();

        return(
            <div>
                {page}
            </div>
        )
    }
}

class Home extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                Hello This is the Home
            </div>
        );
    }
}

class Main extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selection: "Home",
            username: null
        };

        this.getUserID = this.getUserID.bind(this);
        this.setUserID = this.setUserID.bind(this);
        this.logOut = this.logOut.bind(this);
        this.setUType = this.setUType.bind(this);
        this.getUType = this.getUType.bind(this);

        //localStorage.clear();
    }

    componentDidMount(){
        var ID = localStorage.getItem('UID');
        var type = localStorage.getItem('type');
        var lastPage = localStorage.getItem('lastPage');

        if(ID === "null")
            ID = null;
        if(type === "null")
            type = null;

        if(lastPage != null)
            this.setState({selection: lastPage});

        this.setUserID(ID);
        this.setUType(type);
    }

    setUType(type){
        this.setState({type:type});
        localStorage.setItem('type', type);
    }

    getUType(){
        return this.state.type;
    }

    logOut(){
        this.setState({username: null});
        localStorage.removeItem('UID');
    }

    getUserID(){
        return this.state.username
    }

    setUserID(userID){
        this.setState({username:userID});
        localStorage.setItem('UID', userID);
    }

    getPage(){
        if(this.state.selection == "Home")
            return <Home/>;
        if(this.state.selection == "Register")
            return <Register/>;
        if(this.state.selection == "Profile")
            return <Profile callback = {{setUID: this.setUserID, getUID: this.getUserID, logout: this.logout, setUType: this.setUType, getUType: this.getUType}}/>;
    }

    buttonEvent(sel){
        this.setState({selection: sel});
        localStorage.setItem('lastPage', sel);
    }

    render(){
        var page = this.getPage();

        return(
            <div>
                <button name="home" onClick={() => this.buttonEvent("Home")}>Home</button>
                <button name="profile" onClick={() => this.buttonEvent("Profile")}>Profile</button> |
                <button name="register" onClick={() => this.buttonEvent("Register")}>Register</button>
                <button name="logout" onClick={() => this.logOut()}>Log Out</button>

                <div>{this.state.response}</div>

                {page}
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Main />,
    document.getElementById('root')
);
