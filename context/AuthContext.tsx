import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  loadingUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loadingUser: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoadingUser(false);
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
