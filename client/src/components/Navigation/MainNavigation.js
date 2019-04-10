import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const MainNavigation = props => (
  <AuthContext.Consumer>
    {({ userId, token, login, logout }) => (
      <header className="main-navigation">
        <div className="main-navigation__logo">
          <h1>EasyEvents</h1>
        </div>
        <nav className="main-navigation__items">
          <ul>
            {!token && (
              <li>
                <NavLink to="/auth">Login</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            {token && (
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
            )}
          </ul>
        </nav>
      </header>
    )}
  </AuthContext.Consumer>
);

export default MainNavigation;
