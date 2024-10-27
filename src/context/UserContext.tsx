import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  name: string;
  occupationType: 'work' | 'school';
  isOnboarded: boolean;
  completeOnboarding: (name: string, occupationType: 'work' | 'school') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setName] = useState(() => localStorage.getItem('userName') || '');
  const [occupationType, setOccupationType] = useState<'work' | 'school'>(() => 
    (localStorage.getItem('occupationType') as 'work' | 'school') || 'work'
  );
  const [isOnboarded, setIsOnboarded] = useState(() => 
    localStorage.getItem('isOnboarded') === 'true'
  );

  const completeOnboarding = (newName: string, newOccupationType: 'work' | 'school') => {
    setName(newName);
    setOccupationType(newOccupationType);
    setIsOnboarded(true);
  };

  useEffect(() => {
    localStorage.setItem('userName', name);
    localStorage.setItem('occupationType', occupationType);
    localStorage.setItem('isOnboarded', String(isOnboarded));
  }, [name, occupationType, isOnboarded]);

  return (
    <UserContext.Provider value={{
      name,
      occupationType,
      isOnboarded,
      completeOnboarding,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
