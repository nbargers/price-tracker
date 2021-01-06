import React, { useContext, createContext, useState } from "react";

const authContext = createContext();

function useProvideAuth() {
    const [user, setUser] = useState({ userId: null, email: '', isAuthenticated: false });
   
    const signin = (email, userId, callback) => {
      setUser({...user, userId, email, isAuthenticated: true});
      callback();
    };

    const signout = (email, userId, callback) => {
        setUser({...user, userId, email, isAuthenticated: false});
        callback();
    };

    return {user, signin, signout};
}

export const ProvideAuth = ({ children }) =>  {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};
