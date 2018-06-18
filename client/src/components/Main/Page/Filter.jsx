import React, { Component } from 'react';
import axios from 'axios';
import InputSelect from './InputSelect.jsx';
import InputText from './InputText.jsx';
import Grid from '@material-ui/core/Grid';
import './filter.css';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      categories: [],
      selectUser: '',
      selectCat: ''
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSelection(val, type) {
    this.props.filterGetData(val, type);
    //TO Review this later.
    if(type === 'category') {
      this.setState({ 
        selectUser: '',
        selectCat: val 
      });
    }
    if(type === 'username') {
      this.setState({ 
        selectCat: '',
        selectUser: val 
      });
    }
  }
  
  handleSearch(val) {
    this.props.filterSearch(val);
  }

  componentDidMount() {
    axios.get('http://localhost:3010/api/browse').then(res => {
      console.log('Categories: ', res.data.categories);
      console.log('Users: ',res.data.users);
      console.log('All files: ', res.data.files);
      this.setState({ 
        users: res.data.users, 
        categories: res.data.categories
      });
      this.props.listAllFiles(res.data.files);
    });
  }

  render() {
    return(
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='flex-end'
      >
        <Grid item sm={3} md={2} lg={2} style={{ textAlign: 'center' }} >
          <InputText 
            id='Search'
            label='Search...'
            update={this.handleSearch}
            value={this.props.value}
        />
        </Grid>
        <Grid item sm={3} md={2} lg={2} style={{ textAlign: 'center' }} >
          <InputSelect
            id='User'
            label='User'
            update={(e) => this.handleSelection(e, 'username')}
            items={this.state.users}
            value={this.state.selectUser}
          />
        </Grid>
        <Grid item sm={3} md={2} lg={2} style={{ textAlign: 'center' }} >
          <InputSelect
            id='Category'
            label='Category'
            update={(e) => this.handleSelection(e, 'category')}
            items={this.state.categories}
            value={this.state.selectCat}
          />
        </Grid>
      </Grid>
    );
  }
}

export default Filter 
