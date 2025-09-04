import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useTutorial = () => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  useEffect(() => {
    if (user) {
      const completed = localStorage.getItem(`iaoms-tutorial-completed-${user.id}`);
      setHasCompletedTutorial(!!completed);
    }
  }, [user]);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    
    if (user) {
      localStorage.setItem(`iaoms-tutorial-completed-${user.id}`, 'true');
      setHasCompletedTutorial(true);
    }
  };

  const resetTutorial = () => {
    if (user) {
      localStorage.removeItem(`iaoms-tutorial-completed-${user.id}`);
      setHasCompletedTutorial(false);
      setShowTutorial(true);
    }
  };

  const shouldShowAutoTutorial = () => {
    return user && !hasCompletedTutorial;
  };

  return {
    showTutorial,
    startTutorial,
    closeTutorial,
    resetTutorial,
    hasCompletedTutorial,
    shouldShowAutoTutorial
  };
};