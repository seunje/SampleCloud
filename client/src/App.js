import React, { Component } from 'react';
//import axios from 'axios';
import Login from './components/Login.jsx';

class App extends Component {
	/* TO SEGMENT OR USE IT OTHER COMPONENTS, THIS IS JUST A REFERENCE POINT FOR THE FUTURE
	constructor(props){
		super(props);
		this.state = {
			username: '',
			response1: '',
			response2: '',
		};
		this.handleNewUser = this.handleNewUser.bind(this);
	}
	//state handler (onChange)
	handleNewUser(event) {
		this.setState({ username: event.target.value });
	}	
	componentDidMount() {
		this.callApi()
			.then(res => this.setState({ 
				response1: res.arg1,
				response2: res.arg2
			 }));
	}
	//get data from express
	callApi = async () => {
		const response = await fetch('/api/home');
		const body = await response.json();
		return body;
	};
	
	addToDb = event => {
		event.preventDefault();
		let usernameValue = this.state.username;

		this.setState({ username: event.target.value });
		
		//Post back to express (server.js)
		axios.post('http://localhost:3010/api/pushtodb', {
			username: this.state.username,		
		})
		.then(response => {
			console.log(usernameValue, ' has been passed to ../api/pushtodb');
		}).catch((err) => console.log(err));

		this.setState({
			username: '',
		});
	};
		///////////////// RENDER
			<h1>Sample Cloud</h1>
			<h1>{this.state.response1}</h1>
			<p>{this.state.response2}</p>
			<h1>{this.state.username}</h1>
			<input type='text'
				name='username'
				value={this.state.username}
				onChange={this.handleNewUser} />
			<button type='submit' onClick={this.addToDb}>
			Submit 
			</button>
	*/
  	render() {
    	return (
		<div>
			<Login />
		</div>
	    );
	  }
}

export default App;
