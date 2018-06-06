import React, { Component } from 'react';
import Player from './Player.jsx';
import axios from 'axios';

class UserSamples extends Component {
  constructor(props){
    super(props);
    this.state = {
      samples: [],
      userAttr: []
    }
  }

  componentDidMount(){
    const url = 'http://localhost:3000/api/profile/' + this.props.user.username;
    axios.get(url).then(res => {
      console.log('RES: ', res.data);
      this.setState({ 
        samples: res.data.files, 
        userAttr: res.data.user
      });
    }); 
    console.log('UserSamples.jsx has mounted.');
  }

  render() {
    return (
      <div className='samples_cont'>
        <div>{'Samples: '}{this.state.samples.length}</div>
        <SampleBox
          samples={this.state.samples}
          userAttr={this.state.userAttr}
        />
      </div>
    );
  }
}

const box = {
  display: 'inline-block',
  width: '340px',
  height: 'auto',
  backgroundColor: 'white' 
}

const SampleBox = (props) => (
  props.samples.map((item, i) =>
  <div style={box} key={i}>
      <SampleControls />
      <UserProperties
        userAttr={props.userAttr}
      />
      <Player
        username={item.username}
        sample={item.friendlyName}
        sampleURL={item.filePath}
        dateAdded={item.dateAdded}
        block={'inline-block'} 
      />
    </div>
  )
);

const SampleControls = (props) => (
  <div>
    <button>Delete</button>
    <button>Rename</button>
    <button>Move</button>
  </div>
);

//CATEFORIES
const UserProperties = (props) => (
  props.userAttr.map((item, i) =>
    <div key={i}>
      <p>Category: {item.admin}</p>
    </div>
  )
);

export default UserSamples
