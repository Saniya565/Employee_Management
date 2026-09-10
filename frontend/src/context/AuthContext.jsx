import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("scorecare_token")) return setLoading(false);
    api.get("/auth/me").then(r => setUser(r.data.user)).catch(() => localStorage.removeItem("scorecare_token")).finally(() => setLoading(false));
  }, []);
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("scorecare_token", data.token); setUser(data.user); return data;
  };
  const logout = async () => { localStorage.removeItem("scorecare_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
