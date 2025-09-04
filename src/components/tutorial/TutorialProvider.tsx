import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TutorialSystem } from './TutorialSystem';
import { useAuth } from '@/contexts/AuthContext';

interface TutorialContextType {
  showTutorial: boolean;
  startTutorial: () => void;
  closeTutorial: () => void;
  hasCompletedTutorial: boolean;
  resetTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  useEffect(() => {
    // Check if user has completed tutorial
    const completed = localStorage.getItem('iaoms-tutorial-completed');
    const completedForUser = localStorage.getItem(`iaoms-tutorial-completed-${user?.id}`);
    
    setHasCompletedTutorial(!!(completed || completedForUser));
    
    // Auto-start tutorial for new users after a delay
    if (!completed && !completedForUser && user) {
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 3000); // 3 second delay to allow page to load
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    
    // Mark tutorial as completed for this user
    if (user) {
      localStorage.setItem(`iaoms-tutorial-completed-${user.id}`, 'true');
      localStorage.setItem('iaoms-tutorial-completed', 'true');
      setHasCompletedTutorial(true);
    }
  };

  const resetTutorial = () => {
    if (user) {
      localStorage.removeItem(`iaoms-tutorial-completed-${user.id}`);
      localStorage.removeItem('iaoms-tutorial-completed');
      setHasCompletedTutorial(false);
      setShowTutorial(true);
    }
  };

  return (
    <TutorialContext.Provider value={{
      showTutorial,
      startTutorial,
      closeTutorial,
      hasCompletedTutorial,
      resetTutorial
    }}>
      {children}
      
      {/* Tutorial System */}
      {user && (
        <TutorialSystem
          isOpen={showTutorial}
          onClose={closeTutorial}
          autoStart={!hasCompletedTutorial}
          userRole={user.role}
        />
      )}
    </TutorialContext.Provider>
  );
};