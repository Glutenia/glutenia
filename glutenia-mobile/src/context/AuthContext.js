import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const STORAGE_KEY = "glutenia.session";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const session = JSON.parse(saved);
          if (session.token) {
            const freshUser = await api.me(session.token, { timeoutMs: 8000 });
            const nextSession = { ...session, user: freshUser };
            setToken(nextSession.token);
            setUser(nextSession.user);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
          }
        }
      } catch (error) {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const persistSession = async (session) => {
    setToken(session.token);
    setUser(session.user);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const login = async ({ email, password }) => {
    const session = await api.login({ email, password });
    await persistSession(session);
    return session.user;
  };

  const register = async ({ name, email, password, role }) => {
    const session = await api.register({ name, email, password, role });
    await persistSession(session);
    return session.user;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
