import React from 'react';

export default React.createContext({
  token: null,
  userId: '',
  login: () => {},
  logout: () => {}
});
