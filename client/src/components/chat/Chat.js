import React, {Component, Context } from "react";
import socketIOClient from "socket.io-client";
import './Chat.css';
import UserList from './../userlist/UserList';


const ENDPOINT = "http://localhost:3001/";
var socket;
export const MyContext = React.createContext();

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        displayData: [],
        message: "",
        id: 0,
        count: 0,
        boardId: "",
        userList: ""
    };
    socket = this.props.socket;
  }

  componentWillMount = () => {
    // workingon saving messages to server
    let messages = localStorage.getItem('messages')
    if (messages){
      for(var i in messages){
        console.log(JSON.stringify(messages))
      }    
    }
    socket.on("join server", (msg) => {
      console.log("Connecting...");
      this.setState({displayData : [...this.state.displayData, <div className="chat-msg">{msg.time + " - " + msg.username + ": " + msg.text + " "}</div>]})
      localStorage.setItem('messages', this.state.displayData)
      socket.emit("join notification", (this.props.username))
    })
    socket.on("chat message", msg => {    
      console.log("adding message: " + msg);
      this.setState({displayData : [...this.state.displayData, <div className="chat-msg">{msg.time + " - " + msg.username + ": " + msg.text + " "}</div>]})
      localStorage.setItem('messages', this.state.displayData)
    }); 
    socket.on("No login", msg => {    
      console.log("adding message: " + msg);
      this.setState({displayData : [...this.state.displayData, msg.time + " - " + msg.username + ": " + msg.text + " "]})     
      localStorage.setItem('messages', this.state.displayData)
    });
    socket.on("userList", (userList) => {
      console.log("userlist: " )
      console.log(userList)
      this.setState({userList: userList})
    }); 
    socket.on("joined", (boardId, userList) => {
      console.log(userList)
      this.setState({boardId: boardId}) // can't have multiple parameters in emit <=====a
    });
    socket.on("left room", res => {
      this.setState({boardId: ""})
    });
  }
 
  giveId = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
  }

  handleChange = e => {
    this.setState({ message: e.target.value });
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      socket.emit("chat message", this.state.message, this.props.username, this.state.boardId);
      this.setState({message: ""});
    }
  }

  handleClick = e => {   
    socket.emit("chat message", this.state.message, this.props.username, this.state.boardId);
    this.setState({message: ""});
  }

  listUsers = () => {
    var userList = this.state.userList
    console.log("here is hte log:" + this.state.userList)
    if(userList != "")
    return(
    
    )
    else{
      return (
      <p> got nothing </p>
      )
    }
  }

  render() {
    return (
    <div className="chatBox-container">
      <div className="chatBox">  
        {this.state.displayData}       
      </div>    
      <div className="chatInputBox">
        <input
            className="chatInput"
            type="text"
            placeholder="Start Chatting" 
            value={this.state.message}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
        />
      </div>  
        {this.listUsers()}     
    </div>
    )
  }
}
  
export default Chat;