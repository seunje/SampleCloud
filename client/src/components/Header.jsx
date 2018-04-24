import React, { Component } from 'react';
// Used Link for loading components
import { Link } from 'react-router-dom';
import '../css/header.css';

class Header extends Component {
	constructor(props){
		super(props);
	}
	//<li><Link to='/upload'>Upload</Link></li>

	render(){
		return (
			<div className='headerCont'>			
				<h1>Welcome: {this.props.username}</h1>
				<ul>
					<li><Link to='/'>Home</Link></li>
					<li><Link to='/about'>About</Link></li>
					<li><Link to='/browse'>Browse</Link></li>
					<li><Link to='/upload'>Upload</Link></li>
				</ul>
			</div>
	
		);
	}

}

export default Header;