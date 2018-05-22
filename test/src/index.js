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


class Profile extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            username: props.username,
            writtenPost: null
        }

        this.handleInput = this.handleInput.bind(this);
    }

    savePost(){

    }

    callApi = () => {

        var data = {body: this.state.writtenPost, user: this.state.username};
        axios.post('http://127.0.0.1:5000/api/post', data)
            .then(res => {
                console.log(res)
                this.setState({response: res.data.express})
            })
            .catch(err => {console.log( err.toString())});
    };

    handleInput(event){
       this.setState({writtenPost: event.target.value});
    }

    render(){
        var posts = []

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
            response: null
        }
    }

    componentDidMount() {
        this.callApi();
    }

    callApi = () => {

        var data = {a: "sentence"};
        axios.post('http://127.0.0.1:5000/api/hello', data)
            .then(res => {
                console.log(res)
                this.setState({response: res.data.express})
            })
            .catch(err => {console.log( err.toString())});
    };

    buttonEvent(sel){
        this.setState({selection: sel});
    }

    render(){
        var page = (this.state.selection=="Home") ? <Home/> : <Feed />;

        return(
            <div>
                <button name="home" onClick={() => this.buttonEvent("Home")}>Home</button>
                <button name="feed" onClick={() => this.buttonEvent("Feed")}>Feed</button>

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
