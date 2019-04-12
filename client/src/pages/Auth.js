import React, { Component } from 'react';

import AuthContext from '../context/AuthContext';

class AuthPage extends Component {
  state = {
    isLogin: true,
    email: '',
    password: ''
  };

  static contextType = AuthContext;

  onChangeHandler = e => {
    const inputField = e.target;
    this.setState({
      [inputField.id]: inputField.value
    });
  };

  submitHandler = async e => {
    e.preventDefault();
    const { email, password, isLogin } = this.state;
    let requestBody;
    if (isLogin) {
      requestBody = {
        query: `
          query Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              userId
              token
              tokenExpiration
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    } else {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!){
            createUser(user: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    try {
      const response = await fetch('http://localhost:8000/api', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Request failed');
      }
      const parsedResponse = await response.json();
      const {
        data: {
          login: { token, userId, tokenExpiration }
        }
      } = parsedResponse;
      if (token) {
        this.context.login(token, userId, tokenExpiration);
      }
      console.log(parsedResponse);
    } catch (err) {
      console.log(err);
    }
  };

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  render() {
    const { onChangeHandler, submitHandler, switchModeHandler } = this;
    const { isLogin } = this.state;
    return (
      <form onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input onChange={onChangeHandler} type="email" id="email" />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input onChange={onChangeHandler} type="password" id="password" />
        </div>
        <div className="form-actions">
          <button type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? 'Signup' : 'Login'}
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
