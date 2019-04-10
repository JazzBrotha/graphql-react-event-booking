import React, { Component } from 'react';

class AuthPage extends Component {
  state = {
    isLogin: true,
    email: '',
    password: ''
  };
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
          query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `
      };
    } else {
      requestBody = {
        query: `
          mutation {
            createUser(user: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
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
      <form style={{ marginTop: 100 }} onSubmit={submitHandler}>
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