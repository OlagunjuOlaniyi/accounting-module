import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  user: any;
  token: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  isLoggedOut: boolean;
  login: (userData: any, tokenData: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Simulate an asynchronous user details fetch (you can replace this with your actual fetch logic)
      try {
        const storedUser = JSON.parse(
          localStorage.getItem('userDetails') || 'null'
        );
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const login = (userData: any, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);

    // Save user and token to local storage
    localStorage.setItem('userDetails', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    // Clear local storage
    localStorage.removeItem('userDetails');
    localStorage.removeItem('token');

    // Redirect to login page
    // navigate('/login');
  };

  const isAuthenticated = () => !!user && !!token;

  const contextValues: AuthContextProps = {
    user,
    token,
    loading,
    isLoggedIn: isAuthenticated(),
    isLoggedOut: !isAuthenticated(),
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
