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
        canManageWorkflows: false,
        canViewAnalytics: true,
        canManageUsers: false,
      },
      'program-head': {
        canApprove: true,
        canViewAllDepartments: false,
        canManageWorkflows: false,
        canViewAnalytics: true,
        canManageUsers: false,
      },
      employee: {
        canApprove: false,
        canViewAllDepartments: false,
        canManageWorkflows: false,
        canViewAnalytics: false,
        canManageUsers: false,
      },
    };

    return permissions[role as keyof typeof permissions] || permissions.employee;
  };

  const login = async (role: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
    setIsLoading(false);
    
    // Store in localStorage for persistence
    localStorage.setItem('iaoms-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('iaoms-user');
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