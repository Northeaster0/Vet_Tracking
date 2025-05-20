import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OwnerAuthContextType {
  owner: any;
  login: (ownerData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const OwnerAuthContext = createContext<OwnerAuthContextType | undefined>(undefined);

export const OwnerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [owner, setOwner] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if there's a stored owner in localStorage
    const storedOwner = localStorage.getItem('owner');
    if (storedOwner) {
      setOwner(JSON.parse(storedOwner));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (ownerData: any) => {
    setOwner(ownerData);
    setIsAuthenticated(true);
    localStorage.setItem('owner', JSON.stringify(ownerData));
  };

  const logout = () => {
    setOwner(null);
    setIsAuthenticated(false);
    localStorage.removeItem('owner');
  };

  return (
    <OwnerAuthContext.Provider value={{ owner, login, logout, isAuthenticated }}>
      {children}
    </OwnerAuthContext.Provider>
  );
};

export const useOwnerAuth = () => {
  const context = useContext(OwnerAuthContext);
  if (context === undefined) {
    throw new Error('useOwnerAuth must be used within an OwnerAuthProvider');
  }
  return context;
}; 