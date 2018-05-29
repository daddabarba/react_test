import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import axios from 'axios';
var querystring = require('querystring');

function rect(ctx, x,y,width, height) {
    ctx.fillRect(x, y, width, height);
}

function drawFractalTree(context, depth){
    drawTree(context, depth*60, depth*80, -90, depth, depth);
}
function drawTree(context, x1, y1, angle, depth, maxDepth){
    var BRANCH_LENGTH = random(0, 15);
    if (depth > 0){
        var x2 = x1 + (cos(angle) * depth * BRANCH_LENGTH);
        var y2 = y1 + (sin(angle) * depth * BRANCH_LENGTH);

        drawLine(context, x1, y1, x2, y2, 11*(depth/maxDepth), maxDepth);
        drawTree(context, x2, y2, angle - random(15,20), depth - 1, maxDepth);
        drawTree(context, x2, y2, angle + random(15,20), depth - 1, maxDepth);
    }
}
function drawLine(context, x1, y1, x2, y2, thickness, maxDepth){
    context.fillStyle   = '#000';

    var r = 34 + (thickness/maxDepth)*105;
    var g = 139 - (thickness/maxDepth)*13;
    var b = 34 + (thickness/maxDepth)*68;

    context.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    context.lineWidth = thickness * 1.5;
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}
function cos (angle) {
    return Math.cos(deg_to_rad(angle));
}
function sin (angle) {
    return Math.sin(deg_to_rad(angle));
}
function deg_to_rad(angle){
    return angle*(Math.PI/180.0);
}
function random(min, max){
    return min + Math.floor(Math.random()*(max+1-min));
}

class Tree extends React.Component{
    constructor(props){
        super(props);

        this.draw = this.draw.bind(this);
    }

    componentDidMount(){
        this.draw();
    }

    componentDidUpdate(){
        this.draw();
    }

    draw(){
        const context = this.refs.canvas.getContext('2d');
        context.clearRect(0,0, 300, 300);

        //rect(context, 10, 10, 50 ,50);
        drawFractalTree(context,this.props.depth);
    }

