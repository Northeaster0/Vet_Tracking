import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VetAuthContextType {
  vet: any;
  login: (vetData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const VetAuthContext = createContext<VetAuthContextType | undefined>(undefined);

export const VetAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vet, setVet] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if there's a stored vet in localStorage
    const storedVet = localStorage.getItem('doctor');
    if (storedVet) {
      setVet(JSON.parse(storedVet));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (vetData: any) => {
    setVet(vetData);
    setIsAuthenticated(true);
    localStorage.setItem('doctor', JSON.stringify(vetData));
  };

  const logout = () => {
    setVet(null);
    setIsAuthenticated(false);
    localStorage.removeItem('doctor');
  };

  return (
    <VetAuthContext.Provider value={{ vet, login, logout, isAuthenticated }}>
      {children}
    </VetAuthContext.Provider>
  );
};

export const useVetAuth = () => {
  const context = useContext(VetAuthContext);
  if (context === undefined) {
    throw new Error('useVetAuth must be used within a VetAuthProvider');
  }
  return context;
}; 