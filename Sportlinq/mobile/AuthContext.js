import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [useToken, setToken] = useState(null);
  const [userObject, setUserObject] = useState(null);
  const [locations, setLocations] = useState([]);
  const [sessions, setSessions] = useState([]);

  return (
    <AuthContext.Provider value={{ useToken, setToken, userObject, setUserObject, locations, setLocations, sessions, setSessions}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};