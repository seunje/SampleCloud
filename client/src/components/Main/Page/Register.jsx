import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Input from './RegInput.jsx';
import './register.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      emailNotValid: true,
      passwordNotValid: true,
      usernameNotValid: true,
      emailError: '',
      passswordError: '',
      usernameError: '',
      registered: false
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLoginButton = this.handleLoginButton.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
  }

  handleLoginButton(e) {
    e.preventDefault();
    this.props.history.push('/login');
  }
  handleForm(e) {
    e.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    const username = this.state.username;
    const emailNotValid = this.state.emailNotValid;
    const passwordNotValid = this.state.passwordNotValid;
    const usernameNotValid = this.state.usernameNotValid;
    this.setState({
      emailError: '',
      passwordError: '',
      usernameError: ''
    });
    if (passwordNotValid || this.state.password === '') {
      this.setState({
        passwordNotValid: true,
        passwordError:
          'Password must be at least 6 chars long and contain an upper case.'
      });
    }
    if (emailNotValid || this.state.email === '') {
      this.setState({
        emailNotValid: true,
        emailError: 'Please enter a valid email address.'
      });
    }
    if (usernameNotValid || this.state.username === '') {
      this.setState({
        usernameNotValid: true,
        usernameError: 'You can not use this name. Please choose another one.'
      });
    }
    if (!usernameNotValid && !passwordNotValid && !emailNotValid) {
      console.log('The form has been submitted.');
      /// POST TO server.js.
      console.log('Push to DB.');
      axios.post('/register', {
        username: username,
        email: email,
        password: password
      }).then(response => {
        console.log('res: ', response.data);
      });
      this.setState({
        username: '',
        password: '',
        email: ''
      });
      this.setState({ registered: true });
    } else {
      console.log('Failed!');
    }
  }

  handleEmail(emailInputVal) {
    const validatedEmail = emailInputVal;
    if (
      validatedEmail.match(/([.]net|[.]com)|[.]co[.]uk|[.]live|[.]lt|[.]io/) &&
      validatedEmail.indexOf('@') > -1 &&
      validatedEmail.match(/^[\S]+$/)
    ) {
      this.setState({
        email: validatedEmail,
        emailNotValid: false
      });
      console.log('This is a valid email address.');
    } else {
      this.setState({
        email: validatedEmail,
        emailNotValid: true
      });
      console.log('This email address considered to be invalid.');
    }
  }

  handlePassword(passwordInputVal) {
    if (passwordInputVal.length > 6 && passwordInputVal.match(/[A-Z]/)) {
      this.setState({
        password: passwordInputVal,
        passwordNotValid: false
      });
    } else {
      this.setState({
        password: passwordInputVal,
        passwordNotValid: true
      });
    }
  }

  handleUsername(usernameInputVal) {
    this.setState({ username: usernameInputVal });
    axios.post('/validate', {
      username: usernameInputVal
    }).then(res => {
      console.log('RES: ', res.data.free);
      this.setState({ usernameNotValid: res.data.free });
    });
  }

  validationHelper(valid, itemState) {
    /// TO IMPLEMENT LATER
  }

  componentDidMount() {
    console.log('Register.jsx Mounted.');
  }

  componentWillUnmount() {
    console.log('Register.jsx UnMounted.');
  }
  render() {
    const email = this.state.email;
    const password = this.state.password;
    const username = this.state.username;
    const emailNotValid = this.state.emailNotValid;
    const passwordNotValid = this.state.passwordNotValid;
    const usernameNotValid = this.state.usernameNotValid;
    if(this.state.registered){
      return (
        <div className='reg_success_wrap'>
          <div className='reg_success_cont'>
            <div className='login_title'>Register Form</div>
            <p style={{ color: 'white' }}>Your registration has been successful. The activation link has been sent to {this.state.email} email address. In order to verify your account please click on the link.</p> 
            <div onClick={this.handleLoginButton} className='login_button'>Login</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='login_cont'>
          <div className='login_wrapper'>
            <div className='login_title'>Register Form</div>
            <div className='login_form'>
              <form>
                <Input
                  label={'Username:'}
                  id={'username'}
                  error={this.state.usernameError}
                  type={'text'}
                  notValid={usernameNotValid}
                  check={this.handleUsername}
                  val={username}
                />
                <Input
                  label={'Email:'}
                  id={'email'}
                  error={this.state.emailError}
                  type={'text'}
                  notValid={emailNotValid}
                  check={this.handleEmail}
                  val={email}
                />
                <Input
                  label={'Password:'}
                  id={'password'}
                  error={this.state.passwordError}
                  type={'password'}
                  notValid={passwordNotValid}
                  check={this.handlePassword}
                  val={password}
                />
                <br />
                <div 
                  onClick={this.handleForm}
                  className='login_button'
                >Submit</div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(Register);
