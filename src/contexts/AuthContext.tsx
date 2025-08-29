import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'principal' | 'registrar' | 'hod' | 'program-head' | 'employee';
  department?: string;
  branch?: string;
  avatar?: string;
  permissions: {
    canApprove: boolean;
    canViewAllDepartments: boolean;
    canManageWorkflows: boolean;
    canViewAnalytics: boolean;
    canManageUsers: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  const getUserPermissions = (role: string) => {
    const permissions = {
      principal: {
        canApprove: true,
        canViewAllDepartments: true,
        canManageWorkflows: true,
        canViewAnalytics: true,
        canManageUsers: true,
      },
      registrar: {
        canApprove: true,
        canViewAllDepartments: true,
        canManageWorkflows: true,
        canViewAnalytics: true,
        canManageUsers: false,
      },
      hod: {
        canApprove: true,
        canViewAllDepartments: false,
        canManageWorkflows: true,
        canViewAnalytics: true,
        canManageUsers: false,
      },
      'program-head': {
        canApprove: true,
        canViewAllDepartments: false,
        canManageWorkflows: true,
        canViewAnalytics: true,
        canManageUsers: false,
      },
      employee: {
        canApprove: false,
        canViewAllDepartments: false,
        canManageWorkflows: true,
        canViewAnalytics: true,
        canManageUsers: false,
      },
    };

    return permissions[role as keyof typeof permissions] || permissions.employee;
  };

  const login = async (role: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate authentication delay with minimum loading time
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: role === 'principal' ? 'Dr. Robert Smith' :
              role === 'registrar' ? 'Prof. Sarah Johnson' :
              role === 'hod' ? 'Dr. Rajesh Kumar' :
              role === 'program-head' ? 'Prof. Anita Sharma' :
              'Mr. John Doe',
        email: `${role}@hitam.org`,
        role: role as User['role'],
        department: role === 'hod' ? 'Computer Science & Engineering' : 
                   role === 'program-head' ? 'Electronics & Communication' : undefined,
        branch: role === 'hod' ? 'CSE' : 
                role === 'program-head' ? 'ECE' : undefined,
        permissions: getUserPermissions(role)
      };

      setUser(mockUser);
      
      // Store in localStorage for persistence
      localStorage.setItem('iaoms-user', JSON.stringify(mockUser));
      
      // Success notification will be handled by the calling component
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      // Ensure loading is always set to false
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoading(false); // Ensure loading state is reset
    localStorage.removeItem('iaoms-user');
    // Clear any cached data that might persist
    sessionStorage.clear();
    // Navigation will be handled by individual components
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('iaoms-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('iaoms-user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};