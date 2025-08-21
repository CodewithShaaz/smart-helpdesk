import { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the context, which components will consume.
const AuthContext = createContext(null);

// 2. Create the Provider component. This component will hold the state
//    and provide it to all children.
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  // 3. THIS IS THE CRITICAL PART: The Provider must have a `value` prop.
  //    This is what passes the `userInfo`, `login`, and `logout` functions
  //    down to all the components that need them.
  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create a custom hook for components to easily use the context.
export const useAuth = () => {
  return useContext(AuthContext);
};