import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = {
  textSize: {
    fontSize: '16px',
    lineHeight: '16px',
    width: '150px'
  }
}

class UploadSelect extends Component {
  constructor(props){
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e) {
    this.props.update(e.target.value); 
  }

  render() {
    const { value, label, id } = this.props;
      /*
      <div className='upload_select'>
        <select 
          onChange={this.handleSelect}>
          <option value=''>Category</option>
          {this.props.categories.map((item, i) =>
            <option value={item} key={i}>{item}</option>
          )}
        </select>
      </div>
      */
    return (
      <FormControl>
        <InputLabel
          style={ styles.textSize }
          htmlFor={id}
        >{label}
        </InputLabel>
        <Select 
          style={ styles.textSize } 
          value={value}
          id={id}
          onChange={this.handleSelect}
        >
          <MenuItem style={ styles.textSize } value=''>Category</MenuItem>
          {this.props.categories.map((item, i) =>
            <MenuItem key={i} style={ styles.textSize } value={item}>{item}</MenuItem>
          )}
        </Select>
      </FormControl>
    );
  }
}

export default UploadSelect 
