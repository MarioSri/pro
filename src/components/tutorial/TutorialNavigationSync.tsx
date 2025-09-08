import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TutorialNavigationSyncProps {
  isActive: boolean;
}

export const TutorialNavigationSync: React.FC<TutorialNavigationSyncProps> = ({ isActive }) => {
  const location = useLocation();

  useEffect(() => {
    if (!isActive) return;

    // Map paths to tutorial data attributes
    const pathToTutorialMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/search': 'search',
      '/track-documents': 'track-documents',
      '/calendar': 'calendar',
      '/messages': 'messages',
      '/documents': 'documents',
      '/advanced-signature': 'advanced-signature',
      '/emergency': 'emergency',
      '/approvals': 'approvals',
      '/workflow': 'workflow',
      '/approval-routing': 'approval-routing',
      '/analytics': 'analytics'
    };

    const tutorialId = pathToTutorialMap[location.pathname];
    
    if (tutorialId) {
      // Remove previous highlights
      document.querySelectorAll('.tutorial-navigation-highlight').forEach(el => {
        el.classList.remove('tutorial-navigation-highlight');
      });

      // Add highlight to current navigation item
      const navElement = document.querySelector(`[data-tutorial="${tutorialId}"]`);
      if (navElement) {
        navElement.classList.add('tutorial-navigation-highlight');
        
        // Auto-remove highlight after 5 seconds
        setTimeout(() => {
          navElement.classList.remove('tutorial-navigation-highlight');
        }, 5000);
      }
    }
  }, [location.pathname, isActive]);

  return null;
};