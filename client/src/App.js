import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/AuthContext';

class App extends Component {
  state = {
    token: null,
    userId: null
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({
      token,
      userId
    });
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null
    });
  };

  render() {
    const { login, logout } = this;
    const { token, userId } = this.state;
    return (
      <BrowserRouter>
        <>
          <AuthContext.Provider value={{ token, userId, login, logout }}>
            <MainNavigation />
            <main>
              <Switch>
                {token && <Redirect from="/" to="/events" exact />}
                {token && <Redirect from="/auth" to="/events" exact />}
                {!token && <Route path="/auth" component={AuthPage} />}
                <Route path="/events" component={EventsPage} />
                {token && <Route path="/bookings" component={BookingsPage} />}
                {!token && <Redirect to="/auth" />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
