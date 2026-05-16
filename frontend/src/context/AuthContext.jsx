import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API = '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function saveAuth(t, u) {
    setToken(t); setUser(u);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }

  async function login(email, password) {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    saveAuth(data.token, data.user);
    return data;
  }

  async function signup(name, email, password, phone) {
    const res = await fetch(`${API}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    saveAuth(data.token, data.user);
    return data;
  }

  function logout() {
    setToken(null); setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function addAddress(address) {
    const res = await fetch(`${API}/auth/addresses`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(address)
    });
    const data = await res.json();
    if (res.ok) setUser(prev => ({ ...prev, addresses: data.addresses }));
    return data;
  }

  async function claimReferral() {
    const res = await fetch(`${API}/auth/referral/claim`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setUser(prev => ({ ...prev, points: data.points }));
    return data;
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, addAddress, claimReferral }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
