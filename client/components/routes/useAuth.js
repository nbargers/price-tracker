import React, { useContext, createContext } from 'react';

const authContext = createContext();

function useProvideAuth() {
  const signin = (email, userId, token, callback) => {
    const loggedInUser = {
      userId,
      email,
      token,
      isAuthenticated: true,
    };
    localStorage.setItem('active-user', JSON.stringify(loggedInUser));
    callback();
  };

  const signout = (callback) => {
    localStorage.removeItem('active-user');
    callback();
  };

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('active-user'));
    return user || null;
  };

  return {
    getUser,
    signin,
    signout,
  };
}

export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};