    render(){
        return(
            <canvas ref="canvas" width={this.props.depth*80} height={this.props.depth*80}/>
        )
    }
}

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

        if(this.state.password !== this.state.confirmPassword)
            eq = "The two paswords do not match";

        if(this.state.type === "Giver")
            loc = <div className="inline form-group">
                    <label htmlFor="location">Location</label>
                <input type="text" placeholder="somewhere" onChange= {(event) => this.setState({location: event.target.value})} onKeyPress={this._handleKeyPress} />
                </div>;



        return(
            <div>
                <br/><br/>
                <div>
                    <div className="inline form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" placeholder="example97" onChange= {(event) => this.setState({username: event.target.value})} onKeyPress={this._handleKeyPress} />
                    </div>
                    <div className="inline form-group">
                        <label htmlFor="snumber">Student Number</label>
                        <input type="text" placeholder="s1234567" onChange= {(event) => this.setState({snumber: event.target.value})} onKeyPress={this._handleKeyPress} />
                    </div>

                    <div className="block form-group">
                        <label htmlFor="select">Type</label>
                        <select onChange= {(event) => this.setState({type: event.target.value, location:null})}>
                            <option value="None"> </option>
                            <option value="Receiver">Receiver</option>
                            <option value="Giver">Giver</option>
                        </select>
                    </div>


                    <div className="inline form-group">
                        <label htmlFor="password">Password</label>
                        <input type="text" placeholder="password" onChange= {(event) => this.setState({password: event.target.value})} onKeyPress={this._handleKeyPress} />
                    </div>
                    <div className="inline form-group">
                        <label htmlFor="confpass">Confirm Password</label>
                        <input type="text" placeholder="confirm password" onChange= {(event) => this.setState({confirmPassword: event.target.value})} onKeyPress={this._handleKeyPress} />
                    </div>

                    {loc}

                    <div>
                        {eq}
                    </div>


                    <br/><br/>
                    <button class="action" name="submit" onClick={() => {this.submit()}}> Submit </button>
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

        this.state = {
            empty: this.props.body === -1 || this.props.body === "" || this.props.body == null,
            selected: false,
            text: -1,
            result: null
        };
    }

    handleClick = () => {
      if(this.state.empty)
          this.setState({selected: !this.state.selected});
    };

    submit = () => {
        if(this.state.text !== -1 && this.state.text!=="" && this.state.text!==null)
            this.submitApi();
    };

    submitApi = () => {

        var data = {_id: this.props.ID, body: this.state.text, UID: this.props.UID};
        axios.post('http://127.0.0.1:5000/api/writePost', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({result: res.data});
                //window.location.reload()
            })
            .catch(err => {console.log( err.toString())});
    };

    render() {
        var text = <div>  </div>;

        if(this.state.empty) {
            if (this.state.selected) {
                text = <div>
                    <div className="inline form-group">
                        <textarea onChange={(event) => {this.setState({text: event.target.value})}} />
                    </div>

                    <br/>

                    <button class="action" name="Submit" onClick={this.submit()}> Submit</button>
                    <button name="Close" onClick={() => this.setState({selected: !this.state.selected, text:-1})}> Close</button>
                </div>;
            } else {
                text = <div onClick={this.handleClick}> click here to write this</div>
            }
        }else{
            text = <div>
                {this.props.body}
            </div>
        }

        return (
            <div className="card">
                <div className="postBody">
                    {text}
                </div>
                <div className="container">
                    <h4>From: <b>{this.props.location}</b></h4>
                    <h2><p>Total points: {this.props.price}</p></h2>
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
            <Post body={post.body} location={post.location} price={post.points} ID={post._id} UID={this.props.callback.getUID()}/>
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
                <br/><br/>
                <div className="inline form-group">
                    <label htmlFor="usernameLogin">Username</label>
                    <input type="text" placeholder="username" onChange= {(event) => this.setState({inputName: event.target.value})} onKeyPress={this._handleKeyPress} />
                </div>
                <div className="inline form-group">
                    <label htmlFor="passwordLogin">Password</label>
                    <input type="text" placeholder="password" onChange= {(event) => this.setState({inputPass: event.target.value})} onKeyPress={this._handleKeyPress} />
                </div>

                <br/><br/>

                <button class="action" name="Log In" onClick={() => {this.log()}}> Log In </button>
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

        var data = {username: this.state.username, points: this.state.points, me: this.props.callback.getUID()};
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
                <br/>
                <div className="cardPoints">
                    <h2>You are a Giver</h2>
                </div>
                <br/><br/>
                <div>
                    <div className="inline form-group">
                        <label htmlFor="receiver">Receiver</label>
                        <input type="text" placeholder="username" onChange= {(event) => this.setState({username: event.target.value})} onKeyPress={this._handleKeyPress} />
                    </div>
                    <div className="inline form-group">
                        <label htmlFor="points">Amount of points</label>
                        <input type="text" placeholder="points" onChange= {(event) => this.setState({points: event.target.value})} onKeyPress={this._handleKeyPress} />
                    </div>

                    <br/><br/>

                    <button class="action" name="Submit" onClick={() => {this.submit()}}> Submit </button>
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
                this.setState({pubfeeds: res.data.reverse()});
            })
            .catch(err => {console.log( err.toString())});
    };

    getUnpubFeeds = () => {

        var data = {_id: this.props.callback.getUID()};
        axios.post('http://127.0.0.1:5000/api/getUnpubFeeds', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({unpubfeeds: res.data.reverse()});
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


    getPubs(){
        if(this.state.pubfeeds != null)
            return <Feed className="ft-left" posts = {this.state.pubfeeds} callback = {this.props.callback}/>;
        return <div> Loading... </div>;
    }

    getUnpubs(){
        if(this.state.pubfeeds != null)
            return <Feed className="ft-right" posts = {this.state.unpubfeeds} callback = {this.props.callback}/>;
        return <div> Loading... </div>;
    }


    render(){

        var tree = null;

        if(this.state.points > 0)
            tree = <Tree depth={this.state.points} />;

        return(
            <div>
                <br/>
                <div className="cardPoints">
                    <h2>You are a Receiver. You have <font color="blue">{this.state.points}</font> points</h2>
                </div>
                <br/><br/>
                <div className = "entire">
                    <div className = "ft-left">
                        <h2>Posted</h2>
                        {this.getPubs()}
                    </div>
                    <div className="ft-right">
                        <h2> To post</h2>
                        {this.getUnpubs()}
                    </div>
                </div>
                <div className="stuck">
                    {tree}
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
            page = <div className="cardPoints"> <h1> You need to be verified first</h1> </div>;

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

        this.state = {
            feeds: null,
            points: null
        };



    }

    componentDidMount(){
        this.getPoints();
        this.getAllFeeds();
    }

    getPoints = () => {

        var data = {_id: this.props.callback.getUID()};
        axios.post('http://127.0.0.1:5000/api/getPoints', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({points: res.data.points});
            })
            .catch(err => {console.log( err.toString())});
    };

    getAllFeeds = () => {

        var data = {_id: this.props.callback.getUID()};
        axios.post('http://127.0.0.1:5000/api/getAllFeeds', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({feeds: res.data});
            })
            .catch(err => {console.log( err.toString())});
    };

    getPage(){
        if(this.state.feeds != null)
            return <Feed posts = {this.state.feeds} callback = {this.props.callback}/>
        return <div> Loading... </div>
    }

    render(){
        var tree = null;

        if(this.state.points > 0)
            tree = <Tree depth={this.state.points} />;

        return(
            <dib>
                <br/><br/>
                <div className="ft-center">
                    {this.getPage()}
                </div>
                <div className="stuck">
                    {tree}
                </div>
            </dib>
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

    getPage() {
        var cbk = {
            setUID: this.setUserID,
            getUID: this.getUserID,
            logout: this.logout,
            setUType: this.setUType,
            getUType: this.getUType
        };

        if (this.state.selection == "Home") {
            if(this.refs.Home)
                this.refs.Home.disabled = true;
            if(this.refs.Profile)
                this.refs.Profile.disabled = false;

            return <Home callback={cbk}/>;
        }
        if (this.state.selection == "Register") {
            return <Register/>;
        }
        if (this.state.selection == "Profile"){
            if(this.refs.Home)
                this.refs.Home.disabled = false;
            if(this.refs.Profile)
                this.refs.Profile.disabled = true;

            return <Profile callback={cbk}/>;
        }
    }

    buttonEvent(sel){
        this.setState({selection: sel});
        localStorage.setItem('lastPage', sel);
    }

    render(){
        var page = this.getPage();

        return(
            <div>
                <div class="navbar">
                    <div style={{float: "left"}}>
                        <button class="action" ref = "Home" name="home" onClick={() => this.buttonEvent("Home")}>Home</button>
                        <button class="action" ref = "Profile" name="profile" onClick={() => this.buttonEvent("Profile")}>Profile</button>
                    </div>
                    <div style={{float: "right"}}>
                        <button name="register" onClick={() => this.buttonEvent("Register")}>Register</button>
                        <button name="logout" onClick={() => this.logOut()}>Log Out</button>
                    </div>
                </div>

                <div>{this.state.response}</div>

                {page}
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <div><link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"/><Main /></div>,
    document.getElementById('root')
);
