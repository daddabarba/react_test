import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import axios from 'axios';
var querystring = require('querystring');

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

        this.state = {
            posts: [
                {body: "hello everyone", location: "Groningen", price: "2 lleuri"},
                {body: "I am happy!", location: "LA", price: "3 lleuri"},
                {body: "I am NOT happy!", location: "Miami", price: "4 lleuri"},
                {body: "I am NOT happy!", location: "Miami", price: "4 lleuri"}
            ],
            username: null
        }

        this.handleInput = this.handleInput.bind(this);
    }

    renderPost(i){
        const post = this.state.posts[i];
        return(
            <Post body={post.body} location={post.location} price={post.price}/>
        );
    }

    addPost(){
        const posts = this.state.posts;

        posts.push({body: "I am NOT happy!", location: "Miami", price: "4 lleuri"});
        this.setState({posts: posts});
    }

    handleInput(event){
        const state = this.state;

        state.username = event.target.value;
        this.setState(state);
    }

    render(){
        var posts = []

        for(var i=0; i<this.state.posts.length; i++){
            posts.push(<div>{this.renderPost(i)}<br /></div>)
        }

        return(
            <div>
                <input type="text" onChange={this.handleInput} />
                <div>{this.state.username}</div>
                <button name="Add" onClick={() => this.addPost()}> Add </button>
                {posts}
            </div>
        );
    }
}

class ProfileLogin extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        var posts = [];

        return(
            <div>
                <input type="text" onChange= {(event) => this.setState({inputName: event.target.value})} />
                <input type="text" onChange= {(event) => this.setState({inputPass: event.target.value})} />

                <button name="Add" onClick={() => {this.props.logInFun(this.state.inputName, this.state.inputPass)}}> Add </button>
            </div>
        );
    }
}

class ProfileAccess extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                {this.props.userID}
            </div>
        )
    }
}

class Profile extends React.Component {
    constructor(props){
        super(props);
    }

    callApi = (username, password) => {

        var data = {usrname: username, password: password};
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

        return <ProfileAccess userID={this.props.callback.getUID()} />
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
    }

    getUserID(){
        return this.state.username
    }

    setUserID(userID){
        this.setState({username:userID})
    }

    getPage(){
        if(this.state.selection == "Home")
            return <Home/>;
        if(this.state.selection == "Feed")
            return <Feed/>;
        if(this.state.selection == "Profile")
            return <Profile callback = {{setUID: this.setUserID, getUID: this.getUserID}}/>;
    }

    buttonEvent(sel){
        this.setState({selection: sel});
    }

    render(){
        var page = this.getPage();

        return(
            <div>
                <button name="home" onClick={() => this.buttonEvent("Home")}>Home</button>
                <button name="profile" onClick={() => this.buttonEvent("Profile")}>Profile</button>

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
